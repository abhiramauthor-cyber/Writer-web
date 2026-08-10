"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveStory } from "../../../actions";
import { Save, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

export default function StoryEditor({ initialStory, existingCategories = [] }: { initialStory: any, existingCategories?: string[] }) {
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
    
    setForm(prev => {
      const newForm = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Auto-generate slug from title for new stories
      if (!initialStory?.id && name === 'title') {
        newForm.slug = value.toString().toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
      }

      // Auto-generate read time from body
      if (name === 'body_mdx') {
        const words = value.trim().split(/\s+/).length;
        newForm.read_time_minutes = Math.max(1, Math.ceil(words / 200));
      }

      return newForm;
    });
  };

  const handleSave = () => {
    if (!form.slug || !form.title || !form.catalog_no) {
      alert("Please fill in the required fields: Slug, Title, and Catalog No.");
      return;
    }

    const dataToSave = { ...form };
    
    // Auto-generate excerpt if empty
    if (!dataToSave.excerpt && dataToSave.body_mdx) {
      const firstPara = dataToSave.body_mdx.split('\n\n')[0].replace(/<[^>]*>?/gm, '');
      dataToSave.excerpt = firstPara.substring(0, 150) + (firstPara.length > 150 ? '...' : '');
    }

    startTransition(() => {
      saveStory(dataToSave).then(() => {
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
              <input type="text" name="slug" value={form.slug} onChange={handleChange} disabled={!!initialStory?.id} className="w-full bg-paper border border-border p-3 font-body text-sm focus:border-indigo outline-none disabled:bg-paper-card disabled:text-ink-muted" required />
              <p className="mt-1 text-[10px] text-ink-soft">Auto-generated from title. Used in the URL.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Catalog No. *</label>
              <input type="number" name="catalog_no" value={form.catalog_no} onChange={handleChange} className="w-full bg-paper border border-border p-3 font-body text-sm focus:border-indigo outline-none" required />
              <p className="mt-1 text-[10px] text-ink-soft">Auto-assigned sequential number.</p>
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Category</label>
              <input type="text" name="category" list="categories" value={form.category} onChange={handleChange} className="w-full bg-paper border border-border p-3 font-body text-sm focus:border-indigo outline-none" placeholder="e.g. Fiction" />
              <datalist id="categories">
                {existingCategories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Read Time (min)</label>
              <input type="number" name="read_time_minutes" value={form.read_time_minutes} onChange={handleChange} className="w-full bg-paper border border-border p-3 font-body text-sm focus:border-indigo outline-none" />
              <p className="mt-1 text-[10px] text-ink-soft">Auto-calculated from story length.</p>
            </div>
          </div>

          <div>
            <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Excerpt</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className="w-full bg-paper border border-border p-3 font-body text-sm focus:border-indigo outline-none" placeholder="Leave blank to auto-generate from the story content." />
            <p className="mt-1 text-[10px] text-ink-soft">Short summary shown on the story card.</p>
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
