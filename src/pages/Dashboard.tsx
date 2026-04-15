import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowRight, Plus, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";

export default function Dashboard() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/api/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setScraping(true);
    try {
      await axios.post("/api/scrape", { url });
      setUrl("");
      fetchBooks();
    } catch (err) {
      console.error(err);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-5xl font-serif font-bold tracking-tight">Library</h1>
        <p className="text-[#1a1a1a]/60 max-w-2xl">
          Collect book data from the web and generate AI-powered insights. 
          Your personal document intelligence platform.
        </p>
      </header>

      <form onSubmit={handleScrape} className="flex gap-4 max-w-2xl">
        <input
          type="url"
          placeholder="Paste book URL (e.g. Goodreads, Amazon...)"
          className="flex-1 bg-white border border-[#1a1a1a]/10 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={scraping}
          className="bg-[#5A5A40] text-white px-8 py-3 rounded-full font-medium hover:bg-[#4A4A30] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Book
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#5A5A40]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-[#1a1a1a]/5 hover:shadow-xl transition-all"
            >
              <div className="aspect-[3/4] bg-[#E4E3E0] relative overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${book.id}/600/800`}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {book.rating}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold group-hover:text-[#5A5A40] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[#1a1a1a]/60">{book.author}</p>
                </div>
                <p className="text-sm line-clamp-2 text-[#1a1a1a]/80">
                  {book.description}
                </p>
                <Link
                  to={`/book/${book.id}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#5A5A40] group/link"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
