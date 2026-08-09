import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { getFavorites, removeFavorite } from "../api/resources";
import { Spinner } from "../components/Shared";
import SongCard from "../components/SongCard";
import { usePlayerStore } from "../store/playerStore";

export default function Favorites() {
  const queryClient = useQueryClient();
  const playTrack = usePlayerStore((s) => s.playTrack);

  const { data, isLoading } = useQuery({ queryKey: ["favorites"], queryFn: getFavorites });
  const favorites = data ?? [];

  const handleRemove = async (track) => {
    const existing = favorites.find((f) => f.video_id === track.video_id);
    if (existing) {
      await removeFavorite(existing.id);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Favorites</h1>
      <p className="mt-1 text-mist-700 dark:text-mist-200/70">Tracks you've saved along the way.</p>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size={24} className="text-brand-500" />
        </div>
      )}

      {!isLoading && favorites.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-mist-300 py-16 text-center dark:border-ink-600">
          <Star size={26} className="text-mist-700 dark:text-mist-200/50" />
          <p className="text-sm text-mist-700 dark:text-mist-200/60">
            Nothing saved yet — tap the heart on any track to add it here.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((fav) => (
          <SongCard
            key={fav.id}
            track={fav}
            isFavorite
            onPlay={(t) => playTrack(t, favorites)}
            onToggleFavorite={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
