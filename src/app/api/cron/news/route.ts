import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const CRON_SECRET = process.env.CRON_SECRET || process.env.ADMIN_SESSION_SECRET;

const MOVIE_TV_KEYWORDS = [
  'movie', 'film', 'cinema', 'box office', 'trailer', 'sequel', 'prequel',
  'tv show', 'television', 'series', 'season', 'episode', 'streaming',
  'netflix', 'disney+', 'disney plus', 'hbo', 'max', 'amazon prime', 'hulu',
  'apple tv', 'paramount+', 'peacock', 'actor', 'actress', 'director',
  'hollywood', 'bollywood', 'cast', 'premiere', 'release date', 'oscar',
  'emmy', 'golden globe', 'award', 'blockbuster', 'franchise', 'remake',
  'reboot', 'spinoff', 'spin-off', 'showrunner', 'screenwriter', 'screenplay',
  'studio', 'production', 'filming', 'shot', 'wrap', 'post-production',
  'marvel', 'dc', 'star wars', 'pixar', 'animation', 'animated'
];

function isMovieTVRelated(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  return MOVIE_TV_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 100) + '-' + Date.now().toString(36);
}

function areTitlesSimilar(title1: string, title2: string): boolean {
  const norm1 = normalizeTitle(title1);
  const norm2 = normalizeTitle(title2);
  if (norm1 === norm2) return true;
  const words1 = norm1.split(' ');
  const words2 = norm2.split(' ');
  const commonWords = words1.filter(w => words2.includes(w));
  return commonWords.length / Math.max(words1.length, words2.length) > 0.7;
}

async function fetchFromNewsAPI(limit: number): Promise<any[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=(movie OR film OR "tv show" OR television OR netflix OR "box office" OR hollywood OR streaming)&language=en&sortBy=publishedAt&pageSize=20`,
      { headers: { "X-Api-Key": apiKey } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data.articles || [])
      .filter((a: any) => a.title && a.description && a.url && a.urlToImage)
      .filter((a: any) => isMovieTVRelated(a.title, a.description))
      .slice(0, limit)
      .map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image_url: a.urlToImage,
        source: a.source?.name || "NewsAPI",
        published_at: a.publishedAt,
        provider: "newsapi"
      }));
  } catch {
    return [];
  }
}

async function fetchFromGNews(limit: number): Promise<any[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return [];
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=movie OR film OR "tv show" OR netflix OR hollywood&lang=en&max=20&apikey=${apiKey}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data.articles || [])
      .filter((a: any) => a.title && a.description && a.url && a.image)
      .filter((a: any) => isMovieTVRelated(a.title, a.description))
      .slice(0, limit)
      .map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image_url: a.image,
        source: a.source?.name || "GNews",
        published_at: a.publishedAt,
        provider: "gnews"
      }));
  } catch {
    return [];
  }
}

async function rewriteWithAI(title: string, description: string): Promise<{ title: string; content: string }> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return { title, content: `<p>${description}</p>` };

  const systemPrompt = `You are a professional entertainment news writer. Rewrite the news into 4-6 paragraphs. Format as HTML with <p> tags. Return ONLY valid JSON: {"title": "headline", "content": "<p>...</p>"}`;
  const userPrompt = `Rewrite: ${title}\n\n${description}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) return { title, content: `<p>${description}</p>` };

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content || "";
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0].replace(/[\x00-\x1F\x7F]/g, ''));
      if (parsed.title && parsed.content) {
        return { title: parsed.title, content: parsed.content };
      }
    }
  } catch {
    // Fall through to default
  }
  return { title, content: `<p>${description}</p>` };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  // Auth via header or query param
  const providedSecret = authHeader?.replace("Bearer ", "") || secret;

  if (!providedSecret || providedSecret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = 6; // Fetch 6 articles per run
    const articlesPerSource = Math.ceil(count / 2);

    const [newsApiArticles, gnewsArticles] = await Promise.all([
      fetchFromNewsAPI(articlesPerSource),
      fetchFromGNews(articlesPerSource)
    ]);

    const allArticles = [...newsApiArticles, ...gnewsArticles];
    const uniqueArticles: any[] = [];
    const seenUrls = new Set<string>();
    const seenTitles: string[] = [];

    const { data: existingArticles } = await supabaseAdmin
      .from("news_articles")
      .select("source_url, title")
      .order("created_at", { ascending: false })
      .limit(100);

    const existingUrls = new Set((existingArticles || []).map(a => a.source_url));
    const existingTitles = (existingArticles || []).map(a => a.title);

    for (const article of allArticles) {
      if (seenUrls.has(article.url) || existingUrls.has(article.url)) continue;
      const isSimilar = [...seenTitles, ...existingTitles].some(t => areTitlesSimilar(article.title, t));
      if (isSimilar) continue;

      seenUrls.add(article.url);
      seenTitles.push(article.title);
      uniqueArticles.push(article);
      if (uniqueArticles.length >= count) break;
    }

    const savedArticles = [];
    for (const article of uniqueArticles) {
      const rewritten = await rewriteWithAI(article.title, article.description);
      const slug = generateSlug(rewritten.title);

      const { data, error } = await supabaseAdmin
        .from("news_articles")
        .insert({
          title: rewritten.title,
          slug: slug,
          content: rewritten.content,
          original_content: article.description,
          excerpt: rewritten.content.replace(/<[^>]*>/g, '').substring(0, 250).trim() + '...',
          image_url: article.image_url,
          source_name: article.source,
          source_url: article.url,
          published_at: article.published_at,
          status: "published",
          is_ai_generated: true,
          category: "entertainment"
        })
        .select()
        .single();

      if (!error && data) {
        savedArticles.push(data);
      }

      // Small delay between articles
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return NextResponse.json({
      success: true,
      message: `Fetched ${savedArticles.length} new articles`,
      count: savedArticles.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch news" }, { status: 500 });
  }
}
