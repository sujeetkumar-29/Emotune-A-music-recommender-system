import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { detectLive, detectUpload, recommendTracks } from "../api/resources";

/**
 * Runs an emotion detection call (live frame or file upload), then
 * automatically fetches a matching track list for the result.
 */
export function useEmotionDetect() {
  const [result, setResult] = useState(null); // { emotion, confidence, probabilities, history_id }
  const [tracks, setTracks] = useState([]);

  const detectMutation = useMutation({
    mutationFn: async ({ source, payload }) => {
      const detection = source === "live" ? await detectLive(payload) : await detectUpload(payload);
      const recommendation = await recommendTracks(detection.emotion);
      return { detection, recommendation };
    },
    onSuccess: ({ detection, recommendation }) => {
      setResult(detection);
      setTracks(recommendation.tracks);
    },
  });

  const reset = () => {
    setResult(null);
    setTracks([]);
    detectMutation.reset();
  };

  return {
    detectFromLiveFrame: (imageBase64) => detectMutation.mutate({ source: "live", payload: imageBase64 }),
    detectFromFile: (file) => detectMutation.mutate({ source: "upload", payload: file }),
    isDetecting: detectMutation.isPending,
    error: detectMutation.error,
    result,
    tracks,
    reset,
  };
}
