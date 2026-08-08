import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  const siteName = settings?.site_name || "Writer Lokam";
  const nameParts = siteName.split(" ");
  const firstPart = nameParts[0];
  const restPart = nameParts.slice(1).join(" ");

  return (
    <footer className="bg-paper">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <Link href="/" className="font-display text-lg text-ink mb-2 block">
            {firstPart} <span className="italic text-indigo">{restPart}</span>
          </Link>
          <p className="text-[13px] text-ink-muted max-w-xs leading-relaxed font-body whitespace-pre-wrap">
            {settings?.footer_blurb || "A catalogued home for stories about love, memory, and everything held between the lines."}
          </p>
        </div>
        <div className="flex gap-16">
          <div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-4 font-ui">
              Explore
            </p>
            <ul className="space-y-2 text-[13px] text-ink-soft font-ui">
              <li>
                <Link href="/stories" className="hover:text-ink">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-ink">
                  Book
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-ink">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-4 font-ui">
              Connect
            </p>
            <ul className="space-y-2 text-[13px] text-ink-soft font-ui">
              <li>
                <a
                  href={settings?.social_instagram_url || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={settings?.social_twitter_url || "https://twitter.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href={settings?.social_email ? `mailto:${settings.social_email}` : "#"}
                  className="hover:text-ink transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 border-t border-border text-[11px] text-ink-muted font-ui">
        © {new Date().getFullYear()} {siteName}. {settings?.stamp_est_year || "EST. 2025"}
      </div>
    </footer>
  );
}
