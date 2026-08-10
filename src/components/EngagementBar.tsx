"use client";

import { useState } from "react";
import { useTransition } from "react";
import { Heart, Bookmark, Share2, Link2, MessageCircle } from "lucide-react";
import { toggleLike, toggleBookmark } from "@/app/actions";
import { usePathname } from "next/navigation";

interface EngagementBarProps {
  /** Sticky left sidebar (desktop only) vs. inline centered row */
  sticky?: boolean;
  storyId?: string;
  initialLiked?: boolean;
  initialSaved?: boolean;
  initialLikeCount?: number;
}

export default function EngagementBar({ 
  sticky = false, 
  storyId, 
  initialLiked = false, 
  initialSaved = false,
  initialLikeCount = 0
}: EngagementBarProps) {
  const pathname = usePathname();
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    if (!storyId) return alert("Please log in to like this story.");
    // Optimistic update
    setLiked(!liked);
    setLikeCount(liked ? Math.max(0, likeCount - 1) : likeCount + 1);
    startTransition(async () => {
      try {
        await toggleLike(storyId, liked, pathname);
      } catch (err) {
        setLiked(liked); // revert on error
        setLikeCount(liked ? likeCount : Math.max(0, likeCount - 1));
      }
    });
  };

  const handleBookmark = () => {
    if (!storyId) return alert("Please log in to save this story.");
    // Optimistic update
    setSaved(!saved);
    startTransition(async () => {
      try {
        await toggleBookmark(storyId, saved, pathname);
      } catch (err) {
        setSaved(saved); // revert on error
      }
    });
  };

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
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
      <a
        href="#comments"
        aria-label="Jump to comments"
        className={`${btnBase} ${btnDefault}`}
      >
        <MessageCircle size={17} />
      </a>
      <button
        onClick={handleShare}
        aria-label="Share story"
        className={`${btnBase} ${btnDefault}`}
      >
        <Share2 size={16} />
      </button>
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
