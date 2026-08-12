"use client";

import { useState, useEffect, useTransition } from "react";
import { postComment } from "@/app/actions";
import { usePathname } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useToast } from "@/components/Toast";

export interface CommentData {
  id: string;
  name: string;
  body: string;
  time: string;
}

function getDraftKey(storyId?: string) {
  return storyId ? `wl_comment_draft_${storyId}` : null;
}

export default function Comments({ storyId, initialComments = [], isLoggedIn = false }: { storyId?: string, initialComments?: CommentData[], isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { showToast } = useToast();
  const [text, setText] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [isPending, startTransition] = useTransition();

  const draftKey = getDraftKey(storyId);

  // Restore draft from localStorage on mount
  useEffect(() => {
    if (!draftKey) return;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        setText(saved);
      }
    } catch {
      // localStorage unavailable — ignore
    }
  }, [draftKey]);

  // Persist draft to localStorage as user types
  useEffect(() => {
    if (!draftKey) return;
    try {
      if (text.trim()) {
        localStorage.setItem(draftKey, text);
      } else {
        localStorage.removeItem(draftKey);
      }
    } catch {
      // localStorage unavailable — ignore
    }
  }, [text, draftKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    // If not logged in, stash draft and open sign-in modal
    if (!isSignedIn) {
      // Draft is already saved to localStorage via the useEffect above
      openSignIn({
        forceRedirectUrl: pathname,
      });
      return;
    }

    if (!storyId) return;
    
    startTransition(async () => {
      try {
        await postComment(storyId, text, pathname);
        setComments([...comments, { id: "pending-" + Date.now(), name: "You (Pending)", body: text, time: "just now" }]);
        setText("");
        // Clear draft from localStorage on successful post
        if (draftKey) {
          try { localStorage.removeItem(draftKey); } catch {}
        }
        showToast("Comment posted — pending approval", "success");
      } catch (err: any) {
        showToast(err.message || "Failed to post comment", "error");
      }
    });
  };

  return (
    <section id="comments" className="max-w-2xl mx-auto px-6 md:px-10 py-16">
      <h2 className="font-display text-2xl text-ink mb-8">
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </h2>

      <div className="space-y-6 mb-10">
        {comments.map((c, i) => (
          <div key={i} className="border-b border-border pb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[13px] text-ink font-ui">{c.name}</span>
              <span className="text-[11px] text-placeholder font-ui">
                {c.time}
              </span>
            </div>
            <p className="text-[14.5px] text-ink-soft leading-relaxed font-body">
              {c.body}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <label className="block text-[11px] tracking-[0.14em] uppercase text-ink-muted mb-2 font-ui">
          Add a comment
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did this story bring up for you?"
          className="w-full bg-paper-card border border-border px-4 py-3 text-sm text-ink placeholder-placeholder focus:outline-none focus:border-indigo font-body resize-none mb-4"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-ink text-paper text-[11px] tracking-[0.18em] uppercase px-6 py-3 hover:bg-indigo transition-colors font-ui disabled:opacity-50"
        >
          {isPending ? "Posting..." : isSignedIn ? "Post comment" : "Sign in to comment"}
        </button>
      </form>
    </section>
  );
}
