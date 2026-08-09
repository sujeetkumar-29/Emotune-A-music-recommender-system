import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle, Camera, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { addFavorite, getFavorites, removeFavorite } from "../api/resources";
import EmotionResultCard from "../components/EmotionResultCard";
import { Spinner } from "../components/Shared";
import SongCard from "../components/SongCard";
import Waveform from "../components/Waveform";
import { useCamera } from "../hooks/useCamera";
import { useEmotionDetect } from "../hooks/useEmotionDetect";
import { usePlayerStore } from "../store/playerStore";

export default function LiveDetect() {
  const { videoRef, isActive, error: cameraError, start, stop, capture } = useCamera();
  const { detectFromLiveFrame, isDetecting, error, result, tracks, reset } = useEmotionDetect();
  const playTrack = usePlayerStore((s) => s.playTrack);
  const queryClient = useQueryClient();
  const [flash, setFlash] = useState(false);

  const favoritesQuery = useQuery({ queryKey: ["favorites"], queryFn: getFavorites });
  const favoriteIds = new Set((favoritesQuery.data ?? []).map((f) => f.video_id));

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    const frame = capture();
    if (!frame) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    detectFromLiveFrame(frame);
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
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Live Detection</h1>
      <p className="mt-1 text-mist-700 dark:text-mist-200/70">
        Center your face in frame, good lighting helps, then capture.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-mist-200 bg-ink-950 dark:border-ink-700">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full -scale-x-100 object-cover"
            />
            {flash && <div className="absolute inset-0 bg-white/80" />}
            {!isActive && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center text-white/70">
                <Spinner size={24} />
              </div>
            )}
            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-white">
                <AlertCircle size={26} className="text-emotion-angry" />
                <p className="text-sm">{cameraError}</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCapture}
              disabled={!isActive || isDetecting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
            >
              {isDetecting ? <Spinner size={16} /> : <Camera size={17} />}
              {isDetecting ? "Analyzing…" : "Capture & Detect"}
            </button>
            {result && (
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl border border-mist-300 px-4 text-sm font-medium hover:bg-mist-100 dark:border-ink-600 dark:hover:bg-ink-800"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-emotion-angry/10 px-3 py-2 text-sm text-emotion-angry">
              {error.response?.data?.detail || "Couldn't detect an emotion. Try again with better lighting."}
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
