import { useId } from "react";

type IkatTone = "mixed" | "indigo" | "marigold" | "rust";

const toneHex: Record<string, string> = {
  indigo: "var(--color-indigo)",
  marigold: "var(--color-marigold)",
  rust: "var(--color-rust)",
};

export default function IkatDivider({ tone = "mixed" }: { tone?: IkatTone }) {
  // useId avoids SVG pattern-id collisions when multiple dividers are on one page
  const uid = useId();
  const patternId = `ikat-${uid}`;

  const colors: [string, string] =
    tone === "mixed"
      ? ["var(--color-indigo)", "var(--color-marigold)"]
      : [toneHex[tone], toneHex[tone]];

  return (
    <svg
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      className="w-full h-4"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width="20"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <polyline
            points="0,16 10,0 20,16"
            fill="none"
            stroke={colors[0]}
            strokeWidth="1.5"
          />
          <polyline
            points="-5,8 5,-4 15,8 25,-4"
            fill="none"
            stroke={colors[1]}
            strokeWidth="1"
            opacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="200" height="16" fill={`url(#${patternId})`} />
    </svg>
  );
}
