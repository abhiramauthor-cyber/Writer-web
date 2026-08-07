"use client";

import { useState } from "react";
import { ShoppingBag, Heart, Bookmark } from "lucide-react";
import Link from "next/link";

export default function BuySection() {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <section id="buy" className="bg-paper-card border-y border-border">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-24 text-center">
        <p className="text-[11px] tracking-[0.24em] uppercase text-marigold-text mb-4 font-ui">
          Get the Book
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
          Bring it home
        </h2>
        <p className="text-[15px] text-ink-soft mb-10 max-w-md mx-auto leading-relaxed font-body">
          Two States, One Heart is available in print and as an ebook. However
          you like to read, there&apos;s a copy for you.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link
            href="#"
            className="inline-flex items-center gap-2 bg-ink text-paper text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-indigo transition-colors font-ui"
          >
            <ShoppingBag size={14} /> Buy print copy
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 border border-ink text-ink text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-ink hover:text-paper transition-colors font-ui"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Download ebook
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setLiked(!liked)}
            className={`inline-flex items-center gap-2 text-[12px] font-ui transition-colors ${
              liked ? "text-rust" : "text-ink-muted hover:text-ink"
            }`}
          >
            <Heart size={15} fill={liked ? "currentColor" : "none"} />{" "}
            {liked ? "Liked" : "Like this book"}
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`inline-flex items-center gap-2 text-[12px] font-ui transition-colors ${
              saved ? "text-indigo" : "text-ink-muted hover:text-ink"
            }`}
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} />{" "}
            {saved ? "Saved" : "Save for later"}
          </button>
        </div>
      </div>
    </section>
  );
}
