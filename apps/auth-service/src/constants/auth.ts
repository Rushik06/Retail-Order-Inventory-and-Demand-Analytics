export const AUTH = {
  REFRESH_TOKEN_TTL_SECONDS: Number(process.env.REFRESH_TOKEN_TTL_SECONDS) || 7 * 24 * 60 * 60,
  COOKIE_MAX_AGE: Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: AUTH.COOKIE_MAX_AGE,
} as const;