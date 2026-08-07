"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "../actions";

export default function SettingsPage({
  initialMaintenanceMode,
}: {
  initialMaintenanceMode: boolean;
}) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(initialMaintenanceMode);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newValue = !isMaintenanceMode;
    setIsMaintenanceMode(newValue);
    startTransition(() => {
      updateSiteSettings(newValue);
    });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl text-ink mb-2">Settings</h1>
      <p className="text-ink-soft font-body mb-10">Configure global website settings.</p>

      <div className="bg-paper border border-border p-8 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl text-ink">Maintenance Mode</h3>
            <p className="text-[14px] text-ink-soft font-body mt-1 max-w-sm">
              When active, visitors will see a "Coming Soon" screen. You will still be able to browse the site normally because you are logged in as admin.
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
    </div>
  );
}
