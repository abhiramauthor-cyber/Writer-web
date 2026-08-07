"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import IkatDivider from "@/components/IkatDivider";
import { subscribeToNewsletter } from "@/app/actions";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setMessage(null);
    startTransition(() => {
      subscribeToNewsletter(email)
        .then(() => {
          setMessage({ text: "Thank you for subscribing!", type: "success" });
          setEmail("");
        })
        .catch((err) => {
          setMessage({ text: err.message, type: "error" });
        });
    });
  };

  return (
    <section className="bg-indigo">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-paper mb-4">
          A letter, once a month
        </h2>
        <p className="text-indigo-body text-[15px] mb-10 max-w-md mx-auto leading-relaxed font-body">
          New stories, writing updates, and news about Two States, One Heart —
          one card added to your catalog every month, never more.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-transparent border border-indigo-border px-5 py-4 text-sm text-paper placeholder-indigo-muted focus:outline-none focus:border-marigold font-body"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-marigold text-ink text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-marigold-hover transition-colors font-ui font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? "Subscribing..." : (
              <>
                Subscribe <Send size={14} />
              </>
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-6 text-sm font-body ${message.type === 'success' ? 'text-indigo' : 'text-rust'}`}>
            {message.text}
          </div>
        )}
      </div>
      <IkatDivider tone="marigold" />
    </section>
  );
}
