import { motion } from "framer-motion";
import { Camera, Heart, LineChart, PlayCircle, Sparkles, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import FAQAccordion from "../components/FAQAccordion";
import { Footer } from "../components/Shared";
import Waveform from "../components/Waveform";
import { getEmotionMeta } from "../lib/emotions";

const steps = [
  {
    title: "Detect",
    body: "Look into your camera or upload a photo. Emotune reads your expression in under a second.",
    icon: Camera,
  },
  {
    title: "Analyze",
    body: "A trained model scores your mood across seven emotions and picks the strongest signal.",
    icon: Sparkles,
  },
  {
    title: "Listen",
    body: "We turn that mood into a search and hand you a playlist that actually fits how you feel.",
    icon: PlayCircle,
  },
];

const features = [
  { title: "Live camera detection", body: "Real-time capture straight from your webcam, no upload needed.", icon: Camera },
  { title: "Photo upload", body: "Prefer a still photo? Drag one in and get the same analysis.", icon: Upload },
  { title: "YouTube integration", body: "Every recommendation plays right in the app via embedded YouTube.", icon: PlayCircle },
  { title: "History tracking", body: "Every detection is logged so you can look back on your week.", icon: LineChart },
  { title: "Favorites", body: "Save tracks that hit right, and come back to them anytime.", icon: Heart },
  { title: "Mood analytics", body: "A running chart of your emotional trend, not just a single snapshot.", icon: Sparkles },
];

const faqItems = [
  {
    question: "Does Emotune store my photos?",
    answer:
      "Only the detected emotion and confidence score are saved to your history — the raw image isn't kept on our servers unless you explicitly opt in to save a thumbnail.",
  },
  {
    question: "What emotions can it detect?",
    answer: "Happy, sad, angry, surprised, fearful, disgusted, and neutral — the seven categories the model was trained on.",
  },
  {
    question: "Do I need a webcam?",
    answer: "No — the upload flow works with any photo where your face is clearly visible and front-facing.",
  },
  {
    question: "Is it free?",
    answer: "Yes. Create an account with email or Google and start detecting — no credit card required.",
  },
];

const previewEmotions = ["happy", "sad", "surprise", "neutral"];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-28 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-300">
              <Sparkles size={13} /> Emotion-aware music, in real time
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              See your mood.
              <br />
              <span className="bg-gradient-to-r from-brand-500 to-ember-500 bg-clip-text text-transparent">
                Hear your music.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-mist-700 dark:text-mist-200/75">
              Emotune reads your facial expression through your camera or a photo, then builds
              you a playlist that matches exactly how you feel — not just what you usually play.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-transform hover:-translate-y-0.5 hover:bg-brand-600"
              >
                Try live detection
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-mist-300 px-6 py-3 text-sm font-semibold transition-colors hover:bg-mist-100 dark:border-ink-600 dark:hover:bg-ink-800"
              >
                Log in
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-3xl border border-mist-200 bg-white p-6 shadow-xl dark:border-ink-700 dark:bg-ink-800">
              <p className="text-xs font-medium uppercase tracking-wide text-mist-700 dark:text-mist-200/60">
                Live preview
              </p>
              <div className="mt-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/10 to-ember-500/10 py-10">
                <Waveform bars={12} height={80} />
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {previewEmotions.map((e) => {
                  const meta = getEmotionMeta(e);
                  return (
                    <div
                      key={e}
                      className="flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-center"
                      style={{ backgroundColor: `${meta.color}18` }}
                    >
                      <span className="text-xl">{meta.emoji}</span>
                      <span className="text-[11px] font-medium" style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-mist-200 bg-mist-100/50 py-20 dark:border-ink-700 dark:bg-ink-800/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold">How it works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map(({ title, body, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-700 dark:text-mist-200/70">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold">Everything you need to track your sound</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ title, body, icon: Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-mist-200 p-5 transition-shadow hover:shadow-md dark:border-ink-700"
              >
                <Icon size={20} className="text-brand-500" />
                <h3 className="mt-3 font-medium">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-700 dark:text-mist-200/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-mist-200 py-20 dark:border-ink-700">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold">Frequently asked questions</h2>
          <div className="mt-8">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-ember-600 px-8 py-14 text-center text-white">
          <h2 className="font-display text-3xl font-semibold">Your face already knows the vibe.</h2>
          <p className="mx-auto mt-3 max-w-md text-white/85">Let your music catch up. It takes ten seconds to start.</p>
          <Link
            to="/signup"
            className="mt-7 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand-700 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Create your free account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
