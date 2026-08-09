import { motion } from "framer-motion";
import { Heart, Play } from "lucide-react";

export default function SongCard({ track, isFavorite, onPlay, onToggleFavorite }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="group overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-ink-700 dark:bg-ink-800"
    >
      <div className="relative aspect-video overflow-hidden bg-mist-100 dark:bg-ink-700">
        {track.thumbnail_url ? (
          <img src={track.thumbnail_url} alt="" className="h-full w-full object-cover" />
        ) : null}
        <button
          onClick={() => onPlay?.(track)}
          aria-label={`Play ${track.title}`}
          className="absolute inset-0 flex items-center justify-center bg-ink-950/0 opacity-0 transition-all group-hover:bg-ink-950/40 group-hover:opacity-100"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-900 shadow-lg">
            <Play size={18} fill="currentColor" />
          </span>
        </button>
      </div>

      <div className="flex items-start justify-between gap-2 p-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium" title={track.title}>
            {track.title}
          </p>
          <p className="truncate text-xs text-mist-700 dark:text-mist-200/70">{track.channel}</p>
        </div>
        <button
          onClick={() => onToggleFavorite?.(track)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="shrink-0 rounded-full p-1.5 transition-colors hover:bg-mist-100 dark:hover:bg-ink-700"
        >
          <Heart
            size={17}
            className={isFavorite ? "text-emotion-angry" : "text-mist-700 dark:text-mist-200/70"}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
    </motion.div>
  );
}
