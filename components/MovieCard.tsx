type Movie = {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
};

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition hover:-translate-y-1 hover:border-red-500/50">
      <img
        src={movie.poster}
        alt={movie.title}
        className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
      />

      <div className="p-4">
        <h3 className="truncate text-lg font-semibold">
          {movie.title}
        </h3>

        <div className="mt-2 flex items-center justify-between text-sm text-zinc-400">
          <span>{movie.year}</span>
          <span className="text-yellow-400">
            ★ {movie.rating}
          </span>
        </div>
      </div>
    </article>
  );
}
