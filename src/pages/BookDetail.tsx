import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Quote, Sparkles, Brain, Heart, Tag } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";
import { cn } from "../lib/utils";

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const getSentimentColor = (sentiment: string) => {
    const s = sentiment.toLowerCase();
    if (s.includes("optimistic") || s.includes("positive") || s.includes("happy")) return "bg-green-50 text-green-700";
    if (s.includes("melancholic") || s.includes("sad") || s.includes("somber")) return "bg-blue-50 text-blue-700";
    if (s.includes("tense") || s.includes("dark") || s.includes("thrilling")) return "bg-red-50 text-red-700";
    return "bg-gray-50 text-gray-700";
  };

  return (
    <div className="space-y-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a]">
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src={`https://picsum.photos/seed/${book.id}/800/1200`}
              alt={book.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-[#5A5A40]/10 text-[#5A5A40] rounded-full text-xs font-bold uppercase tracking-wider">
                {book.genre}
              </span>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {book.rating} ({book.reviews} reviews)
              </div>
            </div>
            <h1 className="text-6xl font-serif font-bold tracking-tight">{book.title}</h1>
            <p className="text-2xl text-[#1a1a1a]/60">by {book.author}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InsightCard
              icon={Sparkles}
              title="AI Summary"
              content={book.summary}
              color="bg-purple-50"
            />
            <InsightCard
              icon={Brain}
              title="Genre Analysis"
              content={`Predicted Genre: ${book.genre}. This book explores themes of ${book.genre.toLowerCase()} and human experience.`}
              color="bg-blue-50"
            />
            <InsightCard
              icon={Heart}
              title="Sentiment"
              content={`The tone is ${book.sentiment}.`}
              color={getSentimentColor(book.sentiment)}
            />
            <InsightCard
              icon={Tag}
              title="Recommendations"
              content={book.recommendation}
              color="bg-green-50"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold flex items-center gap-2">
              <Quote className="w-5 h-5 text-[#5A5A40]" />
              Description
            </h3>
            <p className="text-lg leading-relaxed text-[#1a1a1a]/80">
              {book.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, content, color }: any) {
  return (
    <div className={cn("p-6 rounded-3xl space-y-3", color)}>
      <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider opacity-60">
        <Icon className="w-4 h-4" />
        {title}
      </div>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}
