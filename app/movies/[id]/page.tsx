
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import WatchlistButton from "@/components/WatchlistButton";

type Genre = {
  id: number;
  name: string;
};

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: Genre[];
  poster_path: string | null;
  backdrop_path: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function MovieDetailsPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <Suspense
        fallback={
          <div className="px-6 py-20 text-center text-zinc-400">
            Loading movie details...
          </div>
        }
      >
        <MovieDetailsContent params={params} />
      </Suspense>
    </main>
  );
}

async function MovieDetailsContent({ params }: PageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB access token is not configured.");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch movie details from TMDB.");
  }

  const movie: MovieDetails = await response.json();

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "Unknown";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "Unavailable";

  return (
    <section
      className="relative bg-cover bg-center"
      style={{
        backgroundImage: movie.backdrop_path
          ? `linear-gradient(to right, #09090b 20%, rgba(9,9,11,0.75)), url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
          : undefined,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-zinc-300 transition hover:text-red-400"
        >
          ← Back to movies
        </Link>

        <div className="grid gap-8 md:grid-cols-[280px_1fr] md:gap-12">
          <div>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className="w-full max-w-xs rounded-xl shadow-2xl"
              />
            ) : (
              <div className="flex aspect-[2/3] max-w-xs items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
                No poster available
              </div>
            )}
          </div>

          <div className="self-center">
            <p className="mb-3 font-semibold uppercase tracking-widest text-red-500">
              Movie Details
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              {movie.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-300">
              <span>{year}</span>
              <span className="text-yellow-400">
                ★ {movie.vote_average.toFixed(1)} / 10
              </span>
              <span>{runtime}</span>
            </div>

            {movie.genres.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/20 px-3 py-1 text-sm text-zinc-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <h2 className="mt-8 text-2xl font-semibold">Overview</h2>

            <p className="mt-3 max-w-3xl leading-8 text-zinc-300">
              {movie.overview ||
                "No overview is available for this movie."}
            </p>

            <WatchlistButton
              movie={{
                id: movie.id,
                title: movie.title,
                year: movie.release_date
                  ? Number(movie.release_date.slice(0, 4))
                  : 0,
                rating: movie.vote_average,
                poster: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
