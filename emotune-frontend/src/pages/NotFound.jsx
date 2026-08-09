import { Link } from "react-router-dom";
import Waveform from "../components/Waveform";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <Waveform bars={7} height={40} animated={false} />
      <h1 className="font-display text-3xl font-semibold">Page not found</h1>
      <p className="text-mist-700 dark:text-mist-200/70">This track doesn't exist in our library.</p>
      <Link to="/" className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
        Back home
      </Link>
    </div>
  );
}
