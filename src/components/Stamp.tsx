interface StampProps {
  estYear?: string; // e.g. "EST. 2025" or "2025"
}

export default function Stamp({ estYear }: StampProps) {
  const year = estYear?.replace(/\D/g, '') || '2025';

  // All geometry is based on a 200×200 viewBox, center at (100,100).
  // Text ring radius = 62  →  arc from (38,100) to (162,100)
  // Separators sit at exactly 3-o'clock and 9-o'clock on that ring.

  return (
    <div className="relative w-28 h-28 md:w-32 md:h-32 drop-shadow-md flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* Top arc — clockwise from left to right */}
          <path
            id="stampTopArc"
            d="M 38,100 A 62,62 0 0,1 162,100"
            fill="none"
          />
          {/* Bottom arc — counter-clockwise from left to right */}
          <path
            id="stampBottomArc"
            d="M 38,100 A 62,62 0 0,0 162,100"
            fill="none"
          />
        </defs>

        {/* ── Rings ── */}
        {/* Outermost thin ring */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-rust/30" />
        {/* Dashed decorative ring */}
        <circle cx="100" cy="100" r="89" fill="none" stroke="currentColor" strokeWidth="1.25" strokeDasharray="4 5" className="text-rust/50" />
        {/* Text-track ring (sits behind the curved text) */}
        <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-rust/25" />
        {/* Inner ring enclosing the center */}
        <circle cx="100" cy="100" r="46" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-rust/25" />

        {/* ── Curved text ── */}
        <text
          fontSize="13"
          letterSpacing="5.5"
          fill="currentColor"
          fontFamily="var(--font-ui), sans-serif"
          className="text-rust"
          dominantBaseline="central"
        >
          <textPath href="#stampTopArc" startOffset="50%" textAnchor="middle">
            WRITER LOKAM
          </textPath>
        </text>

        <text
          fontSize="13"
          letterSpacing="5.5"
          fill="currentColor"
          fontFamily="var(--font-ui), sans-serif"
          className="text-rust"
          dominantBaseline="central"
        >
          <textPath href="#stampBottomArc" startOffset="50%" textAnchor="middle">
            READING ROOM
          </textPath>
        </text>

        {/* ── Separators — small elegant dots at 9 & 3 o'clock ── */}
        <circle cx="38"  cy="100" r="2" fill="currentColor" className="text-rust/70" />
        <circle cx="162" cy="100" r="2" fill="currentColor" className="text-rust/70" />

        {/* ── Center lockup ── */}
        <text
          x="100"
          y="93"
          textAnchor="middle"
          fontSize="24"
          fill="currentColor"
          fontFamily="var(--font-display), serif"
          fontStyle="italic"
          className="text-rust"
        >
          est.
        </text>

        {/* Thin horizontal rule */}
        <line x1="82" y1="101" x2="118" y2="101" stroke="currentColor" strokeWidth="0.5" className="text-rust/30" />

        <text
          x="100"
          y="114"
          textAnchor="middle"
          fontSize="15"
          fill="currentColor"
          fontFamily="var(--font-ui), sans-serif"
          letterSpacing="3"
          className="text-rust font-medium"
        >
          {year}
        </text>
      </svg>
    </div>
  );
}

