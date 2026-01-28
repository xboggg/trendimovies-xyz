import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
  } catch (error) {
    console.error("NewsAPI fetch error:", error);
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
  } catch (error) {
    console.error("GNews fetch error:", error);
    return [];
  }
}

async function rewriteWithAI(title: string, description: string): Promise<{ title: string; content: string }> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return { title, content: description };

  const systemPrompt = `You are a professional entertainment news writer for TrendiMovies.xyz. Your job is to rewrite news articles into comprehensive, engaging articles.

CRITICAL REQUIREMENTS:
1. Write a compelling, SEO-optimized headline (title)
2. Write a DETAILED article with 8-10 paragraphs (800-1200 words)
3. Format content as HTML with <p> tags for EACH paragraph
4. Include background info about actors, directors, studios mentioned
5. Add industry context and analysis
6. Include relevant history or previous works
7. End with future outlook or conclusion

CONTENT STRUCTURE:
- Opening paragraph: Hook and main news
- Paragraphs 2-3: Details and context
- Paragraphs 4-5: Background on key people/projects
- Paragraphs 6-7: Industry analysis
- Paragraphs 8-9: Fan reactions or expectations
- Final paragraph: Conclusion and outlook

OUTPUT FORMAT - Return ONLY valid JSON:
{"title": "Compelling headline", "content": "<p>First paragraph...</p>\\n<p>Second paragraph...</p>\\n<p>Third paragraph...</p>..."}

IMPORTANT: Each paragraph MUST be wrapped in <p></p> tags. Write at least 8 substantial paragraphs.`;

  const userPrompt = `Rewrite this entertainment news into a comprehensive 800-1200 word article with HTML paragraph formatting:

HEADLINE: ${title}

SUMMARY: ${description}

Write 8-10 detailed paragraphs. Each paragraph wrapped in <p></p> tags. Include background, context, analysis. Return only JSON.`;

  // Retry up to 3 times with delays between attempts
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // Add delay before retries to handle rate limiting (15 seconds)
      if (attempt > 1) {
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
      console.log(`AI attempt ${attempt} for: ${title.substring(0, 40)}...`);

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
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        console.error("Groq API error:", response.status);
        continue;
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || "";
      console.log("AI Response received, length:", aiContent.length);

      // First try direct JSON parse with cleaning
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          // Clean control characters that break JSON.parse
          const cleanedJson = jsonMatch[0]
            .replace(/[\x00-\x1F\x7F]/g, (char: string) => {
              if (char === '\n') return '\\n';
              if (char === '\r') return '';
              if (char === '\t') return '\\t';
              return '';
            });
          const parsed = JSON.parse(cleanedJson);
          if (parsed.title && parsed.content && parsed.content.length > 500) {
            console.log("SUCCESS via JSON.parse, content length:", parsed.content.length);
            return { title: parsed.title, content: parsed.content };
          }
        } catch (jsonErr) {
          console.log("JSON.parse failed, trying manual extraction");
        }
      }

      // Fallback: Find title and content positions manually
      const titleMatch = aiContent.match(/"title"\s*:\s*"([^"]+)"/);

      // Find content start after "content": "
      const contentStartIdx = aiContent.indexOf('"content"');
      if (titleMatch && contentStartIdx !== -1) {
        // Find the opening quote after "content":
        const colonIdx = aiContent.indexOf(':', contentStartIdx);
        const openQuoteIdx = aiContent.indexOf('"', colonIdx + 1);

        if (openQuoteIdx !== -1) {
          // Find the closing "} at the end - try multiple patterns
          let closeIdx = aiContent.lastIndexOf('"}');
          if (closeIdx === -1) closeIdx = aiContent.lastIndexOf('" }');
          if (closeIdx === -1) closeIdx = aiContent.lastIndexOf('"\n}');
          if (closeIdx === -1) closeIdx = aiContent.lastIndexOf('"  }');

          // If still not found, look for last </p>" pattern
          if (closeIdx === -1 || closeIdx <= openQuoteIdx) {
            const lastPTagIdx = aiContent.lastIndexOf('</p>');
            if (lastPTagIdx !== -1) {
              closeIdx = aiContent.indexOf('"', lastPTagIdx);
            }
          }

          if (closeIdx > openQuoteIdx) {
            let extractedContent = aiContent.substring(openQuoteIdx + 1, closeIdx);

            // Clean up the content
            extractedContent = extractedContent
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '')
              .replace(/\\t/g, ' ')
              .replace(/\\"/g, '"')
              .replace(/\n\s*\n/g, '\n')
              .trim();

            console.log("Extracted title:", titleMatch[1].substring(0, 50));
            console.log("Extracted content length:", extractedContent.length);

            if (extractedContent.length > 500) {
              console.log("SUCCESS via manual extraction");
              return { title: titleMatch[1], content: extractedContent };
            } else {
              console.log("Manual extraction content too short:", extractedContent.length);
            }
          } else {
            console.log("Could not find valid close index, closeIdx:", closeIdx, "openQuoteIdx:", openQuoteIdx);
          }
        }
      }

      // Last resort: Try to find content between <p> tags directly
      const allParagraphs = aiContent.match(/<p>[\s\S]*?<\/p>/g);
      if (allParagraphs && allParagraphs.length >= 5) {
        const combinedContent = allParagraphs.join('\n');
        if (combinedContent.length > 500) {
          const fallbackTitle = titleMatch ? titleMatch[1] : title;
          console.log("SUCCESS via paragraph extraction, found", allParagraphs.length, "paragraphs");
          return { title: fallbackTitle, content: combinedContent };
        }
      }
      console.log(`Attempt ${attempt} failed to extract content, retrying...`);
    } catch (error) {
      console.error(`AI attempt ${attempt} error:`, error);
    }
  }

  console.log("All 3 attempts failed, using original content");
  return { title, content: description };
}

