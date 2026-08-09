import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Camera, Star, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { getFavorites, getHistory } from "../api/resources";
import MoodChart from "../components/MoodChart";
import Waveform from "../components/Waveform";
import { useAuth } from "../hooks/useAuth";
import { getEmotionMeta } from "../lib/emotions";

export default function Dashboard() {
  const { user } = useAuth();

  const historyQuery = useQuery({
    queryKey: ["history", { page: 1, pageSize: 10 }],
    queryFn: () => getHistory({ page: 1, pageSize: 10 }),
  });

  const favoritesQuery = useQuery({ queryKey: ["favorites"], queryFn: getFavorites });

  const recent = historyQuery.data?.items ?? [];
  const chartHistory = [...recent].reverse();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          Hey {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="mt-1 text-mist-700 dark:text-mist-200/70">What's your mood today?</p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/detect/live"
          className="group flex items-center justify-between rounded-2xl border border-mist-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-ink-700 dark:bg-ink-800"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
              <Camera size={18} />
            </div>
            <h3 className="mt-3 font-display font-semibold">Live detection</h3>
            <p className="mt-1 text-sm text-mist-700 dark:text-mist-200/70">Use your webcam right now.</p>
          </div>
          <Waveform bars={5} height={40} className="opacity-60 transition-opacity group-hover:opacity-100" />
        </Link>

        <Link
          to="/detect/upload"
          className="group flex items-center justify-between rounded-2xl border border-mist-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-ink-700 dark:bg-ink-800"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500 text-white">
              <Upload size={18} />
            </div>
            <h3 className="mt-3 font-display font-semibold">Upload a photo</h3>
            <p className="mt-1 text-sm text-mist-700 dark:text-mist-200/70">Analyze an existing picture.</p>
          </div>
          <Waveform bars={5} height={40} colorFrom="#FF8B5E" colorTo="#6C5CE7" className="opacity-60 transition-opacity group-hover:opacity-100" />
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Mood over time</h2>
            <Link to="/history" className="text-sm font-medium text-brand-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4">
            <MoodChart history={chartHistory} />
          </div>

          <h2 className="mt-8 font-display text-lg font-semibold">Recent detections</h2>
          <div className="mt-4 space-y-2">
            {recent.length === 0 && (
              <p className="text-sm text-mist-700 dark:text-mist-200/60">
                Nothing yet — try a live or uploaded detection to get started.
              </p>
            )}
            {recent.slice(0, 5).map((item) => {
              const meta = getEmotionMeta(item.emotion);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-mist-200 px-4 py-3 dark:border-ink-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{meta.emoji}</span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: meta.color }}>
                        {meta.label}
                      </p>
                      <p className="text-xs text-mist-700 dark:text-mist-200/60">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono-data text-xs text-mist-700 dark:text-mist-200/60">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Favorites</h2>
            <Link to="/favorites" className="text-sm font-medium text-brand-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {(favoritesQuery.data ?? []).length === 0 && (
              <p className="text-sm text-mist-700 dark:text-mist-200/60">
                <Star size={14} className="mr-1 inline" /> No favorites saved yet.
              </p>
            )}
            {(favoritesQuery.data ?? []).slice(0, 5).map((fav) => (
              <div key={fav.id} className="flex items-center gap-3 rounded-xl border border-mist-200 p-2.5 dark:border-ink-700">
                <img src={fav.thumbnail_url} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{fav.title}</p>
                  <p className="truncate text-xs text-mist-700 dark:text-mist-200/60">{fav.channel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
