import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  PORT: getEnv('PORT'),

  DB_NAME: getEnv('DB_NAME'),
  DB_USER: getEnv('DB_USER'),
  DB_PASSWORD: getEnv('DB_PASSWORD'),
  DB_HOST: getEnv('DB_HOST'),

  JWT_ACCESS_SECRET: getEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),

  ACCESS_TOKEN_EXPIRY: getEnv('ACCESS_TOKEN_EXPIRY'),
  REFRESH_TOKEN_EXPIRY: getEnv('REFRESH_TOKEN_EXPIRY'),

  EMAIL_HOST:getEnv('EMAIL_HOST'),
  EMAIL_PORT:getEnv('EMAIL_PORT'),
  EMAIL_USER:getEnv('EMAIL_USER'),
  EMAIL_PASS:getEnv('EMAIL_PASS'),
  EMAIL_FROM:getEnv('EMAIL_FROM'),


};