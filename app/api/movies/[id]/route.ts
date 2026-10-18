import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = await tmdbFetch(`/movie/${encodeURIComponent(id)}`);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: res.status }
    );
  }

  return NextResponse.json(await res.json());
}
