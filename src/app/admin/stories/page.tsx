import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit3 } from "lucide-react";
import DeleteStoryButton from "./DeleteStoryButton";

export default async function StoriesAdmin() {
  const supabase = await createClient();
  
  const { data: stories } = await supabase
    .from("stories")
    .select("slug, title, catalog_no, is_published, published_at")
    .order("catalog_no", { ascending: false });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-4xl text-ink">Stories</h1>
        <Link
          href="/admin/stories/edit/new"
          className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors rounded-sm"
        >
          <Plus size={14} /> New Story
        </Link>
      </div>
      <p className="text-ink-soft font-body mb-10">Manage your story catalog.</p>

      <div className="bg-paper border border-border rounded-md overflow-hidden">
        <table className="w-full text-left font-body text-[14px]">
          <thead className="bg-paper-card border-b border-border font-ui text-[11px] tracking-widest uppercase text-ink-muted">
            <tr>
              <th className="p-4 font-normal w-24">Cat No.</th>
              <th className="p-4 font-normal">Title</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stories?.map((story) => (
              <tr key={story.slug} className="hover:bg-paper-card/50">
                <td className="p-4 align-middle text-ink-muted font-ui tracking-wider">
                  {String(story.catalog_no).padStart(3, '0')}
                </td>
                <td className="p-4 align-middle font-display text-lg">
                  {story.title}
                </td>
                <td className="p-4 align-middle">
                  <span className={`px-2 py-1 rounded-full text-[11px] font-ui tracking-widest uppercase ${
                    story.is_published ? 'bg-green-100 text-green-800' : 'bg-marigold/20 text-marigold-text'
                  }`}>
                    {story.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 align-middle text-right space-x-2">
                  <Link
                    href={`/admin/stories/edit/${story.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] bg-paper border border-border rounded hover:bg-indigo hover:text-paper transition-colors"
                  >
                    <Edit3 size={14} /> Edit
                  </Link>
                  <DeleteStoryButton slug={story.slug} />
                </td>
              </tr>
            ))}
            {(!stories || stories.length === 0) && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink-muted font-body">
                  No stories found. Create one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
