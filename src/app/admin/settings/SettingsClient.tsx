"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings, updateSocialLinks } from "../actions";
import { Save } from "lucide-react";

export default function SettingsClient({
  initialMaintenanceMode,
  initialSocialLinks,
}: {
  initialMaintenanceMode: boolean;
  initialSocialLinks: any;
}) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(initialMaintenanceMode);
  const [isPending, startTransition] = useTransition();

  const [socials, setSocials] = useState({
    instagram: { url: initialSocialLinks?.instagram?.url || "", handle: initialSocialLinks?.instagram?.handle || "" },
    twitter: { url: initialSocialLinks?.twitter?.url || "", handle: initialSocialLinks?.twitter?.handle || "" },
    email: initialSocialLinks?.email || "",
  });

  const handleToggle = () => {
    const newValue = !isMaintenanceMode;
    setIsMaintenanceMode(newValue);
    startTransition(() => {
      updateSiteSettings(newValue).catch(e => alert(e.message));
    });
  };

  const handleSaveSocials = () => {
    startTransition(() => {
      updateSocialLinks(socials).then(() => {
        alert("Social links saved!");
      }).catch(e => {
        alert("Error saving socials: " + e.message);
      });
    });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-2">Settings</h1>
      <p className="text-ink-soft font-body mb-10">Configure global website settings and links.</p>

      {/* Visibility */}
      <div className="bg-paper border border-border p-8 rounded-md mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl text-ink">Maintenance Mode</h3>
            <p className="text-[14px] text-ink-soft font-body mt-1 max-w-sm">
              When active, visitors will see a "Coming Soon" screen. You will still be able to browse the site normally.
            </p>
          </div>
          
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isMaintenanceMode ? "bg-marigold" : "bg-border"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-paper transition-transform ${
                isMaintenanceMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-paper border border-border p-8 rounded-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl text-ink">Social Links</h3>
          <button
            onClick={handleSaveSocials}
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors"
          >
            <Save size={14} /> Save Links
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Instagram URL</label>
              <input type="url" value={socials.instagram.url} onChange={(e) => setSocials({...socials, instagram: {...socials.instagram, url: e.target.value}})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Instagram Handle (Display)</label>
              <input type="text" value={socials.instagram.handle} onChange={(e) => setSocials({...socials, instagram: {...socials.instagram, handle: e.target.value}})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" placeholder="@handle" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Twitter/X URL</label>
              <input type="url" value={socials.twitter.url} onChange={(e) => setSocials({...socials, twitter: {...socials.twitter, url: e.target.value}})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Twitter/X Handle (Display)</label>
              <input type="text" value={socials.twitter.handle} onChange={(e) => setSocials({...socials, twitter: {...socials.twitter, handle: e.target.value}})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" placeholder="@handle" />
            </div>
          </div>

          <div>
            <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Email Address</label>
            <input type="email" value={socials.email} onChange={(e) => setSocials({...socials, email: e.target.value})} className="w-full bg-paper-card border border-border p-3 font-body text-sm text-ink focus:outline-none focus:border-indigo" placeholder="hello@example.com" />
          </div>
        </div>
      </div>

    </div>
  );
}
