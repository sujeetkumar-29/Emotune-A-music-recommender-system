import { motion } from "framer-motion";
import { getEmotionMeta } from "../lib/emotions";

export default function EmotionResultCard({ emotion, confidence, probabilities }) {
  const meta = getEmotionMeta(emotion);
  const sorted = probabilities
    ? Object.entries(probabilities).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-mist-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-800"
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
          style={{ backgroundColor: `${meta.color}22` }}
        >
          {meta.emoji}
        </div>
        <div>
          <p className="text-sm text-mist-700 dark:text-mist-200/70">Detected mood</p>
          <h3 className="font-display text-2xl font-semibold" style={{ color: meta.color }}>
            {meta.label}
          </h3>
          <p className="font-mono-data text-xs text-mist-700 dark:text-mist-200/70">
            {Math.round(confidence * 100)}% confidence
          </p>
        </div>
      </div>

      {sorted.length > 0 && (
        <div className="mt-6 space-y-2.5">
          {sorted.map(([label, value]) => {
            const m = getEmotionMeta(label);
            return (
              <div key={label} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs font-medium capitalize text-mist-700 dark:text-mist-200/80">
                  {label}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-mist-100 dark:bg-ink-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                </div>
                <span className="font-mono-data w-10 shrink-0 text-right text-xs text-mist-700 dark:text-mist-200/70">
                  {Math.round(value * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
