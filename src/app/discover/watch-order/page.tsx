import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BackToDiscover } from "@/components/common/BackToDiscover";
import { ListOrdered, ArrowRight } from "lucide-react";
import { supabase, Franchise } from "@/lib/supabase";
import { getCollection } from "@/services/tmdb";

export const metadata: Metadata = {
  title: "Watch Order Guides | TrendiMovies",
  description: "Chronological vs release order guides for movie franchises.",
};

// Revalidate every 5 minutes
export const revalidate = 3600;

async function getFranchises(): Promise<Franchise[]> {
  const { data } = await supabase.from("franchises").select("*").order("name");
  return data || [];
}

export default async function WatchOrderPage() {
  const franchises = await getFranchises();

  const franchisesWithImages = await Promise.all(
    franchises.map(async (f) => {
      if (f.tmdb_collection_id) {
        try {
          const c = await getCollection(f.tmdb_collection_id);
          return { ...f, backdrop: c?.backdrop_path, movieCount: c?.parts?.length || 0 };
        } catch { return { ...f, backdrop: null, movieCount: 0 }; }
      }
      return { ...f, backdrop: null, movieCount: 0 };
    })
  );

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <BackToDiscover />
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Watch Order Guides</h1>
          <p className="text-zinc-400">Find the best way to watch your favorite franchises</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {franchisesWithImages.map((f) => (
            <Link key={f.id} href={"/discover/franchises/" + f.slug} className="group relative aspect-video rounded-xl overflow-hidden">
              {f.backdrop ? <Image src={"https://image.tmdb.org/t/p/w780" + f.backdrop} alt={f.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-zinc-800" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 text-red-500 text-sm mb-2"><ListOrdered className="w-4 h-4" />Watch Order Guide</div>
                <h2 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{f.name}</h2>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-zinc-400 text-sm">{f.movieCount} movies</span>
                  <span className="flex items-center gap-1 text-red-500 text-sm">View Guide <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
