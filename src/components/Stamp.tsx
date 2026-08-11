interface StampProps {
  estYear?: string; // e.g. "EST. 2025" or "2025"
}

export default function Stamp({ estYear }: StampProps) {
  // Extract numeric year from settings value like "EST. 2025"
  const year = estYear?.replace(/\D/g, '') || '2025';
  
  return (
    <div className="relative w-28 h-28 md:w-32 md:h-32 drop-shadow-md flex items-center justify-center">
      <svg
        viewBox="0 0 140 140"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* Top Arc (Clockwise) */}
          <path
            id="stampTopPath"
            d="M 26,70 A 44,44 0 0,1 114,70"
            fill="none"
          />
          {/* Bottom Arc (Counter-Clockwise) */}
          <path
            id="stampBottomPath"
            d="M 26,70 A 44,44 0 0,0 114,70"
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
          letterSpacing="4"
          fill="currentColor"
          fontFamily="var(--font-ui), sans-serif"
          className="text-rust uppercase"
          style={{ fontVariantNumeric: 'lining-nums' }}
          dominantBaseline="central"
        >
          {/* Top Text */}
          <textPath href="#stampTopPath" startOffset="50%" textAnchor="middle">
            WRITER LOKAM
          </textPath>
        </text>

        <text
          fontSize="10.5"
          letterSpacing="4"
          fill="currentColor"
          fontFamily="var(--font-ui), sans-serif"
          className="text-rust uppercase"
          style={{ fontVariantNumeric: 'lining-nums' }}
          dominantBaseline="central"
        >
          {/* Bottom Text */}
          <textPath href="#stampBottomPath" startOffset="50%" textAnchor="middle">
            READING ROOM
          </textPath>
        </text>

        {/* Elegantly Crafted Separators */}
        <g transform="translate(26, 70)" className="text-rust/80">
          <path d="M 0,-6 Q 0,0 6,0 Q 0,0 0,6 Q 0,0 -6,0 Q 0,0 0,-6 Z" fill="currentColor" />
          <path d="M 0,-1.5 L 1.5,0 L 0,1.5 L -1.5,0 Z" fill="#F9F8F3" />
        </g>
        <g transform="translate(114, 70)" className="text-rust/80">
          <path d="M 0,-6 Q 0,0 6,0 Q 0,0 0,6 Q 0,0 -6,0 Q 0,0 0,-6 Z" fill="currentColor" />
          <path d="M 0,-1.5 L 1.5,0 L 0,1.5 L -1.5,0 Z" fill="#F9F8F3" />
        </g>

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
    </div>
  );
}
