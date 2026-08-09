import { AnimatePresence, motion } from "framer-motion";
import { Camera, History, Home, LogOut, Menu, Moon, Star, Sun, Upload, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useThemeStore } from "../store/themeStore";
import Waveform from "./Waveform";

const authedLinks = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/detect/live", label: "Live Detection", icon: Camera },
  { to: "/detect/upload", label: "Upload Photo", icon: Upload },
  { to: "/history", label: "History", icon: History },
  { to: "/favorites", label: "Favorites", icon: Star },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-mist-200/60 bg-mist-50/80 backdrop-blur-lg dark:border-ink-700/60 dark:bg-ink-900/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Waveform bars={4} height={20} animated={false} />
          <span className="font-display text-lg font-semibold tracking-tight">Emotune</span>
        </Link>

        {isAuthenticated && (
          <div className="hidden items-center gap-1 md:flex">
            {authedLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-300"
                      : "text-mist-700 hover:bg-mist-100 dark:text-mist-200/80 dark:hover:bg-ink-800"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="rounded-full p-2 text-mist-700 transition-colors hover:bg-mist-100 dark:text-mist-200 dark:hover:bg-ink-800"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-mist-200 py-1 pl-1 pr-3 hover:bg-mist-100 dark:border-ink-700 dark:hover:bg-ink-800"
              >
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-sm font-medium">{user?.name?.split(" ")[0] || "Account"}</span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-mist-200 bg-white py-1 shadow-lg dark:border-ink-700 dark:bg-ink-800"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-mist-100 dark:hover:bg-ink-700"
                    >
                      <User size={15} /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-emotion-angry hover:bg-mist-100 dark:hover:bg-ink-700"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium hover:bg-mist-100 dark:hover:bg-ink-800">
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-500/30 transition-colors hover:bg-brand-600"
              >
                Get started
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 hover:bg-mist-100 dark:hover:bg-ink-800 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-mist-200 bg-mist-50 dark:border-ink-700 dark:bg-ink-900 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {isAuthenticated ? (
                <>
                  {authedLinks.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-mist-100 dark:hover:bg-ink-800"
                    >
                      <Icon size={16} /> {label}
                    </NavLink>
                  ))}
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-mist-100 dark:hover:bg-ink-800"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                      navigate("/login");
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-emotion-angry hover:bg-mist-100 dark:hover:bg-ink-800"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-mist-100 dark:hover:bg-ink-800">
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-brand-500 px-3 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
