import { useState, useEffect, type ReactNode } from "react";
import { cn } from "./utils/cn";
import { AuthProvider, useAuth } from "./AuthContext";
import { RouterProvider, useRouter } from "./RouterContext";
import { ShipmentsProvider } from "./ShipmentsContext";
import AdminDashboard from "./AdminDashboard";
import SignIn from "./pages/SignIn";
import UserDashboard from "./pages/UserDashboard";

// ─── Types ───────────────────────────────────────────
interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

// ─── Icons (inline SVG components) ───────────────────
const Icons = {
  gift: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  ),
  pin: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  ),
  map: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  globe: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  heart: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  truck: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  camera: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  star: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  menu: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  sparkles: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
      <line x1="19" y1="17" x2="19" y2="21" />
      <line x1="17" y1="19" x2="21" y2="19" />
      <line x1="3" y1="17" x2="3" y2="21" />
      <line x1="1" y1="19" x2="5" y2="19" />
    </svg>
  ),
  qr: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="4" height="4" />
    </svg>
  ),
  phone: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  mail: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  whatsapp: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  box: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  plane: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  music: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  video: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  leaf: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  ai: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4c0 2-2 3-2 5h-4c0-2-2-3-2-5a4 4 0 0 1 4-4z" />
      <path d="M9 14h6" />
      <path d="M9 18h6" />
      <path d="M12 14v8" />
    </svg>
  ),
  robot: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  ),
  crown: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M3 20h18" />
    </svg>
  ),
  shopping: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  flash: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  smile: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  lock: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  wallet: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  ),
  trending: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  puzzle: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
      <path d="M7 3v2c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V3" />
      <path d="M10 11h4" />
      <path d="M12 9v4" />
    </svg>
  ),
  location: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  route: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 9v6a3 3 0 0 0 3 3h3" />
      <path d="M18 15V9a3 3 0 0 0-3-3h-3" />
    </svg>
  ),
  barChart: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  layers: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  database: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  activity: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

// ─── Navigation ─────────────────────────────────────
const NavLink = ({ href, children, className }: NavLinkProps) => (
  <a
    href={href}
    className={cn(
      "text-sm font-medium text-gray-600 hover:text-gift-600 transition-colors duration-200 relative group",
      className
    )}
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gift-500 to-pin-500 transition-all duration-300 group-hover:w-full" />
  </a>
);

const Navbar = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const { navigate } = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center shadow-lg shadow-gift-200 group-hover:shadow-gift-300 transition-all duration-300">
              <span className="text-white font-bold text-lg">{Icons.gift}</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gift-600 to-pin-600 bg-clip-text text-transparent">
              GiftPin
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#tracking">Track</NavLink>
            <NavLink href="#marketplace">Marketplace</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gift-50 to-pin-50 border border-gift-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {user?.avatar || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name?.split(" ")[0] || "User"}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium uppercase text-gift-600 bg-gift-50 px-2 py-0.5 rounded">{user?.role}</span>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        My Dashboard
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50 pt-3"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="text-sm font-medium text-gray-600 hover:text-gift-600 transition-colors px-4 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-sm font-semibold text-white bg-gradient-to-r from-gift-500 to-pin-600 rounded-full px-6 py-2.5 shadow-lg shadow-gift-200 hover:shadow-xl hover:shadow-gift-300 hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? Icons.close : Icons.menu}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="px-4 py-6 space-y-4">
            <a href="#how-it-works" className="block text-sm font-medium text-gray-600 hover:text-gift-600 py-2" onClick={() => setOpen(false)}>How It Works</a>
            <a href="#features" className="block text-sm font-medium text-gray-600 hover:text-gift-600 py-2" onClick={() => setOpen(false)}>Features</a>
            <a href="#tracking" className="block text-sm font-medium text-gray-600 hover:text-gift-600 py-2" onClick={() => setOpen(false)}>Track</a>
            <a href="#marketplace" className="block text-sm font-medium text-gray-600 hover:text-gift-600 py-2" onClick={() => setOpen(false)}>Marketplace</a>
            <a href="#pricing" className="block text-sm font-medium text-gray-600 hover:text-gift-600 py-2" onClick={() => setOpen(false)}>Pricing</a>
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="w-full text-sm font-medium text-red-500 border border-red-200 rounded-full px-6 py-2.5 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { navigate("/signin"); setOpen(false); }}
                    className="w-full text-sm font-medium text-gray-600 border border-gray-200 rounded-full px-6 py-2.5 hover:border-gift-300 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { navigate("/signup"); setOpen(false); }}
                    className="w-full text-sm font-semibold text-white bg-gradient-to-r from-gift-500 to-pin-600 rounded-full px-6 py-2.5 shadow-lg"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// ─── Hero Section ────────────────────────────────────

