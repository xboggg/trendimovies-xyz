import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/services/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const page = searchParams.get("page") || "1";

  if (!query) {
    return NextResponse.json({ results: [], total_results: 0 });
  }

  try {
    const data = await searchMulti(query, parseInt(page));
    return NextResponse.json(data);
  } catch (error) {
    // console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 }
    );
  }
}
