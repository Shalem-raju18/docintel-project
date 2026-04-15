import { Link, useLocation } from "react-router-dom";
import { Book, Search, MessageSquare, LayoutDashboard } from "lucide-react";
import { cn } from "../lib/utils";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Q&A", path: "/qa", icon: MessageSquare },
  ];

  return (
    <nav className="bg-white border-b border-[#1a1a1a]/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Book className="w-8 h-8 text-[#5A5A40]" />
            <span className="text-xl font-serif font-bold tracking-tight">DocIntel</span>
          </div>
          <div className="flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#5A5A40]",
                  location.pathname === item.path ? "text-[#5A5A40]" : "text-[#1a1a1a]/60"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
