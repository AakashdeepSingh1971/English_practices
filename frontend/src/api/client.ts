import axios from "axios";
import { useAuthStore, type AuthUser } from "../stores/authStore";

// Same origin by default: in production the backend serves this app, and in
// development Vite proxies /api to the backend (see vite.config.ts). Set
// VITE_API_URL only if the API is hosted somewhere else.
export const apiBaseUrl = import.meta.env.VITE_API_URL ?? "";

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

export interface RefreshedSession {
  accessToken: string;
  user: AuthUser;
}

let refreshPromise: Promise<RefreshedSession | null> | null = null;

// Trades the httpOnly refresh cookie for a new access token and the user's
// profile. The server also renews the cookie, so the session keeps sliding
// forward while the site or installed app is used.
async function refreshAccessToken(): Promise<RefreshedSession | null> {
  try {
    const res = await axios.post(
      `${apiBaseUrl}/api/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return { accessToken: res.data.accessToken as string, user: res.data.user as AuthUser };
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
      const session = await refreshPromise;
      if (session) {
        useAuthStore.getState().setSession(session.accessToken, session.user);
        original.headers.Authorization = `Bearer ${session.accessToken}`;
        return apiClient(original);
      }
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  }
);

export { refreshAccessToken };
