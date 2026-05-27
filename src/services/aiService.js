// src/services/aiService.js

import {
  AI_PROVIDER,
} from "../config/aiConfig";

import { generateMockContent } from "./ai/providers/mockProvider";
import { generateGeminiContent } from "./ai/providers/geminiProvider";

function normalizeProvider(provider) {
  if (provider === "gemini") {
    return "gemini";
  }

  return "mock";
}

export async function generateAIContent({
  input = "",
  type = "Prompt para ChatGPT",
  provider = AI_PROVIDER,
} = {}) {
  const selectedProvider =
    normalizeProvider(provider);

  if (selectedProvider === "gemini") {
    try {
      return await generateGeminiContent({
        input,
        type,
      });
    } catch {
      return generateMockContent({
        input,
        type,
      });
    }
  }

  return generateMockContent({
    input,
    type,
  });
}

export {
  generateMockContent,
  generateGeminiContent,
};