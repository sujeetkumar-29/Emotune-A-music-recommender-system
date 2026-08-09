import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { updateMe } from "../api/resources";
import { Spinner } from "../components/Shared";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

export default function Profile() {
  const { user, logout } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const { theme, setTheme } = useThemeStore();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  const handleThemeChange = (next) => {
    setTheme(next);
    mutation.mutate({ theme_preference: next });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Profile</h1>

      <div className="mt-8 flex items-center gap-4">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-xl font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div>
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm text-mist-700 dark:text-mist-200/70">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-mist-200 p-6 dark:border-ink-700">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Display name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-mist-300 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-ink-600"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {mutation.isPending && <Spinner size={16} />}
          {saved && <CheckCircle2 size={16} />}
          Save changes
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-mist-200 p-6 dark:border-ink-700">
        <p className="text-sm font-medium">Theme</p>
        <div className="mt-3 flex gap-2">
          {["light", "dark"].map((t) => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                theme === t ? "bg-brand-500 text-white" : "bg-mist-100 dark:bg-ink-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-8 text-sm font-medium text-emotion-angry hover:underline"
      >
        Log out
      </button>
    </div>
  );
}
