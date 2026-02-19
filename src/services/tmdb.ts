import { TMDB_CONFIG } from "@/lib/constants";
import type {
  Movie,
  MovieResults,
  TVShow,
  TVResults,
  Person,
  PersonResults,
  MultiSearchResult,
  Genre,
  Season,
  Episode,
} from "@/types";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = TMDB_CONFIG.baseUrl;

// Check if API key is available
function checkApiKey(): void {
  if (!API_KEY) {
    // console.warn("TMDB_API_KEY is not set. Some features may not work.");
  }
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  // Return empty data during build if no API key
  if (!API_KEY) {
    return { results: [], page: 1, total_pages: 0, total_results: 0 } as T;
  }

  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    language: TMDB_CONFIG.defaultLanguage,
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${searchParams}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }

  return response.json();
}

// Movies
export async function getPopularMovies(page = 1): Promise<MovieResults> {
  return fetchTMDB<MovieResults>("/movie/popular", { page: page.toString() });
}

export async function getNowPlayingMovies(page = 1): Promise<MovieResults> {
  return fetchTMDB<MovieResults>("/movie/now_playing", { page: page.toString() });
}

export async function getUpcomingMovies(page = 1): Promise<MovieResults> {
  // Use discover endpoint with date filter for truly upcoming movies
  const today = new Date().toISOString().split("T")[0];
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  const endDate = sixMonthsLater.toISOString().split("T")[0];

  return fetchTMDB<MovieResults>("/discover/movie", {
    page: page.toString(),
    sort_by: "popularity.desc",
    "primary_release_date.gte": today,
    "primary_release_date.lte": endDate,
  });
}

// Old upcoming function (uses unreliable TMDB endpoint)
export async function getUpcomingMoviesOld(page = 1): Promise<MovieResults> {
  return fetchTMDB<MovieResults>("/movie/upcoming", { page: page.toString() });
}

export async function getTopRatedMovies(page = 1): Promise<MovieResults> {
  return fetchTMDB<MovieResults>("/movie/top_rated", { page: page.toString() });
}

export async function getTrendingMovies(timeWindow: "day" | "week" = "week"): Promise<MovieResults> {
  return fetchTMDB<MovieResults>(`/trending/movie/${timeWindow}`);
}

export async function getMovieDetails(id: number): Promise<Movie> {
  return fetchTMDB<Movie>(`/movie/${id}`, {
    append_to_response: "credits,videos,similar,recommendations,images,external_ids,watch/providers",
  });
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<MovieResults> {
  return fetchTMDB<MovieResults>("/discover/movie", {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: "popularity.desc",
  });
}

// TV Shows
export async function getPopularTV(page = 1): Promise<TVResults> {
  return fetchTMDB<TVResults>("/tv/popular", { page: page.toString() });
}

export async function getAiringTodayTV(page = 1): Promise<TVResults> {
  return fetchTMDB<TVResults>("/tv/airing_today", { page: page.toString() });
}

export async function getOnTheAirTV(page = 1): Promise<TVResults> {
  return fetchTMDB<TVResults>("/tv/on_the_air", { page: page.toString() });
}

export async function getTopRatedTV(page = 1): Promise<TVResults> {
  return fetchTMDB<TVResults>("/tv/top_rated", { page: page.toString() });
}

export async function getTrendingTV(timeWindow: "day" | "week" = "week"): Promise<TVResults> {
  return fetchTMDB<TVResults>(`/trending/tv/${timeWindow}`);
}

export async function getTVDetails(id: number): Promise<TVShow> {
  return fetchTMDB<TVShow>(`/tv/${id}`, {
    append_to_response: "credits,videos,similar,recommendations,images,external_ids,watch/providers",
  });
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<Season & { episodes: Episode[] }> {
  return fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function getTVByGenre(genreId: number, page = 1): Promise<TVResults> {
  return fetchTMDB<TVResults>("/discover/tv", {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: "popularity.desc",
  });
}

// People
export async function getPersonDetails(id: number): Promise<Person> {
  return fetchTMDB<Person>(`/person/${id}`, {
    append_to_response: "combined_credits,images,external_ids",
  });
}

export async function getPopularPeople(page = 1): Promise<PersonResults> {
  return fetchTMDB<PersonResults>("/person/popular", { page: page.toString() });
}

// Search
export async function searchMulti(query: string, page = 1): Promise<MultiSearchResult> {
  return fetchTMDB<MultiSearchResult>("/search/multi", {
    query,
    page: page.toString(),
  });
}

export async function searchMovies(query: string, page = 1): Promise<MovieResults> {
  return fetchTMDB<MovieResults>("/search/movie", {
    query,
    page: page.toString(),
  });
}

export async function searchTV(query: string, page = 1): Promise<TVResults> {
  return fetchTMDB<TVResults>("/search/tv", {
    query,
    page: page.toString(),
  });
}

export async function searchPeople(query: string, page = 1): Promise<PersonResults> {
  return fetchTMDB<PersonResults>("/search/person", {
    query,
    page: page.toString(),
  });
}

// Collections (Franchises)
export async function getCollection(collectionId: number): Promise<any> {
  return fetchTMDB<any>(`/collection/${collectionId}`);
}

// Genres
export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  return fetchTMDB<{ genres: Genre[] }>("/genre/movie/list");
}

export async function getTVGenres(): Promise<{ genres: Genre[] }> {
  return fetchTMDB<{ genres: Genre[] }>("/genre/tv/list");
}

// Discover (Advanced Filtering)
export async function discoverMovies(params: {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  year?: number;
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
}): Promise<MovieResults> {
  const searchParams: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams[key] = value.toString();
    }
  });

  return fetchTMDB<MovieResults>("/discover/movie", searchParams);
}

export async function discoverTV(params: {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  first_air_date_year?: number;
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
}): Promise<TVResults> {
  const searchParams: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams[key] = value.toString();
    }
  });

  return fetchTMDB<TVResults>("/discover/tv", searchParams);
}

// Helper to get movies/TV by category
export async function getMoviesByCategory(
  category: "popular" | "now_playing" | "upcoming" | "top_rated" | "trending",
  page = 1
): Promise<MovieResults> {
  switch (category) {
    case "popular":
      return getPopularMovies(page);
    case "now_playing":
      return getNowPlayingMovies(page);
    case "upcoming":
      return getUpcomingMovies(page);
    case "top_rated":
      return getTopRatedMovies(page);
    case "trending":
      return getTrendingMovies();
    default:
      return getPopularMovies(page);
  }
}

export async function getTVByCategory(
  category: "popular" | "airing_today" | "on_the_air" | "top_rated" | "trending",
  page = 1
): Promise<TVResults> {
  switch (category) {
    case "popular":
      return getPopularTV(page);
    case "airing_today":
      return getAiringTodayTV(page);
    case "on_the_air":
      return getOnTheAirTV(page);
    case "top_rated":
      return getTopRatedTV(page);
    case "trending":
      return getTrendingTV();
    default:
      return getPopularTV(page);
  }
}
