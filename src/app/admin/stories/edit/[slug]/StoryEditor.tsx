"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveStory } from "../../../actions";
import { Save, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

export default function StoryEditor({ initialStory }: { initialStory: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    id: initialStory?.id || null,
    slug: initialStory?.slug || "",
    title: initialStory?.title || "",
    excerpt: initialStory?.excerpt || "",
    category: initialStory?.category || "Fiction",
    catalog_no: initialStory?.catalog_no || "",
    read_time_minutes: initialStory?.read_time_minutes || 5,
    body_mdx: initialStory?.body_mdx || "",
    is_published: initialStory?.is_published || false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    if (!form.slug || !form.title || !form.catalog_no) {
      alert("Please fill in the required fields: Slug, Title, and Catalog No.");
      return;
    }

    startTransition(() => {
      saveStory(form).then(() => {
        alert("Story saved successfully!");
        if (!form.id) {
          router.push('/admin/stories');
        }
      }).catch(err => {
        alert("Error saving story: " + err.message);
      });
    });
  };

  return (
    <div className="max-w-5xl flex gap-8">
      {/* Editor Form */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin/stories" className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors font-ui text-[11px] tracking-widest uppercase">
            <ArrowLeft size={14} /> Back to stories
          </Link>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors rounded-sm"
          >
            <Save size={14} /> Save {form.is_published ? "Published" : "Draft"}
          </button>
        </div>

        <div className="bg-paper border border-border p-6 rounded-md space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full bg-paper border border-border p-3 font-display text-lg focus:border-indigo outline-none" required />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">URL Slug *</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange} disabled={!!form.id} className="w-full bg-paper border border-border p-3 font-body text-sm focus:border-indigo outline-none disabled:bg-paper-card" required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Catalog No. *</label>
              <input type="number" name="catalog_no" value={form.catalog_no} onChange={handleChange} className="w-full bg-paper border border-border p-3 font-body text-sm focus:border-indigo outline-none" required />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full bg-paper border border-border p-3 font-body text-sm focus:border-indigo outline-none">
                <option value="Family">Family</option>
                <option value="Memory">Memory</option>
                <option value="Longing">Longing</option>
              </select>
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Read Time (min)</label>
              <input type="number" name="read_time_minutes" value={form.read_time_minutes} onChange={handleChange} className="w-full bg-paper border border-border p-3 font-body text-sm focus:border-indigo outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Excerpt</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className="w-full bg-paper border border-border p-3 font-body text-sm focus:border-indigo outline-none" />
          </div>

          <div>
            <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Story Content (MDX)</label>
            <textarea name="body_mdx" value={form.body_mdx} onChange={handleChange} rows={20} className="w-full bg-paper border border-border p-4 font-mono text-sm leading-relaxed focus:border-indigo outline-none" />
          </div>

          <div className="pt-4 border-t border-border flex items-center gap-3">
            <input type="checkbox" id="is_published" name="is_published" checked={form.is_published} onChange={handleChange} className="w-4 h-4 text-indigo bg-paper border-border rounded focus:ring-indigo" />
            <label htmlFor="is_published" className="font-ui text-[12px] tracking-widest uppercase text-ink cursor-pointer">
              Publish this story to the live site
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
