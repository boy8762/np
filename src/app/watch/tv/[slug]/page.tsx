"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/main/site-header";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;

interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
}

interface Season {
  season_number: number;
  name: string;
  episodes: Episode[];
}

const WatchPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params?.slug;
  const season = searchParams.get("s") || "1";
  const episode = searchParams.get("ep") || "1";

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [showName, setShowName] = useState<string | null>(null);
  const [backdropUrl, setBackdropUrl] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(Number(season));
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEmbed, setSelectedEmbed] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [autoNext, setAutoNext] = useState<boolean>(false);


  

  useEffect(() => {
    if (!searchParams.has("s") || !searchParams.has("ep")) {
      router.replace(`/watch/tv/${id}?s=${season}&ep=${episode}`);
    }
  }, [searchParams, router, id, season, episode]);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        setShowName(data.name);
        setBackdropUrl(data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null);

        const seasonDetails = await Promise.all(
          data.seasons.map(async (season: any) => {
            const seasonResponse = await fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}?api_key=${TMDB_API_KEY}`
            );
            const seasonData = await seasonResponse.json();
            const episodes = seasonData.episodes.map((ep: any) => ({
              id: ep.episode_number,
              name: ep.name,
              overview: ep.overview,
              still_path: `https://image.tmdb.org/t/p/w300${ep.still_path}`,
            }));
            return {
              season_number: season.season_number,
              name: season.name,
              episodes,
            };
          })
        );

        setSeasons(seasonDetails);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch seasons: ", error);
        setLoading(false);
      }
    };

    fetchSeasons();
  }, [id]);

  useEffect(() => {
    if (seasons.length > 0) {
      const seasonData = seasons.find((s) => s.season_number === selectedSeason);
      if (seasonData) {
        const episodeData = seasonData.episodes.find((ep) => ep.id === Number(episode));
        setSelectedEpisode(episodeData || null);
      }
    }
  }, [seasons, selectedSeason, episode]);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeason = Number(e.target.value);
    setSelectedSeason(newSeason);
    router.push(`/watch/tv/${id}?s=${newSeason}&ep=1`); // Reset to episode 1 when season changes
  };

  const handleEpisodeClick = (ep: Episode) => {
    setSelectedEpisode(ep);
    router.push(`/watch/tv/${id}?s=${selectedSeason}&ep=${ep.id}`);
  };

  const toggleAutoNext = () => {
    setAutoNext(!autoNext);
  };

  const saveToWatchHistory = (id: string, season: number, episode: number) => {
    try {
      const currentHistory = JSON.parse(localStorage.getItem("watchHistory") || "[]");
      const newEntry = { id, type: "tv", season, episode, timestamp: Date.now() };
  
      // Ensure unique entries (same id, season, episode won't duplicate)
      const updatedHistory = [
        newEntry,
        ...currentHistory.filter(
          (item: { id: string; season: number; episode: number }) =>
            !(item.id === id && item.season === season && item.episode === episode)
        ),
      ];
  
      // Keep only the latest 50 entries
      localStorage.setItem("watchHistory", JSON.stringify(updatedHistory.slice(0, 50)));
    } catch (error) {
      console.error("Error saving to watch history:", error);
    }
  };
  
  useEffect(() => {
    if (id && selectedSeason && selectedEpisode?.id) {
      saveToWatchHistory(id, selectedSeason, selectedEpisode.id);
    }
  }, [id, selectedSeason, selectedEpisode]);
  

  const handleVideoEnd = () => {
    if (autoNext) {
      const currentSeason = seasons.find((s) => s.season_number === selectedSeason);
      if (currentSeason) {
        const currentEpisodeIndex = currentSeason.episodes.findIndex(
          (ep) => ep.id === Number(episode)
        );
        if (currentEpisodeIndex < currentSeason.episodes.length - 1) {
          const nextEpisode = currentSeason.episodes[currentEpisodeIndex + 1];
          setSelectedEpisode(nextEpisode);
          router.push(`/watch/tv/${id}?s=${selectedSeason}&ep=${nextEpisode.id}`);
        } else if (selectedSeason < seasons.length) {
          // If it's the last episode of the season, move to the next season
          const nextSeason = seasons[selectedSeason];
          if (nextSeason && nextSeason.episodes.length > 0) {
            setSelectedSeason(nextSeason.season_number);
            setSelectedEpisode(nextSeason.episodes[0]);
            router.push(`/watch/tv/${id}?s=${nextSeason.season_number}&ep=${nextSeason.episodes[0].id}`);
          }
        }
      }
    }
  };

  // List of embed API providers with custom names
  const embedSources = [
    { name: "Netprime Server 1 { Multi }", url: `https://vidzee.wtf/tv/multi.php?id=${id}/${selectedSeason}/${episode}` },
    { name: "Netprime Server 1 {Anime} { Multi }", url: `https://api.flixindia.site/anime/${id}/${selectedSeason}/${episode}` },
    { name: "Netprime Server 2 {Og}", url: `https://vidzee.wtf/tv/?id=${id}/${selectedSeason}/${episode}` },
    { name: "Netprime Server 3", url: `https://vidlink.pro/tv/${id}/${selectedSeason}/${episode}` },
    { name: "Netprime Server 4", url: `https://111movies.com/tv/${id}/${selectedSeason}/${episode}` },
    { name: "Netprime Server 5", url: `https://player.videasy.net/tv/${id}/${selectedSeason}/${episode}` },
    { name: "Netprime Server 6", url: `https://vidsrc.dev/embed/tv/${id}/${selectedSeason}/${episode}` },
    { name: "Netprime Server 7", url: `https://rivestream.live/embed?type=tv&id=${id}&season=${selectedSeason}&episode=${episode}` },
    { name:  "Netprime Server 8", url: `https://embed.su/embed/tv/${id}/${selectedSeason}/${episode}` },
    { name: "Netprime Server 9", url: `https://player.smashy.stream/tv/${id}?s=${selectedSeason}&e=${episode}` },
    { name: "Netprime Server 10", url: `https://vidsrc.cc/v2/embed/tv/${id}/${selectedSeason}/${episode}` },
    { name: "Netprime Server 11", url: `https://vidsrc.me/embed/tv/${id}/${selectedSeason}/${episode}` },
    { name: "Netprime Server 12", url: `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${episode}` },
    { name: "Netprime Server 13", url: `https://2embed.cc/embed/${id}&s=${selectedSeason}&e=${episode}` }
  ];

  return (
    <>
      <SiteHeader />
      {backdropUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-md opacity-60"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}

      <div className="relative flex flex-col md:flex-row w-full h-screen text-white">
        <div className="flex-grow flex flex-col items-center relative z-10">
          {/* Video Player */}
          <div className="w-full mt-9 max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={embedSources[selectedEmbed].url}
              title="Video Player"
              allowFullScreen
              className="w-full h-full border-none"
              onEnded={handleVideoEnd}
            ></iframe>
          </div>

          {/* Embed Source Dropdown */}
          <div className="mt-4 relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 text-sm rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            >
              {embedSources[selectedEmbed].name} (Selected)
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

          {/* Auto-Next Toggle Button */}
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={toggleAutoNext}
              className={`px-4 py-2 text-sm rounded-md ${
                autoNext ? "bg-green-500" : "bg-gray-700"
              } text-white focus:outline-none focus:ring focus:ring-blue-500`}
            >
              {autoNext ? "Auto-Next: ON" : "Auto-Next: OFF"}
            </button>
          </div>

          {/* Show and Episode Info */}
          <div className="w-full max-w-4xl p-4">
            <h1 className="text-xl font-bold mb-2">{loading ? "Loading..." : showName}</h1>
            {selectedEpisode && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold">{selectedEpisode.name}</h2>
                <p className="text-sm text-gray-400">{selectedEpisode.overview}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (Seasons and Episodes) */}
        <div className="w-full md:w-72 bg-gray-800/40 backdrop-blur-lg border border-gray-500/30 rounded-lg shadow-lg overflow-y-auto relative z-10 p-4">
          <h2 className="text-lg font-bold mb-4">Seasons</h2>
          <select
            value={selectedSeason}
            onChange={handleSeasonChange}
            className="w-full p-2 bg-gray-700 rounded-md mb-4"
          >
            {seasons.map((season) => (
              <option key={season.season_number} value={season.season_number}>
                {season.name}
              </option>
            ))}
          </select>

          <div className="space-y-4">
            {seasons
              .find((s) => s.season_number === selectedSeason)
              ?.episodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => handleEpisodeClick(ep)}
                  className={`flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md ${
                    ep.id === Number(episode) ? "bg-gray-700" : ""
                  }`}
                >
                  <img
                    src={ep.still_path}
                    alt={ep.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{ep.name}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{ep.overview}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchPage;
