"use client";

import { useState, useTransition } from "react";
import { updatePageContent } from "../actions";
import { Save } from "lucide-react";

export default function PagesClient({
  homeContent,
  aboutContent,
}: {
  homeContent: any;
  aboutContent: any;
}) {
  const [isPending, startTransition] = useTransition();

  // Home State
  const [heroTitle, setHeroTitle] = useState(homeContent?.hero_title || "");
  const [heroSubtitle, setHeroSubtitle] = useState(homeContent?.hero_subtitle || "");

  // About State
  const [bio, setBio] = useState(aboutContent?.bio || "");

  const handleSaveHome = () => {
    startTransition(() => {
      updatePageContent("home", {
        ...homeContent,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
      });
      alert("Homepage saved!");
    });
  };

  const handleSaveAbout = () => {
    startTransition(() => {
      updatePageContent("about", {
        ...aboutContent,
        bio,
      });
      alert("About page saved!");
    });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-2">Pages</h1>
      <p className="text-ink-soft font-body mb-10">Edit the text on your static pages.</p>

      {/* Home Page */}
      <section className="bg-paper border border-border rounded-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Homepage</h2>
          <button
            onClick={handleSaveHome}
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors"
          >
            <Save size={14} /> Save Home
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Hero Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-paper border border-border p-3 font-display text-lg text-ink focus:outline-none focus:border-indigo"
            />
          </div>
          <div>
            <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Hero Subtitle</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              className="w-full bg-paper border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo"
            />
          </div>
        </div>
      </section>

      {/* About Page */}
      <section className="bg-paper border border-border rounded-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">About Page</h2>
          <button
            onClick={handleSaveAbout}
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors"
          >
            <Save size={14} /> Save About
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Biography</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={10}
              className="w-full bg-paper border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
