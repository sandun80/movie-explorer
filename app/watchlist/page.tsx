"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Movie = {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
};

const STORAGE_KEY = "movie-watchlist";

export default function WishlistPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    try {
      const savedMovies = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (Array.isArray(savedMovies)) {
        setMovies(savedMovies);
      }
    } catch (error) {
      console.error("Could not load watchlist:", error);
    }
  }, []);

  function removeMovie(id: number) {
    const updatedMovies = movies.filter((movie) => movie.id !== id);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedMovies)
    );

    setMovies(updatedMovies);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="px-6 py-12 md:px-12">
        <p className="font-semibold uppercase tracking-widest text-red-500">
          Your collection
        </p>

        <h1 className="mt-2 text-4xl font-bold">My Watchlist</h1>

        <p className="mt-3 text-zinc-400">
          Movies you have saved to watch later.
        </p>

        {movies.length === 0 ? (
          <div className="mt-10 rounded-xl border border-white/10 bg-zinc-900 p-8 text-center">
            <h2 className="text-xl font-semibold">
              Your watchlist is empty
            </h2>

            <p className="mt-2 text-zinc-400">
              Explore movies and add your favourites here.
            </p>

            <Link
              href="/"
              className="mt-5 inline-block rounded-lg bg-red-600 px-5 py-3 font-semibold hover:bg-red-700"
            >
              Explore Movies
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-6 text-sm text-zinc-400">
              {movies.length} saved movie(s)
            </p>

            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {movies.map((movie) => (
                <article
                  key={movie.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
                >
                  <Link href={`/movies/${movie.id}`}>
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="aspect-[2/3] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[2/3] items-center justify-center bg-zinc-800 text-zinc-400">
                        No poster available
                      </div>
                    )}
                  </Link>

                  <div className="p-3">
                    <h2 className="truncate font-semibold">
                      {movie.title}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                      {movie.year || "Year unavailable"} · ★{" "}
                      {movie.rating.toFixed(1)}
                    </p>

                    <button
                      onClick={() => removeMovie(movie.id)}
                      className="mt-3 w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
