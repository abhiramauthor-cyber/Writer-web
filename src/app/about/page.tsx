import { ArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getPageContent } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import IkatDivider from "@/components/IkatDivider";
import ContactForm from "@/components/ContactForm";

export default async function AboutPage() {
  const content = await getPageContent("about");
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('social_links').eq('id', 1).single();
  
  const bio = content?.bio || "Biography goes here.";
  const journey = content?.journey || [];
  const socials = settings?.social_links || {};

  return (
    <>
      <Nav activePage="about" cta={{ label: "Get in Touch", href: "#contact" }} />
      <AboutHero />
      <Biography content={content} />
      {journey.length > 0 && (
        <section className="bg-paper-card border-y border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
            <h2 className="font-display text-3xl md:text-4xl text-ink mb-16 text-center">
              The Journey
            </h2>
            <div className="max-w-3xl mx-auto space-y-12">
              {journey.map((step: any, index: number) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-10">
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
      <Achievements content={content} />
      <SocialLinks socials={socials} />
      <ContactForm />
      <Footer />
    </>
  );
}

function AboutHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-16">
      <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-indigo flex items-center justify-center font-display text-5xl italic text-paper shrink-0 mx-auto md:mx-0">
          A
        </div>
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-5 font-ui">
            Card No. 000 &middot; The Author
          </p>
          <h1 className="font-display text-ink leading-[0.98] text-[44px] sm:text-[56px] md:text-[64px]">
            Hi, I&apos;m <span className="italic text-marigold-text">Abhi</span>
          </h1>
          <p className="mt-6 text-[15.5px] text-ink-soft leading-relaxed max-w-lg font-body">
            I write stories about the quiet negotiations inside families — the
            ones that happen over dinner, in two languages, when love has to
            make room for everyone at the table.
          </p>
        </div>
      </div>
      <div className="mt-16">
        <IkatDivider tone="mixed" />
      </div>
    </section>
  );
}


function Biography({ content }: { content: any }) {
  const bioText = content?.bio || "I grew up listening to two kinds of stories — the ones told at the dinner table, and the ones I made up on the way home from school. Somewhere along the way, the second kind started to feel like the more honest version of the first.";

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
          <p>{bioText}</p>
        </div>
      </div>
    </section>
  );
}

function Achievements({ content }: { content: any }) {
  const achievements = content?.achievements || [
    { title: "Author, Two States, One Heart", year: "2023" },
    { title: "Original short fiction published monthly on Writer Lokam", year: "2024" },
    { title: "Writing in both Telugu and English", year: "Ongoing" },
  ];

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
          {achievements.map((a: { title: string; year: string }, i: number) => (
            <div key={i} className="border border-indigo-border p-6">
              <span className="font-ui text-[11px] tracking-wider text-indigo-muted block mb-3">
                {a.year}
              </span>
              <p className="text-[14.5px] text-indigo-light leading-relaxed font-body">
                {a.title}
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

function SocialLinks({ socials }: { socials: any }) {
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
          {socials?.instagram?.handle && (
            <a
              href={socials.instagram.url || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-6 border border-border bg-paper hover:bg-paper-card transition-colors group"
            >
              <Instagram size={24} className="text-ink-muted group-hover:text-indigo transition-colors mb-3" />
              <span className="font-ui text-[11px] tracking-widest uppercase text-ink-muted group-hover:text-ink transition-colors">
                Instagram
              </span>
              <span className="font-body text-[12px] text-ink-soft mt-1 text-center">
                {socials.instagram.handle}
              </span>
            </a>
          )}
          
          {/* Twitter / X */}
          {socials?.twitter?.handle && (
            <a
              href={socials.twitter.url || "https://twitter.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-6 border border-border bg-paper hover:bg-paper-card transition-colors group"
            >
              <Twitter size={24} className="text-ink-muted group-hover:text-indigo transition-colors mb-3" />
              <span className="font-ui text-[11px] tracking-widest uppercase text-ink-muted group-hover:text-ink transition-colors">
                Twitter / X
              </span>
              <span className="font-body text-[12px] text-ink-soft mt-1 text-center">
                {socials.twitter.handle}
              </span>
            </a>
          )}

          {/* Email */}
          {socials?.email && (
            <a
              href={`mailto:${socials.email}`}
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
          )}
        </div>
      </div>
    </section>
  );
}
