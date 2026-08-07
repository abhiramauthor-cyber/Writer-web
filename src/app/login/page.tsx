"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import IkatDivider from "@/components/IkatDivider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ text: error.message, error: true });
    } else {
      setMessage({ text: "Check your email for the login link.", error: false });
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-ink-muted hover:text-ink transition-colors font-ui"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-ink mb-3">Sign In</h1>
            <p className="text-[14px] text-ink-soft font-body leading-relaxed">
              Sign in to save stories to your library, leave comments, and join the reading room.
            </p>
          </div>

          <div className="bg-paper-card border border-border p-8">
            <form onSubmit={handleMagicLink} className="mb-6">
              <label className="block text-[11px] tracking-[0.14em] uppercase text-ink-muted mb-2 font-ui">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-transparent border border-border px-4 py-3 text-sm text-ink placeholder-placeholder focus:outline-none focus:border-indigo font-body mb-4"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-paper text-[11px] tracking-[0.18em] uppercase px-6 py-4 hover:bg-indigo transition-colors font-ui disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            </form>

            {message && (
              <div
                className={`mb-6 p-4 text-[13px] font-body text-center border ${
                  message.error
                    ? "bg-rust/10 border-rust/20 text-rust"
                    : "bg-indigo/10 border-indigo/20 text-indigo"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-paper-card text-[10px] tracking-widest uppercase text-ink-muted font-ui">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full border border-ink text-ink text-[11px] tracking-[0.18em] uppercase px-6 py-4 hover:bg-ink hover:text-paper transition-colors font-ui flex items-center justify-center gap-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>
        </div>
      </main>
      
      <div className="mt-auto">
        <IkatDivider tone="indigo" />
      </div>
    </div>
  );
}
