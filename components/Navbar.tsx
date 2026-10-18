export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
      <h1 className="text-2xl font-bold text-red-500">
        Movie<span className="text-white">Explorer</span>
      </h1>

      <div className="flex gap-6 text-sm text-zinc-300">
        <a href="/" className="text-white">
          Home
        </a>

        <a href="/movies" className="transition hover:text-red-500">
          Movies
        </a>

        <a href="/watchlist" className="transition hover:text-red-500">
          Watchlist
        </a>
      </div>
    </nav>
  );
}
