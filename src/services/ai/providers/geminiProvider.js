// src/services/ai/providers/geminiProvider.js

import {
  AI_MAX_TOKENS,
  AI_RETRY_COUNT,
  AI_TEMPERATURE,
  AI_TIMEOUT,
} from "../../../config/aiConfig";

import { buildPromptPayload } from "../prompts/promptTemplates";
import { withTimeout } from "../utils/timeout";

async function runGeminiRequest({
  input = "",
  type = "Prompt para ChatGPT",
} = {}) {
  const cleanInput = input.trim();

  if (!cleanInput) {
    return "";
  }

  const promptPayload = buildPromptPayload({
    input: cleanInput,
    type,
  });

  const preparedRequest = {
    provider: "gemini",
    model: "gemini-pro",
    temperature: AI_TEMPERATURE,
    maxTokens: AI_MAX_TOKENS,
    prompt: `${promptPayload.intro}

${promptPayload.instruction}

${cleanInput}`,
  };

  void preparedRequest;

  throw new Error(
    "Gemini provider preparado, pero la API real aún no está conectada.",
  );
}

export async function generateGeminiContent({
  input = "",
  type = "Prompt para ChatGPT",
} = {}) {
  let lastError = null;

  for (
    let attempt = 0;
    attempt <= AI_RETRY_COUNT;
    attempt += 1
  ) {
    try {
      const response = await withTimeout(
        runGeminiRequest({
          input,
          type,
        }),
        AI_TIMEOUT,
      );

      if (
        !response ||
        typeof response !== "string" ||
        !response.trim()
      ) {
        throw new Error(
          "Gemini devolvió una respuesta vacía.",
        );
      }

      return response.trim();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}