export async function POST(request: Request) {
  try {
    const { count = 10 } = await request.json().catch(() => ({}));
    const articlesPerSource = Math.ceil(count / 2);

    const [newsApiArticles, gnewsArticles] = await Promise.all([
      fetchFromNewsAPI(articlesPerSource),
      fetchFromGNews(articlesPerSource)
    ]);

    console.log(`Fetched ${newsApiArticles.length} from NewsAPI, ${gnewsArticles.length} from GNews`);

    const allArticles = [...newsApiArticles, ...gnewsArticles];
    const uniqueArticles: any[] = [];
    const seenUrls = new Set<string>();
    const seenTitles: string[] = [];

    const { data: existingArticles } = await supabase
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

    console.log(`${uniqueArticles.length} unique articles after deduplication`);

    const savedArticles = [];
    for (let i = 0; i < uniqueArticles.length; i++) {
      const article = uniqueArticles[i];

      // Add delay between articles to avoid rate limiting (30 seconds)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 30000));
      }

      const rewritten = await rewriteWithAI(article.title, article.description);
      const slug = generateSlug(rewritten.title);

      const { data, error } = await supabase
        .from("news_articles")
        .insert({
          title: rewritten.title,
          slug: slug,
          content: rewritten.content,
          original_content: article.description,
          excerpt: rewritten.content.replace(/<[^>]*>/g, '').substring(0, 250).replace(/\n/g, ' ').trim() + '...',
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

      if (error) {
        console.error("Error saving article:", error);
        continue;
      }
      savedArticles.push(data);
    }

    return NextResponse.json({
      success: true,
      message: `Fetched and saved ${savedArticles.length} articles`,
      articles: savedArticles,
      sources: { newsapi: newsApiArticles.length, gnews: gnewsArticles.length }
    });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to fetch news",
    params: { count: "Number of articles to fetch (default: 10)" }
  });
}
