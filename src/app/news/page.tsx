import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase, NewsArticle } from "@/lib/supabase";
import PlaceholderImage from "@/components/PlaceholderImage";

export const metadata: Metadata = {
  title: "Movie & TV News | TrendiMovies",
  description: "Latest news about movies, TV shows, streaming, and entertainment industry.",
};

// Force dynamic rendering to always fetch from database at runtime
export const dynamic = "force-dynamic";

const ARTICLES_PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getNews(page: number): Promise<{ articles: NewsArticle[]; totalCount: number }> {
  const from = (page - 1) * ARTICLES_PER_PAGE;
  const to = from + ARTICLES_PER_PAGE - 1;

  // Get total count
  const { count } = await supabase
    .from("news_articles")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  // Get paginated articles
  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching news:", error);
    return { articles: [], totalCount: 0 };
  }

  return { articles: data || [], totalCount: count || 0 };
}

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const { articles, totalCount } = await getNews(currentPage);
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Entertainment News
          </h1>
          <p className="text-zinc-400">
            Stay updated with the latest movie and TV show news
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg mb-4">No news articles yet.</p>
            <p className="text-zinc-500">Check back soon for the latest entertainment news!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {article.image_url ? (
                      <Image
                        src={article.image_url}
                        alt={article.image_alt || article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <PlaceholderImage
                        title={article.title}
                        category={article.category}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {article.category && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded capitalize">
                        {article.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-white group-hover:text-red-500 transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-zinc-400 text-sm line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString()
                          : "Draft"}
                      </span>
                      <span className="flex items-center gap-1 text-red-500 group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {/* Previous button */}
                {currentPage > 1 ? (
                  <Link
                    href={`/news?page=${currentPage - 1}`}
                    className="flex items-center gap-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-4 py-2 bg-zinc-900 text-zinc-600 rounded-lg cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </span>
                )}

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1;

                    // Show ellipsis
                    const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore) {
                      return (
                        <span key={`ellipsis-before-${page}`} className="px-2 text-zinc-500">
                          ...
                        </span>
                      );
                    }

                    if (showEllipsisAfter) {
                      return (
                        <span key={`ellipsis-after-${page}`} className="px-2 text-zinc-500">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <Link
                        key={page}
                        href={`/news?page=${page}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                          page === currentPage
                            ? "bg-red-600 text-white"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        {page}
                      </Link>
                    );
                  })}
                </div>

                {/* Next button */}
                {currentPage < totalPages ? (
                  <Link
                    href={`/news?page=${currentPage + 1}`}
                    className="flex items-center gap-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-4 py-2 bg-zinc-900 text-zinc-600 rounded-lg cursor-not-allowed">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            )}

            {/* Page info */}
            <div className="text-center mt-4 text-zinc-500 text-sm">
              Showing {(currentPage - 1) * ARTICLES_PER_PAGE + 1} - {Math.min(currentPage * ARTICLES_PER_PAGE, totalCount)} of {totalCount} articles
            </div>
          </>
        )}
      </div>
    </main>
  );
}
