"use client";

import { useState, useTransition } from "react";
import { updateBookDetails, saveReview, deleteListItem, reorderList, saveBuyLink } from "../actions";
import { Save, ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";
import ImageUpload from "../components/ImageUpload";

export default function BookClient({
  initialDetails,
  initialReviews,
  initialBuyLinks,
}: {
  initialDetails: any;
  initialReviews: any[];
  initialBuyLinks: any[];
}) {
  const [isPending, startTransition] = useTransition();

  // Details
  const [details, setDetails] = useState({
    title: initialDetails?.title || "",
    tagline: initialDetails?.tagline || "",
    synopsis: initialDetails?.synopsis || "",
    author_teaser: initialDetails?.author_teaser || "",
    sample_chapter_title: initialDetails?.sample_chapter_title || "",
    sample_chapter_body: initialDetails?.sample_chapter_body || "",
    sample_chapter_meta: initialDetails?.sample_chapter_meta || "",
    cover_image_url: initialDetails?.cover_image_url || "",
  });

  // Reviews
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [editingReview, setEditingReview] = useState<any | null>(null);

  // Buy Links
  const [buyLinks, setBuyLinks] = useState<any[]>(initialBuyLinks);
  const [editingBuyLink, setEditingBuyLink] = useState<any | null>(null);

  const handleSaveDetails = () => {
    startTransition(() => {
      updateBookDetails(details)
        .then(() => alert("Book details saved!"))
        .catch((e) => alert("Error saving book details: " + e.message));
    });
  };

  // Reorder generic
  const moveItem = async (list: any[], setList: any, index: number, direction: 'up' | 'down', table: string) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === list.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newList = [...list];
    const temp = newList[index];
    newList[index] = newList[newIndex];
    newList[newIndex] = temp;

    // update sort_orders
    const updated = newList.map((item, i) => ({ ...item, sort_order: i }));
    setList(updated);

    startTransition(() => {
      reorderList(table, updated).catch(e => alert("Reorder failed: " + e.message));
    });
  };

  // Reviews CRUD
  const handleSaveReview = () => {
    if (!editingReview) return;
    startTransition(() => {
      saveReview(editingReview).then(() => {
        setEditingReview(null);
        window.location.reload(); // Quick refresh to get new IDs
      }).catch(e => alert(e.message));
    });
  };

  const handleDeleteReview = (id: string) => {
    if (!confirm("Are you sure?")) return;
    startTransition(() => {
      deleteListItem('reviews', id).then(() => {
        setReviews(reviews.filter(r => r.id !== id));
      }).catch(e => alert(e.message));
    });
  };

  // Buy Links CRUD
  const handleSaveBuyLink = () => {
    if (!editingBuyLink) return;
    startTransition(() => {
      saveBuyLink(editingBuyLink).then(() => {
        setEditingBuyLink(null);
        window.location.reload(); // Quick refresh
      }).catch(e => alert(e.message));
    });
  };

  const handleDeleteBuyLink = (id: string) => {
    if (!confirm("Are you sure?")) return;
    startTransition(() => {
      deleteListItem('buy_links', id).then(() => {
        setBuyLinks(buyLinks.filter(l => l.id !== id));
      }).catch(e => alert(e.message));
    });
  };


  return (
    <div className="max-w-4xl space-y-16 pb-20">
      <div>
        <h1 className="font-display text-4xl text-ink mb-2">Book Content</h1>
        <p className="text-ink-soft font-body">Manage the single source of truth for your book details, reviews, and buy links.</p>
      </div>

      {/* Single Source Details */}
      <section className="bg-paper border border-border p-8 rounded-md">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-ink">Book Details</h2>
          <button
            onClick={handleSaveDetails}
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors disabled:opacity-50"
          >
            <Save size={14} /> Save Details
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Title</label>
              <input type="text" value={details.title} onChange={(e) => setDetails({...details, title: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Tagline (e.g. A Novel)</label>
              <input type="text" value={details.tagline} onChange={(e) => setDetails({...details, tagline: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Synopsis</label>
              <textarea rows={5} value={details.synopsis} onChange={(e) => setDetails({...details, synopsis: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
          </div>
          <div>
            <ImageUpload 
              label="Cover Image" 
              currentImageUrl={details.cover_image_url} 
              onUploadSuccess={(url) => setDetails({...details, cover_image_url: url})} 
            />
          </div>
        </div>

        <hr className="border-border my-8" />

        <div className="space-y-6">
          <h3 className="font-ui text-[13px] tracking-widest uppercase text-ink mb-4">Sample Chapter & Author Teaser</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Author Teaser</label>
              <textarea rows={3} value={details.author_teaser} onChange={(e) => setDetails({...details, author_teaser: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Sample Chapter Title</label>
              <input type="text" value={details.sample_chapter_title} onChange={(e) => setDetails({...details, sample_chapter_title: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
          </div>
          <div className="grid md:grid-cols-[1fr_auto] gap-6">
             <div className="w-full">
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Sample Chapter Meta (e.g. 10 mins read)</label>
              <input type="text" value={details.sample_chapter_meta} onChange={(e) => setDetails({...details, sample_chapter_meta: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
          </div>
          <div>
            <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Sample Chapter Body</label>
            <textarea rows={6} value={details.sample_chapter_body} onChange={(e) => setDetails({...details, sample_chapter_body: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
          </div>
        </div>
      </section>


      {/* Buy Links List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Buy Links</h2>
          <button
            onClick={() => setEditingBuyLink({ label: "", url: "", type: "primary", sort_order: buyLinks.length })}
            className="flex items-center gap-2 bg-paper border border-border text-ink px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-paper-card transition-colors"
          >
            <Plus size={14} /> Add Link
          </button>
        </div>

        {editingBuyLink && (
          <div className="bg-paper-card border border-border p-6 mb-6">
            <h3 className="font-ui text-[13px] tracking-widest uppercase text-ink mb-4">{editingBuyLink.id ? "Edit Link" : "New Link"}</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Label (e.g. Amazon)</label>
                <input type="text" value={editingBuyLink.label} onChange={e => setEditingBuyLink({...editingBuyLink, label: e.target.value})} className="w-full bg-paper border border-border p-2 text-sm" />
              </div>
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">URL</label>
                <input type="url" value={editingBuyLink.url} onChange={e => setEditingBuyLink({...editingBuyLink, url: e.target.value})} className="w-full bg-paper border border-border p-2 text-sm" />
              </div>
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Type</label>
                <select value={editingBuyLink.type} onChange={e => setEditingBuyLink({...editingBuyLink, type: e.target.value})} className="w-full bg-paper border border-border p-2 text-sm">
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveBuyLink} disabled={isPending} className="bg-indigo text-paper px-4 py-2 text-[11px] font-ui uppercase">Save</button>
              <button onClick={() => setEditingBuyLink(null)} className="border border-border px-4 py-2 text-[11px] font-ui uppercase">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {buyLinks.map((link, i) => (
            <div key={link.id} className="flex items-center gap-4 bg-paper border border-border p-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveItem(buyLinks, setBuyLinks, i, 'up', 'buy_links')} className="text-ink-muted hover:text-indigo disabled:opacity-30" disabled={i === 0 || isPending}><ArrowUp size={16} /></button>
                <button onClick={() => moveItem(buyLinks, setBuyLinks, i, 'down', 'buy_links')} className="text-ink-muted hover:text-indigo disabled:opacity-30" disabled={i === buyLinks.length - 1 || isPending}><ArrowDown size={16} /></button>
              </div>
              <div className="flex-1">
                <p className="font-ui text-sm font-bold">{link.label} <span className="font-normal text-ink-muted">({link.type})</span></p>
                <p className="text-xs text-ink-soft">{link.url}</p>
              </div>
              <button onClick={() => setEditingBuyLink(link)} className="text-sm font-ui text-indigo hover:underline">Edit</button>
              <button onClick={() => handleDeleteBuyLink(link.id)} disabled={isPending} className="text-red-500 hover:text-red-700 ml-2"><Trash2 size={16} /></button>
            </div>
          ))}
          {buyLinks.length === 0 && <p className="text-ink-muted text-sm italic">No buy links added.</p>}
        </div>
      </section>

      {/* Reviews List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Reviews</h2>
          <button
            onClick={() => setEditingReview({ quote: "", name: "", context: "", sort_order: reviews.length })}
            className="flex items-center gap-2 bg-paper border border-border text-ink px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-paper-card transition-colors"
          >
            <Plus size={14} /> Add Review
          </button>
        </div>

        {editingReview && (
          <div className="bg-paper-card border border-border p-6 mb-6">
            <h3 className="font-ui text-[13px] tracking-widest uppercase text-ink mb-4">{editingReview.id ? "Edit Review" : "New Review"}</h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Quote</label>
                <textarea rows={3} value={editingReview.quote} onChange={e => setEditingReview({...editingReview, quote: e.target.value})} className="w-full bg-paper border border-border p-2 text-sm" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Reviewer Name</label>
                  <input type="text" value={editingReview.name} onChange={e => setEditingReview({...editingReview, name: e.target.value})} className="w-full bg-paper border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Context (e.g. NYT, Goodreads)</label>
                  <input type="text" value={editingReview.context} onChange={e => setEditingReview({...editingReview, context: e.target.value})} className="w-full bg-paper border border-border p-2 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveReview} disabled={isPending} className="bg-indigo text-paper px-4 py-2 text-[11px] font-ui uppercase">Save</button>
              <button onClick={() => setEditingReview(null)} className="border border-border px-4 py-2 text-[11px] font-ui uppercase">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {reviews.map((review, i) => (
            <div key={review.id} className="flex items-center gap-4 bg-paper border border-border p-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveItem(reviews, setReviews, i, 'up', 'reviews')} className="text-ink-muted hover:text-indigo disabled:opacity-30" disabled={i === 0 || isPending}><ArrowUp size={16} /></button>
                <button onClick={() => moveItem(reviews, setReviews, i, 'down', 'reviews')} className="text-ink-muted hover:text-indigo disabled:opacity-30" disabled={i === reviews.length - 1 || isPending}><ArrowDown size={16} /></button>
              </div>
              <div className="flex-1">
                <p className="font-body text-sm italic">"{review.quote}"</p>
                <p className="text-[11px] font-ui text-ink-soft mt-1">— {review.name} {review.context && `(${review.context})`}</p>
              </div>
              <button onClick={() => setEditingReview(review)} className="text-sm font-ui text-indigo hover:underline">Edit</button>
              <button onClick={() => handleDeleteReview(review.id)} disabled={isPending} className="text-red-500 hover:text-red-700 ml-2"><Trash2 size={16} /></button>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-ink-muted text-sm italic">No reviews added.</p>}
        </div>
      </section>

    </div>
  );
}
