"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import IkatDivider from "@/components/IkatDivider";
import StoryCard, { type StoryData } from "@/components/StoryCard";
import { categories, type Category } from "@/lib/constants";

export default function StoriesClient({ stories, hero }: { stories: StoryData[], hero: any }) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const eyebrow = hero?.eyebrow || "Card No. 002 · The Full Catalog";
  const heading = hero?.heading || "The Catalog";
  const subheading = hero?.subheading || "Every story, catalogued and kept.";
  
  const words = heading.split(" ");
  const lastWord = words.pop();
  const restOfHeading = words.join(" ");

  const filteredStories = stories.filter((story) => {
    const matchesCategory =
      activeCategory === "All" || story.category === activeCategory;
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <header className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-16">
        <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-5 font-ui">
          {eyebrow}
        </p>
        <h1 className="font-display text-ink leading-[0.98] text-[44px] sm:text-[56px] md:text-[64px]">
          {restOfHeading ? (
            <>
              {restOfHeading} <span className="italic text-marigold-text">{lastWord}</span>
            </>
          ) : (
            heading
          )}
        </h1>
        {subheading && (
          <p className="mt-4 font-display italic text-xl md:text-2xl text-ink-soft max-w-lg">
            {subheading}
          </p>
        )}

        <div className="mt-16">
          <IkatDivider tone="mixed" />
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              let btnClass =
                "text-[11px] tracking-[0.14em] uppercase px-4 py-2 border transition-colors font-ui ";

              if (isActive) {
                if (cat === "All") {
                  btnClass += "bg-ink text-paper border-ink";
                } else if (cat === "Family") {
                  btnClass += "bg-indigo text-paper border-indigo";
                } else if (cat === "Memory") {
                  btnClass += "bg-marigold text-paper border-marigold";
                } else if (cat === "Longing") {
                  btnClass += "bg-rust text-paper border-rust";
                }
              } else {
                btnClass +=
                  "border-border text-ink-muted hover:border-ink/40 hover:text-ink";
              }

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={btnClass}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-placeholder"
            />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-paper-card border border-border pl-10 pr-4 py-3 text-sm text-ink placeholder-placeholder focus:outline-none focus:border-indigo font-body"
            />
          </div>
        </div>

        <p className="text-[12px] text-ink-muted font-ui mb-6">
          Showing {filteredStories.length}{" "}
          {filteredStories.length === 1 ? "story" : "stories"}
        </p>

        {filteredStories.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredStories.map((s) => (
              <StoryCard key={s.no} story={s} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-display italic text-xl text-ink-muted">
              No stories match your search.
            </p>
          </div>
        )}
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-10 mb-16">
        <IkatDivider tone="mixed" />
      </div>
    </>
  );
}
