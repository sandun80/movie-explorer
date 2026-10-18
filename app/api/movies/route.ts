import { NextResponse } from "next/server";
import { connection } from "next/server";

export async function GET(request: Request) {
    await connection();
    
    try{
        const pageParam = Number(new URL(request.url).searchParams.get("page"));
        const page = Number.isInteger(pageParam) && pageParam >= 1 ? Math.min(pageParam, 500) : 1;
        const apikey = process.env.TMDB_ACCESS_TOKEN;

        if(!apikey){
            return NextResponse.json(
                { error: "TMDB API key is not configured." },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${apikey}`,
                    accept: "application/json",
                },
                cache: "no-store",
            }
        )

        
if (!response.ok) {
  const errorDetails = await response.text();

  console.error("TMDB API error:", response.status, errorDetails);

  return NextResponse.json(
    {
      error: "TMDB request failed",
      tmdbStatus: response.status,
      details: errorDetails,
    },
    { status: 502 }
  );
}


        const data = await response.json();

        return NextResponse.json(data);

    }catch(error){
        console.log(error);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}