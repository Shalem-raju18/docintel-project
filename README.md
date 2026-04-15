# DocIntel: Document Intelligence Platform

A full-stack web application with AI/RAG integration for processing book data and intelligent querying.

## Features
- **Automated Book Scraping**: Collect metadata from book URLs.
- **AI Insights**: Automatically generate summaries, genre predictions, sentiment analysis, and recommendations using Gemini AI.
- **Intelligent Q&A (RAG)**: Ask questions across your entire book collection with contextual answers.
- **Modern UI**: Polished dashboard and detail pages built with React, Tailwind CSS, and Motion.

## Tech Stack
- **Frontend**: ReactJS, Tailwind CSS, Motion, Lucide Icons.
- **Backend**: Node.js (Express), Gemini AI API.
- **Database**: In-memory storage (can be easily extended to Firestore).
- **AI**: Google Gemini 1.5 Flash.

## Setup Instructions
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set your `GEMINI_API_KEY` in the environment.
4. Run the development server: `npm run dev`.

## API Documentation
- `GET /api/books`: List all processed books.
- `GET /api/books/:id`: Get details for a specific book.
- `POST /api/scrape`: Scrape a book from a URL and generate AI insights.
- `POST /api/qa`: Ask a question about the book collection.

## Sample Q&A
**Q**: "What are the common themes in my library?"
**A**: "Based on your collection, common themes include the pursuit of the American Dream (The Great Gatsby), survival and human ingenuity (Project Hail Mary), and psychological trauma (The Silent Patient)."
