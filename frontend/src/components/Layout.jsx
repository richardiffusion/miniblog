import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Calendar, Mail, PenTool } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const publicPages = [
    { name: "Home", path: createPageUrl("Home"), icon: Home },
    { name: "Calendar", path: createPageUrl("Calendar"), icon: Calendar },
    { name: "Contact", path: createPageUrl("Contact"), icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      <style>{`
        :root {
          --primary: 217 91% 60%;
          --primary-hover: 217 91% 55%;
          --accent: 199 89% 48%;
          --background: 210 100% 97%;
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                My Blog
              </span>
            </Link>

            {/* Navigation Links - 只显示公开页面 */}
            <div className="flex items-center gap-1">
              {publicPages.map((page) => (
                <Link
                  key={page.name}
                  to={page.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(page.path)
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <page.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{page.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-blue-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600">
                © 2024 My Blog. Share your thoughts with the world.
              </span>
            </div>
            <div className="flex gap-4">
              {publicPages.map((page) => (
                <Link
                  key={page.name}
                  to={page.path}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}