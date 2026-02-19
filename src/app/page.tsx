import { Hero, MovieRow, TrendingRow } from "@/components/movies";
import { TVCard } from "@/components/ui/card";
import { Section, ContentGrid } from "@/components/ui/section";
import { GoldGlowLine } from "@/components/ui/GoldGlowLine";
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
  SocialFollow,
} from "@/components/engagement";
import { WebsiteJsonLd } from "@/components/seo";
import {
  getTrendingMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getTrendingTV,
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

      {/* Gold Glow Line Divider */}
      <GoldGlowLine />

      {/* Content Sections */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Latest News Section - Right after Hero */}
        {latestNews.length > 0 && <NewsSection articles={latestNews} />}

        {/* Trending This Week - Expanded with auto-slide */}
        <TrendingRow
          title="Trending This Week"
          movies={trendingMovies.results}
          href="/movies?category=trending"
        />

        {/* User's Watchlist (client-side) */}
        <WatchlistDisplay className="mb-10" maxItems={10} showEmpty={false} />

        {/* Movie Battle + Daily Poll Side by Side - Fixed alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="w-full">
            {activeBattle ? <MovieBattle battle={activeBattle} /> : <div className="hidden lg:block" />}
          </div>
          <div className="w-full">
            {activePoll ? <DailyPoll poll={activePoll} /> : <div className="hidden lg:block" />}
          </div>
        </div>

        {/* Coming Soon with Arrows and Auto-scroll */}
        <ComingSoonRow movies={upcomingMovies.results} title="Coming Soon" />

        {/* Row 2: Trivia + This Day in History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <DailyTrivia compact />
          <ThisDayInHistory events={todayHistory} />
        </div>

        {/* Now Playing */}
        <MovieRow
          title="Now Playing in Theaters"
          movies={nowPlayingMovies.results}
          href="/movies?category=now_playing"
        />

        {/* Hot Discussions */}
        <div className="mb-10">
          <HotDiscussions limit={5} />
        </div>

        {/* Trending TV Shows - Only one TV section now */}
        <Section title="Trending TV Shows" href="/tv?category=trending">
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

        {/* Popular Movies */}
        <MovieRow
          title="Popular Movies"
          movies={popularMovies.results}
          href="/movies?category=popular"
        />

        {/* Newsletter + Social Follow Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <Newsletter variant="card" />
          <SocialFollow />
        </div>
      </div>
    </div>
  );
}
