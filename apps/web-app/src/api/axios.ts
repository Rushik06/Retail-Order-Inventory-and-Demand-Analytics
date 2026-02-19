import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../utils/token";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        const res = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          { refreshToken }
        );

        setTokens(res.data.accessToken, refreshToken!);

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch {
        clearTokens();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;