"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteStory } from "../actions";

export default function DeleteStoryButton({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to completely delete this story? This action cannot be undone.")) {
      startTransition(() => {
        deleteStory(slug).catch(err => alert(err.message));
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] bg-paper border border-border rounded hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Delete Story"
    >
      <Trash2 size={14} /> Delete
    </button>
  );
}
