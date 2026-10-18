"use client";

import { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      onSearch(trimmedQuery);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-3">
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for a movie..."
        className="min-w-0 flex-1 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
      />

      <button
        type="submit"
        className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        Search
      </button>
    </form>
  );
}
