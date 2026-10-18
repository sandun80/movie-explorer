
"use client";

import { useEffect, useState } from "react";

type WatchlistMovie = {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
};

type WatchlistButtonProps = {
  movie: WatchlistMovie;
};

const STORAGE_KEY = "movie-watchlist";

export default function WatchlistButton({
  movie,
}: WatchlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedMovies: WatchlistMovie[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    setIsSaved(
      savedMovies.some((savedMovie) => savedMovie.id === movie.id)
    );
  }, [movie.id]);

  function handleAddToWatchlist() {
    try {
      const savedMovies: WatchlistMovie[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      const alreadySaved = savedMovies.some(
        (savedMovie) => savedMovie.id === movie.id
      );

      if (alreadySaved) {
        setIsSaved(true);
        return;
      }

      const updatedMovies = [...savedMovies, movie];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedMovies)
      );

      setIsSaved(true);
    } catch (error) {
      console.error("Could not save movie:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToWatchlist}
      disabled={isSaved}
      className={`mt-6 rounded-lg px-6 py-3 font-semibold transition ${
        isSaved
          ? "cursor-default bg-zinc-700 text-zinc-300"
          : "bg-red-600 text-white hover:bg-red-700"
      }`}
    >
      {isSaved ? "✓ Added to Watchlist" : "+ Add to Watchlist"}
    </button>
  );
}
