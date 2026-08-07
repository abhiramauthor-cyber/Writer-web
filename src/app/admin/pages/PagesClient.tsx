"use client";

import { useState, useTransition } from "react";
import { updatePageHero } from "../actions";
import { Save } from "lucide-react";
import ImageUpload from "../components/ImageUpload";

export default function PagesClient({ heroes }: { heroes: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("home");

  const [forms, setForms] = useState(
    heroes.reduce((acc, hero) => ({ ...acc, [hero.slug]: hero }), {})
  );

  const activeForm = forms[activeTab as keyof typeof forms] || {
    slug: activeTab,
    eyebrow: "",
    heading: "",
    subheading: "",
    body: "",
    cta_primary_label: "",
    cta_primary_href: "",
    cta_secondary_label: "",
    cta_secondary_href: "",
    image_url: "",
  };

  const handleUpdate = (field: string, value: string) => {
    setForms((prev: any) => ({
      ...prev,
      [activeTab]: {
        ...activeForm,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    startTransition(() => {
      updatePageHero(activeForm)
        .then(() => alert(`${activeTab} page saved!`))
        .catch((e) => alert("Error saving page: " + e.message));
    });
  };

  const tabs = ["home", "book", "about", "stories"];

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div>
        <h1 className="font-display text-4xl text-ink mb-2">Pages</h1>
        <p className="text-ink-soft font-body">Manage the Hero sections for each main page.</p>
      </div>

      <div className="flex gap-4 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 font-ui text-[13px] tracking-widest uppercase transition-colors ${
              activeTab === tab
                ? "text-indigo border-b-2 border-indigo"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="bg-paper border border-border p-8 rounded-md">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-ink capitalize">{activeTab} Page Hero</h2>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors disabled:opacity-50"
          >
            <Save size={14} /> Save {activeTab}
          </button>
        </div>

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Eyebrow (Small text above)</label>
              <input type="text" value={activeForm.eyebrow || ""} onChange={(e) => handleUpdate("eyebrow", e.target.value)} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Heading (Main Title)</label>
              <input type="text" value={activeForm.heading || ""} onChange={(e) => handleUpdate("heading", e.target.value)} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Subheading</label>
              <input type="text" value={activeForm.subheading || ""} onChange={(e) => handleUpdate("subheading", e.target.value)} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Body Text</label>
              <textarea rows={3} value={activeForm.body || ""} onChange={(e) => handleUpdate("body", e.target.value)} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
          </div>

          <hr className="border-border" />

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-ui text-[13px] tracking-widest uppercase text-ink mb-4">Calls to Action</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Primary Label</label>
                  <input type="text" value={activeForm.cta_primary_label || ""} onChange={(e) => handleUpdate("cta_primary_label", e.target.value)} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
                </div>
                <div>
                  <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Primary URL</label>
                  <input type="text" value={activeForm.cta_primary_href || ""} onChange={(e) => handleUpdate("cta_primary_href", e.target.value)} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Secondary Label</label>
                  <input type="text" value={activeForm.cta_secondary_label || ""} onChange={(e) => handleUpdate("cta_secondary_label", e.target.value)} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
                </div>
                <div>
                  <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Secondary URL</label>
                  <input type="text" value={activeForm.cta_secondary_href || ""} onChange={(e) => handleUpdate("cta_secondary_href", e.target.value)} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-ui text-[13px] tracking-widest uppercase text-ink mb-4">Hero Image</h3>
              <ImageUpload 
                label="Hero Image URL (Optional)" 
                currentImageUrl={activeForm.image_url} 
                onUploadSuccess={(url) => handleUpdate("image_url", url)} 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
