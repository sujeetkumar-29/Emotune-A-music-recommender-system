import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ImagePlus, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { addFavorite, getFavorites, removeFavorite } from "../api/resources";
import EmotionResultCard from "../components/EmotionResultCard";
import { Spinner } from "../components/Shared";
import SongCard from "../components/SongCard";
import Waveform from "../components/Waveform";
import { useEmotionDetect } from "../hooks/useEmotionDetect";
import { usePlayerStore } from "../store/playerStore";

export default function UploadDetect() {
  const { detectFromFile, isDetecting, error, result, tracks, reset } = useEmotionDetect();
  const playTrack = usePlayerStore((s) => s.playTrack);
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const favoritesQuery = useQuery({ queryKey: ["favorites"], queryFn: getFavorites });
  const favoriteIds = new Set((favoritesQuery.data ?? []).map((f) => f.video_id));

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) return;
      setPreview(URL.createObjectURL(file));
      detectFromFile(file);
    },
    [detectFromFile]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleReset = () => {
    setPreview(null);
    reset();
  };

  const handleToggleFavorite = async (track) => {
    const existing = (favoritesQuery.data ?? []).find((f) => f.video_id === track.video_id);
    if (existing) {
      await removeFavorite(existing.id);
    } else {
      await addFavorite({ ...track, emotion_context: result?.emotion });
    }
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Upload a Photo</h1>
      <p className="mt-1 text-mist-700 dark:text-mist-200/70">
        Drop in a clear, front-facing photo and we'll take it from there.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
              isDragging
                ? "border-brand-500 bg-brand-500/5"
                : "border-mist-300 bg-mist-50 hover:bg-mist-100 dark:border-ink-600 dark:bg-ink-800 dark:hover:bg-ink-700"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {preview ? (
              <img src={preview} alt="Uploaded preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 px-6 text-center">
                <ImagePlus size={28} className="text-mist-700 dark:text-mist-200/60" />
                <p className="text-sm font-medium">Drag & drop a photo, or click to browse</p>
                <p className="text-xs text-mist-700 dark:text-mist-200/50">JPG or PNG, one clear face works best</p>
              </div>
            )}
            {isDetecting && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink-950/50">
                <Spinner size={26} className="text-white" />
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={isDetecting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
            >
              <Sparkles size={16} />
              {preview ? "Choose a different photo" : "Choose a photo"}
            </button>
            {result && (
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 rounded-xl border border-mist-300 px-4 text-sm font-medium hover:bg-mist-100 dark:border-ink-600 dark:hover:bg-ink-800"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-emotion-angry/10 px-3 py-2 text-sm text-emotion-angry">
              {error.response?.data?.detail || "Couldn't detect a face. Try a clearer, front-facing photo."}
            </p>
          )}
        </div>

        <div>
          {result ? (
            <EmotionResultCard {...result} />
          ) : (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-mist-300 p-8 text-center dark:border-ink-600">
              <Waveform bars={8} height={44} animated={isDetecting} />
              <p className="mt-4 text-sm text-mist-700 dark:text-mist-200/60">
                Your result and matching playlist will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {tracks.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
          <h2 className="font-display text-lg font-semibold">Recommended for your mood</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <SongCard
                key={track.video_id}
                track={track}
                isFavorite={favoriteIds.has(track.video_id)}
                onPlay={(t) => playTrack(t, tracks)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
