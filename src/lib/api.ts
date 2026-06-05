import axios, { isAxiosError } from "axios";
import { getChildToken, getUserToken } from "@/lib/auth-cookies";
import { logoutParent } from "@/lib/auth-session";

export type AuthMode = "user" | "child" | "none";

declare module "axios" {
  interface AxiosRequestConfig {
    authMode?: AuthMode;
  }
}

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const authMode = config.authMode ?? "user";

  if (authMode === "none") {
    return config;
  }

  const token =
    authMode === "child" ? getChildToken() : getUserToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      const authMode = error.config?.authMode ?? "user";
      if (
        authMode === "user" &&
        window.location.pathname.startsWith("/parent-dashboard")
      ) {
        logoutParent();
        const returnUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `/parent-sign-in?returnUrl=${returnUrl}`;
      }
    }
    return Promise.reject(error);
  },
);
