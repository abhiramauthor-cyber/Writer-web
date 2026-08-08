"use client";

import { useState } from "react";
import { ShoppingBag, Heart, Bookmark, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function BuySection({ buyLinks }: { buyLinks: any[] }) {
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
          {buyLinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className={`inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase px-7 py-4 font-ui transition-colors ${
                link.type === 'primary' 
                  ? 'bg-ink text-paper hover:bg-indigo' 
                  : 'border border-ink text-ink hover:bg-ink hover:text-paper'
              }`}
            >
              {link.type === 'primary' ? <ShoppingBag size={14} /> : <ExternalLink size={14} />}
              {link.label}
            </Link>
          ))}
          {buyLinks.length === 0 && (
            <p className="text-sm text-ink-muted italic">Links coming soon.</p>
          )}
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
