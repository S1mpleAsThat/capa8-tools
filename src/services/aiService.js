// src/services/aiService.js

import {
  AI_MAX_INPUT_LENGTH,
  AI_MODE,
  AI_PROVIDER,
} from "../config/aiConfig";

import { trackAdAction } from "./ads/adService";

import { generateGeminiContent } from "./ai/providers/geminiProvider";
import { generateGroqContent } from "./ai/providers/groqProvider";
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

function shouldUseGroqDirectly() {
  return AI_PROVIDER === "groq" || AI_MODE === "groq";
}

function isRecoverableProviderError(error) {
  const message = String(
    error?.message || error || "",
  ).toLowerCase();

  return (
    message.includes("429") ||
    message.includes("too many requests") ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("rate_limit") ||
    message.includes("unavailable") ||
    message.includes("overloaded") ||
    message.includes("timeout") ||
    message.includes("network") ||
    message.includes("failed")
  );
}

function trackGeneration(reason) {
  try {
    trackAdAction(reason);
  } catch {
    return;
  }
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

  if (!shouldUseGemini() && !shouldUseGroqDirectly()) {
    const result = await generateMockContent({
      input: safeInput,
      type: cleanType,
    });

    trackGeneration("ai-generation-mock");

    return result;
  }

  if (shouldUseGroqDirectly()) {
    try {
      console.log("[AI] Using Groq");

      const groqResult = await generateGroqContent({
        input: safeInput,
        type: cleanType,
      });

      trackGeneration("ai-generation-groq");

      return groqResult;
    } catch (groqError) {
      console.log("[AI] Groq failed", groqError);
      console.log("[AI] Using Local Fallback");

      const localResult = generateLocalContent({
        input: safeInput,
        type: cleanType,
      });

      trackGeneration("ai-generation-local-fallback");

      return localResult;
    }
  }

  try {
    console.log("[AI] Using Gemini");

    const geminiResult = await generateGeminiContent({
      input: safeInput,
      type: cleanType,
    });

    trackGeneration("ai-generation-gemini");

    return geminiResult;
  } catch (geminiError) {
    console.log("[AI] Gemini failed", geminiError);

    if (!isRecoverableProviderError(geminiError)) {
      console.log("[AI] Using Groq");
    } else {
      console.log("[AI] Using Groq");
    }

    try {
      const groqResult = await generateGroqContent({
        input: safeInput,
        type: cleanType,
      });

      trackGeneration("ai-generation-groq-fallback");

      return groqResult;
    } catch (groqError) {
      console.log("[AI] Groq failed", groqError);
      console.log("[AI] Using Local Fallback");

      const localResult = generateLocalContent({
        input: safeInput,
        type: cleanType,
      });

      trackGeneration("ai-generation-local-fallback");

      return localResult;
    }
  }
}