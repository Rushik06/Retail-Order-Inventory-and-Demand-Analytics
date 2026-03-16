import { createApiClient } from "./api-client";

const api = createApiClient(import.meta.env.VITE_API_URL);

export default api;