{downloadLinks.map((url, i) => (
  <a
    key={i}
    href={url}
    download
    className="bg-secondary text-white rounded px-3 py-1 m-2 inline-block"
  >
    Download (Server {i + 1})
  </a>
))}
