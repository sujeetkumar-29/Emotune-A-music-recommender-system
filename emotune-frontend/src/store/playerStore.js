import { create } from "zustand";

export const usePlayerStore = create((set) => ({
  currentTrack: null, // { video_id, title, channel, thumbnail_url }
  isPlaying: false,
  queue: [],

  playTrack: (track, queue = []) => set({ currentTrack: track, isPlaying: true, queue }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  stop: () => set({ currentTrack: null, isPlaying: false }),

  playNext: () =>
    set((state) => {
      if (!state.queue.length) return state;
      const idx = state.queue.findIndex((t) => t.video_id === state.currentTrack?.video_id);
      const next = state.queue[(idx + 1) % state.queue.length];
      return { currentTrack: next, isPlaying: true };
    }),
}));
