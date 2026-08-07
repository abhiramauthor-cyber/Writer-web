import Link from "next/link";

/**
 * Minimal footer for the story reading page.
 * Explicitly NOT the standard Footer (no nav grid) and NOT absent.
 * Just logo linking home + copyright.
 */
export default function StoryMinimalFooter() {
  return (
    <footer className="bg-paper border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
        <Link href="/" className="font-display text-base text-ink">
          Writer <span className="italic text-indigo">Lokam</span>
        </Link>
        <span className="text-[11px] text-ink-muted font-ui">
          © 2026 Writer Lokam. All stories written with care.
        </span>
      </div>
    </footer>
  );
}
