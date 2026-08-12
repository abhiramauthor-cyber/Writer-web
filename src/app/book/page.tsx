import { BookOpen, Quote, Heart, Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IkatDivider from "@/components/IkatDivider";
import BuySection from "./BuySection";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "Two States, One Heart",
  description: "Get the book that inspired the catalog. Two States, One Heart is available in print and as an ebook.",
};

export default async function BookPage() {
  const supabase = await createClient();
  
  const { data: hero } = await supabase.from("page_hero").select("*").eq("slug", "book").single();
  const { data: details } = await supabase.from("book_details").select("*").eq("id", 1).single();
  const { data: author } = await supabase.from("author_profile").select("*").eq("id", 1).single();
  const { data: reviews } = await supabase.from("reviews").select("*").order("sort_order", { ascending: true });
  const { data: buyLinks } = await supabase.from("buy_links").select("*").order("sort_order", { ascending: true });

  return (
    <>
      <Nav activePage="book" cta={{ label: hero?.cta_primary_label || "Buy the Book", href: hero?.cta_primary_href || "#buy" }} />
      <BookHero hero={hero} details={details} />
      <AboutAuthor author={author} />
      <SampleChapter details={details} />
      <Reviews reviews={reviews || []} />
      <BuySection buyLinks={buyLinks || []} />
      <Footer />
    </>
  );
}

function BookHero({ hero, details }: { hero: any, details: any }) {
  const eyebrow = hero?.eyebrow || "The Debut Novel";
  const heading = hero?.heading || details?.title || "Two States, One Heart";
  const subtitle = hero?.subheading || details?.tagline || "Abhi · A Novel";
  const body = hero?.body || details?.synopsis || "Two families, two languages, two ways of loving — and the couple caught in between, trying to weave something that honors both.";
  const buyLink = hero?.cta_primary_href || "#buy";
  const sampleLink = hero?.cta_secondary_href || "#sample";
  const imageUrl = hero?.image_url || details?.cover_image_url;

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-16">
      <div className="grid md:grid-cols-[auto_1fr] gap-14 md:gap-20 items-center">
        <div className="order-1 md:order-2 flex justify-center">
          {imageUrl ? (
            <div className="relative w-64 md:w-80 aspect-[2/3] border border-border overflow-hidden bg-paper shadow-2xl">
              <Image
                src={imageUrl}
                alt={heading}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 256px, 320px"
                priority
              />
            </div>
          ) : (
            <div className="relative w-64 md:w-80 aspect-[2/3] bg-indigo p-7 flex flex-col justify-between shadow-2xl">
              <div
                className="absolute inset-3 border border-dashed border-marigold/50"
                aria-hidden="true"
              />
              <p className="relative text-[10px] tracking-[0.3em] uppercase text-gold font-ui">
                Card No. 001
              </p>
              <div className="relative text-center">
                <p className="font-display text-2xl leading-snug text-paper">
                  {heading.split(',').length > 1 ? (
                    <>
                      {heading.split(',')[0]},<br/>
                      {heading.split(',').slice(1).join(',')}
                    </>
                  ) : (
                    heading
                  )}
                </p>
              </div>
              <p className="relative text-[11px] tracking-[0.2em] uppercase text-paper/70 text-center font-ui">
                {subtitle}
              </p>
            </div>
          )}
        </div>

        <div className="order-2 md:order-1 pt-6 md:pt-16">
          <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-5 font-ui">
            {eyebrow}
          </p>
          <h1 className="font-display text-ink leading-tight text-[44px] sm:text-[56px] md:text-[64px] mb-4">
            {heading.split(',').length > 1 ? (
              <>
                {heading.split(',')[0]},
                <br />
                <span className="italic text-marigold-text">{heading.split(',').slice(1).join(',')}</span>
              </>
            ) : (
              <span className="italic text-marigold-text">{heading}</span>
            )}
          </h1>
          <p className="font-ui text-ink-muted tracking-[0.2em] uppercase text-[12px] mb-8">
            {subtitle}
          </p>
          <p className="text-[15.5px] leading-relaxed text-ink-soft font-body max-w-lg mb-10 whitespace-pre-wrap">
            {body}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={buyLink}
              className="bg-indigo text-paper text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-ink transition-colors font-ui"
            >
              {hero?.cta_primary_label || "Order Now"}
            </Link>
            <Link
              href={sampleLink}
              className="border border-border text-ink-muted text-[11px] tracking-[0.18em] uppercase px-7 py-4 inline-flex items-center gap-2 hover:bg-paper-card hover:text-ink transition-colors font-ui"
            >
              <BookOpen size={14} /> {hero?.cta_secondary_label || "Read Excerpt"}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <IkatDivider tone="mixed" />
      </div>
    </section>
  );
}

function AboutAuthor({ author }: { author: any }) {
  const name = author?.name || "Abhi";
  const bio = author?.bio_paragraphs || ["Abhi writes in the space between two languages and two ways of belonging..."];
  
  return (
    <section className="bg-paper-card border-y border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
          {author?.avatar_url ? (
            <div className="relative w-20 h-20 rounded-full border border-border overflow-hidden shrink-0">
              <Image
                src={author.avatar_url}
                alt={name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo flex items-center justify-center font-display text-2xl italic text-paper shrink-0">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-3 font-ui">
              About the Author
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-ink mb-4">
              Written by {name}
            </h2>
            <div className="text-[15px] text-ink-soft leading-relaxed max-w-2xl font-body mb-5 space-y-4">
              {bio.map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <Link
              href="/about"
              className="text-[11px] tracking-[0.16em] uppercase text-ink inline-flex items-center gap-2 border-b border-ink pb-1 font-ui"
            >
              Read the full author story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SampleChapter({ details }: { details: any }) {
  if (!details?.sample_chapter_body) return null;
  
  return (
    <section
      id="sample"
      className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24"
    >
      <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-4 font-ui">
        Sample Chapter
      </p>
      <h2 className="font-display text-3xl md:text-4xl text-ink mb-10">
        {details?.sample_chapter_title || "Chapter One"}
      </h2>

      <div className="bg-paper-card border border-border p-8 md:p-12">
        <p className="font-body text-[16px] md:text-[17px] leading-[1.9] text-ink max-w-2xl whitespace-pre-wrap">
          {details.sample_chapter_body}
        </p>
        <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <span className="text-[12px] text-ink-muted font-ui">
            {details?.sample_chapter_meta || "Read more"}
          </span>
          <Link
            href="#buy"
            className="text-[11px] tracking-[0.16em] uppercase text-ink inline-flex items-center gap-2 hover:gap-3 transition-all font-ui"
          >
            Continue in the full book <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Reviews({ reviews }: { reviews: any[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-indigo">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <p className="text-[11px] tracking-[0.24em] uppercase text-gold mb-4 font-ui">
          From Early Readers
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-paper mb-12">
          What people are saying
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="border border-indigo-border p-7 flex flex-col gap-5"
            >
              <Quote size={18} className="text-marigold" />
              <p className="font-body italic text-[15px] text-indigo-light leading-relaxed">
                &quot;{r.quote}&quot;
              </p>
              <div className="mt-auto pt-3 border-t border-indigo-border">
                <p className="text-[13px] text-paper font-ui">{r.name}</p>
                <p className="text-[11px] text-indigo-muted font-ui">
                  {r.context}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
