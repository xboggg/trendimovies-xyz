// TMDB API Types

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: Genre[];
  adult: boolean;
  original_language: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  homepage?: string | null;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  credits?: Credits;
  videos?: VideoResults;
  similar?: MovieResults;
  recommendations?: MovieResults;
  images?: ImageResults;
  external_ids?: ExternalIds;
  watch_providers?: WatchProviders;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: Genre[];
  origin_country: string[];
  original_language: string;
  number_of_episodes?: number;
  number_of_seasons?: number;
  status?: string;
  tagline?: string;
  type?: string;
  homepage?: string | null;
  networks?: Network[];
  production_companies?: ProductionCompany[];
  seasons?: Season[];
  created_by?: Creator[];
  credits?: Credits;
  videos?: VideoResults;
  similar?: TVResults;
  recommendations?: TVResults;
  images?: ImageResults;
  external_ids?: ExternalIds;
  watch_providers?: WatchProviders;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
  vote_average: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
  vote_count: number;
  runtime: number;
  crew: CrewMember[];
  guest_stars: CastMember[];
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  biography?: string;
  birthday?: string;
  deathday?: string | null;
  place_of_birth?: string;
  known_for_department: string;
  popularity: number;
  gender: number;
  also_known_as?: string[];
  homepage?: string | null;
  imdb_id?: string;
  combined_credits?: {
    cast: (Movie | TVShow)[];
    crew: (Movie | TVShow)[];
  };
  images?: {
    profiles: Image[];
  };
  external_ids?: ExternalIds;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
  popularity: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  popularity: number;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideoResults {
  results: Video[];
}

export interface Image {
  file_path: string;
  aspect_ratio: number;
  height: number;
  width: number;
  vote_average: number;
  vote_count: number;
}

export interface ImageResults {
  backdrops: Image[];
  posters: Image[];
  logos: Image[];
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface ExternalIds {
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
  tiktok_id?: string | null;
  youtube_id?: string | null;
  wikidata_id?: string | null;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface WatchProviderCountry {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
}

export interface WatchProviders {
  results: {
    [countryCode: string]: WatchProviderCountry;
  };
}

// API Response Types
export interface MovieResults {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TVResults {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export interface PersonResults {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

export interface MultiSearchResult {
  page: number;
  results: (Movie | TVShow | Person)[];
  total_pages: number;
  total_results: number;
}

// Navigation & Menu Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface MenuCategory {
  title: string;
  items: NavItem[];
}
