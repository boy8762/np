'use client';

import React, { useEffect } from 'react';
import EmbedPlayer from '@/components/watch/embed-player';
import { MediaType } from '@/types';

export const revalidate = 3600;

export default function Page({ params }: { params: { slug: string } }) {
  const id = params.slug.split('-').pop();
  const movieId: string | undefined = params.slug.split('/').pop();

  useEffect(() => {
    if (id) {
      const type = movieId?.includes('t') ? MediaType.ANIME : MediaType.MOVIE;
      const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      const newEntry = { id, type, date: new Date().toISOString() };

      const updatedHistory = history.filter((item: any) => item.id !== id);
      updatedHistory.unshift(newEntry);

      localStorage.setItem('watchHistory', JSON.stringify(updatedHistory));
    }
  }, [id, movieId]);

  return (
    <EmbedPlayer
      movieId={movieId}
      mediaType={movieId?.includes('t') ? MediaType.ANIME : undefined}
      url={`https://vidsrc.cc/v2/embed/anime/tmdb${id}/1/sub?autoPlay=false`}
    />
  );
}
