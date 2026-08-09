import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getGoogleLoginUrl } from "../api/auth";
import { Spinner } from "../components/Shared";
import Waveform from "../components/Waveform";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const { register, isRegistering, registerError } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form); // logs the user straight into /dashboard on success - no email verification step
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Waveform bars={6} height={32} />
          <h1 className="mt-4 font-display text-2xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-mist-700 dark:text-mist-200/70">Free forever. No credit card.</p>
        </div>

        <a
          href={getGoogleLoginUrl()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-mist-300 py-2.5 text-sm font-medium transition-colors hover:bg-mist-100 dark:border-ink-600 dark:hover:bg-ink-800"
        >
          Continue with Google
        </a>

        <div className="my-5 flex items-center gap-3 text-xs text-mist-700 dark:text-mist-200/50">
          <div className="h-px flex-1 bg-mist-200 dark:bg-ink-700" />
          or
          <div className="h-px flex-1 bg-mist-200 dark:bg-ink-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={update("name")}
              className="w-full rounded-xl border border-mist-300 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-ink-600"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
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
              minLength={8}
              value={form.password}
              onChange={update("password")}
              className="w-full rounded-xl border border-mist-300 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-ink-600"
              placeholder="At least 8 characters"
            />
          </div>

          {registerError && (
            <p className="rounded-lg bg-emotion-angry/10 px-3 py-2 text-sm text-emotion-angry">
              {registerError.response?.data?.detail || "Something went wrong. Please try again."}
            </p>
          )}

          <button
            type="submit"
            disabled={isRegistering}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
          >
            {isRegistering && <Spinner size={16} />}
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist-700 dark:text-mist-200/70">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-500 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
