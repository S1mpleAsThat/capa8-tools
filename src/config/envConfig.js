// src/config/envConfig.js

const env = import.meta.env || {};

export const APP_NAME = env.VITE_APP_NAME || "CAPA 8 TOOLS";

export const ENV_AI_PROVIDER = env.VITE_AI_PROVIDER || "local";

export const ENV_AI_MODE = env.VITE_AI_MODE || "mock";

export const ENV_AI_MAX_INPUT_LENGTH =
  Number(env.VITE_AI_MAX_INPUT_LENGTH) || 1500;

export const ENV_AI_MAX_TOKENS =
  Number(env.VITE_AI_MAX_TOKENS) || 800;

export const ENV_AI_RETRY_COUNT =
  Number(env.VITE_AI_RETRY_COUNT) || 1;

export const ENV_AI_TEMPERATURE =
  Number(env.VITE_AI_TEMPERATURE) || 0.7;

export const ENV_AI_TIMEOUT =
  Number(env.VITE_AI_TIMEOUT) || 12000;

export const GOOGLE_CLIENT_ID =
  env.VITE_GOOGLE_CLIENT_ID || "";

export const GOOGLE_REDIRECT_URI =
  env.VITE_GOOGLE_REDIRECT_URI || "";