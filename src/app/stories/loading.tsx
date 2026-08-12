export default function StoriesLoading() {
  return (
    <>
      {/* Header skeleton */}
      <header className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-16">
        <div className="h-3 w-48 bg-border/60 rounded animate-pulse mb-5" />
        <div className="h-12 w-80 bg-border/60 rounded animate-pulse mb-4" />
        <div className="h-6 w-64 bg-border/40 rounded animate-pulse" />
      </header>

      {/* Filter bar skeleton */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 w-20 bg-border/50 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-10 w-full md:w-64 bg-border/40 rounded animate-pulse" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-paper-card border border-border flex flex-col">
              <div className="flex items-center justify-between px-6 pt-5">
                <div className="h-4 w-16 bg-border/50 rounded animate-pulse" />
                <div className="h-5 w-14 bg-border/50 rounded animate-pulse" />
              </div>
              <div className="px-6 pt-5 pb-6 flex-1 space-y-3">
                <div className="h-6 w-3/4 bg-border/60 rounded animate-pulse" />
                <div className="h-4 w-full bg-border/40 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-border/40 rounded animate-pulse" />
              </div>
              <div className="h-1 w-full bg-border/30" />
              <div className="px-6 py-5 flex items-center justify-between">
                <div className="h-3 w-16 bg-border/40 rounded animate-pulse" />
                <div className="h-3 w-12 bg-border/40 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
