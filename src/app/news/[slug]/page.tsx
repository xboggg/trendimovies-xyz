import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { supabase, NewsArticle } from "@/lib/supabase";
import ShareButtons from "@/components/ShareButtons";
import PlaceholderImage from "@/components/PlaceholderImage";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string): Promise<NewsArticle | null> {
  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  // Increment view count
  await supabase
    .from("news_articles")
    .update({ views: (data.views || 0) + 1 })
    .eq("id", data.id);

  return data;
}

async function getRelatedArticles(category: string, currentId: string): Promise<NewsArticle[]> {
  const { data } = await supabase
    .from("news_articles")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", currentId)
    .order("published_at", { ascending: false })
    .limit(3);

  return data || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article Not Found | TrendiMovies" };
  }

  return {
    title: `${article.title} | TrendiMovies`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, article.id);

  const readingTime = Math.ceil((article.content?.split(" ").length || 0) / 200);

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>

        {/* Category Badge */}
        {article.category && (
          <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-medium rounded capitalize mb-4">
            {article.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm mb-8">
          {article.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readingTime} min read
          </span>
          {article.source_name && (
            <span className="flex items-center gap-1">
              Source: {article.source_name}
            </span>
          )}
        </div>

        {/* Featured image */}
        <div className="aspect-video relative rounded-xl overflow-hidden mb-8">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.image_alt || article.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <PlaceholderImage title={article.title} category={article.category} />
          )}
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-zinc-300 mb-8 leading-relaxed border-l-4 border-red-600 pl-4">
            {article.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none mb-12
            prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
            prose-headings:text-white prose-headings:mt-8 prose-headings:mb-4
            prose-strong:text-white prose-em:text-zinc-200
            prose-a:text-red-500 prose-a:no-underline hover:prose-a:underline
            [&>p]:mb-6 [&>p]:leading-8 [&>p]:text-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share & Source */}
        <div className="flex items-center justify-between py-6 border-t border-zinc-800">
          <ShareButtons title={article.title} />
          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-400 transition-colors text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              Source
            </a>
          )}
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 pt-12 border-t border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6">Related News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/news/${related.slug}`}
                  className="group"
                >
                  <div className="aspect-video relative rounded-lg overflow-hidden mb-3">
                    {related.image_url ? (
                      <Image
                        src={related.image_url}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <PlaceholderImage title={related.title} category={related.category} className="group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <h3 className="text-white font-medium group-hover:text-red-500 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
