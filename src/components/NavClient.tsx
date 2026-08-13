"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false }
);

const SignInButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignInButton),
  { ssr: false }
);

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
  isAdmin?: boolean;
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
  isAdmin = false,
}: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isLoaded, userId } = useAuth();

  const nameParts = siteName.split(" ");
  const firstPart = nameParts[0];
  const restPart = nameParts.slice(1).join(" ");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close mobile nav on scroll (throttled via rAF, 30px delta threshold)
  useEffect(() => {
    if (!open) return;

    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const delta = Math.abs(window.scrollY - lastY);
        if (delta > 30) {
          setOpen(false);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

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
          <Link href="/" className="font-display text-base text-ink inline-flex items-baseline leading-none">
            <span>{firstPart}</span>
            <span className="italic text-indigo ml-1">{restPart}</span>
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
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-paper/85 backdrop-blur-lg border-b border-border shadow-sm shadow-ink/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-20">
        <Link href="/" className="font-display text-xl text-ink inline-flex items-baseline leading-none">
          <span>{firstPart}</span>
          <span className="italic text-indigo ml-1.5">{restPart}</span>
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
          {isAdmin && (
            <Link
              href="/admin"
              className="text-[11px] tracking-[0.18em] uppercase font-ui text-marigold hover:text-ink transition-colors"
            >
              Admin
            </Link>
          )}
          {isLoaded && userId ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="text-[11px] tracking-[0.18em] uppercase font-ui text-indigo hover:text-ink transition-colors">
                Sign In
              </button>
            </SignInButton>
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
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-wider text-marigold font-ui"
            >
              Admin
            </Link>
          )}
          <Link
            href={cta.href}
            onClick={() => setOpen(false)}
            className="mt-2 text-center bg-ink text-paper text-xs tracking-widest uppercase px-5 py-3 font-ui"
          >
            {cta.label}
          </Link>
          <div className="mt-4 border-t border-border pt-4 flex flex-col gap-4 items-center">
            {isLoaded && userId ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="text-[11px] tracking-[0.18em] uppercase font-ui text-indigo hover:text-ink transition-colors w-full text-center">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
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
