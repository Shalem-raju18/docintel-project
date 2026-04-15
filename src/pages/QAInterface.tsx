import React, { useState } from "react";
import { Send, Bot, User, Loader2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import axios from "axios";

export default function QAInterface() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([
    { role: "bot", content: "Hello! I'm your Book Intelligence Assistant. Ask me anything about the books in your library." }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: "user", content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("/api/qa", { query });
      const botMsg = { 
        role: "bot", 
        content: res.data.content,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, I encountered an error while processing your request." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight">Intelligent Q&A</h1>
        <p className="text-[#1a1a1a]/60">Ask questions across your entire book collection</p>
      </header>

      <div className="flex-1 bg-white rounded-3xl border border-[#1a1a1a]/10 overflow-hidden flex flex-col shadow-sm">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[80%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === "user" ? "bg-[#5A5A40] text-white" : "bg-[#f5f5f0] text-[#5A5A40]"
                )}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user" ? "bg-[#5A5A40] text-white" : "bg-[#f5f5f0]"
                )}>
                  {msg.content}
                  {msg.citation && (
                    <div className="mt-2 pt-2 border-t border-[#1a1a1a]/10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                      <BookOpen className="w-3 h-3" />
                      Source: {msg.citation}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#f5f5f0] flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-[#5A5A40]" />
              </div>
              <div className="bg-[#f5f5f0] p-4 rounded-2xl text-sm italic text-[#1a1a1a]/40">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-[#1a1a1a]/10 bg-[#f5f5f0]/30">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask a question about your books..."
              className="w-full bg-white border border-[#1a1a1a]/10 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-[#5A5A40] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#4A4A30] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
