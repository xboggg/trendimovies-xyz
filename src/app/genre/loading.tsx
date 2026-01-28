export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-10 w-48 bg-zinc-800 rounded-lg mb-4" />
          <div className="h-5 w-72 bg-zinc-800/50 rounded mb-10" />

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg" />
              <div className="h-6 w-32 bg-zinc-800 rounded" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-14 bg-zinc-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
