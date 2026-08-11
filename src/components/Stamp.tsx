interface StampProps {
  estYear?: string; // e.g. "EST. 2025" or "2025"
}

export default function Stamp({ estYear }: StampProps) {
  // Extract numeric year from settings value like "EST. 2025"
  const year = estYear?.replace(/\D/g, '') || '2025';
  
  return (
    <svg
      viewBox="0 0 140 140"
      className="w-28 h-28 md:w-32 md:h-32 animate-spin-slow drop-shadow-md origin-center"
      aria-hidden="true"
    >
      <defs>
        <path
          id="stampCirclePath"
          d="M70,22 A48,48 0 1,1 69.9,22"
          fill="none"
        />
      </defs>

      {/* Outer decorative ring */}
      <circle cx="70" cy="70" r="66" fill="none" stroke="currentColor" strokeWidth="1" className="text-rust/40" />
      <circle cx="70" cy="70" r="62" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" className="text-rust/70" />
      
      {/* Inner framing ring */}
      <circle cx="70" cy="70" r="54" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-rust/60" />
      <circle cx="70" cy="70" r="34" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-rust/60" />

      {/* Circular Text */}
      <text
        fontSize="10.5"
        letterSpacing="3"
        fill="currentColor"
        fontFamily="var(--font-ui), sans-serif"
        className="text-rust uppercase"
        style={{ fontVariantNumeric: 'lining-nums' }}
      >
        <textPath href="#stampCirclePath" startOffset="0" textLength="300" lengthAdjust="spacingAndGlyphs">
          WRITER LOKAM ✦ READING ROOM ✦ WRITER LOKAM ✦ READING ROOM ✦ 
        </textPath>
      </text>

      {/* Center est. text */}
      <text
        x="70"
        y="65"
        textAnchor="middle"
        fontSize="18"
        fill="currentColor"
        fontFamily="var(--font-display), serif"
        fontStyle="italic"
        className="text-rust"
      >
        est.
      </text>
      
      {/* Center Year text */}
      <text
        x="70"
        y="83"
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        fontFamily="var(--font-ui), sans-serif"
        letterSpacing="2"
        className="text-rust font-medium"
      >
        {year}
      </text>
    </svg>
  );
}
