export default function Stamp() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="w-24 h-24 md:w-28 md:h-28"
      aria-hidden="true"
    >
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="none"
        stroke="var(--color-rust)"
        strokeWidth="1.5"
        strokeDasharray="2 3"
      />
      <circle cx="60" cy="60" r="46" fill="none" stroke="var(--color-rust)" strokeWidth="1" />
      <path
        id="stampCirclePath"
        d="M60,18 A42,42 0 1,1 59.9,18"
        fill="none"
      />
      <text
        fontSize="8.5"
        letterSpacing="2.5"
        fill="var(--color-rust)"
        fontFamily="var(--font-ui), sans-serif"
      >
        <textPath href="#stampCirclePath" startOffset="2%">
          WRITER LOKAM · READING ROOM ·
        </textPath>
      </text>
      <text
        x="60"
        y="65"
        textAnchor="middle"
        fontSize="20"
        fill="var(--color-rust)"
        fontFamily="var(--font-display), serif"
        fontStyle="italic"
      >
        est.
      </text>
      <text
        x="60"
        y="82"
        textAnchor="middle"
        fontSize="11"
        fill="var(--color-rust)"
        fontFamily="var(--font-ui), sans-serif"
        letterSpacing="1"
      >
        2026
      </text>
    </svg>
  );
}
