import axios from "axios";
import { getAccessToken, setAccessToken, clearTokens } from "../utils/token";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

export const createApiClient = (baseURL: string) => {
  const api = axios.create({
    baseURL,
    withCredentials: true, 
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
          // httpOnly cookie is sent automatically
          const res = await axios.post(
            `${AUTH_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          // Only accessToken comes back in the body
          setAccessToken(res.data.accessToken);

          originalRequest.headers.Authorization =
            `Bearer ${res.data.accessToken}`;

          return api(originalRequest);
        } catch {
          // Refresh failed — clear access token and redirect to login
          clearTokens();
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};