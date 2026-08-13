import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { cookies } from "next/headers";
import Nav from "@/components/Nav";
import IkatDivider from "@/components/IkatDivider";
import ReadingProgress from "@/components/ReadingProgress";
import EngagementBar from "@/components/EngagementBar";
import StoryMinimalFooter from "@/components/StoryMinimalFooter";
import Comments, { type CommentData } from "@/components/Comments";
import { getStoryBySlugCached, getAllStoriesCached, getAuthorProfileCached } from "@/lib/data";
import type { StoryData } from "@/components/StoryCard";
import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { getAnonIdFromCookieHeader } from "@/lib/anonId";

const threadTextColorMap: Record<string, string> = {
  indigo: "var(--color-indigo)",
  marigold: "var(--color-marigold-text)",
  rust: "var(--color-rust-text)",
};
const threadColorMap: Record<string, string> = {
  indigo: "var(--color-indigo)",
  marigold: "var(--color-marigold)",
  rust: "var(--color-rust)",
};

export const revalidate = 3600; // ISR: revalidate every hour

export async function generateStaticParams() {
  const stories = await getAllStoriesCached();
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const storyData = await getStoryBySlugCached(slug);

  if (!storyData) {
    return {};
  }

  return {
    title: storyData.frontmatter.title,
    description: storyData.frontmatter.excerpt,
    openGraph: {
      title: storyData.frontmatter.title,
      description: storyData.frontmatter.excerpt,
      type: "article",
      publishedTime: new Date(Date.now()).toISOString(),
      authors: ["Abhi"],
    }
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const storyData = await getStoryBySlugCached(slug);

  if (!storyData) {
    notFound();
  }

  const { frontmatter: story, content } = storyData;

  // Supabase data fetching
  const supabase = await createClient();
  const { userId: clerkUserId } = await auth();

  // Fetch author profile
  const authorProfile = await getAuthorProfileCached();
  
  // Read anonymous ID from cookie (for anon like checks)
  const cookieStore = await cookies();
  const anonId = getAnonIdFromCookieHeader(cookieStore.toString());
  // The liker identity: Clerk user ID if logged in, otherwise anon cookie ID
  const likerId = clerkUserId || anonId;
  
  // 1. Get story UUID from Supabase
  const { data: dbStory } = await supabase
    .from("stories")
    .select("id")
    .eq("slug", slug)
    .single();

  const storyId = dbStory?.id;

  // 2. Get initial user state for EngagementBar
  let initialLiked = false;
  let initialSaved = false;
  let likeCount = 0;
  if (storyId) {
    const { count } = await supabase.from("likes").select("*", { count: "exact", head: true }).eq("story_id", storyId);
    likeCount = count || 0;
  }
  // Check if current user/anon has liked this story
  if (likerId && storyId) {
    const { data: likeData } = await supabase.from("likes").select("liker_id").eq("liker_id", likerId).eq("story_id", storyId).single();
    initialLiked = !!likeData;
  }
  // Check bookmarks (only for logged-in users — anon bookmarks are in localStorage)
  if (clerkUserId && storyId) {
    const { data: bookmarkData } = await supabase.from("bookmarks").select("user_id").eq("user_id", clerkUserId).eq("story_id", storyId).single();
    initialSaved = !!bookmarkData;
  }

  // 3. Get approved comments (plus user's pending comments if logged in)
  let initialComments: CommentData[] = [];
  if (storyId) {
    let query = supabase
      .from("comments")
      .select("id, body, created_at, profiles(display_name), status, user_id")
      .eq("story_id", storyId)
      .order("created_at", { ascending: true });
    
    const { data: dbComments } = await query;
    if (dbComments) {
      initialComments = dbComments
        .filter(c => c.status === 'approved' || (clerkUserId && c.user_id === clerkUserId))
        .map(c => {
          const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
          return {
            id: c.id,
            name: (profile as any)?.display_name || "Anonymous",
            body: c.body,
            time: new Date(c.created_at).toLocaleDateString(),
          };
        });
    }
  }

  return (
    <>
      <ReadingProgress />
      <Nav variant="reading" />
      <StoryHeader story={story} />
      
      <article className="max-w-2xl mx-auto px-6 md:px-10 pb-14">
        <div className="prose prose-lg max-w-none prose-p:font-body prose-p:text-[18px] prose-p:leading-[1.85] prose-p:text-ink prose-a:text-indigo hover:prose-a:text-ink transition-colors">
          <MDXRemote source={content} />
        </div>

        <div className="mt-14">
          <EngagementBar 
            storyId={storyId}
            storySlug={slug}
            initialLiked={initialLiked} 
            initialSaved={initialSaved} 
            initialLikeCount={likeCount}
            commentCount={initialComments.length}
          />
        </div>
      </article>

      <AuthorNote avatarUrl={authorProfile?.avatar_url} name={authorProfile?.name} />
      {/* Related Stories */}
      <div className="max-w-4xl mx-auto mt-16 md:mt-24 mb-16 md:mb-24 px-6 md:px-0">
        <RelatedStories currentSlug={slug} allStories={await getAllStoriesCached()} />
      </div>
      <Comments storyId={storyId} initialComments={initialComments} isLoggedIn={!!clerkUserId} />
      <StoryMinimalFooter />
    </>
  );
}

function StoryHeader({ story }: { story: StoryData }) {
  const textHex = threadTextColorMap[story.thread];
  const borderHex = threadColorMap[story.thread];

  return (
    <header className="max-w-2xl mx-auto px-6 md:px-10 pt-14 pb-10">
      <div className="flex items-center justify-between mb-6">
        <span className="font-ui text-[11px] tracking-wider text-ink-muted">
          No. {story.no}
        </span>
        <span
          className="text-[10px] tracking-[0.18em] uppercase font-ui px-2 py-1"
          style={{ color: textHex, border: `1px solid ${borderHex}` }}
        >
          {story.category}
        </span>
      </div>
      <h1 className="font-display text-ink leading-[1.05] text-[38px] sm:text-[46px] md:text-[52px] mb-6">
        {story.title}
      </h1>
      <p className="font-display italic text-lg text-ink-soft mb-6">
        {story.excerpt}
      </p>
      <div className="flex items-center gap-4 text-[12px] text-ink-muted font-ui">
        <span>By Abhi</span>
        <span aria-hidden="true">&middot;</span>
        <span>{story.readTime} read</span>
      </div>
      <div className="mt-8">
        <IkatDivider tone={story.thread} />
      </div>
    </header>
  );
}

function AuthorNote({ avatarUrl, name = "Abhi" }: { avatarUrl?: string | null; name?: string }) {
  return (
    <section className="bg-paper-card border-y border-border">
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-12 flex items-center gap-5">
        {avatarUrl ? (
          <div className="relative w-14 h-14 rounded-full border border-border overflow-hidden shrink-0">
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-indigo flex items-center justify-center font-display text-xl italic text-paper shrink-0">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-[13px] text-ink font-ui mb-1">Written by {name}</p>
          <p className="text-[13px] text-ink-muted leading-relaxed font-body">
            Author of Two States, One Heart. Writes about the quiet negotiations
            inside families.
          </p>
        </div>
      </div>
    </section>
  );
}

function RelatedStories({ currentSlug, allStories }: { currentSlug: string, allStories: StoryData[] }) {
  const related = allStories.filter((s) => s.slug !== currentSlug).slice(0, 2);

  if (related.length === 0) return null;

  return (
    <section className="bg-indigo">
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-14">
        <p className="text-[11px] tracking-[0.24em] uppercase text-gold mb-6 font-ui">
          Next From the Catalog
        </p>
        <div className="space-y-4">
          {related.map((r) => (
            <Link
              key={r.no}
              href={`/stories/${r.slug}`}
              className="group flex items-center justify-between border border-indigo-border px-6 py-5 hover:border-marigold/60 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-ui text-[11px] tracking-wider text-indigo-muted">
                  No. {r.no}
                </span>
                <span className="font-display text-lg text-paper group-hover:text-gold transition-colors">
                  {r.title}
                </span>
              </div>
              <ArrowLeft
                size={16}
                className="rotate-180 text-indigo-muted group-hover:text-gold transition-colors"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
