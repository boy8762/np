import Hero from '@/components/hero';
import ShowsContainer from '@/components/shows-container';
import { MediaType, type Show } from '@/types';
import { siteConfig } from '@/configs/site';
import { RequestType, type ShowRequest } from '@/enums/request-type';
import MovieService from '@/services/MovieService';
import { Genre } from '@/enums/genre';
import { getRandomShow } from '@/lib/utils';

export const revalidate = 3600;

export default async function Home() {
  const h1 = `${siteConfig.name} Home`;
 const requests: ShowRequest[] = [
  // Existing requests
  {
    title: 'Trending Now',
    req: { requestType: RequestType.TRENDING, mediaType: MediaType.ALL },
    visible: true,
  },
  {
    title: 'Netflix TV Shows',
    req: { requestType: RequestType.NETFLIX, mediaType: MediaType.TV },
    visible: true,
  },
  {
    title: 'Popular TV Shows',
    req: {
      requestType: RequestType.TOP_RATED,
      mediaType: MediaType.TV,
      genre: Genre.TV_MOVIE,
    },
    visible: true,
  },
  {
    title: 'Korean Movies',
    req: {
      requestType: RequestType.KOREAN,
      mediaType: MediaType.MOVIE,
      genre: Genre.THRILLER,
    },
    visible: true,
  },
  {
    title: 'Comedy Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.COMEDY,
    },
    visible: true,
  },
  {
    title: 'Action Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.ACTION,
    },
    visible: true,
  },
  {
    title: 'Romance Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.ROMANCE,
    },
    visible: true,
  },
  {
    title: 'Scary Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.THRILLER,
    },
    visible: true,
  },
  // New sections
  {
    title: 'Adventure Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.ADVENTURE,
    },
    visible: true,
  },
  {
    title: 'Fantasy Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.FANTASY,
    },
    visible: true,
  },
  {
    title: 'History Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.HISTORY,
    },
    visible: true,
  },
  {
    title: 'Music Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.MUSIC,
    },
    visible: true,
  },
  {
    title: 'Mystery Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.MYSTERY,
    },
    visible: true,
  },
  {
    title: 'War Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.WAR,
    },
    visible: true,
  },
  {
    title: 'Western Movies',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.MOVIE,
      genre: Genre.WESTERN,
    },
    visible: true,
  },
  {
    title: 'Action & Adventure TV Shows',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.TV,
      genre: Genre.ACTION_ADVENTURE,
    },
    visible: true,
  },
  {
    title: 'Kids TV Shows',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.TV,
      genre: Genre.KIDS,
    },
    visible: true,
  },
  {
    title: 'Sci-Fi & Fantasy TV Shows',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.TV,
      genre: Genre.SCIFI_FANTASY,
    },
    visible: true,
  },
  {
    title: 'Soap TV Shows',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.TV,
      genre: Genre.SOAP,
    },
    visible: true,
  },
  {
    title: 'War & Politics TV Shows',
    req: {
      requestType: RequestType.GENRE,
      mediaType: MediaType.TV,
      genre: Genre.WAR_POLITICS,
    },
    visible: true,
  },
];
  const allShows = await MovieService.getShows(requests);
  const randomShow: Show | null = getRandomShow(allShows);
  return (
    <>
      <h1 className="hidden">{h1}</h1>
      <Hero randomShow={randomShow} />
      
      <ShowsContainer shows={allShows} />
    </>
  );
}
