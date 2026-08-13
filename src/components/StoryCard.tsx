"use client";

import { useState, useEffect, useTransition } from "react";
import { Heart, Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import CatalogBadge from "./CatalogBadge";
import { getOrCreateAnonId } from "@/lib/anonId";
import { toggleLocalBookmark, isLocallyBookmarked } from "@/lib/bookmarks";
import { toggleLike, toggleBookmark } from "@/app/actions";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/Toast";
import { usePathname } from "next/navigation";

export interface StoryData {
  no: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  thread: "indigo" | "marigold" | "rust";
  readTime: string;
  storyId?: string;
  initialLiked?: boolean;
  initialLikeCount?: number;
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

export default function StoryCard(props: { story: StoryData; userId?: string | null }) {
  if (props.userId !== undefined) {
    return <StoryCardInner story={props.story} userId={props.userId} />;
  }
  return <StoryCardWithAuth story={props.story} />;
}

function StoryCardWithAuth({ story }: { story: StoryData }) {
  const { userId } = useAuth();
  return <StoryCardInner story={story} userId={userId} />;
}

function StoryCardInner({ story, userId }: { story: StoryData; userId?: string | null }) {
  const { showToast } = useToast();
  const pathname = usePathname();
  const [liked, setLiked] = useState(story.initialLiked || false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(story.initialLikeCount || 0);
  const [isPending, startTransition] = useTransition();

  const threadHex = threadColorMap[story.thread];
  const textHex = threadTextColorMap[story.thread];

  // Check localStorage bookmark on mount (for anon users)
  useEffect(() => {
    if (!userId) {
      setSaved(isLocallyBookmarked(story.slug));
    }
  }, [userId, story.slug]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!story.storyId) return;

    const anonId = getOrCreateAnonId();
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!liked);
    setLikeCount(liked ? Math.max(0, likeCount - 1) : likeCount + 1);

    startTransition(async () => {
      try {
        await toggleLike(story.storyId!, prevLiked, pathname, anonId);
      } catch (err: any) {
        setLiked(prevLiked);
        setLikeCount(prevCount);
        showToast(err.message || "Something went wrong", "error");
      }
    });
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      // Anonymous: use localStorage
      const newState = toggleLocalBookmark(story.slug);
      setSaved(newState);
      return;
    }

    // Logged-in: use Supabase
    if (!story.storyId) return;
    const prevSaved = saved;
    setSaved(!saved);
    startTransition(async () => {
      try {
        await toggleBookmark(story.storyId!, prevSaved, pathname);
      } catch (err: any) {
        setSaved(prevSaved);
        showToast(err.message || "Something went wrong", "error");
      }
    });
  };

  return (
    <div 
      className="group relative bg-paper-card border border-border hover:border-ink/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-ink/10 transition-all duration-500 flex flex-col"
    >
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
            aria-label={`Read story: ${story.title}`}
            className="text-[11px] tracking-[0.14em] uppercase text-ink inline-flex items-center gap-2 hover:gap-3 transition-all font-ui"
          >
            Read <ArrowRight size={14} />
          </Link>
          <button
            onClick={handleLike}
            disabled={isPending}
            aria-label={`Like story: ${story.title}`}
            className={`relative transition-colors ${
              liked ? "text-rust" : "text-ink-muted hover:text-ink"
            }`}
          >
            <Heart size={15} fill={liked ? "currentColor" : "none"} />
            {likeCount > 0 && (
              <span className={`absolute -top-2 -right-3 text-[9px] font-ui px-1 py-0.5 rounded-full ${liked ? 'text-rust' : 'text-ink-muted'}`}>
                {likeCount}
              </span>
            )}
          </button>
          <button
            onClick={handleBookmark}
            disabled={isPending}
            aria-label={`Bookmark story: ${story.title}`}
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
