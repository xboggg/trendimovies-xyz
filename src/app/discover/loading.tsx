export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-10 w-40 bg-zinc-800 rounded-lg mb-4" />
          <div className="h-5 w-80 bg-zinc-800/50 rounded mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-zinc-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
