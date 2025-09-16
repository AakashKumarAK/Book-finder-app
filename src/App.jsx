import React, { useState } from "react";
import { searchBooks, coverUrl } from "./api";

function SearchBar({ onSearch, loading }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  function submit(e) {
    e.preventDefault();
    onSearch({ title, author, page: 1 });
  }

  return (
    <form onSubmit={submit} className="flex gap-4 items-center">
      <input
        className="flex-1 p-2 rounded border"
        placeholder="Search by title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-48 p-2 pl-2 rounded border"
        placeholder="Author (optional)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

function BookCard({ book }) {
  const img = coverUrl(book.cover_i);
  const authors = book.author_name?.join(", ") || "Unknown";
  return (
    <article className="flex gap-4 p-3 border rounded hover:shadow-sm">
      <div className="w-24 h-32 bg-gray-100 flex-shrink-0">
        {img ? (
          <img
            src={img}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
            No cover
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-600">{authors}</p>
        <p className="text-sm text-gray-500">
          First published: {book.first_publish_year || "—"}
        </p>
      </div>
    </article>
  );
}

export default function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState({ title: "", author: "", page: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function runSearch({ title, author, page }) {
    setLoading(true);
    setError(null);
    try {
      const data = await searchBooks({ title, author, page });
      setResults(data.docs || []);
      setQuery({ title, author, page });
    } catch {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-extrabold mb-2">Book Finder</h1>
        <p className="text-sm text-gray-600 mb-4">
          Search books quickly using Open Library.
        </p>
        <SearchBar onSearch={runSearch} loading={loading} />
      </header>

      <main className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {loading && <div>Loading...</div>}
        {!loading && results.length === 0 && query.title && (
          <div className="text-gray-600">No results found.</div>
        )}
        <section className="grid gap-3">
          {results.map((doc) => (
            <BookCard key={`${doc.key}-${doc.cover_i}`} book={doc} />
          ))}
        </section>
      </main>
    </div>
  );
}
