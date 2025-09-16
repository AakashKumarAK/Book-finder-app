const CACHE = new Map();

export async function searchBooks({ title = "", author = "", page = 1 }) {
  if (!title.trim()) return { docs: [] };

  const params = new URLSearchParams();
  params.set("title", title.trim());
  if (author.trim()) params.set("author", author.trim());
  params.set("page", String(page));

  const url = `https://openlibrary.org/search.json?${params.toString()}`;

  if (CACHE.has(url)) return CACHE.get(url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error");
  const data = await res.json();

  CACHE.set(url, data);
  return data;
}

export function coverUrl(cover_i, size = "M") {
  return cover_i
    ? `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg`
    : null;
}
