import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-paper">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <Link href="/" className="font-display text-lg text-ink mb-2 block">
            Writer <span className="italic text-indigo">Lokam</span>
          </Link>
          <p className="text-[13px] text-ink-muted max-w-xs leading-relaxed font-body">
            A catalogued home for stories about love, memory, and everything
            held between the lines.
          </p>
        </div>
        <div className="flex gap-16">
          <div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-4 font-ui">
              Explore
            </p>
            <ul className="space-y-2 text-[13px] text-ink-soft font-ui">
              <li>
                <Link href="/stories" className="hover:text-ink">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-ink">
                  Book
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-ink">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-4 font-ui">
              Connect
            </p>
            <ul className="space-y-2 text-[13px] text-ink-soft font-ui">
              <li>
                <a href="#" className="hover:text-ink">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ink">
                  Twitter / X
                </a>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-ink">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 border-t border-border text-[11px] text-ink-muted font-ui">
        © 2026 Writer Lokam. All stories written with care.
      </div>
    </footer>
  );
}
