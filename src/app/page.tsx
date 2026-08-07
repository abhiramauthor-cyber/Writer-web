import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IkatDivider from "@/components/IkatDivider";
import Stamp from "@/components/Stamp";
import StoryCard from "@/components/StoryCard";
import Newsletter from "@/components/Newsletter";
import { getAllStories, getPageContent } from "@/lib/data";

/**
 * Homepage — "Card No. 001 · Original Short Fiction"
 *
 * PAGE-LEVEL NUMBERING: "Card No. 001" is a page-level label
 * for the site's front card. This is separate from story-level
 * catalog numbers (014+). See CatalogBadge.tsx for details.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Writer Lokam is a digital library catalog of original short fiction by Abhi. A reading room of stories about love, memory, hope, and longing.",
};

export default async function Home() {
  const allStories = await getAllStories();
  const stories = allStories.slice(0, 3); // Get latest 3 stories
  const homeContent = await getPageContent("home");
  const bookContent = await getPageContent("book");

  return (
    <>
      <Nav cta={{ label: "Read Stories", href: "/stories" }} />
      <Hero content={homeContent} />
      <Stories stories={stories} />
      <IkatDivider tone="indigo" />
      <BookShowcase content={bookContent} />
      <Newsletter />
      <Footer />
    </>
  );
}

/* ─── Hero ─── */
function Hero({ content }: { content: any }) {
  const title = content?.hero_title || "Writer Lokam";
  const subtitle = content?.hero_subtitle || "A reading room of original fiction about love, memory, hope, and longing — catalogued, kept, and added to every month.";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16">
      <div className="grid md:grid-cols-[1fr_auto] gap-10 items-start">
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-6 font-ui">
            Card No. 001 &middot; Original Short Fiction
          </p>
          <h1 className="font-display text-ink leading-[0.95] text-[54px] sm:text-[76px] md:text-[92px]">
            Writer
            <br />
            <span className="italic text-marigold">Lokam</span>
          </h1>
          <p className="mt-8 font-display italic text-xl md:text-2xl text-ink-soft max-w-lg">
            Two threads, dyed separately. Woven into one story.
          </p>
          <p className="mt-4 text-[15px] text-nav-muted max-w-md leading-relaxed font-body">
            {subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/stories"
              className="bg-ink text-paper text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-indigo transition-colors font-ui"
            >
              Read Stories
            </Link>
            <Link
              href="/book"
              className="border border-ink text-ink text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-ink hover:text-paper transition-colors font-ui"
            >
              Explore the Book
            </Link>
          </div>
        </div>

        <div className="hidden md:block pt-2">
          <Stamp />
        </div>
      </div>

      <div className="mt-16">
        <IkatDivider tone="mixed" />
      </div>
    </section>
  );
}

/* ─── Stories grid ─── */
import type { StoryData } from "@/components/StoryCard";

function Stories({ stories }: { stories: StoryData[] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
      <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-4 font-ui">
            The Catalog
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-ink">
            Recently added
          </h2>
        </div>
        <Link
          href="/stories"
          className="text-[11px] tracking-[0.16em] uppercase text-ink inline-flex items-center gap-2 border-b border-ink pb-1 font-ui"
        >
          Browse the full catalog <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stories.map((s) => (
          <StoryCard key={s.no} story={s} />
        ))}
      </div>
    </section>
  );
}

/* ─── Book Showcase ─── */
function BookShowcase({ content }: { content: any }) {
  const title = content?.title || "Two States, One Heart";
  const subtitle = content?.subtitle || "Abhi · A Novel";
  const synopsis = content?.synopsis || "Two families, two languages, two ways of loving — and the couple caught in between, trying to weave something that honors both. A story about the quiet negotiations that hold a family together.";
  const buyLink = content?.buy_link || "/book";
  const imageUrl = content?.image_url;

  return (
    <section className="bg-paper-card border-y border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block px-3 py-1 bg-indigo/10 text-indigo font-ui text-[11px] tracking-widest uppercase mb-6">
              The Debut Novel
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">
              {title}
            </h2>
            <p className="font-ui text-ink-muted tracking-[0.2em] uppercase text-[12px] mb-8">
              {subtitle}
            </p>
            <p className="text-[15.5px] leading-relaxed text-ink-soft font-body mb-8">
              {synopsis}
            </p>
            <Link
              href={buyLink}
              className="inline-flex items-center gap-3 bg-indigo text-paper px-8 py-4 font-ui text-[12px] tracking-widest uppercase hover:bg-ink transition-colors"
            >
              Order Now <ArrowRight size={16} />
            </Link>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            {imageUrl ? (
              <div className="relative w-56 md:w-72 aspect-[2/3] border border-border overflow-hidden bg-paper shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="relative w-56 md:w-72 aspect-[2/3] bg-indigo p-7 flex flex-col justify-between shadow-xl">
                <div
                  className="absolute inset-3 border border-dashed border-marigold/50"
                  aria-hidden="true"
                />
                <p className="relative text-[10px] tracking-[0.3em] uppercase text-gold font-ui">
                  Card No. 001
                </p>
                <div className="relative text-center">
                  <p className="font-display text-2xl leading-snug text-paper">
                    {title.split(',').length > 1 ? (
                      <>
                        {title.split(',')[0]},<br/>
                        {title.split(',').slice(1).join(',')}
                      </>
                    ) : (
                      title
                    )}
                  </p>
                </div>
                <p className="relative text-[11px] tracking-[0.2em] uppercase text-paper/70 text-center font-ui">
                  {subtitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
