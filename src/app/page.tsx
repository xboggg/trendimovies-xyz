import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { Hero, MovieRow } from "@/components/movies";
import { TVCard } from "@/components/ui/card";
import { Section, ContentGrid } from "@/components/ui/section";
import {
  DailyPoll,
  MovieBattle,
  ComingSoonRow,
  ThisDayInHistory,
  DailyTrivia,
  HotDiscussions,
} from "@/components/engagement";
import {
  getTrendingMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getTrendingTV,
  getPopularTV,
} from "@/services/tmdb";
import { supabase } from "@/lib/supabase";

// Cache homepage for 10 minutes for fast loading
export const revalidate = 600;

// Fetch engagement data
async function getActivePoll() {
  try {
    const { data } = await supabase
      .from("polls")
      .select("*")
      .eq("is_active", true)
      .lte("start_date", new Date().toISOString().split("T")[0])
      .order("start_date", { ascending: false })
      .limit(1)
      .single();
    return data;
  } catch {
    return null;
  }
}

async function getActiveBattle() {
  try {
    const { data } = await supabase
      .from("movie_battles")
      .select("*")
      .eq("is_active", true)
      .lte("start_date", new Date().toISOString().split("T")[0])
      .order("start_date", { ascending: false })
      .limit(1)
      .single();
    return data;
  } catch {
    return null;
  }
}

async function getTodayInHistory() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const { data } = await supabase
      .from("movie_history")
      .select("*")
      .order("year", { ascending: false });

    return data?.filter((event) => {
      const eventDate = new Date(event.event_date);
      return eventDate.getMonth() + 1 === month && eventDate.getDate() === day;
    }) || [];
  } catch {
    return [];
  }
}

async function getLatestNews() {
  try {
    const { data } = await supabase
      .from("news_articles")
      .select("id, title, slug, excerpt, image_url, category, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3);
    return data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  // Fetch all data in parallel
  const [
    trendingMovies,
    popularMovies,
    nowPlayingMovies,
    upcomingMovies,
    topRatedMovies,
    trendingTV,
    popularTV,
    activePoll,
    activeBattle,
    todayHistory,
    latestNews,
  ] = await Promise.all([
    getTrendingMovies("week"),
    getPopularMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getTopRatedMovies(),
    getTrendingTV("week"),
    getPopularTV(),
    getActivePoll(),
    getActiveBattle(),
    getTodayInHistory(),
    getLatestNews(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero movies={trendingMovies.results} />

      {/* Content Sections */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Row 1: Trending + Poll Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <MovieRow
              title="Trending This Week"
              movies={trendingMovies.results}
              href="/movies?category=trending"
            />
          </div>
          <div className="lg:col-span-1">
            {activePoll && <DailyPoll poll={activePoll} />}
          </div>
        </div>

        {/* Ad Zone 1 */}
        <div className="mb-10 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
          <span className="text-zinc-600 text-sm">Advertisement</span>
          <div className="h-24 flex items-center justify-center text-zinc-700">
            {/* AdSense code will go here */}
            Ad Space - 728x90
          </div>
        </div>

        {/* Movie Battle */}
        {activeBattle && (
          <div className="mb-10">
            <MovieBattle battle={activeBattle} />
          </div>
        )}

        {/* Coming Soon with Countdowns */}
        <ComingSoonRow movies={upcomingMovies.results} title="Coming Soon" />

        {/* Row 2: Trivia + This Day in History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <DailyTrivia compact />
          <ThisDayInHistory events={todayHistory} />
        </div>

        {/* Ad Zone 2 */}
        <div className="mb-10 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
          <span className="text-zinc-600 text-sm">Advertisement</span>
          <div className="h-24 flex items-center justify-center text-zinc-700">
            {/* AdSense code will go here */}
            Ad Space - 728x90
          </div>
        </div>

        {/* Now Playing */}
        <MovieRow
          title="Now Playing in Theaters"
          movies={nowPlayingMovies.results}
          href="/movies?category=now_playing"
        />

        {/* Latest News Section */}
        {latestNews.length > 0 && (
          <Section
            title="Latest News"
            href="/news"
            icon={<Newspaper className="w-5 h-5 text-red-500" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden bg-zinc-800">
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {article.category && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded capitalize">
                        {article.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold group-hover:text-red-500 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Hot Discussions */}
        <div className="mb-10">
          <HotDiscussions limit={5} />
        </div>

        {/* Popular TV Shows */}
        <Section title="Popular TV Shows" href="/tv?category=popular">
          <ContentGrid columns={5}>
            {trendingTV.results.slice(0, 10).map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </ContentGrid>
        </Section>

        {/* Top Rated */}
        <MovieRow
          title="Top Rated Movies"
          movies={topRatedMovies.results}
          href="/movies?category=top_rated"
        />

        {/* Ad Zone 3 */}
        <div className="mb-10 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
          <span className="text-zinc-600 text-sm">Advertisement</span>
          <div className="h-24 flex items-center justify-center text-zinc-700">
            {/* AdSense code will go here */}
            Ad Space - 728x90
          </div>
        </div>

        {/* Popular Movies */}
        <MovieRow
          title="Popular Movies"
          movies={popularMovies.results}
          href="/movies?category=popular"
        />

        {/* Trending TV */}
        <Section title="Trending TV Shows" href="/tv?category=trending">
          <ContentGrid columns={5}>
            {popularTV.results.slice(0, 10).map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </ContentGrid>
        </Section>
      </div>
    </div>
  );
}
