import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Book Data
  let books: any[] = [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      rating: 4.4,
      reviews: 1200,
      description: "A story of wealth, love, and the American Dream in the 1920s.",
      url: "https://example.com/gatsby",
      genre: "Classic",
      summary: "Jay Gatsby's quest for Daisy Buchanan in a world of excess.",
      sentiment: "Melancholic",
      recommendation: "The Sun Also Rises by Ernest Hemingway"
    },
    {
      id: "2",
      title: "Project Hail Mary",
      author: "Andy Weir",
      rating: 4.7,
      reviews: 8500,
      description: "A lone astronaut must save the earth from an extinction-level threat.",
      url: "https://example.com/hail-mary",
      genre: "Sci-Fi",
      summary: "Ryland Grace wakes up on a spaceship with no memory and a mission to save humanity.",
      sentiment: "Optimistic",
      recommendation: "The Martian by Andy Weir"
    },
    {
      id: "3",
      title: "The Silent Patient",
      author: "Alex Michaelides",
      rating: 4.2,
      reviews: 5400,
      description: "A woman shoots her husband five times in the face, and then never speaks another word.",
      url: "https://example.com/silent-patient",
      genre: "Thriller",
      summary: "A criminal psychotherapist becomes obsessed with uncovering the motive of a silent murderer.",
      sentiment: "Tense",
      recommendation: "Gone Girl by Gillian Flynn"
    }
  ];

  app.get("/api/books", (req, res) => {
    res.json(books);
  });

  app.get("/api/books/:id", (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (book) res.json(book);
    else res.status(404).json({ error: "Book not found" });
  });

  app.post("/api/scrape", async (req, res) => {
    const { url } = req.body;
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      const title = $("h1").first().text().trim() || "Unknown Title";
      const author = $("a[href*='author']").first().text().trim() || "Unknown Author";
      const description = $("meta[name='description']").attr("content") || $("p").first().text().trim();

      // Generate AI Insights
      const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-latest",
        contents: `Analyze this book description and provide: 
        1. A short summary (2 sentences)
        2. Predicted Genre
        3. Sentiment Analysis of the description
        4. A recommendation (If you like this, you'll like...)
        
        Description: ${description}
        
        Return ONLY a JSON object with these keys: "summary", "genre", "sentiment", "recommendation"`
      });

      let insights = {};
      try {
        const text = aiResponse.text || "{}";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        insights = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      } catch (e) {
        console.error("Failed to parse AI response:", aiResponse.text);
      }

      const newBook = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        author,
        rating: 4.0,
        reviews: 0,
        description,
        url,
        ...insights
      };

      books.push(newBook);
      res.json(newBook);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to scrape book or generate insights" });
    }
  });

  app.post("/api/qa", async (req, res) => {
    const { query } = req.body;
    try {
      const context = books.map(b => `Title: ${b.title}\nAuthor: ${b.author}\nDescription: ${b.description}`).join("\n\n");
      
      const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-latest",
        contents: `You are a Book Intelligence Assistant. Use the following book collection as context to answer the user's question. If you don't know the answer, say you don't know. Provide citations if possible.
        
        Context:
        ${context}
        
        Question: ${query}`
      });

      res.json({ content: aiResponse.text });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate answer" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
