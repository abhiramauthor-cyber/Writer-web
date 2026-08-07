"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavCta {
  label: string;
  href: string;
}

interface NavProps {
  /** Which page is active — drives the highlighted nav link */
  activePage?: "home" | "stories" | "book" | "about";
  /** Per-page CTA button in the header */
  cta?: NavCta;
  /** "reading" renders the compact story-reading nav */
  variant?: "default" | "reading";
  user?: any;
  siteName?: string;
}

const navLinks = [
  { label: "Stories", href: "/stories", key: "stories" },
  { label: "Book", href: "/book", key: "book" },
  { label: "About", href: "/about", key: "about" },
  { label: "Contact", href: "/about#contact", key: "contact" },
] as const;

export default function NavClient({
  activePage,
  cta = { label: "Read Stories", href: "/stories" },
  variant = "default",
  user,
  siteName = "Writer Lokam",
}: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const nameParts = siteName.split(" ");
  const firstPart = nameParts[0];
  const restPart = nameParts.slice(1).join(" ");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Reading-mode nav (story page) ─── */
  if (variant === "reading") {
    return (
      <header className="sticky top-[3px] z-50 bg-paper/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase text-ink-muted hover:text-ink transition-colors font-ui"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All stories
          </Link>
          <Link href="/" className="font-display text-base text-ink">
            {firstPart} <span className="italic text-indigo">{restPart}</span>
          </Link>
          {/* Invisible spacer to keep logo centered */}
          <span className="w-[90px]" aria-hidden="true" />
        </div>
      </header>
    );
  }

  /* ─── Default full nav ─── */
  const resolvedActive = activePage ?? inferActivePage(pathname);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-paper/95 backdrop-blur border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-20">
        <Link href="/" className="font-display text-xl text-ink">
          {firstPart} <span className="italic text-indigo">{restPart}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`text-[11px] tracking-[0.18em] uppercase font-ui transition-colors ${
                resolvedActive === link.key
                  ? "text-ink"
                  : "text-nav-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-[11px] tracking-[0.18em] uppercase font-ui text-nav-muted hover:text-rust transition-colors"
              >
                Sign Out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="text-[11px] tracking-[0.18em] uppercase font-ui text-indigo hover:text-ink transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>

        <Link
          href={cta.href}
          className="hidden md:inline-flex items-center bg-ink text-paper text-[11px] tracking-[0.18em] uppercase px-5 py-3 hover:bg-indigo transition-colors font-ui"
        >
          {cta.label}
        </Link>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-paper border-t border-border px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-wider text-nav-muted font-ui"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={cta.href}
            onClick={() => setOpen(false)}
            className="mt-2 text-center bg-ink text-paper text-xs tracking-widest uppercase px-5 py-3 font-ui"
          >
            {cta.label}
          </Link>
        </div>
      )}
    </header>
  );
}

function inferActivePage(pathname: string): string | undefined {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/stories")) return "stories";
  if (pathname.startsWith("/book")) return "book";
  if (pathname.startsWith("/about")) return "about";
  return undefined;
}
