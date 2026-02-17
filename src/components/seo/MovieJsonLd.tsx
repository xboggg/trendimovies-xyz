"use client";

interface MovieJsonLdProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    runtime?: number;
    poster_path: string | null;
    backdrop_path: string | null;
    genres?: { id: number; name: string }[];
    credits?: {
      crew: { job: string; name: string }[];
      cast: { name: string }[];
    };
  };
}

export function MovieJsonLd({ movie }: MovieJsonLdProps) {
  const director = movie.credits?.crew.find((c) => c.job === "Director");
  const actors = movie.credits?.cast.slice(0, 5).map((a) => a.name) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : undefined,
    datePublished: movie.release_date,
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    genre: movie.genres?.map((g) => g.name),
    director: director
      ? {
          "@type": "Person",
          name: director.name,
        }
      : undefined,
    actor: actors.map((name) => ({
      "@type": "Person",
      name,
    })),
    aggregateRating: movie.vote_count > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average.toFixed(1),
          bestRating: "10",
          worstRating: "0",
          ratingCount: movie.vote_count,
        }
      : undefined,
    url: `https://trendimovies.xyz/movies/${movie.id}`,
    potentialAction: {
      "@type": "WatchAction",
      target: `https://trendimovies.com/movie/${movie.id}`,
    },
  };

  // Remove undefined values
  const cleanJsonLd = JSON.parse(JSON.stringify(jsonLd));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanJsonLd) }}
    />
  );
}

interface TVShowJsonLdProps {
  show: {
    id: number;
    name: string;
    overview: string;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    number_of_seasons?: number;
    number_of_episodes?: number;
    poster_path: string | null;
    genres?: { id: number; name: string }[];
    credits?: {
      cast: { name: string }[];
    };
    created_by?: { name: string }[];
  };
}

export function TVShowJsonLd({ show }: TVShowJsonLdProps) {
  const creators = show.created_by?.map((c) => c.name) || [];
  const actors = show.credits?.cast.slice(0, 5).map((a) => a.name) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show.name,
    description: show.overview,
    image: show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : undefined,
    datePublished: show.first_air_date,
    genre: show.genres?.map((g) => g.name),
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
    creator: creators.map((name) => ({
      "@type": "Person",
      name,
    })),
    actor: actors.map((name) => ({
      "@type": "Person",
      name,
    })),
    aggregateRating: show.vote_count > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: show.vote_average.toFixed(1),
          bestRating: "10",
          worstRating: "0",
          ratingCount: show.vote_count,
        }
      : undefined,
    url: `https://trendimovies.xyz/tv/${show.id}`,
    potentialAction: {
      "@type": "WatchAction",
      target: `https://trendimovies.com/series/${show.id}`,
    },
  };

  const cleanJsonLd = JSON.parse(JSON.stringify(jsonLd));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanJsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteJsonLdProps {
  name: string;
  url: string;
  description: string;
}

export function WebsiteJsonLd({ name, url, description }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
