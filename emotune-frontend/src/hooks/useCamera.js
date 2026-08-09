import { useCallback, useRef, useState } from "react";

/**
 * Wraps a <video> element with getUserMedia webcam access and exposes a
 * capture() function that grabs the current frame as a base64 JPEG.
 */
export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsActive(true);
    } catch (err) {
      setError(
        err?.name === "NotAllowedError"
          ? "Camera access was denied. Allow camera permissions and try again."
          : "Couldn't access your camera. Check that it's connected and not in use elsewhere."
      );
      setIsActive(false);
    }
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsActive(false);
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isActive) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.9); // data:image/jpeg;base64,...
  }, [isActive]);

  return { videoRef, isActive, error, start, stop, capture };
}
