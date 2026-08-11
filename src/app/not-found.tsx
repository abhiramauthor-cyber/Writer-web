import Link from "next/link";
import NavClient from "@/components/NavClient";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <NavClient />
      <main className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <p className="font-ui text-sm tracking-[0.24em] uppercase text-marigold-text mb-6">
          Error 404
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink mb-6">
          This page has been<br />lost to time
        </h1>
        <p className="font-body text-ink-muted max-w-md mx-auto mb-10 text-lg">
          Like a misplaced letter or a story left unfinished, the page you're looking for cannot be found.
        </p>
        <Link 
          href="/"
          className="bg-ink text-paper px-8 py-4 font-ui text-[11px] tracking-widest uppercase hover:bg-ink-muted transition-colors"
        >
          Return to the Reading Room
        </Link>
      </main>
      <Footer />
    </>
  );
}
