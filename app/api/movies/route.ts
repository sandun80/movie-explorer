import { NextResponse } from "next/server";

export async function GET() {
    try{
        const apikey = process.env.TMDB_ACCESS_TOKEN;

        if(!apikey){
            return NextResponse.json(
                { error: "TMDB API key is not configured." },
                { status: 500 }
            );
        }

        const response = await fetch(
            "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
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
        
    }
}