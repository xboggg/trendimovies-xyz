// Site Configuration
export const SITE_CONFIG = {
  name: "TrendiMovies",
  description: "Discover trending movies, TV shows, reviews, and find where to watch your favorites.",
  url: "https://trendimovies.xyz",
  ogImage: "/og-image.jpg",
  twitterHandle: "@trendimovies",
  keywords: [
    "movies",
    "tv shows",
    "streaming",
    "reviews",
    "trailers",
    "where to watch",
    "movie database",
    "trending movies",
  ],
};

// TMDB Configuration
export const TMDB_CONFIG = {
  baseUrl: "https://api.themoviedb.org/3",
  imageBaseUrl: "https://image.tmdb.org/t/p",
  defaultLanguage: "en-US",
  defaultRegion: "US",
};

// Navigation Menu
export const MAIN_NAV = [
  {
    label: "Movies",
    href: "/movies",
    children: [
      { label: "Popular", href: "/movies?category=popular" },
      { label: "Now Playing", href: "/movies?category=now_playing" },
      { label: "Upcoming", href: "/movies?category=upcoming" },
      { label: "Top Rated", href: "/movies?category=top_rated" },
    ],
  },
  {
    label: "TV Shows",
    href: "/tv",
    children: [
      { label: "Popular", href: "/tv?category=popular" },
      { label: "Airing Today", href: "/tv?category=airing_today" },
      { label: "On TV", href: "/tv?category=on_the_air" },
      { label: "Top Rated", href: "/tv?category=top_rated" },
    ],
  },
  {
    label: "Genres",
    href: "/genre",
    children: [
      { label: "Action", href: "/genre/action" },
      { label: "Comedy", href: "/genre/comedy" },
      { label: "Drama", href: "/genre/drama" },
      { label: "Horror", href: "/genre/horror" },
      { label: "Sci-Fi", href: "/genre/science-fiction" },
      { label: "Thriller", href: "/genre/thriller" },
      { label: "Romance", href: "/genre/romance" },
      { label: "Animation", href: "/genre/animation" },
    ],
  },
  { label: "News", href: "/news" },
  {
    label: "Discover",
    href: "/discover",
    children: [
      { label: "Franchises", href: "/discover/franchises" },
      { label: "Release Calendar", href: "/discover/calendar" },
      { label: "Watch Order Guides", href: "/discover/watch-order" },
      { label: "Best Of Lists", href: "/discover/best-of" },
    ],
  },
];

// Movie Genres (TMDB IDs)
export const MOVIE_GENRES = [
  { id: 28, name: "Action", slug: "action" },
  { id: 12, name: "Adventure", slug: "adventure" },
  { id: 16, name: "Animation", slug: "animation" },
  { id: 35, name: "Comedy", slug: "comedy" },
  { id: 80, name: "Crime", slug: "crime" },
  { id: 99, name: "Documentary", slug: "documentary" },
  { id: 18, name: "Drama", slug: "drama" },
  { id: 10751, name: "Family", slug: "family" },
  { id: 14, name: "Fantasy", slug: "fantasy" },
  { id: 36, name: "History", slug: "history" },
  { id: 27, name: "Horror", slug: "horror" },
  { id: 10402, name: "Music", slug: "music" },
  { id: 9648, name: "Mystery", slug: "mystery" },
  { id: 10749, name: "Romance", slug: "romance" },
  { id: 878, name: "Science Fiction", slug: "science-fiction" },
  { id: 10770, name: "TV Movie", slug: "tv-movie" },
  { id: 53, name: "Thriller", slug: "thriller" },
  { id: 10752, name: "War", slug: "war" },
  { id: 37, name: "Western", slug: "western" },
];

// TV Genres (TMDB IDs)
export const TV_GENRES = [
  { id: 10759, name: "Action & Adventure", slug: "action-adventure" },
  { id: 16, name: "Animation", slug: "animation" },
  { id: 35, name: "Comedy", slug: "comedy" },
  { id: 80, name: "Crime", slug: "crime" },
  { id: 99, name: "Documentary", slug: "documentary" },
  { id: 18, name: "Drama", slug: "drama" },
  { id: 10751, name: "Family", slug: "family" },
  { id: 10762, name: "Kids", slug: "kids" },
  { id: 9648, name: "Mystery", slug: "mystery" },
  { id: 10763, name: "News", slug: "news" },
  { id: 10764, name: "Reality", slug: "reality" },
  { id: 10765, name: "Sci-Fi & Fantasy", slug: "sci-fi-fantasy" },
  { id: 10766, name: "Soap", slug: "soap" },
  { id: 10767, name: "Talk", slug: "talk" },
  { id: 10768, name: "War & Politics", slug: "war-politics" },
  { id: 37, name: "Western", slug: "western" },
];

// Streaming Providers (Popular ones for affiliate)
export const STREAMING_PROVIDERS = [
  { id: 8, name: "Netflix", logo: "/providers/netflix.png", color: "#E50914" },
  { id: 9, name: "Amazon Prime Video", logo: "/providers/prime.png", color: "#00A8E1" },
  { id: 337, name: "Disney+", logo: "/providers/disney.png", color: "#113CCF" },
  { id: 384, name: "HBO Max", logo: "/providers/hbo.png", color: "#B530F2" },
  { id: 15, name: "Hulu", logo: "/providers/hulu.png", color: "#1CE783" },
  { id: 350, name: "Apple TV+", logo: "/providers/apple.png", color: "#000000" },
  { id: 531, name: "Paramount+", logo: "/providers/paramount.png", color: "#0064FF" },
  { id: 386, name: "Peacock", logo: "/providers/peacock.png", color: "#000000" },
  { id: 73, name: "Tubi", logo: "/providers/tubi.png", color: "#FA382F" },
  { id: 457, name: "Plex", logo: "/providers/plex.png", color: "#E5A00D" },
];

// Footer Links
export const FOOTER_LINKS = {
  discover: [
    { label: "Popular Movies", href: "/movies?category=popular" },
    { label: "Popular TV Shows", href: "/tv?category=popular" },
    { label: "Upcoming Movies", href: "/movies?category=upcoming" },
    { label: "Top Rated", href: "/movies?category=top_rated" },
  ],
  genres: [
    { label: "Action", href: "/genre/action" },
    { label: "Comedy", href: "/genre/comedy" },
    { label: "Drama", href: "/genre/drama" },
    { label: "Horror", href: "/genre/horror" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  social: [
    { label: "Twitter", href: "https://twitter.com/trendimovies", icon: "twitter" },
    { label: "Facebook", href: "https://facebook.com/trendimovies", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com/trendimovies", icon: "instagram" },
  ],
};
