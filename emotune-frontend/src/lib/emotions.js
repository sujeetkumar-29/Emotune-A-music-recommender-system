export const EMOTIONS = {
  happy: { label: "Happy", color: "var(--color-emotion-happy)", emoji: "😄" },
  sad: { label: "Sad", color: "var(--color-emotion-sad)", emoji: "😢" },
  angry: { label: "Angry", color: "var(--color-emotion-angry)", emoji: "😠" },
  surprise: { label: "Surprised", color: "var(--color-emotion-surprise)", emoji: "😮" },
  fear: { label: "Fearful", color: "var(--color-emotion-fear)", emoji: "😨" },
  disgust: { label: "Disgusted", color: "var(--color-emotion-disgust)", emoji: "🤢" },
  neutral: { label: "Neutral", color: "var(--color-emotion-neutral)", emoji: "😐" },
};

export const getEmotionMeta = (emotion) =>
  EMOTIONS[emotion?.toLowerCase()] || { label: emotion || "Unknown", color: "var(--color-mist-700)", emoji: "🎧" };

export const EMOTION_LIST = Object.keys(EMOTIONS);
