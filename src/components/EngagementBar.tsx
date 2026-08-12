"use client";

import { useState, useEffect } from "react";
import { useTransition } from "react";
import { Heart, Bookmark, Share2, Link2, MessageCircle } from "lucide-react";
import { toggleLike, toggleBookmark } from "@/app/actions";
import { usePathname } from "next/navigation";
import { getOrCreateAnonId } from "@/lib/anonId";
import { toggleLocalBookmark, isLocallyBookmarked } from "@/lib/bookmarks";
import { useToast } from "@/components/Toast";
import { useAuth } from "@clerk/nextjs";

interface EngagementBarProps {
  /** Sticky left sidebar (desktop only) vs. inline centered row */
  sticky?: boolean;
  storyId?: string;
  storySlug?: string;
  initialLiked?: boolean;
  initialSaved?: boolean;
  initialLikeCount?: number;
  commentCount?: number;
}

export default function EngagementBar({ 
  sticky = false, 
  storyId, 
  storySlug,
  initialLiked = false, 
  initialSaved = false,
  initialLikeCount = 0,
  commentCount = 0,
}: EngagementBarProps) {
  const pathname = usePathname();
  const { showToast } = useToast();
  const { userId } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  // On mount, check localStorage bookmarks for anonymous users
  useEffect(() => {
    if (!userId && storySlug) {
      setSaved(isLocallyBookmarked(storySlug));
    }
  }, [userId, storySlug]);

  const handleLike = () => {
    if (!storyId) return;

    // Get the liker identity (Clerk user ID or anonymous cookie)
    const anonId = getOrCreateAnonId();
    
    // Optimistic update
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!liked);
    setLikeCount(liked ? Math.max(0, likeCount - 1) : likeCount + 1);

    startTransition(async () => {
      try {
        await toggleLike(storyId, prevLiked, pathname, anonId);
      } catch (err: any) {
        // Roll back on genuine error
        setLiked(prevLiked);
        setLikeCount(prevCount);
        showToast(err.message || "Something went wrong", "error");
      }
    });
  };

  const handleBookmark = () => {
    if (!storySlug && !storyId) return;

    if (!userId) {
      // Anonymous: use localStorage
      if (storySlug) {
        const newState = toggleLocalBookmark(storySlug);
        setSaved(newState);
        showToast(newState ? "Story saved" : "Bookmark removed", "success");
      }
      return;
    }

    // Logged-in: use Supabase via server action
    if (!storyId) return;
    const prevSaved = saved;
    setSaved(!saved);
    startTransition(async () => {
      try {
        await toggleBookmark(storyId, prevSaved, pathname);
      } catch (err: any) {
        setSaved(prevSaved);
        showToast(err.message || "Something went wrong", "error");
      }
    });
  };

  /** Copy the canonical clean URL (no hash) */
  const handleCopy = () => {
    if (typeof window === "undefined") return;
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cleanUrl);
    }
    setCopied(true);
    showToast("Link copied", "success");
    setTimeout(() => setCopied(false), 1800);
  };

  /** Share via Web Share API with clean URL, fallback to copy */
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: cleanUrl,
        });
      } catch (err) {
        // User cancelled or error — silently ignore
      }
    } else {
      handleCopy();
    }
  };

  const btnBase =
    "w-11 h-11 flex items-center justify-center border transition-colors";
  const btnDefault =
    "border-border text-ink-muted hover:border-ink/40 hover:text-ink";

  return (
    <div
      className={`flex items-center gap-1 ${
        sticky
          ? "flex-col fixed left-[max(1rem,calc(50%-27rem))] top-1/2 -translate-y-1/2 hidden lg:flex"
          : "flex-row justify-center"
      }`}
    >
      {/* Like button */}
      <button
        onClick={handleLike}
        disabled={isPending}
        aria-label="Like story"
        className={`relative ${btnBase} ${
          liked
            ? "border-rust text-rust bg-rust/5"
            : btnDefault
        }`}
      >
        <Heart size={17} fill={liked ? "currentColor" : "none"} />
        {likeCount > 0 && (
          <span className={`absolute -top-2 -right-2 text-[10px] font-ui px-1.5 py-0.5 rounded-full border ${liked ? 'bg-rust text-paper border-rust' : 'bg-paper text-ink-muted border-border'}`}>
            {likeCount}
          </span>
        )}
      </button>

      {/* Bookmark button */}
      <button
        onClick={handleBookmark}
        disabled={isPending}
        aria-label="Bookmark story"
        className={`${btnBase} ${
          saved
            ? "border-indigo text-indigo bg-indigo/5"
            : btnDefault
        }`}
      >
        <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
      </button>

      {/* Comment jump (anchor link — no share action) */}
      <a
        href="#comments"
        aria-label="Jump to comments"
        className={`relative ${btnBase} ${btnDefault}`}
      >
        <MessageCircle size={17} />
        {commentCount > 0 && (
          <span className="absolute -top-2 -right-2 text-[10px] font-ui px-1.5 py-0.5 rounded-full border bg-paper text-ink-muted border-border">
            {commentCount}
          </span>
        )}
      </a>

      {/* Share button (Web Share API) */}
      <button
        onClick={handleShare}
        aria-label="Share story"
        className={`${btnBase} ${btnDefault}`}
      >
        <Share2 size={16} />
      </button>

      {/* Copy link button (clean URL, no hash) */}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className={`relative ${btnBase} ${btnDefault}`}
      >
        <Link2 size={16} />
        {copied && (
          <span className="absolute -top-8 text-[10px] bg-ink text-paper px-2 py-1 whitespace-nowrap font-ui">
            Copied
          </span>
        )}
      </button>
    </div>
  );
}
