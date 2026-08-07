"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange =
    (field: "name" | "email" | "message") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-24">
      <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-4 font-ui">
        Contact
      </p>
      <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
        Write to me
      </h2>
      <p className="text-[15px] text-ink-soft mb-10 max-w-md leading-relaxed font-body">
        Thoughts on a story, a question about the book, or just to say hello — I
        read every message myself.
      </p>

      {sent ? (
        <div className="bg-paper-card border border-border p-8 text-center">
          <p className="font-display text-xl italic text-marigold-text mb-2">
            Message sent.
          </p>
          <p className="text-[14px] text-ink-muted font-body">
            Thank you for writing in — I&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] tracking-[0.14em] uppercase text-ink-muted mb-2 font-ui">
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Your name"
                className="w-full bg-paper-card border border-border px-4 py-3 text-sm text-ink placeholder-placeholder focus:outline-none focus:border-indigo font-body"
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.14em] uppercase text-ink-muted mb-2 font-ui">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                placeholder="your@email.com"
                className="w-full bg-paper-card border border-border px-4 py-3 text-sm text-ink placeholder-placeholder focus:outline-none focus:border-indigo font-body"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.14em] uppercase text-ink-muted mb-2 font-ui">
              Message
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={handleChange("message")}
              placeholder="What's on your mind?"
              className="w-full bg-paper-card border border-border px-4 py-3 text-sm text-ink placeholder-placeholder focus:outline-none focus:border-indigo font-body resize-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-ink text-paper text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-indigo transition-colors font-ui"
          >
            <Send size={14} /> Send message
          </button>
        </form>
      )}
    </section>
  );
}
