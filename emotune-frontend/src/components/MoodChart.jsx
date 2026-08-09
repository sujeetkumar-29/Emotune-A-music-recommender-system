import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getEmotionMeta } from "../lib/emotions";

const EMOTION_TO_SCORE = {
  happy: 6,
  surprise: 5,
  neutral: 4,
  disgust: 3,
  fear: 2,
  sad: 1,
  angry: 0,
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const meta = getEmotionMeta(point.emotion);
  return (
    <div className="rounded-lg border border-mist-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-ink-700 dark:bg-ink-800">
      <p className="font-medium" style={{ color: meta.color }}>
        {meta.emoji} {meta.label}
      </p>
      <p className="text-mist-700 dark:text-mist-200/70">{point.dateLabel}</p>
    </div>
  );
}

/**
 * history: array of { emotion, created_at } sorted oldest -> newest
 */
export default function MoodChart({ history = [] }) {
  const data = history.map((item) => ({
    dateLabel: new Date(item.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    emotion: item.emotion,
    score: EMOTION_TO_SCORE[item.emotion] ?? 3,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-mist-300 text-sm text-mist-700 dark:border-ink-600 dark:text-mist-200/60">
        No mood history yet — run a detection to start your timeline.
      </div>
    );
  }

  return (
    <div className="h-56 w-full rounded-2xl border border-mist-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-800">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.4} />
          <YAxis hide domain={[0, 6]} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#6C5CE7"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#6C5CE7" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
