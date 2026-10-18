import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "TMDB access token is not configured." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Please provide a movie title." },
        { status: 400 }
      );
    }

    const pageParam = Number(searchParams.get("page"));
    const page =
      Number.isInteger(pageParam) && pageParam >= 1 ? Math.min(pageParam, 500) : 1;

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to search movies." },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
