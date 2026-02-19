import { MetadataRoute } from "next";
import {
  getTrendingMovies,
  getPopularMovies,
  getTrendingTV,
  getPopularTV,
} from "@/services/tmdb";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://trendimovies.xyz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tv`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/trivia`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/discover`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/genre`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];

  // Dynamic movie pages (trending + popular)
  let moviePages: MetadataRoute.Sitemap = [];
  try {
    const [trending, popular] = await Promise.all([
      getTrendingMovies("week"),
      getPopularMovies(),
    ]);

    const movieIds = new Set<number>();
    [...trending.results, ...popular.results].forEach((movie) => {
      movieIds.add(movie.id);
    });

    moviePages = Array.from(movieIds).map((id) => ({
      url: `${BASE_URL}/movies/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    // console.error("Error fetching movies for sitemap:", error);
  }

  // Dynamic TV pages
  let tvPages: MetadataRoute.Sitemap = [];
  try {
    const [trending, popular] = await Promise.all([
      getTrendingTV("week"),
      getPopularTV(),
    ]);

    const tvIds = new Set<number>();
    [...trending.results, ...popular.results].forEach((show) => {
      tvIds.add(show.id);
    });

    tvPages = Array.from(tvIds).map((id) => ({
      url: `${BASE_URL}/tv/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    // console.error("Error fetching TV shows for sitemap:", error);
  }

  // News articles
  let newsPages: MetadataRoute.Sitemap = [];
  try {
    const { data: articles } = await supabase
      .from("news_articles")
      .select("slug, updated_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(100);

    if (articles) {
      newsPages = articles.map((article) => ({
        url: `${BASE_URL}/news/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    // console.error("Error fetching news for sitemap:", error);
  }

  return [...staticPages, ...moviePages, ...tvPages, ...newsPages];
}
