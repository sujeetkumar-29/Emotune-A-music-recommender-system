import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { clearHistory, deleteHistoryItem, getHistory } from "../api/resources";
import MoodChart from "../components/MoodChart";
import { Spinner } from "../components/Shared";
import { EMOTION_LIST, getEmotionMeta } from "../lib/emotions";

export default function History() {
  const [page, setPage] = useState(1);
  const [emotionFilter, setEmotionFilter] = useState("");
  const queryClient = useQueryClient();
  const pageSize = 15;

  const { data, isLoading } = useQuery({
    queryKey: ["history", { page, pageSize, emotion: emotionFilter }],
    queryFn: () => getHistory({ page, pageSize, emotion: emotionFilter || undefined }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["history"] });

  const handleDelete = async (id) => {
    await deleteHistoryItem(id);
    invalidate();
  };

  const handleClearAll = async () => {
    if (!confirm("Clear your entire detection history? This can't be undone.")) return;
    await clearHistory();
    invalidate();
  };

  const items = data?.items ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">History</h1>
          <p className="mt-1 text-mist-700 dark:text-mist-200/70">Every detection, in one timeline.</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 rounded-full border border-mist-300 px-4 py-2 text-sm font-medium text-emotion-angry hover:bg-mist-100 dark:border-ink-600 dark:hover:bg-ink-800"
          >
            <Trash2 size={14} /> Clear all
          </button>
        )}
      </div>

      <div className="mt-6">
        <MoodChart history={[...items].reverse()} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setEmotionFilter("");
            setPage(1);
          }}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
            emotionFilter === "" ? "bg-brand-500 text-white" : "bg-mist-100 dark:bg-ink-800"
          }`}
        >
          All
        </button>
        {EMOTION_LIST.map((e) => {
          const meta = getEmotionMeta(e);
          const active = emotionFilter === e;
          return (
            <button
              key={e}
              onClick={() => {
                setEmotionFilter(e);
                setPage(1);
              }}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: active ? meta.color : `${meta.color}18`,
                color: active ? "white" : meta.color,
              }}
            >
              {meta.emoji} {meta.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Spinner size={24} className="text-brand-500" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <p className="py-10 text-center text-sm text-mist-700 dark:text-mist-200/60">No detections found.</p>
        )}

        {items.map((item) => {
          const meta = getEmotionMeta(item.emotion);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between rounded-xl border border-mist-200 px-4 py-3 dark:border-ink-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{meta.emoji}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: meta.color }}>
                    {meta.label}
                  </p>
                  <p className="text-xs text-mist-700 dark:text-mist-200/60">
                    {new Date(item.created_at).toLocaleString()} · {item.source}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono-data text-xs text-mist-700 dark:text-mist-200/60">
                  {Math.round(item.confidence * 100)}%
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete entry"
                  className="rounded-full p-1.5 text-mist-700 hover:bg-mist-100 hover:text-emotion-angry dark:text-mist-200/60 dark:hover:bg-ink-800"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-mist-300 px-4 py-1.5 text-sm disabled:opacity-40 dark:border-ink-600"
          >
            Previous
          </button>
          <span className="text-sm text-mist-700 dark:text-mist-200/70">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-full border border-mist-300 px-4 py-1.5 text-sm disabled:opacity-40 dark:border-ink-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
