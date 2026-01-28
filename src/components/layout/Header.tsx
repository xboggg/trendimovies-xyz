"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Film,
  Tv,
  LayoutGrid,
  Newspaper,
  Compass,
  User,
  Bookmark,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { SearchModal } from "./SearchModal";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Check if user is logged in
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch(() => {
        // User not logged in
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUserMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getIcon = (label: string) => {
    switch (label) {
      case "Movies":
        return <Film className="w-4 h-4" />;
      case "TV Shows":
        return <Tv className="w-4 h-4" />;
      case "Genres":
        return <LayoutGrid className="w-4 h-4" />;
      case "News":
        return <Newspaper className="w-4 h-4" />;
      case "Discover":
        return <Compass className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800"
            : "bg-gradient-to-b from-black/80 to-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl md:text-2xl font-bold"
            >
              <span className="text-red-600">Trendi</span>
              <span className="text-white">Movies</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {MAIN_NAV.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname.startsWith(item.href)
                        ? "text-red-500"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                    )}
                  >
                    {getIcon(item.label)}
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          openDropdown === item.label && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.children && openDropdown === item.label && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 min-w-[180px] shadow-xl">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-zinc-300 hover:text-white"
              >
                <Search className="w-5 h-5" />
              </Button>

              <Link href="/watchlist" className="hidden md:block">
                <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
                  <Bookmark className="w-5 h-5" />
                </Button>
              </Link>

              {user ? (
                <div className="hidden md:block relative">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="gap-2"
                  >
                    <User className="w-4 h-4" />
                    {user.name}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", userMenuOpen && "rotate-180")} />
                  </Button>

                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-xl z-50">
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden md:block">
                  <Button variant="secondary" size="sm">
                    <User className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-zinc-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div
        className={cn(
          "lg:hidden fixed top-0 right-0 z-50 h-full w-[280px] max-w-[80vw] bg-zinc-950 border-l border-zinc-800 transform transition-transform duration-300 ease-in-out overflow-y-auto",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <span className="text-lg font-bold">
            <span className="text-red-600">Trendi</span>
            <span className="text-white">Movies</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <nav className="p-4 space-y-1 pb-24">
          {MAIN_NAV.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setMobileExpandedMenu(mobileExpandedMenu === item.label ? null : item.label)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      pathname.startsWith(item.href)
                        ? "text-red-500 bg-red-500/10"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {getIcon(item.label)}
                      {item.label}
                    </span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        mobileExpandedMenu === item.label && "rotate-90"
                      )}
                    />
                  </button>
                  {mobileExpandedMenu === item.label && (
                    <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-red-400 hover:text-white transition-colors"
                      >
                        View All {item.label}
                      </Link>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    pathname.startsWith(item.href)
                      ? "text-red-500 bg-red-500/10"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  {getIcon(item.label)}
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <div className="border-t border-zinc-800 pt-4 mt-4 space-y-2">
            <Link
              href="/watchlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <Bookmark className="w-5 h-5" />
              Watchlist
            </Link>

            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800"
                  >
                    <Settings className="w-5 h-5" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out ({user.name})
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <User className="w-5 h-5" />
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
