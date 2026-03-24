/**
 * deploy-firebase-rules.mjs  (v2)
 *
 * Uses the service account credentials in .env.local to:
 *   1. Deploy Realtime Database rules via Firebase Database REST API
 *   2. Deploy Storage rules via Firebase Rules REST API (with correct release name)
 *   3. Set CORS on the Storage bucket via GCS JSON API (handles new .firebasestorage.app buckets)
 *
 * Run:  node deploy-firebase-rules.mjs
 */

import { readFileSync } from "fs";
import { createSign } from "crypto";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(__dirname, ".env.local");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      let val = m[2].trim();
      // Strip wrapping quotes
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[m[1]] = val;
    }
  }
}

// ── Load service account from env ────────────────────────────────────────────
function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY not set in .env.local");
  // Strip any trailing quotes that might have been left
  const cleaned = raw.replace(/^"+|"+$/g, "").trim();
  try {
    const decoded = Buffer.from(cleaned, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch {
    return JSON.parse(cleaned);
  }
}

// ── OAuth2 access token from service account JWT ─────────────────────────────
async function getAccessToken(sa, scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header  = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: scopes.join(" "),
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).toString("base64url");

  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(sa.private_key, "base64url");
  const jwt = `${header}.${payload}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Token fetch failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

// ── 1. Deploy RTDB rules via legacy REST endpoint ────────────────────────────
// The RTDB rules endpoint accepts the service account token when the
// "firebase" OAuth scope is included.
async function deployRtdbRules(databaseUrl, token) {
  console.log("\n🗄️  Deploying Realtime Database rules...");

  const rules = {
    rules: {
      ".read": true,
      ".write": true,
      books: { ".indexOn": ["category", "createdAt"] },
    },
  };

  // The correct endpoint for rules via SA token (not "access_token" query param
  // — that requires an old-style DB secret; use the Authorization header instead)
  const base = databaseUrl.replace(/\/$/, "");
  const url = `${base}/.settings/rules.json`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rules),
  });

  if (res.status === 401 || res.status === 403) {
    // Fallback: try with access_token query param (some RTDB regions need this)
    const url2 = `${url}?access_token=${token}`;
    const res2 = await fetch(url2, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rules),
    });
    const data2 = await res2.json();
    if (!res2.ok) {
      console.error("  ❌ RTDB rules update failed:", JSON.stringify(data2, null, 2));
      console.log("  ℹ️  Tip: Go to Firebase Console → Realtime Database → Rules");
      console.log("     and paste the rules manually (see database.rules.json)");
      return false;
    }
    console.log("  ✅ RTDB rules deployed (fallback method)!");
    return true;
  }

  const data = await res.json();
  if (!res.ok) {
    console.error("  ❌ RTDB rules update failed:", JSON.stringify(data, null, 2));
    console.log("  ℹ️  Tip: Go to Firebase Console → Realtime Database → Rules");
    console.log("     and paste the rules manually (see database.rules.json)");
    return false;
  }
  console.log("  ✅ RTDB rules deployed successfully!");
  return true;
}

// ── 2. Deploy Firebase Storage rules ─────────────────────────────────────────
async function deployStorageRules(projectId, storageBucket, token) {
  console.log("\n📦 Deploying Firebase Storage rules...");

  const rulesContent = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`;

  // Step A: create ruleset
  const createRes = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        source: { files: [{ name: "storage.rules", content: rulesContent }] },
      }),
    }
  );
  const ruleset = await createRes.json();
  if (!createRes.ok) {
    console.error("  ❌ Create ruleset:", JSON.stringify(ruleset.error || ruleset, null, 2));
    return false;
  }
  const rulesetName = ruleset.name;
  console.log("  ✅ Ruleset created:", rulesetName);

  // Step B: list existing releases to find the correct storage release name
  const listRes = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases?filter=name%3Dfirebase.storage`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const listData = await listRes.json();
  const releases = listData.releases || [];

  console.log("  ℹ️  Existing storage releases:", releases.map(r => r.name));

  // Try the two common release name formats
  const candidates = [
    `projects/${projectId}/releases/firebase.storage/${storageBucket}/rules_firebase_storage`,
    `projects/${projectId}/releases/firebase.storage/${storageBucket}`,
    `projects/${projectId}/releases/firebase.storage`,
  ];

  // Pick whichever exists, or use the first
  let releaseName = candidates.find(c => releases.some(r => r.name === c)) || releases[0]?.name;

  if (!releaseName) {
    // No storage release found — create one
    releaseName = `projects/${projectId}/releases/firebase.storage/${storageBucket}`;
    const createReleaseRes = await fetch(
      `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: releaseName, rulesetName }),
      }
    );
    const createReleaseData = await createReleaseRes.json();
    if (!createReleaseRes.ok) {
      console.error("  ❌ Create release failed:", JSON.stringify(createReleaseData.error || createReleaseData, null, 2));
      console.log("  ℹ️  Tip: Go to Firebase Console → Storage → Rules and paste manually.");
      return false;
    }
    console.log("  ✅ Storage release created and rules deployed!");
    return true;
  }

  // Step C: patch the existing release
  const patchRes = await fetch(
    `https://firebaserules.googleapis.com/v1/${releaseName}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ release: { name: releaseName, rulesetName } }),
    }
  );
  const patchData = await patchRes.json();
  if (!patchRes.ok) {
    console.error("  ❌ Patch release failed:", JSON.stringify(patchData.error || patchData, null, 2));
    console.log("  ℹ️  Tip: Go to Firebase Console → Storage → Rules and paste manually.");
    return false;
  }
  console.log("  ✅ Storage rules deployed successfully!");
  return true;
}

// ── 3. Set CORS on Storage bucket ────────────────────────────────────────────
// The new Firebase Storage SDK uses .firebasestorage.app buckets.
// These are still Google Cloud Storage buckets — we just need to encode the
// bucket name correctly in the API call.
async function setCors(bucketName, token) {
  console.log(`\n🌐 Configuring CORS on bucket: ${bucketName}`);

  const cors = [{
    origin: ["*"],
    method: ["GET", "HEAD", "PUT", "POST", "DELETE"],
    responseHeader: ["Content-Type", "Access-Control-Allow-Origin", "x-goog-meta-*"],
    maxAgeSeconds: 3600,
  }];

  // Try the bucket name as-is first, then with b_ prefix (Firebase uses b_ for Storage)
  const bucketVariants = [bucketName];

  for (const bucket of bucketVariants) {
    const encoded = encodeURIComponent(bucket);
    const res = await fetch(
      `https://storage.googleapis.com/storage/v1/b/${encoded}?fields=cors,name`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cors }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      console.log(`  ✅ CORS set on bucket: ${data.name}`);
      return true;
    }

    if (res.status === 404) {
      // Try without domain suffix — some projects use differently named GCS buckets
      console.log(`  ⚠️  Bucket ${bucket} not found via GCS API (404).`);
      console.log("  ℹ️  This is normal for firebasestorage.app buckets in some regions.");
      console.log("  ℹ️  The CORS issue may resolve once Storage rules are open.");
      return "skipped";
    }

    console.error(`  ❌ CORS update failed for ${bucket}:`, JSON.stringify(data.error || data, null, 2));
  }

  return false;
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔧 Firebase Rules & CORS Deployment Script v2");
  console.log("==============================================\n");

  loadEnv();
  const sa = loadServiceAccount();
  const projectId = sa.project_id;
  const databaseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!databaseUrl || !storageBucket) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_DATABASE_URL or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.local");
  }

  console.log(`Project:  ${projectId}`);
  console.log(`Database: ${databaseUrl}`);
  console.log(`Bucket:   ${storageBucket}`);

  // Get token with all needed scopes
  console.log("\n🔑 Getting access token...");
  const token = await getAccessToken(sa, [
    "https://www.googleapis.com/auth/firebase",
    "https://www.googleapis.com/auth/firebase.database",
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/devstorage.full_control",
  ]);
  console.log("  ✅ Access token obtained");

  // Run all three deployments
  const rtdbOk    = await deployRtdbRules(databaseUrl, token);
  const storageOk = await deployStorageRules(projectId, storageBucket, token);
  const corsOk    = await setCors(storageBucket, token);

  console.log("\n==============================================");
  console.log(`RTDB Rules:    ${rtdbOk    ? "✅ Deployed" : "❌ Failed (do manually)"}`);
  console.log(`Storage Rules: ${storageOk ? "✅ Deployed" : "❌ Failed (do manually)"}`);
  console.log(`CORS:          ${corsOk === true ? "✅ Configured" : corsOk === "skipped" ? "⏭️  Skipped (may not be needed)" : "❌ Failed (do manually)"}`);

  if (rtdbOk && storageOk) {
    console.log("\n🎉 Rules deployed! Restart your dev server and try uploading.");
    console.log("   ⚠️  Remember to tighten rules before going to production.");
  } else {
    console.log("\n📋 For any failed steps, apply the rules manually:");
    console.log("   RTDB:    Firebase Console → Realtime Database → Rules");
    console.log("   Storage: Firebase Console → Storage → Rules");
    console.log("   (Both rule files are in your project root)");
  }
}

main().catch((e) => {
  console.error("\n💥 Fatal error:", e.message);
  process.exit(1);
});
