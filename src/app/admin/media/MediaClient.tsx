"use client";

import { useState, useTransition } from "react";
import { deleteImage } from "./actions";
import { Trash2, Copy, Check } from "lucide-react";
import ImageUpload from "../components/ImageUpload";

export default function MediaClient({ initialFiles }: { initialFiles: any[] }) {
  const [files, setFiles] = useState<any[]>(initialFiles);
  const [isPending, startTransition] = useTransition();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleUploadSuccess = (url: string) => {
    // Quick reload to show the newly uploaded file at the top
    window.location.reload();
  };

  const handleDelete = (url: string) => {
    if (!confirm("Are you sure? If this image is in use, it will break on the live site.")) return;
    startTransition(() => {
      deleteImage(url).then(() => {
        setFiles(files.filter(f => f.url !== url));
      }).catch(e => alert(e.message));
    });
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="max-w-6xl space-y-12 pb-20">
      <div>
        <h1 className="font-display text-4xl text-ink mb-2">Media Gallery</h1>
        <p className="text-ink-soft font-body">Manage all uploaded assets in the `public_assets` bucket.</p>
      </div>

      <section className="bg-paper border border-border p-8 rounded-md">
        <h2 className="font-display text-2xl text-ink mb-6">Upload New Image</h2>
        <div className="max-w-sm">
          <ImageUpload 
            label="Select file" 
            onUploadSuccess={handleUploadSuccess} 
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink mb-6">Uploaded Files</h2>
        {files.length === 0 ? (
          <p className="text-ink-muted text-sm italic">No files uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {files.map((file) => (
              <div key={file.name} className="bg-paper border border-border flex flex-col">
                <div className="relative aspect-square border-b border-border bg-paper-card overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <p className="text-[11px] font-ui text-ink-muted truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopy(file.url)}
                      className="flex-1 flex items-center justify-center gap-2 bg-paper-card border border-border py-2 text-[11px] font-ui uppercase hover:bg-paper transition-colors text-ink"
                    >
                      {copiedUrl === file.url ? <Check size={12} className="text-indigo" /> : <Copy size={12} />}
                      {copiedUrl === file.url ? "Copied" : "Copy URL"}
                    </button>
                    <button 
                      onClick={() => handleDelete(file.url)}
                      disabled={isPending}
                      className="px-3 border border-border hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-50 text-ink-muted"
                      title="Delete Image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
