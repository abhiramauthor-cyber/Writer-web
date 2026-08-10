"use client";

import { useTransition } from "react";
import { updateCommentStatus, deleteComment } from "../actions";
import { Check, X, Trash2 } from "lucide-react";

export default function CommentsClient({ comments }: { comments: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleStatus = (id: string, status: 'approved' | 'rejected') => {
    startTransition(() => {
      updateCommentStatus(id, status);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      startTransition(() => {
        deleteComment(id);
      });
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl text-ink mb-2">Comments</h1>
      <p className="text-ink-soft font-body mb-10">Moderate reader comments.</p>

      <div className="bg-paper border border-border rounded-md overflow-hidden">
        <table className="w-full text-left font-body text-[14px]">
          <thead className="bg-paper-card border-b border-border font-ui text-[11px] tracking-widest uppercase text-ink-muted">
            <tr>
              <th className="p-4 font-normal">Date</th>
              <th className="p-4 font-normal">Author</th>
              <th className="p-4 font-normal">Comment</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-paper-card/50">
                <td className="p-4 align-top whitespace-nowrap text-ink-muted">
                  {new Date(comment.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 align-top">
                  <span className="font-semibold">{comment.profiles?.display_name || 'Anonymous'}</span>
                  <br />
                  <span className="text-ink-soft text-[12px]">Reader</span>
                </td>
                <td className="p-4 align-top max-w-md">
                  <div className="text-[12px] text-indigo mb-1 font-ui tracking-widest uppercase">
                    Story: {comment.stories?.title || comment.story_id}
                  </div>
                  {comment.body}
                </td>
                <td className="p-4 align-top">
                  <span className={`px-2 py-1 rounded-full text-[11px] font-ui tracking-widest uppercase ${
                    comment.status === 'pending' ? 'bg-marigold/20 text-marigold-text' :
                    comment.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {comment.status}
                  </span>
                </td>
                <td className="p-4 align-top text-right space-x-2">
                  {comment.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatus(comment.id, 'approved')} disabled={isPending} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve">
                        <Check size={16} />
                      </button>
                      <button onClick={() => handleStatus(comment.id, 'rejected')} disabled={isPending} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject">
                        <X size={16} />
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(comment.id)} disabled={isPending} className="p-1.5 text-ink-muted hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-muted font-body">
                  No comments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
