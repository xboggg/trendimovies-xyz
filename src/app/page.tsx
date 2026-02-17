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
  Newsletter,
  WatchlistDisplay,
  NewsSection,
} from "@/components/engagement";
import { WebsiteJsonLd } from "@/components/seo";
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
      .limit(4);
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
      {/* JSON-LD Structured Data */}
      <WebsiteJsonLd
        name="TrendiMovies"
        url="https://trendimovies.xyz"
        description="Discover trending movies, TV shows, reviews, and find where to watch your favorites."
      />

      {/* Hero Section - Redesigned */}
      <Hero movies={trendingMovies.results} />

      {/* Content Sections */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
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

        {/* User's Watchlist (client-side) */}
        <WatchlistDisplay className="mb-10" maxItems={10} showEmpty={false} />

        {/* Ad Zone 1 */}
        <div className="mb-10 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl text-center">
          <span className="text-zinc-600 text-xs">Advertisement</span>
          <div className="h-20 flex items-center justify-center text-zinc-700">
            Ad Space - 728x90
          </div>
        </div>

        {/* Movie Battle - Fixed Width */}
        {activeBattle && (
          <div className="mb-10">
            <MovieBattle battle={activeBattle} />
          </div>
        )}

        {/* Coming Soon with Arrows and Auto-scroll */}
        <ComingSoonRow movies={upcomingMovies.results} title="Coming Soon" />

        {/* Row 2: Trivia + This Day in History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <DailyTrivia compact />
          <ThisDayInHistory events={todayHistory} />
        </div>

        {/* Newsletter Inline */}
        <Newsletter variant="inline" className="mb-10" />

        {/* Now Playing */}
        <MovieRow
          title="Now Playing in Theaters"
          movies={nowPlayingMovies.results}
          href="/movies?category=now_playing"
        />

        {/* Latest News Section - Redesigned with animations */}
        {latestNews.length > 0 && <NewsSection articles={latestNews} />}

        {/* Ad Zone 2 */}
        <div className="mb-10 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl text-center">
          <span className="text-zinc-600 text-xs">Advertisement</span>
          <div className="h-20 flex items-center justify-center text-zinc-700">
            Ad Space - 728x90
          </div>
        </div>

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
        <div className="mb-10 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl text-center">
          <span className="text-zinc-600 text-xs">Advertisement</span>
          <div className="h-20 flex items-center justify-center text-zinc-700">
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

        {/* Newsletter Card at Bottom */}
        <div className="mb-10 max-w-md mx-auto">
          <Newsletter variant="card" />
        </div>
      </div>
    </div>
  );
}
