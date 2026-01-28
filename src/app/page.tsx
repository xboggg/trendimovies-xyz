import { Hero, MovieRow } from "@/components/movies";
import { TVCard } from "@/components/ui/card";
import { Section, ContentGrid } from "@/components/ui/section";
import {
  getTrendingMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getTrendingTV,
  getPopularTV,
} from "@/services/tmdb";

// Cache homepage for 10 minutes for fast loading
export const revalidate = 3600;

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
  ] = await Promise.all([
    getTrendingMovies("week"),
    getPopularMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getTopRatedMovies(),
    getTrendingTV("week"),
    getPopularTV(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero movies={trendingMovies.results} />

      {/* Content Sections */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Trending Movies */}
        <MovieRow
          title="Trending This Week"
          movies={trendingMovies.results}
          href="/movies?category=trending"
        />

        {/* Now Playing */}
        <MovieRow
          title="Now Playing in Theaters"
          movies={nowPlayingMovies.results}
          href="/movies?category=now_playing"
        />

        {/* Popular TV Shows */}
        <Section title="Popular TV Shows" href="/tv?category=popular">
          <ContentGrid columns={5}>
            {trendingTV.results.slice(0, 10).map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </ContentGrid>
        </Section>

        {/* Upcoming Movies */}
        <MovieRow
          title="Coming Soon"
          movies={upcomingMovies.results}
          href="/movies?category=upcoming"
        />

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
