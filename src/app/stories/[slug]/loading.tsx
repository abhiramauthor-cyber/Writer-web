export default function StoryLoading() {
  return (
    <>
      <header className="max-w-2xl mx-auto px-6 md:px-10 pt-14 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="h-3 w-16 bg-border/60 rounded animate-pulse" />
          <div className="h-5 w-20 bg-border/60 rounded animate-pulse" />
        </div>
        <div className="h-10 w-5/6 bg-border/60 rounded animate-pulse mb-6" />
        <div className="h-6 w-full bg-border/40 rounded animate-pulse mb-6" />
        <div className="h-3 w-36 bg-border/40 rounded animate-pulse" />
      </header>

      <article className="max-w-2xl mx-auto px-6 md:px-10 pb-14 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 w-full bg-border/40 rounded animate-pulse" />
        ))}
      </article>
    </>
  );
}
