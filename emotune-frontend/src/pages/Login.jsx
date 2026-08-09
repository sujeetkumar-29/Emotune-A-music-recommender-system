import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getGoogleLoginUrl } from "../api/auth";
import { Spinner } from "../components/Shared";
import Waveform from "../components/Waveform";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Waveform bars={6} height={32} />
          <h1 className="mt-4 font-display text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-mist-700 dark:text-mist-200/70">Log in to see what's playing.</p>
        </div>

        <a
          href={getGoogleLoginUrl()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-mist-300 py-2.5 text-sm font-medium transition-colors hover:bg-mist-100 dark:border-ink-600 dark:hover:bg-ink-800"
        >
          <GoogleIcon /> Continue with Google
        </a>

        <div className="my-5 flex items-center gap-3 text-xs text-mist-700 dark:text-mist-200/50">
          <div className="h-px flex-1 bg-mist-200 dark:bg-ink-700" />
          or
          <div className="h-px flex-1 bg-mist-200 dark:bg-ink-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-mist-300 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-ink-600"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-mist-300 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-ink-600"
              placeholder="••••••••"
            />
          </div>

          {loginError && (
            <p className="rounded-lg bg-emotion-angry/10 px-3 py-2 text-sm text-emotion-angry">
              {loginError.response?.data?.detail || "Something went wrong. Please try again."}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
          >
            {isLoggingIn && <Spinner size={16} />}
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist-700 dark:text-mist-200/70">
          New to Emotune?{" "}
          <Link to="/signup" className="font-medium text-brand-500 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35 26.9 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.6 5.6C41.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}
