// src/services/aiService.js

import {
  AI_MAX_INPUT_LENGTH,
  AI_MODE,
  AI_PROVIDER,
} from "../config/aiConfig";

import { generateGeminiContent } from "./ai/providers/geminiProvider";
import {
  generateMockContent,
  generateLocalContent,
} from "./ai/providers/mockProvider";

function normalizeInput(input) {
  return typeof input === "string" ? input.trim() : "";
}

function normalizeType(type) {
  return typeof type === "string" && type.trim()
    ? type.trim()
    : "Prompt para ChatGPT";
}

function shouldUseGemini() {
  return (
    AI_PROVIDER === "gemini" ||
    AI_MODE === "gemini" ||
    AI_MODE === "production"
  );
}

export async function generateAIContent({
  input = "",
  type = "Prompt para ChatGPT",
} = {}) {
  const cleanInput = normalizeInput(input);
  const cleanType = normalizeType(type);

  if (!cleanInput) {
    return "";
  }

  const safeInput =
    cleanInput.length > AI_MAX_INPUT_LENGTH
      ? cleanInput.slice(0, AI_MAX_INPUT_LENGTH)
      : cleanInput;

  if (!shouldUseGemini()) {
    return generateMockContent({
      input: safeInput,
      type: cleanType,
    });
  }

  try {
    return await generateGeminiContent({
      input: safeInput,
      type: cleanType,
    });
  } catch {
    return generateLocalContent({
      input: safeInput,
      type: cleanType,
    });
  }
}