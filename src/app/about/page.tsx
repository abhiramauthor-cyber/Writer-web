import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { getPageContent } from "@/lib/data";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IkatDivider from "@/components/IkatDivider";
import ContactForm from "@/components/ContactForm";

const journey = [
  {
    year: "2022",
    title: "First story, written for no one",
    body: "Started writing short fiction in Telugu and English, mostly about the families around me.",
  },
  {
    year: "2024",
    title: "Two States, One Heart begins",
    body: "What started as a single scene overheard at a wedding grew into a full manuscript.",
  },
  {
    year: "2025",
    title: "The reading room opens",
    body: "Writer Lokam started as a place to publish short stories alongside the novel.",
  },
  {
    year: "2026",
    title: "Two States, One Heart is published",
    body: "The novel finds its way into readers' hands, in print and as an ebook.",
  },
];

export default async function AboutPage() {
  const aboutContent = await getPageContent("about");

  return (
    <>
      <Nav activePage="about" cta={{ label: "Get in Touch", href: "#contact" }} />
      <AboutHero />
      <Biography content={aboutContent} />
      <IkatDivider tone="indigo" />
      <Journey />
      <Achievements content={aboutContent} />
      <SocialLinks />
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

function Journey() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
      <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-4 font-ui">
        The Writing Journey
      </p>
      <h2 className="font-display text-3xl md:text-4xl text-ink mb-12">
        How this came to be
      </h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {journey.map((j, i) => (
          <div key={i} className="bg-paper-card border border-border p-7">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display italic text-2xl text-marigold-text">
                {j.year}
              </span>
              <span className="font-ui text-[11px] tracking-wider text-ink-muted">
                Card No. {String(i + 2).padStart(3, "0")}
              </span>
            </div>
            <h3 className="font-display text-xl text-ink mb-2">{j.title}</h3>
            <p className="text-[14px] text-ink-soft leading-relaxed font-body">
              {j.body}
            </p>
          </div>
        ))}
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

function SocialLinks() {
  const links = [
    { icon: Instagram, label: "Instagram", handle: "@writerlokam" },
    { icon: Twitter, label: "Twitter / X", handle: "@writerlokam" },
    { icon: Mail, label: "Email", handle: "hello@writerlokam.com" },
  ];
  return (
    <section className="bg-paper-card border-y border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <p className="text-[11px] tracking-[0.24em] uppercase text-marigold-text mb-4 font-ui">
          Find Me
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-10">
          Stay connected
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {links.map(({ icon: Icon, label, handle }) => (
            <Link
              key={label}
              href="#"
              className="group flex items-center gap-4 border border-border p-6 hover:border-ink/40 transition-colors"
            >
              <Icon size={20} className="text-indigo shrink-0" />
              <div>
                <p className="text-[13px] text-ink font-ui">{label}</p>
                <p className="text-[12px] text-ink-muted font-ui">{handle}</p>
              </div>
              <ArrowRight
                size={14}
                className="ml-auto text-ink-muted group-hover:text-ink transition-colors"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
