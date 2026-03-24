export default function IslamicPattern({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light" | "star";
}) {
  const patternClass =
    variant === "light"
      ? "islamic-pattern-bg-light"
      : variant === "star"
        ? "islamic-star-pattern"
        : "islamic-pattern-bg";

  return <div className={`${patternClass} ${className}`} />;
}
