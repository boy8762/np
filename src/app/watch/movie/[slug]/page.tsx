"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/main/site-header";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;

const WatchMoviePage: React.FC = () => {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const id = slug ? slug.split("-").pop() : null;

  const [movie, setMovie] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEmbed, setSelectedEmbed] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Save watch history
  useEffect(() => {
    if (id) {
      const saveWatchHistory = () => {
        const history = JSON.parse(localStorage.getItem("watchHistory") || "[]");
        const newEntry = { id, type: "movie", date: new Date().toISOString() };

        // Remove existing entry with the same ID
        const updatedHistory = history.filter((item: any) => item.id !== id);

        updatedHistory.unshift(newEntry); // Add the new entry at the beginning
        localStorage.setItem("watchHistory", JSON.stringify(updatedHistory));
      };

      saveWatchHistory();
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      try {
        const [movieRes, recRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`).then((res) =>
            res.json()
          ),
          fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${TMDB_API_KEY}`).then((res) =>
            res.json()
          ),
        ]);

        setMovie(movieRes);
        setRecommendations(recRes.results?.length > 0 ? recRes.results : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // List of embed API providers with custom names
  const embedSources = [
    { name: "Netprime Server 1 { Own Server }", url: `https://letsembed.cc/embed/movie/?id=${id}` },
    { name: "Netprime Server 1 {Multi }", url: `https://vidzee.wtf/movie/multi.php?id=${id}` },
    { name: "Netprime Server 2", url: `https://api.flixindia.site/movie/${id}` },
    { name: "Netprime Server 3", url: `https://iframe.pstream.org/media/tmdb-movie-${id}` },
    { name: "Netprime Server 4 { og }", url: `https://vidzee.wtf/movie/${id}` },
    { name: "Netprime Server 5", url: `https://vidlink.pro/movie/${id}` },
    { name: "Netprime Server 6", url: `https://111movies.com/movie/${id}` },
    { name: "Netprime Server 7 {4k}", url: `https://player.videasy.net/movie/${id}` },
    { name: "Netprime Server 8 {4k}", url: `https://vidsrc.dev/embed/movie/${id}` },
    { name: "Netprime Server 9", url: `https://rivestream.live/embed?type=movie&id=${id}` },
    { name: "Netprime Server 10", url: `https://embed.su/embed/movie/${id}` },
    { name: "Netprime Server 11", url: `https://player.smashy.stream/movie/${id}` },
    { name: "Netprime Server 12", url: `https://vidsrc.cc/v2/embed/movie/${id}` },
    { name: "Netprime Server 13", url: `https://vidsrc.me/embed/movie/${id}` },
    { name: "Netprime Server 14", url: `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    { name: "Netprime Server 15", url: `https://2embed.cc/embed/${id}` },
    { name: "Netprime Server 16", url: `https://moviesapi.to/movie/${id}` },
    { name: "Netprime Server 17", url: `https://filmku.stream/embed/${id}` },
    { name: "Netprime Server 18", url: `https://vidsrc.wtf/api/3/movie/?id=${id}` },
  ];

  const handleEmbedError = () => {
    if (selectedEmbed < embedSources.length - 1) {
      setSelectedEmbed(selectedEmbed + 1);
    } else {
      console.error("All embed sources failed to load.");
    }
  };

  return (
    <>
      <SiteHeader />
      {movie?.backdrop_path && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm opacity-60"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
        />
      )}

      <div className="relative flex flex-col md:flex-row w-full h-screen text-white">
        <div className="flex-grow flex flex-col items-center relative z-10">
          <div className="w-full mt-4 max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={embedSources[selectedEmbed].url}
              title="Video Player"
              allowFullScreen
              className="w-full h-full border-none"
              onError={handleEmbedError}
            ></iframe>
          </div>

          <div className="mt-4 relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 text-sm rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            >
              {`${embedSources[selectedEmbed].name} (Selected)`}
            </button>
            {dropdownOpen && (
              <div className="absolute mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-600 overflow-y-auto max-h-40">
                {embedSources.map((source, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedEmbed(index);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition duration-200 ${selectedEmbed === index ? "bg-blue-500 text-white font-semibold" : "text-gray-300"}`}
                  >
                    {source.name} {selectedEmbed === index && "✓"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchMoviePage;
