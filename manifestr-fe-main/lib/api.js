import axios from "axios";
import Router from "next/router";

// Default base URL - Production vs Development
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.manifestr.ai"
    : "http://localhost:8000");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for HttpOnly cookies
  timeout: 0, // 🔥 No timeout by default - let per-request configs handle it
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];
let isRedirectingToLogin = false;

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no config (network error etc)
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Auth-related routes (DO NOT refresh token for these)
    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/forgot-password") ||
      originalRequest.url?.includes("/auth/send-reset-code") ||
      originalRequest.url?.includes("/auth/verify-reset-code") ||
      originalRequest.url?.includes("/auth/reset-password");

    // Handle 401 (token expired)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      // If already refreshing → queue requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token (HttpOnly cookie based)
        const response = await api.post("/auth/refresh-token");
        const accessToken = response?.data?.details?.accessToken;

        if (!accessToken) {
          throw new Error("Refresh token failed");
        }

        // Store new token
        localStorage.setItem("accessToken", accessToken);
        api.defaults.headers.common.Authorization =
          "Bearer " + accessToken;

        // Retry queued requests
        processQueue(null, accessToken);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Silent logout (NO UI crash)
        if (typeof window !== "undefined" && !isRedirectingToLogin) {
          isRedirectingToLogin = true;

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          localStorage.removeItem("pendingUser");
          localStorage.removeItem("pendingVerificationEmail");

          Router.replace("/login");

          setTimeout(() => {
            isRedirectingToLogin = false;
          }, 1000);
        }

        // Return resolved response (prevents UI error popups)
        return Promise.resolve({
          data: {
            status: "error",
            message: "Session expired",
            details: {},
          },
        });
      } finally {
        isRefreshing = false;
      }
    }

    // If 401 on auth routes → force logout
    if (
      error.response?.status === 401 &&
      isAuthRequest &&
      typeof window !== "undefined" &&
      !isRedirectingToLogin
    ) {
      isRedirectingToLogin = true;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("pendingUser");
      localStorage.removeItem("pendingVerificationEmail");

      Router.replace("/login");

      setTimeout(() => {
        isRedirectingToLogin = false;
      }, 1000);

      return Promise.resolve({
        data: {
          status: "error",
          message: "Session expired",
        },
      });
    }

    return Promise.reject(error);
  }
);

export default api;