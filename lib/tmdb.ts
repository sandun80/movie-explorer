const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

export async function tmdbFetch(
  path: string,
  params: Record<string, string> = {}
) {
  const url = new URL(`${BASE_URL.replace(/\/$/, "")}${path}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );

  const headers: Record<string, string> = { accept: "application/json" };
  if (process.env.TMDB_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  } else if (process.env.TMDB_API_KEY) {
    url.searchParams.set("api_key", process.env.TMDB_API_KEY);
  }

  return fetch(url, { headers, cache: "no-store" });
}
