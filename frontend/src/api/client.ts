import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: apiBaseUrl + "/api",
  withCredentials: true, // sends the httpOnly refresh cookie
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await axios.post(
      `${apiBaseUrl}/api/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return res.data.accessToken as string;
  } catch {
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retried) {
      original._retried = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      if (newToken) {
        const { user } = useAuthStore.getState();
        if (user) useAuthStore.getState().setSession(newToken, user);
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  }
);

export { refreshAccessToken };
