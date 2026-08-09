import client from "./client";

export const registerUser = (payload) => client.post("/auth/register", payload).then((r) => r.data);

export const loginUser = (payload) => client.post("/auth/login", payload).then((r) => r.data);

export const getGoogleLoginUrl = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  return `${base}/auth/google`;
};
