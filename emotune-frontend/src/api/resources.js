import client from "./client";

// --- Users ---
export const getMe = () => client.get("/users/me").then((r) => r.data);
export const updateMe = (payload) => client.put("/users/me", payload).then((r) => r.data);

// --- Emotion detection ---
export const detectLive = (imageBase64) =>
  client.post("/detect/live", { image_base64: imageBase64 }).then((r) => r.data);

export const detectUpload = (file) => {
  const form = new FormData();
  form.append("file", file);
  return client
    .post("/detect/upload", form, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};

// --- Music ---
export const recommendTracks = (emotion, maxResults = 12) =>
  client.get("/music/recommend", { params: { emotion, max_results: maxResults } }).then((r) => r.data);

// --- History ---
export const getHistory = ({ page = 1, pageSize = 20, emotion } = {}) =>
  client
    .get("/history", { params: { page, page_size: pageSize, emotion } })
    .then((r) => r.data);

export const deleteHistoryItem = (id) => client.delete(`/history/${id}`).then((r) => r.data);
export const clearHistory = () => client.delete("/history").then((r) => r.data);

// --- Favorites ---
export const getFavorites = () => client.get("/favorites").then((r) => r.data);
export const addFavorite = (payload) => client.post("/favorites", payload).then((r) => r.data);
export const removeFavorite = (id) => client.delete(`/favorites/${id}`).then((r) => r.data);
