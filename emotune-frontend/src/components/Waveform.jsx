const DEFAULT_HEIGHTS = [0.4, 0.7, 1, 0.55, 0.85, 0.35, 0.9, 0.5, 0.75, 0.45];

/**
 * The recurring signature motif: a gradient equalizer bar. Used in the hero,
 * as a scanning/loading motif during detection, and as a quiet background
 * accent elsewhere. Colors can be overridden to reflect a detected emotion.
 */
export default function Waveform({
  bars = 10,
  colorFrom = "#6C5CE7",
  colorTo = "#FF8B5E",
  height = 64,
  animated = true,
  className = "",
}) {
  const heights = Array.from({ length: bars }, (_, i) => DEFAULT_HEIGHTS[i % DEFAULT_HEIGHTS.length]);

  return (
    <div className={`flex items-end justify-center gap-1.5 ${className}`} style={{ height }} aria-hidden="true">
      {heights.map((h, i) => (
        <div
          key={i}
          className={animated ? "wave-bar" : ""}
          style={{
            width: 6,
            height: "100%",
            borderRadius: 4,
            background: `linear-gradient(180deg, ${colorFrom}, ${colorTo})`,
            animationDelay: `${i * 0.09}s`,
            transform: animated ? undefined : `scaleY(${h})`,
          }}
        />
      ))}
    </div>
  );
}
