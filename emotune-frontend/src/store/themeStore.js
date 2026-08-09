import { create } from "zustand";

const getInitialTheme = () => {
  const stored = localStorage.getItem("emotune-theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("emotune-theme", theme);
};

const initial = getInitialTheme();
applyTheme(initial);

export const useThemeStore = create((set, get) => ({
  theme: initial,
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    applyTheme(next);
    set({ theme: next });
  },
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
