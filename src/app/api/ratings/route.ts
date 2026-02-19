import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

// GET - Fetch rating stats for a content item
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get("type");
    const contentId = searchParams.get("id");

    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: "Missing type or id parameter" },
        { status: 400 }
      );
    }

    // Get all ratings for this content
    const { data: ratings, error } = await supabaseAdmin
      .from("user_ratings")
      .select("rating")
      .eq("content_type", contentType)
      .eq("content_id", contentId);

    if (error) {
      throw error;
    }

    if (!ratings || ratings.length === 0) {
      return NextResponse.json({
        averageRating: 0,
        totalRatings: 0,
        distribution: {},
      });
    }

    // Calculate stats
    const totalRatings = ratings.length;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = sum / totalRatings;

    // Calculate distribution
    const distribution: { [key: number]: number } = {};
    ratings.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return NextResponse.json({
      averageRating,
      totalRatings,
      distribution,
    });
  } catch (error) {
    // console.error("Ratings GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}

// POST - Submit a rating
export async function POST(request: NextRequest) {
  try {
    const { contentType, contentId, contentTitle, rating, previousRating } =
      await request.json();

    if (!contentType || !contentId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Get or create voter ID from cookies
    const cookieStore = await cookies();
    let voterId = cookieStore.get("voter_id")?.value;

    if (!voterId) {
      voterId = crypto.randomUUID();
      // Note: Cookie will be set client-side since we can't set cookies in route handlers easily
    }

    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip");

    // Check if user already rated this content
    const { data: existingRating } = await supabaseAdmin
      .from("user_ratings")
      .select("id")
      .eq("content_type", contentType)
      .eq("content_id", contentId)
      .eq("voter_id", voterId)
      .single();

    if (existingRating) {
      // Update existing rating
      const { error } = await supabaseAdmin
        .from("user_ratings")
        .update({
          rating,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRating.id);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        message: "Rating updated",
        voterId,
      });
    }

    // Insert new rating
    const { error } = await supabaseAdmin.from("user_ratings").insert({
      content_type: contentType,
      content_id: contentId,
      content_title: contentTitle,
      rating,
      voter_id: voterId,
      ip_address: ipAddress,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Rating submitted",
      voterId,
    });
  } catch (error) {
    // console.error("Ratings POST error:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}
