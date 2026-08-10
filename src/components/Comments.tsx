"use client";

import { useState, useTransition } from "react";
import { postComment } from "@/app/actions";
import { usePathname } from "next/navigation";

export interface CommentData {
  id: string;
  name: string;
  body: string;
  time: string;
}

export default function Comments({ storyId, initialComments = [] }: { storyId?: string, initialComments?: CommentData[] }) {
  const pathname = usePathname();
  const [text, setText] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !storyId) {
      if (!storyId) alert("Please log in to comment.");
      return;
    }
    
    startTransition(async () => {
      try {
        await postComment(storyId, text, pathname);
        setComments([...comments, { id: "pending-" + Date.now(), name: "You (Pending)", body: text, time: "just now" }]);
        setText("");
      } catch (err: any) {
        alert(err.message);
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
          {isPending ? "Posting..." : "Post comment"}
        </button>
      </form>
    </section>
  );
}
