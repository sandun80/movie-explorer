import MovieCard from "@/components/MovieCard";

type Movie = {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
};

type MovieGridProps = {
  movies: Movie[];
};

export default function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <p className="py-12 text-center text-zinc-400">
        No movies found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
