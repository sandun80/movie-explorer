"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";

type Movie = {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
};

type TMDBMovie = {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
};

type TMDBResponse = {
  results: TMDBMovie[];
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function formatMovies(results: TMDBMovie[]): Movie[] {
    return results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date
        ? Number(movie.release_date.slice(0, 4))
        : 0,
      rating: movie.vote_average,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",
    }));
  }

  async function loadPopularMovies() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/movies");

      if (!response.ok) {
        throw new Error("Failed to load popular movies");
      }

      const data: TMDBResponse = await response.json();
      setMovies(formatMovies(data.results));
    } catch (error) {
      console.error("Movies page error:", error);
      setError("Could not load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/movies/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to search movies");
      }

      const data: TMDBResponse = await response.json();
      setMovies(formatMovies(data.results));
    } catch (error) {
      console.error("Movie search error:", error);
      setError("Could not search movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function initialize() {
      await loadPopularMovies();
    }

    initialize();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="px-6 py-12 md:px-12">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-red-400"
        >
          ← Home
        </Link>

        <div className="mt-6">
          <p className="font-semibold uppercase tracking-widest text-red-500">
            Explore the collection
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            All Movies
          </h1>

          <p className="mt-3 text-zinc-400">
            Discover popular movies or search for your next favourite.
          </p>
        </div>

        <div className="mt-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mt-10">
          {loading ? (
            <p className="py-10 text-center text-zinc-400">
              Loading movies...
            </p>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-red-400">{error}</p>

              <button
                onClick={loadPopularMovies}
                className="mt-4 rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Movies to Explore
                </h2>

                <span className="text-sm text-zinc-400">
                  {movies.length} movies
                </span>
              </div>

              <MovieGrid movies={movies} />

              <button
                onClick={loadPopularMovies}
                className="mt-8 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold transition hover:border-red-500 hover:text-red-400"
              >
                Show Popular Movies
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
