import { Metadata } from "next";
import Link from "next/link";
import { Trophy, Award, Sparkles, ArrowRight, Film, Calendar } from "lucide-react";
import { BackToDiscover } from "@/components/common/BackToDiscover";
import { supabase, CuratedList } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Best Of Lists | TrendiMovies",
  description: "Curated lists of the best movies by genre and year.",
};

// Revalidate every 5 minutes
export const revalidate = 3600;

async function getLists(): Promise<CuratedList[]> {
  const { data } = await supabase.from("curated_lists").select("*").order("display_order");
  return data || [];
}

function ListCard({ list }: { list: CuratedList }) {
  return (
    <Link
      href={`/discover/best-of/${list.slug}`}
      className="group bg-zinc-900/50 backdrop-blur rounded-xl p-6 border border-zinc-800 hover:border-red-600/50 hover:bg-zinc-900 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition-colors">
            {list.title}
          </h3>
          {list.description && (
            <p className="text-zinc-400 text-sm mt-2 line-clamp-2">{list.description}</p>
          )}
          {list.year && (
            <div className="flex items-center gap-1 text-zinc-500 text-xs mt-2">
              <Calendar className="w-3 h-3" />
              {list.year}
            </div>
          )}
        </div>
        <Film className="w-8 h-8 text-zinc-700 group-hover:text-red-600/50 transition-colors" />
      </div>
      <div className="flex items-center gap-1 text-red-500 text-sm mt-4 group-hover:gap-2 transition-all">
        View List <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

export default async function BestOfPage() {
  const lists = await getLists();

  const bestOf = lists.filter(l => l.list_type === "best-of");
  const awards = lists.filter(l => l.list_type === "awards");
  const recommendations = lists.filter(l => l.list_type === "recommendations");

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <BackToDiscover />
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Best Of Lists
          </h1>
          <p className="text-zinc-400">
            Curated collections of the best movies by year, genre, and awards
          </p>
        </div>

        {/* Best Of Year Section */}
        {bestOf.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Best Of Year & Genre</h2>
                <p className="text-zinc-500 text-sm">Top-rated movies by year and category</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestOf.map(list => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          </section>
        )}

        {/* Award Winners Section */}
        {awards.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Award Winners</h2>
                <p className="text-zinc-500 text-sm">Oscar, Golden Globe, and more</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.map(list => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          </section>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Recommendations</h2>
                <p className="text-zinc-500 text-sm">Hidden gems and must-watch films</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map(list => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          </section>
        )}

        {lists.length === 0 && (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">No curated lists yet. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  );
}
