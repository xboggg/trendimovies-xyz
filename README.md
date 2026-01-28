# TrendiMovies 2.0

A modern, state-of-the-art movie and TV show discovery platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Movie Discovery** - Browse trending, popular, upcoming, and top-rated movies
- **TV Shows** - Explore TV series with season and episode information
- **Search** - Multi-search across movies, TV shows, and people
- **Where to Watch** - See streaming availability across platforms
- **Responsive Design** - Beautiful UI on all devices
- **SEO Optimized** - Server-side rendering for search engine visibility
- **Fast** - Optimized performance with Next.js

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **Animations**: Framer Motion
- **Data Source**: TMDB API
- **Deployment**: Docker + Nginx (Contabo VPS)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create environment file: `cp .env.example .env.local`
4. Add your TMDB API key to `.env.local`
5. Start development server: `npm run dev`

Visit http://localhost:3000

## Deployment (Contabo VPS)

### Quick Deploy

1. SSH into your Contabo server
2. Clone the repository
3. Create `.env` file with your configuration
4. Run the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh build
./deploy.sh ssl
./deploy.sh start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| TMDB_API_KEY | TMDB API key | Yes |
| NEXT_PUBLIC_SITE_URL | Site URL for SEO | Yes (prod) |

## License

This project is for educational purposes. Movie data provided by TMDB.