const HeroSection = () => {
  const { navigate } = useRouter();
  const [pinInput, setPinInput] = useState("");
  const [trackingStatus, setTrackingStatus] = useState<"idle" | "tracking">("idle");

  const handleTrack = () => {
    if (pinInput.length >= 4) {
      setTrackingStatus("tracking");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white via-gift-50/30 to-white">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gift-200/30 to-pin-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-pin-200/20 to-gift-200/30 blur-3xl" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-gift-100/10 to-pin-100/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gift-100 to-pin-100 border border-gift-200/50 animate-fade-in">
              {Icons.sparkles}
              <span className="text-sm font-medium bg-gradient-to-r from-gift-700 to-pin-700 bg-clip-text text-transparent">
                Global Gift Shipping Platform
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1]">
                <span className="text-gray-900">Send gifts</span>
                <br />
                <span className="bg-gradient-to-r from-gift-500 via-pin-500 to-gift-600 bg-clip-text text-transparent">
                  anywhere.
                </span>
                <br />
                <span className="text-gray-900">Track every</span>
                <span className="bg-gradient-to-r from-pin-500 to-gift-500 bg-clip-text text-transparent"> moment.</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 max-w-lg leading-relaxed animate-fade-in stagger-2">
                The world's first emotional gifting platform. Send gifts globally with
                PIN-based tracking, real-time journey stories, and surprise reveals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-in stagger-3">
              <button
                onClick={() => navigate("/signup")}
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-gift-500 to-pin-600 text-white font-semibold rounded-full px-8 py-4 text-lg shadow-xl shadow-gift-200 hover:shadow-2xl hover:shadow-gift-300 hover:scale-105 transition-all duration-300"
              >
                Send a Gift Now
                <span className="group-hover:translate-x-1 transition-transform">{Icons.arrowRight}</span>
              </button>
              <a href="#how-it-works" className="inline-flex items-center gap-2 text-gray-700 font-semibold rounded-full px-8 py-4 text-lg border-2 border-gray-200 hover:border-gift-300 hover:text-gift-600 hover:bg-gift-50/50 transition-all duration-300">
                {Icons.heart}
                How It Works
              </a>
            </div>

            {/* PIN Tracker */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-6 max-w-md animate-fade-in stagger-4">
              <div className="flex items-center gap-2 mb-3">
                {Icons.pin}
                <span className="text-sm font-semibold text-gray-700">Track Your Gift</span>
              </div>
              {trackingStatus === "idle" ? (
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter Gift PIN (e.g., GP-8472-9184)"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gift-400 focus:ring-2 focus:ring-gift-100 outline-none text-sm transition-all"
                    />
                  </div>
                  <button
                    onClick={handleTrack}
                    className="bg-gradient-to-r from-gift-500 to-pin-600 text-white font-semibold rounded-xl px-6 py-3 text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Track
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-gift-50 to-pin-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    {Icons.check}
                    <span className="text-sm font-semibold">Gift Found!</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">PIN: <span className="font-mono font-bold text-gray-800">GP-8472-9184</span></p>
                      <p className="text-xs text-gray-500">Status: <span className="font-semibold text-gift-600">In Transit</span></p>
                    </div>
                    <button
                      onClick={() => setTrackingStatus("idle")}
                      className="text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                      Change
                    </button>
                  </div>
                  {/* Mini progress */}
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-gradient-to-r from-gift-500 to-pin-500 rounded-full animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-400">Estimated delivery: Tomorrow by 2:00 PM</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 animate-fade-in stagger-5">
              <div>
                <p className="text-2xl font-bold text-gray-900">50K+</p>
                <p className="text-xs text-gray-500">Gifts Sent</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">120+</p>
                <p className="text-xs text-gray-500">Countries</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">99%</p>
                <p className="text-xs text-gray-500">Delivered</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:flex justify-center relative">
            <div className="relative">
              {/* Main gift card */}
              <div className="w-[400px] h-[520px] bg-gradient-to-br from-gift-100 via-white to-pin-50 rounded-3xl border border-gray-100 shadow-2xl shadow-gift-100/50 p-8 flex flex-col animate-float">
                {/* Gift icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center shadow-lg mx-auto mb-6">
                  <span className="text-white scale-150">{Icons.gift}</span>
                </div>

                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">A Gift Is On Its Way!</h3>
                <p className="text-sm text-gray-500 text-center mb-6">Track your gift's emotional journey</p>

                {/* PIN display */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 text-center">
                  <p className="text-xs text-gray-400 mb-1">YOUR GIFT PIN</p>
                  <p className="text-2xl font-bold tracking-widest bg-gradient-to-r from-gift-600 to-pin-600 bg-clip-text text-transparent">
                    GP-8472-9184
                  </p>
                </div>

                {/* Timeline preview */}
                <div className="space-y-3 flex-1">
                  {[
                    { emoji: "📦", label: "Packed in London", time: "2 days ago", done: true },
                    { emoji: "🛩️", label: "Crossing the Atlantic", time: "1 day ago", done: true },
                    { emoji: "🌊", label: "Arrived in Lagos", time: "5 hours ago", done: true },
                    { emoji: "🚚", label: "Out for delivery", time: "Soon!", done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                        item.done ? "bg-gift-100 text-gift-600" : "bg-gray-100 text-gray-400"
                      )}>
                        {item.emoji}
                      </div>
                      <div>
                        <p className={cn("text-sm font-medium", item.done ? "text-gray-800" : "text-gray-400")}>
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-400">{item.time}</p>
                      </div>
                      {item.done && <span className="ml-auto text-green-500">{Icons.check}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge 1 */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-3 animate-fade-in stagger-2">
                <div className="flex items-center gap-2">
                  {Icons.star}
                  <span className="text-sm font-semibold text-gray-800">4.9 Rating</span>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-3 animate-fade-in stagger-4">
                <div className="flex items-center gap-2">
                  {Icons.flash}
                  <span className="text-sm font-semibold text-gray-800">Express Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Feature Card ────────────────────────────────────
const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => (
  <div className={cn(
    "group relative bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl hover:shadow-gift-100/30 hover:border-gift-200/50 transition-all duration-500",
    className
  )}>
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gift-100 to-pin-100 flex items-center justify-center text-gift-600 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 mb-5">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
  </div>
);

// ─── Features Section ────────────────────────────────

const features = [
  {
    icon: Icons.pin,
    title: "PIN-Based Tracking",
    description: "Every gift gets a unique PIN. Track your shipment with a simple code — share it with your recipient for total transparency."
  },
  {
    icon: Icons.map,
    title: "Live Map Tracking",
    description: "Watch your gift's journey in real-time on an interactive map. See exactly where your package is at every moment."
  },
  {
    icon: Icons.heart,
    title: "Gift Journey Experience",
    description: "Transform shipping into a story. 'Your gift left London 🇬🇧', 'Crossed the Atlantic 🌊' — emotional updates at every step."
  },
  {
    icon: Icons.video,
    title: "Unboxing Experience",
    description: "Upload a video message, voice note, or digital card. Recipients unlock your personal message after delivery."
  },
  {
    icon: Icons.robot,
    title: "AI Delivery Assistant",
    description: "AI helps estimate costs, recommend couriers, check customs restrictions, and suggest optimal packaging."
  },
  {
    icon: Icons.shield,
    title: "Gift Insurance",
    description: "Optional protection against loss, theft, or damage. File claims directly inside the app with just a few taps."
  },
  {
    icon: Icons.globe,
    title: "Global Shipping",
    description: "Send to 120+ countries. Integrated with DHL, FedEx, UPS, Aramex, and EMS — automatically selects the best option."
  },
  {
    icon: Icons.mail,
    title: "Smart Notifications",
    description: "Get updates via Email, SMS, WhatsApp, and Push notifications. Never miss a delivery milestone."
  },
  {
    icon: Icons.qr,
    title: "Surprise Mode",
    description: "Recipients see 'You have a gift coming' without revealing the sender or gift details until delivery."
  },
  {
    icon: Icons.database,
    title: "Digital Twin Tracking",
    description: "Every shipment has a permanent digital profile with full timeline, documents, and status history."
  },
  {
    icon: Icons.leaf,
    title: "Carbon Neutral Shipping",
    description: "See your shipment's carbon footprint and offset it with eco-friendly options. Ship sustainably."
  },
  {
    icon: Icons.calendar,
    title: "Delivery Date Guarantee",
    description: "Select a special date — birthday, anniversary, Christmas — and we guarantee it arrives on time."
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gift-50/30 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pin-50/30 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gift-100 to-pin-100 border border-gift-200/50 mb-6">
            {Icons.sparkles}
            <span className="text-sm font-medium bg-gradient-to-r from-gift-700 to-pin-700 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Powerful features for
            <span className="bg-gradient-to-r from-gift-500 to-pin-600 bg-clip-text text-transparent"> emotional gifting</span>
          </h2>
          <p className="text-lg text-gray-500">
            We combine logistics, tracking, and emotional engagement into one seamless platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className={`animate-fade-in stagger-${Math.min(i % 6 + 1, 6)}`}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── How It Works Section ────────────────────────────

const steps = [
  {
    number: "01",
    title: "Create Your Gift",
    description: "Choose a gift from our marketplace or register your own personal gift with photos and details.",
    icon: Icons.gift,
    color: "from-gift-500 to-pin-500"
  },
  {
    number: "02",
    title: "Enter Recipient Info",
    description: "Add your recipient's details, delivery instructions, and activate Surprise Mode if you want to keep it secret.",
    icon: Icons.users,
    color: "from-pin-500 to-gift-500"
  },
  {
    number: "03",
    title: "Ship & Get Your PIN",
    description: "We automatically select the best courier, handle customs, and generate a unique Gift PIN for tracking.",
    icon: Icons.pin,
    color: "from-gift-500 to-pin-500"
  },
  {
    number: "04",
    title: "Share the Journey",
    description: "Share the PIN with your recipient. Both of you can track the gift's emotional journey in real-time.",
    icon: Icons.map,
    color: "from-pin-500 to-gift-500"
  },
  {
    number: "05",
    title: "Celebrate Delivery",
    description: "Recipient verifies with OTP, unlocks your video message, and the gift is complete — with memories forever.",
    icon: Icons.smile,
    color: "from-gift-500 to-pin-500"
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-gift-50/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gift-100 to-pin-100 border border-gift-200/50 mb-6">
            {Icons.route}
            <span className="text-sm font-medium bg-gradient-to-r from-gift-700 to-pin-700 bg-clip-text text-transparent">
              Simple 5-Step Process
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How{" "}
            <span className="bg-gradient-to-r from-gift-500 to-pin-600 bg-clip-text text-transparent">
              GiftPin
            </span>{" "}
            Works
          </h2>
          <p className="text-lg text-gray-500">
            Sending a gift across the globe is as easy as 1-2-3. No complicated forms, no hidden fees.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 h-full hover:shadow-xl hover:shadow-gift-100/30 hover:border-gift-200/50 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110",
                    step.color
                  )}>
                    <span className="text-white scale-125">{step.icon}</span>
                  </div>
                  <span className="text-4xl font-black text-gray-100 group-hover:text-gift-200 transition-colors">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-lg">
                    {Icons.arrowRight}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Live Tracking Demo Section ──────────────────────

const TrackingDemoSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const timeline = [
    { status: "Gift Created", description: "Your gift has been registered and is being prepared.", time: "2 days ago", icon: Icons.gift },
    { status: "Packed", description: "Gift has been carefully packed with love.", time: "1 day ago", icon: Icons.box },
    { status: "In Transit", description: "Your gift left London and is crossing the Atlantic.", time: "12 hours ago", icon: Icons.plane },
    { status: "Customs Clearance", description: "Clearing customs in destination country.", time: "3 hours ago", icon: Icons.shield },
    { status: "Out For Delivery", description: "Your gift is on the final leg of its journey!", time: "Soon", icon: Icons.truck },
    { status: "Delivered", description: "Gift delivered! Recipient confirmed.", time: "--", icon: Icons.heart },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < timeline.length - 1 ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [timeline.length]);

  return (
    <section id="tracking" className="relative py-24 lg:py-32 bg-gradient-to-b from-gift-50/20 via-white to-pin-50/20 overflow-hidden">
      {/* Map background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
          <path d="M100,300 Q200,150 300,250 T500,200 T700,300 T900,250" fill="none" stroke="#ec4899" strokeWidth="2" />
          <circle cx="200" cy="200" r="4" fill="#ec4899" />
          <circle cx="800" cy="300" r="4" fill="#3b82f6" />
          <path d="M200,200 Q400,100 600,200 T800,300" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gift-100 to-pin-100 border border-gift-200/50 mb-6">
            {Icons.activity}
            <span className="text-sm font-medium bg-gradient-to-r from-gift-700 to-pin-700 bg-clip-text text-transparent">
              Live Tracking Demo
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Watch Your Gift's{" "}
            <span className="bg-gradient-to-r from-gift-500 to-pin-600 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            Every gift tells a story. Follow along as your package travels across the globe.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Timeline */}
          <div className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Gift Timeline</h3>
                <p className="text-sm text-gray-500">PIN: <span className="font-mono font-bold text-gift-600">GP-8472-9184</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-500">Live</span>
              </div>
            </div>

            <div className="space-y-0">
              {timeline.map((item, i) => {
                const isActive = i === activeStep;
                const isCompleted = i < activeStep;
                return (
                  <div key={i} className="flex gap-4 relative">
                    {/* Connector line */}
                    {i < timeline.length - 1 && (
                      <div className={cn(
                        "absolute left-5 top-10 w-0.5 h-12",
                        isCompleted ? "bg-gradient-to-b from-gift-500 to-pin-500" : "bg-gray-200"
                      )} />
                    )}
                    {/* Circle */}
                    <div className={cn(
                      "relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 z-10",
                      isCompleted
                        ? "bg-gradient-to-br from-gift-500 to-pin-500 border-transparent text-white"
                        : isActive
                          ? "bg-white border-gift-500 text-gift-500 ring-4 ring-gift-100"
                          : "bg-white border-gray-200 text-gray-400"
                    )}>
                      {isCompleted ? Icons.check : item.icon}
                    </div>
                    {/* Content */}
                    <div className={cn(
                      "pb-8 transition-all duration-500",
                      isActive ? "opacity-100" : isCompleted ? "opacity-70" : "opacity-50"
                    )}>
                      <h4 className={cn(
                        "font-semibold",
                        isActive ? "text-gift-600 text-lg" : "text-gray-800"
                      )}>
                        {item.status}
                        {isActive && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-gift-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-gift-500 animate-pulse" />
                            In Progress
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Map Preview */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {Icons.location}
                <span className="text-sm font-semibold text-gray-700">Live Location</span>
              </div>
              <span className="text-xs text-gray-400">Updated 2s ago</span>
            </div>
            <div className="relative aspect-square bg-gradient-to-br from-gift-50 via-blue-50 to-pin-50">
              {/* World map dots */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Route arc */}
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <path d="M80,200 Q200,80 320,200" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
                  <circle cx="80" cy="200" r="8" fill="#ec4899" className="animate-pulse" />
                  <circle cx="320" cy="200" r="8" fill="#3b82f6" className="animate-pulse" />
                  {/* Moving dot */}
                  {(() => {
                    const progress = (activeStep + 1) / (timeline.length + 1);
                    const x = 80 + progress * 240;
                    const y = 200 - Math.sin(progress * Math.PI) * 120;
                    return (
                      <>
                        <circle cx={x} cy={y} r="10" fill="#db2777" className="animate-pulse" />
                        <circle cx={x} cy={y} r="20" fill="#db2777" opacity="0.2" className="animate-ping" />
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Origin */}
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-800">🇬🇧 London</p>
                <p className="text-[10px] text-gray-400">Origin</p>
              </div>

              {/* Destination */}
              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-800">🇳🇬 Lagos</p>
                <p className="text-[10px] text-gray-400">Destination</p>
              </div>

              {/* ETA */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-100">
                <div className="flex items-center gap-1">
                  {Icons.clock}
                  <span className="text-xs font-semibold text-gray-800">ETA: 2:00 PM</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gift-500 to-pin-500 rounded-full transition-all duration-1000"
                  style={{ width: `${((activeStep + 1) / timeline.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>London 🇬🇧</span>
                <span>In Transit</span>
                <span>Lagos 🇳🇬</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Marketplace Preview ─────────────────────────────

const marketplaceItems = [
  { name: "Premium Roses Bouquet", price: "$49", emoji: "🌹", color: "from-pink-400 to-rose-500" },
  { name: "Belgian Chocolate Box", price: "$29", emoji: "🍫", color: "from-amber-600 to-yellow-700" },
  { name: "Smart Watch Pro", price: "$199", emoji: "⌚", color: "from-gray-600 to-gray-800" },
  { name: "Designer Perfume", price: "$89", emoji: "🧴", color: "from-purple-400 to-purple-600" },
  { name: "Luxury Gift Card", price: "$25-$500", emoji: "💳", color: "from-emerald-400 to-emerald-600" },
  { name: "Personalized Photo Frame", price: "$39", emoji: "🖼️", color: "from-cyan-400 to-blue-500" },
  { name: "Cashmere Scarf", price: "$79", emoji: "🧣", color: "from-red-400 to-red-600" },
  { name: "Wireless Earbuds", price: "$149", emoji: "🎧", color: "from-slate-500 to-slate-700" },
];

const MarketplaceSection = () => {
  const { navigate } = useRouter();
  return (
    <section id="marketplace" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gift-100 to-pin-100 border border-gift-200/50 mb-6">
            {Icons.shopping}
            <span className="text-sm font-medium bg-gradient-to-r from-gift-700 to-pin-700 bg-clip-text text-transparent">
              Gift Marketplace
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Browse Our{" "}
            <span className="bg-gradient-to-r from-gift-500 to-pin-600 bg-clip-text text-transparent">
              Curated Collection
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            From flowers to electronics, find the perfect gift for any occasion. Or ship your own personal gift.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search gifts..."
                className="w-full px-5 py-3.5 rounded-full border border-gray-200 focus:border-gift-400 focus:ring-2 focus:ring-gift-100 outline-none text-sm pl-12 transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {Icons.search}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {marketplaceItems.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gift-100/30 hover:border-gift-200/50 transition-all duration-500 cursor-pointer"
            >
              <div className={cn(
                "aspect-square bg-gradient-to-br flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110",
                item.color
              )}>
                <span className="drop-shadow-lg">{item.emoji}</span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-gift-600">{item.price}</span>
                  <button className="text-xs font-semibold text-white bg-gradient-to-r from-gift-500 to-pin-600 rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/signup")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gift-500 to-pin-600 text-white font-semibold rounded-full px-8 py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Explore Full Marketplace
            {Icons.arrowRight}
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── Pricing Section ─────────────────────────────────

const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-gift-50/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gift-100 to-pin-100 border border-gift-200/50 mb-6">
            {Icons.crown}
            <span className="text-sm font-medium bg-gradient-to-r from-gift-700 to-pin-700 bg-clip-text text-transparent">
              GiftPin Plus
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-gift-500 to-pin-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            Start with pay-as-you-go shipping. Upgrade to GiftPin Plus for premium benefits.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:shadow-gift-100/30 hover:border-gift-200/50 transition-all duration-500">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 mb-5">
              {Icons.gift}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pay As You Go</h3>
            <p className="text-sm text-gray-500 mb-6">For occasional senders</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">Free</span>
              <span className="text-gray-400 ml-2">to start</span>
            </div>
            <ul className="space-y-3 mb-8">
              {["Global shipping to 120+ countries", "PIN-based tracking", "Email & SMS notifications", "Standard support"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">{Icons.check}</span>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full text-sm font-semibold text-gray-800 border-2 border-gray-200 rounded-full px-6 py-3.5 hover:border-gift-300 hover:text-gift-600 transition-all duration-300">
              Get Started
            </button>
          </div>

          {/* Plus - Featured */}
          <div className="relative bg-white rounded-2xl border-2 border-gift-300 p-8 shadow-2xl shadow-gift-100/50 scale-105 z-10">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gift-500 to-pin-600 text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg">
              MOST POPULAR
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center text-white mb-5 shadow-lg">
              {Icons.crown}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">GiftPin Plus</h3>
            <p className="text-sm text-gray-500 mb-6">For frequent senders</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$12</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {["Everything in Free +", "Discounted shipping (up to 40% off)", "Priority 24/7 support", "Free gift insurance", "Advanced tracking & analytics", "Unlimited gift history", "Carbon-neutral shipping"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-gift-100 text-gift-600 flex items-center justify-center shrink-0 mt-0.5">{Icons.check}</span>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full text-sm font-semibold text-white bg-gradient-to-r from-gift-500 to-pin-600 rounded-full px-6 py-3.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Subscribe Now
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:shadow-gift-100/30 hover:border-gift-200/50 transition-all duration-500">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pin-100 to-pin-200 flex items-center justify-center text-pin-600 mb-5">
              {Icons.users}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <p className="text-sm text-gray-500 mb-6">For businesses</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">Custom</span>
            </div>
            <ul className="space-y-3 mb-8">
              {["Everything in Plus +", "Bulk gifting dashboard", "Dedicated account manager", "Custom branding options", "API access & integrations", "Corporate SLA guarantees", "Volume-based discounts"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-pin-100 text-pin-600 flex items-center justify-center shrink-0 mt-0.5">{Icons.check}</span>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full text-sm font-semibold text-gray-800 border-2 border-gray-200 rounded-full px-6 py-3.5 hover:border-pin-300 hover:text-pin-600 transition-all duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Stats / Trust Bar ───────────────────────────────

const TrustBar = () => {
  const couriers = ["DHL", "FedEx", "UPS", "Aramex", "EMS"];
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-400 mb-8 uppercase tracking-wider">
          Trusted by leading courier partners worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {couriers.map((name) => (
            <div key={name} className="flex items-center gap-2 text-gray-300 hover:text-gray-500 transition-colors">
              {Icons.truck}
              <span className="text-xl font-bold tracking-tight">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Testimonials ────────────────────────────────────

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Frequent Sender",
    avatar: "SJ",
    text: "I sent my nephew a birthday gift from New York to Tokyo. The PIN tracking was incredible — we both watched his gift cross the Pacific together!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "GiftPin Plus Member",
    avatar: "MC",
    text: "The surprise mode is genius. My girlfriend had no idea what was coming until it arrived. The video message feature made it even more special.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Corporate Client",
    avatar: "ER",
    text: "We use GiftPin for all our global employee recognition. The bulk dashboard and analytics make it easy to manage hundreds of gifts at once.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-gift-50/20 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gift-100 to-pin-100 border border-gift-200/50 mb-6">
            {Icons.heart}
            <span className="text-sm font-medium bg-gradient-to-r from-gift-700 to-pin-700 bg-clip-text text-transparent">
              What People Say
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Loved by senders{" "}
            <span className="bg-gradient-to-r from-gift-500 to-pin-600 bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto relative">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={cn(
                "transition-all duration-700 absolute inset-0",
                i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
              )}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 lg:p-12 text-center">
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, ri) => (
                    <span key={ri} className="text-yellow-400 text-xl">{Icons.star}</span>
                  ))}
                </div>
                <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 italic">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {t.avatar}
                </div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
          {/* Spacer for layout */}
          <div className="h-[340px]" />

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  i === current ? "bg-gift-500 w-8" : "bg-gray-200 hover:bg-gray-300"
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── CTA Section ─────────────────────────────────────

const CTASection = () => {
  const { navigate } = useRouter();
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gift-600 via-gift-500 to-pin-600" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
          {Icons.sparkles}
          <span className="text-sm font-medium text-white/90">
            Join 50,000+ Happy Senders
          </span>
        </div>

        <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to send a gift
          <br />
          that tells a story?
        </h2>
        <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
          Join thousands of people who use GiftPin to send love across borders.
          Every gift has a journey. Every journey has a story.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-gift-600 font-bold rounded-full px-10 py-4 text-lg shadow-2xl hover:shadow-gift-900/30 hover:scale-105 transition-all duration-300"
          >
            Send Your First Gift
          </button>
          <button className="text-white font-semibold rounded-full px-10 py-4 text-lg border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300">
            Track a Gift
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 mt-12 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            {Icons.shield}
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            {Icons.truck}
            <span>Global Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            {Icons.smile}
            <span>Satisfaction Guaranteed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ──────────────────────────────────────────

const Footer = () => {
  const footerLinks = [
    {
      title: "Platform",
      links: ["How It Works", "Marketplace", "Tracking", "Pricing", "Mobile App"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Blog", "Partner Program"]
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Shipping Info", "Returns", "FAQ"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "CCPA"]
    },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <a href="#" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{Icons.gift}</span>
              </div>
              <span className="text-xl font-bold text-white">GiftPin</span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs">
              The world's first emotional gifting platform. Send gifts anywhere.
              Track every moment. Create memories that last forever.
            </p>
            <div className="flex gap-4">
              {[Icons.mail, Icons.whatsapp, Icons.phone, Icons.video].map((icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center hover:text-white transition-all duration-300">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} GiftPin. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              {Icons.globe}
              English (US)
            </span>
            <span>USD $</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── Main App ────────────────────────────────────────

function MainContent() {
  const { isAuthenticated, user } = useAuth();
  const { path, navigate } = useRouter();

  // Redirect if logged in and at "/"
  useEffect(() => {
    if (path === "/" && isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [path, isAuthenticated, user, navigate]);

  // Route configurations
  if (path === "/signin" || path === "/signup") {
    return <SignIn />;
  }

  if (path === "/admin") {
    if (isAuthenticated && user?.role === "admin") {
      return <AdminDashboard />;
    }
    return <SignIn />;
  }

  if (path === "/dashboard") {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        return <AdminDashboard />;
      }
      return <UserDashboard />;
    }
    return <SignIn />;
  }

  // Otherwise show marketing landing page
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <HowItWorksSection />
        <FeaturesSection />
        <TrackingDemoSection />
        <MarketplaceSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <ShipmentsProvider>
          <MainContent />
        </ShipmentsProvider>
      </RouterProvider>
    </AuthProvider>
  );
}
