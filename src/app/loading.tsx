export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-10 w-64 bg-zinc-800 rounded-lg mb-4" />
          <div className="h-5 w-96 bg-zinc-800/50 rounded mb-8" />

          {/* Grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-[2/3] bg-zinc-800 rounded-lg" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800/50 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
