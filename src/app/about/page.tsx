import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import IkatDivider from "@/components/IkatDivider";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Abhi and the journey behind Writer Lokam.",
};

export default async function AboutPage() {
  const supabase = await createClient();
  
  const { data: hero } = await supabase.from("page_hero").select("*").eq("slug", "about").single();
  const { data: author } = await supabase.from("author_profile").select("*").eq("id", 1).single();
  const { data: journey } = await supabase.from("journey_items").select("*").order("sort_order", { ascending: true });
  const { data: achievements } = await supabase.from("achievements").select("*").order("sort_order", { ascending: true });
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  return (
    <>
      <Nav activePage="about" cta={{ label: hero?.cta_primary_label || "Get in Touch", href: hero?.cta_primary_href || "#contact" }} />
      <AboutHero hero={hero} author={author} />
      <Biography author={author} />
      {journey && journey.length > 0 && (
        <section className="bg-paper-card border-y border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
            <h2 className="font-display text-3xl md:text-4xl text-ink mb-16 text-center">
              The Journey
            </h2>
            <div className="max-w-3xl mx-auto space-y-12">
              {journey.map((step: any) => (
                <div key={step.id} className="flex flex-col md:flex-row gap-4 md:gap-10">
                  <div className="md:w-32 flex-shrink-0 font-ui text-[13px] tracking-widest text-indigo uppercase pt-1">
                    {step.year}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-ink mb-2">
                      {step.title}
                    </h3>
                    <p className="text-ink-soft font-body leading-relaxed text-[15px]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <Achievements achievements={achievements || []} />
      <SocialLinks settings={settings} />
      <ContactForm />
      <Footer />
    </>
  );
}

function AboutHero({ hero, author }: { hero: any, author: any }) {
  const imageUrl = hero?.image_url || author?.avatar_url;
  const eyebrow = hero?.eyebrow || "Card No. 000 · The Author";
  const heading = hero?.heading || `Hi, I'm ${author?.name || "Abhi"}`;
  const body = hero?.body || "I write stories about the quiet negotiations inside families — the ones that happen over dinner, in two languages, when love has to make room for everyone at the table.";
  
  // Format the heading so the last word is italic marigold-text if it matches pattern.
  // Actually, we can just render the heading exactly. Or if we want to mimic the old design "Hi, I'm Abhi":
  const words = heading.split(" ");
  const lastWord = words.pop();
  const restOfHeading = words.join(" ");

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-16">
      <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
        {imageUrl ? (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden shrink-0 mx-auto md:mx-0 border-2 border-indigo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Author" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-indigo flex items-center justify-center font-display text-5xl italic text-paper shrink-0 mx-auto md:mx-0">
            {author?.name?.charAt(0) || "A"}
          </div>
        )}
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-5 font-ui">
            {eyebrow}
          </p>
          <h1 className="font-display text-ink leading-[0.98] text-[44px] sm:text-[56px] md:text-[64px]">
            {restOfHeading} <span className="italic text-marigold-text">{lastWord}</span>
          </h1>
          <p className="mt-6 text-[15.5px] text-ink-soft leading-relaxed max-w-lg font-body whitespace-pre-wrap">
            {body}
          </p>
        </div>
      </div>
      <div className="mt-16">
        <IkatDivider tone="mixed" />
      </div>
    </section>
  );
}


function Biography({ author }: { author: any }) {
  const bioParagraphs = author?.bio_paragraphs || ["I grew up listening to two kinds of stories..."];

  return (
    <section className="bg-paper-card border-y border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-4 font-ui">
          Biography
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-6">
          A little about me
        </h2>
        <div className="max-w-2xl space-y-5 text-[15px] text-ink-soft leading-relaxed font-body whitespace-pre-wrap">
          {bioParagraphs.map((p: string, idx: number) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function Achievements({ achievements }: { achievements: any[] }) {
  if (achievements.length === 0) return null;

  return (
    <section className="bg-indigo">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <p className="text-[11px] tracking-[0.24em] uppercase text-gold mb-4 font-ui">
          Achievements
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-paper mb-10">
          On the record
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {achievements.map((a: any) => (
            <div key={a.id} className="border border-indigo-border p-6">
              <span className="font-ui text-[11px] tracking-wider text-indigo-muted block mb-3">
                Achieved
              </span>
              <p className="text-[14.5px] text-indigo-light leading-relaxed font-body">
                {a.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instagram({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function Twitter({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  );
}

function SocialLinks({ settings }: { settings: any }) {
  return (
    <section className="bg-paper-card border-y border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <p className="text-[11px] tracking-[0.24em] uppercase text-marigold-text mb-4 font-ui">
          Find Me
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-10">
          Stay connected
        </h2>
        <div className="max-w-md mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Instagram */}
          <a
            href={settings?.social_instagram_url || "https://instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 border border-border bg-paper hover:bg-paper-card transition-colors group"
          >
            <Instagram size={24} className="text-ink-muted group-hover:text-indigo transition-colors mb-3" />
            <span className="font-ui text-[11px] tracking-widest uppercase text-ink-muted group-hover:text-ink transition-colors">
              Instagram
            </span>
          </a>
          
          {/* Twitter / X */}
          <a
            href={settings?.social_twitter_url || "https://twitter.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 border border-border bg-paper hover:bg-paper-card transition-colors group"
          >
            <Twitter size={24} className="text-ink-muted group-hover:text-indigo transition-colors mb-3" />
            <span className="font-ui text-[11px] tracking-widest uppercase text-ink-muted group-hover:text-ink transition-colors">
              Twitter / X
            </span>
          </a>

          {/* Email */}
          <a
            href={settings?.social_email ? `mailto:${settings.social_email}` : "#"}
            className="flex flex-col items-center justify-center p-6 border border-border bg-paper hover:bg-paper-card transition-colors group"
          >
            <Mail size={24} className="text-ink-muted group-hover:text-indigo transition-colors mb-3" />
            <span className="font-ui text-[11px] tracking-widest uppercase text-ink-muted group-hover:text-ink transition-colors">
              Email
            </span>
            <span className="font-body text-[12px] text-ink-soft mt-1 text-center">
              Say Hello
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
