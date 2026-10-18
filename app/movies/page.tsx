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
  total_pages: number;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeQuery, setActiveQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  async function fetchPage(query: string, pageNumber: number) {
    const url = query
      ? `/api/search?query=${encodeURIComponent(query)}&page=${pageNumber}`
      : `/api/movies?page=${pageNumber}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to load movies");
    }

    const data: TMDBResponse = await response.json();
    return {
      movies: formatMovies(data.results),
      totalPages: Math.min(data.total_pages ?? 1, 500),
    };
  }

  async function loadMore() {
    try {
      setLoadingMore(true);
      const next = page + 1;
      const result = await fetchPage(activeQuery, next);

      // Pages can overlap, so skip movies already shown
      setMovies((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        return [...prev, ...result.movies.filter((m) => !seen.has(m.id))];
      });
      setPage(next);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Load more error:", error);
      setError("Could not load more movies. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  }

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

      const result = await fetchPage("", 1);
      setMovies(result.movies);
      setActiveQuery("");
      setPage(1);
      setTotalPages(result.totalPages);
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

      const result = await fetchPage(query, 1);
      setMovies(result.movies);
      setActiveQuery(query);
      setPage(1);
      setTotalPages(result.totalPages);
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

              {page < totalPages && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-lg bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {loadingMore ? "Loading..." : "Load more"}
                  </button>
                </div>
              )}

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
