import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";
import { getMe } from "../api/resources";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken, user, login: storeLogin, logout: storeLogout, setUser } = useAuthStore();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!accessToken,
    retry: false,
  });

  // React Query v5 dropped onSuccess from useQuery - sync the store when fresh data lands
  useEffect(() => {
    if (meQuery.data) setUser(meQuery.data);
  }, [meQuery.data, setUser]);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      storeLogin(data.access_token, data.refresh_token);
      const profile = await getMe();
      setUser(profile);
      navigate("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      storeLogin(data.access_token, data.refresh_token);
      const profile = await getMe();
      setUser(profile);
      navigate("/dashboard");
    },
  });

  const logout = () => {
    storeLogout();
    queryClient.clear();
    navigate("/login");
  };

  return {
    user: user || meQuery.data,
    isAuthenticated: !!accessToken,
    isLoadingUser: meQuery.isLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
  };
}
