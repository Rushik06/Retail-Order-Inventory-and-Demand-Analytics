import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/token";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

export const createApiClient = (baseURL: string) => {
  const api = axios.create({
    baseURL,
    withCredentials: false,
  });

  /* REQUEST INTERCEPTOR */

  api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  /* RESPONSE INTERCEPTOR */

  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      const isAuthRoute =
        originalRequest?.url?.includes("/auth/login") ||
        originalRequest?.url?.includes("/auth/register") ||
        originalRequest?.url?.includes("/password/forgot") ||
        originalRequest?.url?.includes("/password/reset");

      if (
        error.response?.status === 401 &&
        !originalRequest?._retry &&
        !isAuthRoute
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const res = await axios.post(
            `${AUTH_URL}/refresh`,
            { refreshToken }
          );

          setTokens(res.data.accessToken, refreshToken);

          originalRequest.headers.Authorization =
            `Bearer ${res.data.accessToken}`;

          return api(originalRequest);
        } catch {
          clearTokens();
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};