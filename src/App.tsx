import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BookDetail from "./pages/BookDetail";
import QAInterface from "./pages/QAInterface";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/qa" element={<QAInterface />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
