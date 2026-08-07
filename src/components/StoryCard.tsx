"use client";

import { useState } from "react";
import { Heart, Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import CatalogBadge from "./CatalogBadge";

export interface StoryData {
  no: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  thread: "indigo" | "marigold" | "rust";
  readTime: string;
}

const threadColorMap: Record<string, string> = {
  indigo: "var(--color-indigo)",
  marigold: "var(--color-marigold)",
  rust: "var(--color-rust)",
};

const threadTextColorMap: Record<string, string> = {
  indigo: "var(--color-indigo)",
  marigold: "var(--color-marigold-text)",
  rust: "var(--color-rust-text)",
};

export default function StoryCard({ story }: { story: StoryData }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const threadHex = threadColorMap[story.thread];
  const textHex = threadTextColorMap[story.thread];

  return (
    <div className="group relative bg-paper-card border border-border hover:border-ink/40 transition-colors flex flex-col">
      <div className="flex items-center justify-between px-6 pt-5">
        <CatalogBadge no={story.no} />
        <span
          className="text-[10px] tracking-[0.18em] uppercase font-ui px-2 py-1"
          style={{ color: textHex, border: `1px solid ${threadHex}` }}
        >
          {story.category}
        </span>
      </div>

      <div className="px-6 pt-5 pb-6 flex-1">
        <h3 className="font-display text-2xl text-ink mb-3 group-hover:text-indigo transition-colors">
          {story.title}
        </h3>
        <p className="text-[14.5px] text-nav-muted leading-relaxed font-body">
          {story.excerpt}
        </p>
      </div>

      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${threadHex}, transparent)`,
        }}
        aria-hidden="true"
      />

      <div className="px-6 py-5 flex items-center justify-between">
        <span className="text-[11px] text-ink-muted font-ui">
          {story.readTime} read
        </span>
        <div className="flex items-center gap-4">
          <Link
            href={`/stories/${story.slug}`}
            className="text-[11px] tracking-[0.14em] uppercase text-ink inline-flex items-center gap-2 hover:gap-3 transition-all font-ui"
          >
            Read <ArrowRight size={14} />
          </Link>
          <button
            onClick={() => setLiked(!liked)}
            aria-label="Like story"
            className={`transition-colors ${
              liked ? "text-rust" : "text-ink-muted hover:text-ink"
            }`}
          >
            <Heart size={15} fill={liked ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => setSaved(!saved)}
            aria-label="Bookmark story"
            className={`transition-colors ${
              saved ? "text-indigo" : "text-ink-muted hover:text-ink"
            }`}
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}
