import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const CRON_SECRET = process.env.CRON_SECRET || process.env.ADMIN_SESSION_SECRET;

// Popular movie pairs for battles - curated matchups that spark debate
const BATTLE_PAIRS = [
  // Superhero battles
  { a: { id: 155, title: "The Dark Knight" }, b: { id: 27205, title: "Inception" }, category: "nolan" },
  { a: { id: 299536, title: "Avengers: Infinity War" }, b: { id: 299534, title: "Avengers: Endgame" }, category: "mcu" },
  { a: { id: 1726, title: "Iron Man" }, b: { id: 299536, title: "Avengers: Infinity War" }, category: "mcu" },
  { a: { id: 157336, title: "Interstellar" }, b: { id: 27205, title: "Inception" }, category: "nolan" },
  { a: { id: 120467, title: "The Grand Budapest Hotel" }, b: { id: 153, title: "Lost in Translation" }, category: "indie" },

  // Classic matchups
  { a: { id: 278, title: "The Shawshank Redemption" }, b: { id: 238, title: "The Godfather" }, category: "classic" },
  { a: { id: 680, title: "Pulp Fiction" }, b: { id: 550, title: "Fight Club" }, category: "90s" },
  { a: { id: 13, title: "Forrest Gump" }, b: { id: 278, title: "The Shawshank Redemption" }, category: "90s" },

  // Sci-Fi battles
  { a: { id: 603, title: "The Matrix" }, b: { id: 27205, title: "Inception" }, category: "scifi" },
  { a: { id: 601, title: "E.T. the Extra-Terrestrial" }, b: { id: 329, title: "Jurassic Park" }, category: "spielberg" },
  { a: { id: 11, title: "Star Wars" }, b: { id: 140607, title: "Star Wars: The Force Awakens" }, category: "starwars" },
  { a: { id: 1891, title: "The Empire Strikes Back" }, b: { id: 11, title: "Star Wars" }, category: "starwars" },

  // Animation battles
  { a: { id: 862, title: "Toy Story" }, b: { id: 12, title: "Finding Nemo" }, category: "pixar" },
  { a: { id: 129, title: "Spirited Away" }, b: { id: 128, title: "Princess Mononoke" }, category: "ghibli" },
  { a: { id: 508442, title: "Soul" }, b: { id: 150540, title: "Inside Out" }, category: "pixar" },

  // Horror matchups
  { a: { id: 694, title: "The Shining" }, b: { id: 539, title: "Psycho" }, category: "horror" },
  { a: { id: 493922, title: "Hereditary" }, b: { id: 419430, title: "Get Out" }, category: "horror" },

  // Action classics
  { a: { id: 218, title: "The Terminator" }, b: { id: 280, title: "Terminator 2: Judgment Day" }, category: "action" },
  { a: { id: 98, title: "Gladiator" }, b: { id: 652, title: "Troy" }, category: "epic" },
  { a: { id: 557, title: "Spider-Man" }, b: { id: 1930, title: "The Amazing Spider-Man" }, category: "spidey" },

  // Modern hits
  { a: { id: 466420, title: "Killers of the Flower Moon" }, b: { id: 872585, title: "Oppenheimer" }, category: "2023" },
  { a: { id: 346698, title: "Barbie" }, b: { id: 872585, title: "Oppenheimer" }, category: "2023" },
  { a: { id: 438631, title: "Dune" }, b: { id: 693134, title: "Dune: Part Two" }, category: "dune" },
  { a: { id: 569094, title: "Spider-Man: Across the Spider-Verse" }, b: { id: 324857, title: "Spider-Man: Into the Spider-Verse" }, category: "spiderverse" },

  // Director showdowns
  { a: { id: 16869, title: "Inglourious Basterds" }, b: { id: 68718, title: "Django Unchained" }, category: "tarantino" },
  { a: { id: 752623, title: "The Lost City" }, b: { id: 696806, title: "The Adam Project" }, category: "2022" },
];

async function getMoviePoster(movieId: number): Promise<string | null> {
  const tmdbKey = process.env.TMDB_API_KEY;
  if (!tmdbKey) return null;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbKey}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.poster_path || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const providedSecret = authHeader?.replace("Bearer ", "") || secret;

  if (!providedSecret || providedSecret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check current active battle
    const { data: currentBattle } = await supabaseAdmin
      .from("movie_battles")
      .select("*")
      .eq("is_active", true)
      .single();

    if (currentBattle) {
      const startDate = new Date(currentBattle.start_date);
      const now = new Date();
      const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      // Only rotate if 3+ days have passed
      if (daysSinceStart < 3) {
        return NextResponse.json({
          success: true,
          message: `Current battle still active (${3 - daysSinceStart} days remaining)`,
          battle: currentBattle
        });
      }

      // Deactivate current battle
      await supabaseAdmin
        .from("movie_battles")
        .update({ is_active: false, end_date: now.toISOString().split("T")[0] })
        .eq("id", currentBattle.id);
    }

    // Get recent battles to avoid repetition
    const { data: recentBattles } = await supabaseAdmin
      .from("movie_battles")
      .select("movie_a_id, movie_b_id")
      .order("created_at", { ascending: false })
      .limit(10);

    const recentMovieIds = new Set<number>();
    (recentBattles || []).forEach(b => {
      recentMovieIds.add(b.movie_a_id);
      recentMovieIds.add(b.movie_b_id);
    });

    // Find a battle pair that hasn't been used recently
    let selectedPair = BATTLE_PAIRS[Math.floor(Math.random() * BATTLE_PAIRS.length)];

    for (const pair of BATTLE_PAIRS.sort(() => Math.random() - 0.5)) {
      if (!recentMovieIds.has(pair.a.id) && !recentMovieIds.has(pair.b.id)) {
        selectedPair = pair;
        break;
      }
    }

    // Get posters from TMDB
    const [posterA, posterB] = await Promise.all([
      getMoviePoster(selectedPair.a.id),
      getMoviePoster(selectedPair.b.id)
    ]);

    // Create new battle
    const { data: newBattle, error } = await supabaseAdmin
      .from("movie_battles")
      .insert({
        movie_a_id: selectedPair.a.id,
        movie_a_title: selectedPair.a.title,
        movie_a_poster: posterA,
        movie_a_votes: 0,
        movie_b_id: selectedPair.b.id,
        movie_b_title: selectedPair.b.title,
        movie_b_poster: posterB,
        movie_b_votes: 0,
        is_active: true,
        start_date: new Date().toISOString().split("T")[0],
        category: selectedPair.category
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "New battle created",
      battle: newBattle
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to rotate battle" }, { status: 500 });
  }
}
