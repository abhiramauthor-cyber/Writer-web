"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings, updateAuthorProfile } from "../actions";
import { Save } from "lucide-react";
import ImageUpload from "../components/ImageUpload";

export default function SettingsClient({
  initialSettings,
  initialAuthor,
}: {
  initialSettings: any;
  initialAuthor: any;
}) {
  const [isPending, startTransition] = useTransition();

  const [settings, setSettings] = useState({
    site_name: initialSettings?.site_name || "",
    tagline: initialSettings?.tagline || "",
    footer_blurb: initialSettings?.footer_blurb || "",
    meta_description: initialSettings?.meta_description || "",
    og_image_url: initialSettings?.og_image_url || "",
    newsletter_heading: initialSettings?.newsletter_heading || "",
    newsletter_body: initialSettings?.newsletter_body || "",
    social_instagram_url: initialSettings?.social_instagram_url || "",
    social_twitter_url: initialSettings?.social_twitter_url || "",
    social_email: initialSettings?.social_email || "",
    stamp_est_year: initialSettings?.stamp_est_year || "",
    is_maintenance_mode: Boolean(initialSettings?.is_maintenance_mode),
  });

  const [author, setAuthor] = useState({
    name: initialAuthor?.name || "",
    avatar_url: initialAuthor?.avatar_url || "",
    bio_paragraphs: initialAuthor?.bio_paragraphs ? initialAuthor.bio_paragraphs.join("\n\n") : "",
  });

  const handleSaveSettings = () => {
    startTransition(() => {
      updateSiteSettings(settings)
        .then(() => alert("Settings saved!"))
        .catch((e) => alert("Error saving settings: " + e.message));
    });
  };

  const handleSaveAuthor = () => {
    startTransition(() => {
      const bioArray = author.bio_paragraphs.split("\n\n").filter((p: string) => p.trim() !== "");
      updateAuthorProfile({ ...author, bio_paragraphs: bioArray })
        .then(() => alert("Author profile saved!"))
        .catch((e) => alert("Error saving author profile: " + e.message));
    });
  };

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div>
        <h1 className="font-display text-4xl text-ink mb-2">Settings</h1>
        <p className="text-ink-soft font-body">Configure global website settings and author profile.</p>
      </div>

      {/* Author Profile */}
      <section className="bg-paper border border-border p-8 rounded-md">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-ink">Author Profile</h2>
          <button
            onClick={handleSaveAuthor}
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors disabled:opacity-50"
          >
            <Save size={14} /> Save Profile
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Author Name</label>
              <input type="text" value={author.name} onChange={(e) => setAuthor({...author, name: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Biography (Separate paragraphs with blank lines)</label>
              <textarea 
                rows={8} 
                value={author.bio_paragraphs} 
                onChange={(e) => setAuthor({...author, bio_paragraphs: e.target.value})} 
                className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
          </div>
          <div>
            <ImageUpload 
              label="Avatar Image" 
              currentImageUrl={author.avatar_url} 
              onUploadSuccess={(url) => setAuthor({...author, avatar_url: url})} 
            />
          </div>
        </div>
      </section>

      {/* Global Settings */}
      <section className="bg-paper border border-border p-8 rounded-md">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-ink">Global Settings</h2>
          <button
            onClick={handleSaveSettings}
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors disabled:opacity-50"
          >
            <Save size={14} /> Save Settings
          </button>
        </div>

        <div className="space-y-8">
          {/* Maintenance Mode */}
          <div className="bg-paper-card border border-border p-6 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-ui text-[13px] tracking-widest uppercase text-ink font-bold flex items-center gap-2">
                  Maintenance Mode
                  {settings.is_maintenance_mode && (
                    <span className="bg-rust/20 text-rust-text text-[10px] px-2 py-0.5 rounded-full font-mono">
                      ACTIVE
                    </span>
                  )}
                </h3>
                <p className="text-xs text-ink-soft font-body mt-1">
                  When turned on, public visitors are redirected to the <span className="font-mono text-indigo font-bold">/maintenance</span> page. You (Admin) can still access the admin dashboard.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.is_maintenance_mode}
                  onChange={(e) => setSettings({ ...settings, is_maintenance_mode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-paper after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rust"></div>
                <span className="ml-3 font-ui text-[11px] tracking-widest uppercase font-bold text-ink">
                  {settings.is_maintenance_mode ? "ON" : "OFF"}
                </span>
              </label>
            </div>
          </div>

          <hr className="border-border" />

          {/* Brand */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Site Name</label>
              <input type="text" value={settings.site_name} onChange={(e) => setSettings({...settings, site_name: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Tagline</label>
              <input type="text" value={settings.tagline} onChange={(e) => setSettings({...settings, tagline: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Footer Blurb</label>
              <textarea rows={3} value={settings.footer_blurb} onChange={(e) => setSettings({...settings, footer_blurb: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Stamp / Est. Year</label>
              <input type="text" value={settings.stamp_est_year} onChange={(e) => setSettings({...settings, stamp_est_year: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
          </div>

          <hr className="border-border" />

          {/* SEO & Meta */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Meta Description</label>
              <textarea rows={3} value={settings.meta_description} onChange={(e) => setSettings({...settings, meta_description: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
            </div>
            <div>
              <ImageUpload 
                label="OG Image (Social Sharing)" 
                currentImageUrl={settings.og_image_url} 
                onUploadSuccess={(url) => setSettings({...settings, og_image_url: url})} 
              />
            </div>
          </div>

          <hr className="border-border" />

          {/* Social Links */}
          <div>
            <h3 className="font-ui text-[13px] tracking-widest uppercase text-ink mb-4">Social & Contact</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Instagram URL</label>
                <input type="url" value={settings.social_instagram_url} onChange={(e) => setSettings({...settings, social_instagram_url: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
              </div>
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Twitter / X URL</label>
                <input type="url" value={settings.social_twitter_url} onChange={(e) => setSettings({...settings, social_twitter_url: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
              </div>
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Contact Email</label>
                <input type="email" value={settings.social_email} onChange={(e) => setSettings({...settings, social_email: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Newsletter */}
          <div>
            <h3 className="font-ui text-[13px] tracking-widest uppercase text-ink mb-4">Newsletter Section</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Heading</label>
                <input type="text" value={settings.newsletter_heading} onChange={(e) => setSettings({...settings, newsletter_heading: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
              </div>
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Body Text</label>
                <input type="text" value={settings.newsletter_body} onChange={(e) => setSettings({...settings, newsletter_body: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" />
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
