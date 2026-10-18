"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import MovieGrid from "@/components/MovieGrid";

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


export default function Home() {
const [movies, setMovies] = useState<Movie[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  async function fetchMovies() {
    try {
      const response = await fetch("/api/movies");

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data: TMDBResponse = await response.json();

      const formattedMovies: Movie[] = data.results.map((movie) => ({
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

      setMovies(formattedMovies);
    } catch {
      setError("Could not load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  fetchMovies();
}, []);



async function handleSearch(query: string) {
  try {
    setLoading(true);
    setError("");

    const response = await fetch(
      `/api/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Failed to search movies");
    }

    const data: TMDBResponse = await response.json();

    const formattedMovies: Movie[] = data.results.map((movie) => ({
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

    setMovies(formattedMovies);
  } catch (error) {
  console.error("Movie search error:", error);
  setError("Could not search movies. Please try again.");
  
  } finally {
    setLoading(false);
  }
}



  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="max-w-3xl">
          <p className="mb-4 font-semibold uppercase tracking-[0.3em] text-red-500">
            Discover your next favourite
          </p>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            Movies worth
            <span className="text-red-500"> watching.</span>
          </h2>

          <div className="mt-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          <p className="mt-6 max-w-xl leading-7 text-zinc-400">
            Explore unforgettable stories, discover popular movies, and find
            your next movie-night favourite.
          </p>

          <a
            href="#movies"
            className="mt-8 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
          >
            Explore Movies
          </a>
        </div>
      </section>

      {/* Movie Collection */}
      <section id="movies" className="px-6 pb-20 md:px-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-red-500">
              Handpicked for you
            </p>
            <h2 className="mt-2 text-3xl font-bold">Popular Movies</h2>
          </div>

          <span className="text-sm text-zinc-500">
            {movies.length} movies
          </span>

        </div>
       
        {loading && (
          <p className="py-12 text-center text-zinc-400">
            Loading movies...
          </p>
        )}

      {error && (
        <p className="py-12 text-center text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && <MovieGrid movies={movies} />}

    </section>
      

      {/* Footer */}
      <footer
        id="watchlist"
        className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-500"
      >
        MovieExplorer — Discover your next favourite movie.
      </footer>
    </main>
  );
}
