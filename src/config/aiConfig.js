// src/config/aiConfig.js

import {
  ENV_AI_MAX_INPUT_LENGTH,
  ENV_AI_MAX_TOKENS,
  ENV_AI_MODE,
  ENV_AI_PROVIDER,
  ENV_AI_RETRY_COUNT,
  ENV_AI_TEMPERATURE,
  ENV_AI_TIMEOUT,
} from "./envConfig";

export const AI_PROVIDER =
  ENV_AI_PROVIDER || "mock";

export const AI_MODE =
  ENV_AI_MODE || "mock";

export const AI_MAX_INPUT_LENGTH =
  ENV_AI_MAX_INPUT_LENGTH || 1500;

export const AI_TEMPERATURE =
  ENV_AI_TEMPERATURE ?? 0.7;

export const AI_MAX_TOKENS =
  ENV_AI_MAX_TOKENS || 800;

export const AI_TIMEOUT =
  ENV_AI_TIMEOUT || 20000;

export const AI_RETRY_COUNT =
  ENV_AI_RETRY_COUNT || 2;