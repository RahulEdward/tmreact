"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
  Key,
  FileText,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: Activity },
  { name: "TradingView", href: "/dashboard/tradingview", icon: Zap },
  { name: "API Keys", href: "/dashboard/apikeys", icon: Key },
  { name: "Logs", href: "/dashboard/logs", icon: FileText },
  { name: "Add Broker", href: "/dashboard/brokers", icon: Building2 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check session with backend instead of localStorage
    const checkSession = async () => {
      try {
        // First check localStorage for auth data
        if (typeof window !== 'undefined') {
          const authUser = localStorage.getItem('auth_user');
          if (authUser) {
            console.log("Dashboard: Found auth data in localStorage");
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback to session cookie check
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        console.log("Dashboard: Checking session at:", `${apiUrl}/auth/new/session`);
        
        const response = await fetch(`${apiUrl}/auth/new/session`, {
          method: "GET",
          credentials: "include", // Important for session cookies
        });
        
        const data = await response.json();
        console.log("Dashboard: Session check response:", data);
        
        if (data.authenticated) {
          console.log("Dashboard: User authenticated via session, showing dashboard");
          setIsAuthenticated(true);
        } else {
          console.log("Dashboard: User not authenticated, redirecting to login");
          router.push("/new-login");
        }
      } catch (error) {
        console.error("Dashboard: Session check failed:", error);
        router.push("/new-login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const handleLogout = async () => {
    try {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_session');
        localStorage.removeItem('auth_token');
      }
      
      // Call backend logout
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${apiUrl}/auth/new/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    router.push("/new-login");
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full ${
          isSidebarMinimized ? "w-16" : "w-64"
        } bg-slate-900 border-r border-slate-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              {!isSidebarMinimized && (
                <span className="text-lg font-bold text-white">TradingBridge</span>
              )}
            </Link>
            <div className="flex items-center space-x-2">
              {/* Minimize/Expand Toggle */}
              <button
                onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
                className="hidden lg:block text-slate-400 hover:text-white transition-colors"
                title={isSidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
              >
                {isSidebarMinimized ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
              {/* Mobile close button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${
                  isSidebarMinimized ? "justify-center px-3" : "space-x-3 px-3"
                } py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200`}
                title={isSidebarMinimized ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isSidebarMinimized && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className={`flex items-center ${
                isSidebarMinimized ? "justify-center px-3" : "space-x-3 px-3"
              } w-full py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200`}
              title={isSidebarMinimized ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isSidebarMinimized && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${
        isSidebarMinimized ? "lg:pl-16" : "lg:pl-64"
      }`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              {/* Notifications, user menu, etc. can go here */}
              <div className="text-sm text-slate-400">
                Welcome back!
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
