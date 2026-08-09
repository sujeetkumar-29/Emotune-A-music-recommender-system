export function Spinner({ size = 20, className = "" }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function Footer() {
  return (
    <footer className="border-t border-mist-200 py-10 text-sm text-mist-700 dark:border-ink-700 dark:text-mist-200/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Emotune. See your mood, hear your music.</p>
        <div className="flex gap-6">
          <a href="#faq" className="hover:text-brand-500">FAQ</a>
          <a href="mailto:hello@emotune.app" className="hover:text-brand-500">Contact</a>
        </div>
      </div>
    </footer>
  );
}
