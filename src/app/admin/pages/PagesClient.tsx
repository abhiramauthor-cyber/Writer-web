"use client";

import { useState, useTransition } from "react";
import { updateBookContent, updateAboutContent } from "../actions";
import { Save, ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";

export default function PagesClient({
  aboutContent,
  bookContent,
}: {
  aboutContent: any;
  bookContent: any;
}) {
  const [isPending, startTransition] = useTransition();

  // About State
  const [bio, setBio] = useState(aboutContent?.bio || "");
  const [aboutImage, setAboutImage] = useState(aboutContent?.image_url || "");
  const [journey, setJourney] = useState<any[]>(aboutContent?.journey || []);

  // Book State
  const [bookForm, setBookForm] = useState({
    title: bookContent?.title || "",
    subtitle: bookContent?.subtitle || "",
    synopsis: bookContent?.synopsis || "",
    buy_link: bookContent?.buy_link || "/book",
    sample_link: bookContent?.sample_link || "/book#sample",
    image_url: bookContent?.image_url || "",
  });

  const handleSaveAbout = () => {
    startTransition(() => {
      // Re-sort journey by sort_order before saving just in case
      const sortedJourney = [...journey].sort((a, b) => a.sort_order - b.sort_order);
      updateAboutContent({ bio, image_url: aboutImage, journey: sortedJourney }).then(() => alert("About page saved!")).catch(e => alert(e.message));
    });
  };

  const handleSaveBook = () => {
    startTransition(() => {
      updateBookContent(bookForm).then(() => alert("Book details saved!")).catch(e => alert(e.message));
    });
  };

  // Journey Handlers
  const addJourneyStep = () => {
    setJourney([...journey, { year: "", title: "", body: "", sort_order: journey.length + 1 }]);
  };
  
  const removeJourneyStep = (index: number) => {
    const newJourney = journey.filter((_, i) => i !== index);
    // Re-index
    setJourney(newJourney.map((j, i) => ({ ...j, sort_order: i + 1 })));
  };

  const moveJourneyStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === journey.length - 1) return;

    const newJourney = [...journey];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newJourney[index];
    newJourney[index] = newJourney[targetIndex];
    newJourney[targetIndex] = temp;

    // Re-index
    setJourney(newJourney.map((j, i) => ({ ...j, sort_order: i + 1 })));
  };

  const updateJourneyStep = (index: number, field: string, value: string) => {
    const newJourney = [...journey];
    newJourney[index] = { ...newJourney[index], [field]: value };
    setJourney(newJourney);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl text-ink mb-2">Pages & Content</h1>
      <p className="text-ink-soft font-body mb-10">Edit the text on your static pages.</p>

      {/* Book Details (Single Source of Truth) */}
      <section className="bg-paper border border-border rounded-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl text-ink">Book Details</h2>
            <p className="text-[12px] text-ink-muted font-body mt-1">This updates the Book Showcase on the Homepage AND the main Book page.</p>
          </div>
          <button
            onClick={handleSaveBook}
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors"
          >
            <Save size={14} /> Save Book
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Title</label>
              <input
                type="text"
                value={bookForm.title}
                onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                className="w-full bg-paper border border-border p-3 font-display text-lg text-ink focus:outline-none focus:border-indigo"
              />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Subtitle</label>
              <input
                type="text"
                value={bookForm.subtitle}
                onChange={(e) => setBookForm({...bookForm, subtitle: e.target.value})}
                className="w-full bg-paper border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo"
              />
            </div>
          </div>
          <div>
            <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Synopsis</label>
            <textarea
              value={bookForm.synopsis}
              onChange={(e) => setBookForm({...bookForm, synopsis: e.target.value})}
              rows={3}
              className="w-full bg-paper border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Buy Link</label>
              <input
                type="text"
                value={bookForm.buy_link}
                onChange={(e) => setBookForm({...bookForm, buy_link: e.target.value})}
                className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo"
              />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Sample Link</label>
              <input
                type="text"
                value={bookForm.sample_link}
                onChange={(e) => setBookForm({...bookForm, sample_link: e.target.value})}
                className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo"
              />
            </div>
          </div>
          <div>
            <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Cover Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={bookForm.image_url}
              onChange={(e) => setBookForm({...bookForm, image_url: e.target.value})}
              className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo"
            />
          </div>
        </div>
      </section>

      {/* About Page */}
      <section className="bg-paper border border-border rounded-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">About Page</h2>
          <button
            onClick={handleSaveAbout}
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors"
          >
            <Save size={14} /> Save About
          </button>
        </div>
        
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Biography</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                className="w-full bg-paper border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo"
              />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Profile Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={aboutImage}
                onChange={(e) => setAboutImage(e.target.value)}
                className="w-full bg-paper border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo"
              />
              {aboutImage && (
                <div className="mt-4 w-24 h-24 rounded-full overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={aboutImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted">The Writing Journey</label>
              <button onClick={addJourneyStep} className="flex items-center gap-1 text-[11px] font-ui uppercase tracking-widest text-indigo hover:text-ink transition-colors">
                <Plus size={14} /> Add Step
              </button>
            </div>
            
            <div className="space-y-3">
              {journey.map((step, index) => (
                <div key={index} className="flex gap-4 items-start bg-paper-card border border-border p-4 rounded-sm">
                  <div className="flex flex-col gap-1 mt-1">
                    <button onClick={() => moveJourneyStep(index, 'up')} disabled={index === 0} className="p-1 text-ink-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowUp size={14} />
                    </button>
                    <span className="text-center font-ui text-[10px] text-ink-muted">{step.sort_order}</span>
                    <button onClick={() => moveJourneyStep(index, 'down')} disabled={index === journey.length - 1} className="p-1 text-ink-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-[100px_1fr] gap-3">
                      <input type="text" placeholder="Year" value={step.year} onChange={(e) => updateJourneyStep(index, 'year', e.target.value)} className="w-full bg-paper border border-border p-2 font-display text-sm focus:outline-none focus:border-indigo" />
                      <input type="text" placeholder="Title" value={step.title} onChange={(e) => updateJourneyStep(index, 'title', e.target.value)} className="w-full bg-paper border border-border p-2 font-display text-sm focus:outline-none focus:border-indigo" />
                    </div>
                    <textarea placeholder="Body" value={step.body} onChange={(e) => updateJourneyStep(index, 'body', e.target.value)} rows={2} className="w-full bg-paper border border-border p-2 font-body text-sm focus:outline-none focus:border-indigo" />
                  </div>
                  <button onClick={() => removeJourneyStep(index)} className="p-2 text-ink-muted hover:text-red-500 transition-colors mt-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {journey.length === 0 && (
                <div className="text-center p-6 border border-dashed border-border text-[13px] font-body text-ink-muted">
                  No journey steps added.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
