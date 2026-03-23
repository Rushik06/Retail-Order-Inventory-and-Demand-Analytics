
export const setAccessToken = (token: string): void =>
  localStorage.setItem("accessToken", token);

export const getAccessToken = (): string | null =>
  localStorage.getItem("accessToken");

export const clearTokens = (): void =>
  localStorage.removeItem("accessToken");
