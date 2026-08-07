import { BookOpen, ShoppingBag, Quote, Heart, Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IkatDivider from "@/components/IkatDivider";
import BuySection from "./BuySection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Two States, One Heart",
  description: "Get the book that inspired the catalog. Two States, One Heart is available in print and as an ebook.",
};

const reviews = [
  {
    quote:
      "I read the first chapter meaning to skim it, and finished it in one sitting instead. The family arguments felt like ones I'd actually had.",
    name: "Early reader",
    context: "Beta reading circle",
  },
  {
    quote:
      "What stayed with me wasn't the romance, it was the mothers. Two women who never meet but shape everything.",
    name: "Early reader",
    context: "Beta reading circle",
  },
  {
    quote:
      "Rare to see a story about two Indian states that isn't just about food and festivals. This one is about compromise.",
    name: "Early reader",
    context: "Beta reading circle",
  },
];

export default function BookPage() {
  return (
    <>
      <Nav activePage="book" cta={{ label: "Buy the Book", href: "#buy" }} />
      <BookHero />
      <AboutAuthor />
      <SampleChapter />
      <Reviews />
      <BuySection />
      <Footer />
    </>
  );
}

function BookHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-16">
      <div className="grid md:grid-cols-[auto_1fr] gap-14 md:gap-20 items-center">
        <div className="mx-auto md:mx-0">
          <div className="relative w-60 md:w-72 aspect-[2/3] bg-indigo p-7 flex flex-col justify-between shadow-[10px_10px_0_var(--color-border)]">
            <div
              className="absolute inset-3 border border-dashed border-marigold/50"
              aria-hidden="true"
            />
            <p className="relative text-[10px] tracking-[0.3em] uppercase text-gold font-ui">
              Card No. 001
            </p>
            <div className="relative text-center">
              <p className="font-display text-3xl leading-snug text-paper">
                Two States,
                <br />
                One Heart
              </p>
            </div>
            <p className="relative text-[11px] tracking-[0.2em] uppercase text-paper/70 text-center font-ui">
              Abhi &middot; A Novel
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-5 font-ui">
            The Book &middot; Fiction
          </p>
          <h1 className="font-display text-ink leading-[0.98] text-[44px] sm:text-[56px] md:text-[64px] mb-6">
            Two States,
            <br />
            <span className="italic text-marigold-text">One Heart</span>
          </h1>
          <p className="text-[15.5px] text-ink-soft leading-relaxed max-w-lg font-body mb-8">
            When Meera brings home a man from a state her family has never set
            foot in, love is the easy part. What follows is a quiet negotiation
            between two languages, two kitchens, two ideas of what a wedding —
            and a life — should look like. A novel about the distance between
            two states, and the smaller distances inside one family learning to
            close it.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#buy"
              className="inline-flex items-center gap-2 bg-ink text-paper text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-indigo transition-colors font-ui"
            >
              <ShoppingBag size={14} /> Buy the Book
            </Link>
            <Link
              href="#sample"
              className="inline-flex items-center gap-2 border border-ink text-ink text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-ink hover:text-paper transition-colors font-ui"
            >
              <BookOpen size={14} /> Read a Sample
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

function AboutAuthor() {
  return (
    <section className="bg-paper-card border-y border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
          <div className="w-20 h-20 rounded-full bg-indigo flex items-center justify-center font-display text-2xl italic text-paper shrink-0">
            A
          </div>
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-3 font-ui">
              About the Author
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-ink mb-4">
              Written by Abhi
            </h2>
            <p className="text-[15px] text-ink-soft leading-relaxed max-w-2xl font-body mb-5">
              Abhi writes in the space between two languages and two ways of
              belonging. Two States, One Heart grew out of stories overheard at
              family weddings — the negotiations, half in Telugu and half in
              translation, that decide what a new family will look like. This is
              a first novel about the quiet work love does after the proposal is
              over.
            </p>
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

function SampleChapter() {
  return (
    <section
      id="sample"
      className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24"
    >
      <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-4 font-ui">
        Sample Chapter
      </p>
      <h2 className="font-display text-3xl md:text-4xl text-ink mb-10">
        Chapter One &middot; The Announcement
      </h2>

      <div className="bg-paper-card border border-border p-8 md:p-12">
        <p className="font-body text-[16px] md:text-[17px] leading-[1.9] text-ink max-w-2xl">
          Meera&apos;s mother heard the news the way she heard most difficult
          things — standing at the stove, back turned, as though the sambar
          needed her more urgently than her daughter did. &quot;From where,&quot;
          she asked, not turning around. Not who. Not what does he do. From
          where. As if a state on a map could tell her everything else she
          needed to know.
          <br />
          <br />
          Meera had rehearsed this in the car. She had not rehearsed the silence
          that followed, the particular quality of it, the sound of a wooden
          spoon set down too carefully against a steel pot.
        </p>
        <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <span className="text-[12px] text-ink-muted font-ui">
            Chapter 1 of 24 &middot; 9 min read
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

function Reviews() {
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


