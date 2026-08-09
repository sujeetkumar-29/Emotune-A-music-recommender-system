import { AnimatePresence, motion } from "framer-motion";
import { SkipForward, X } from "lucide-react";
import { usePlayerStore } from "../store/playerStore";

export default function YouTubePlayer() {
  const { currentTrack, isPlaying, stop, playNext, queue } = usePlayerStore();

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-mist-200 bg-white/95 backdrop-blur-lg dark:border-ink-700 dark:bg-ink-800/95"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div className="aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:w-56">
              <iframe
                key={currentTrack.video_id}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentTrack.video_id}?autoplay=${isPlaying ? 1 : 0}`}
                title={currentTrack.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{currentTrack.title}</p>
              <p className="truncate text-xs text-mist-700 dark:text-mist-200/70">{currentTrack.channel}</p>
            </div>

            <div className="flex items-center justify-end gap-1.5">
              {queue.length > 1 && (
                <button
                  onClick={playNext}
                  aria-label="Play next track"
                  className="rounded-full p-2 hover:bg-mist-100 dark:hover:bg-ink-700"
                >
                  <SkipForward size={18} />
                </button>
              )}
              <button
                onClick={stop}
                aria-label="Close player"
                className="rounded-full p-2 hover:bg-mist-100 dark:hover:bg-ink-700"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
