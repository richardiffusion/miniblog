import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Calendar, Mail, PenTool, Settings, LogOut, User, Plus, BarChart3, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // 添加这行
import { Button } from "@/components/ui/button"; // 添加这行

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);
  const { isAuthenticated, user, logout, checkAuth } = useAuth(); // 添加这行


    // 添加这个 useEffect 来检查认证状态
  React.useEffect(() => {
    checkAuth();
  }, [location.pathname, checkAuth]); // 当路由变化时检查认证状态

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

  const adminPages = [
    { name: "Dashboard", path: "/admin/dashboard", icon: BarChart3 },
    { name: "New Article", path: "/admin/new-article", icon: Plus },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 返回主站点的函数
  const handleBackToMainSite = () => {
    window.location.href = "https://www.richardiffusion.me";
  };


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
                Richardiffusion Blog
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {/* 返回主站点按钮 - 始终显示 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToMainSite}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-gray-700 hover:bg-green-50 hover:text-green-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Main Site</span>
              </Button>

              {/* 公开页面 */}
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

              {/* 管理员菜单 - 仅在登录时显示 */}
              {isAuthenticated && adminPages.map((page) => (
                <Link
                  key={page.name}
                  to={page.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(page.path)
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "text-gray-700 hover:bg-purple-50"
                  }`}
                >
                  <page.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{page.name}</span>
                </Link>
              ))}

              {/* 登录/退出按钮 */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <User className="w-3 h-3" />
                    <span className="hidden sm:inline">{user?.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-gray-700 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                // 只有在非管理页面显示登录链接
                !location.pathname.startsWith('/admin') && (
                  <Link
                    to="/admin-login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-gray-700 hover:bg-blue-50"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )
              )}
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
                © 2025 Richardiffusion Blog. All rights reserved.
              </span>
              {isAuthenticated && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Admin Mode
                </span>
              )}
            </div>
            <div className="flex gap-4">
              {/* 在页脚也添加返回主站点的链接 */}
              <button
                onClick={handleBackToMainSite}
                className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Main Site
              </button>
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