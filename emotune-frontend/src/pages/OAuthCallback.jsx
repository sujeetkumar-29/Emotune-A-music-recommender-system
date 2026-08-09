import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "../components/Shared";
import { useAuthStore } from "../store/authStore";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  useEffect(() => {
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login?error=oauth_failed", { replace: true });
    }
  }, [params, navigate, setTokens]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3">
      <Spinner size={28} className="text-brand-500" />
      <p className="text-sm text-mist-700 dark:text-mist-200/70">Signing you in…</p>
    </div>
  );
}
