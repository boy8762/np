useEffect(() => {
  const interval = setInterval(() => fetchDownloadLinksAgain(), 1000 * 60 * 60 * 12);
  return () => clearInterval(interval);
}, []);
