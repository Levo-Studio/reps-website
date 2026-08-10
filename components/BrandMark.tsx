type BrandMarkProps = {
  size?: number;
  /** Only the header/hero mark animates its bar in; others are decorative. */
  animatedBar?: boolean;
  /** Corner radius of the tile — 9 in nav/footer, 10 in inline cards. */
  radius?: number;
  className?: string;
};

/**
 * The Reps app icon: a green diagonal capsule on a dark rounded square.
 * Rendered inline as SVG so it stays crisp and can be animated via GSAP.
 */
export function BrandMark({
  size = 24,
  animatedBar = false,
  radius = 9,
  className,
}: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      role="img"
      aria-label="Reps app icon: a green diagonal capsule on a dark rounded square"
      className={className}
      style={{ display: "block", flex: "none" }}
    >
      <rect
        width="40"
        height="40"
        rx={radius}
        fill="#141416"
        stroke="rgba(255,255,255,0.0824)"
      />
      <rect
        {...(animatedBar ? { "data-mark-bar": "" } : {})}
        x="17.25"
        y="7.5"
        width="5.5"
        height="25"
        rx="2.75"
        fill="#2EE59D"
        transform="rotate(20 20 20)"
        style={{ transformOrigin: "20px 20px" }}
      />
    </svg>
  );
}
