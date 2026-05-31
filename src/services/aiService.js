// src/services/aiService.js

import {
  AI_MAX_INPUT_LENGTH,
  AI_MODE,
  AI_PROVIDER,
} from "../config/aiConfig";

import { trackAdAction } from "./ads/adService";

import { generateGeminiContent } from "./ai/providers/geminiProvider";
import { generateGroqContent } from "./ai/providers/groqProvider";
import { generateMockContent } from "./ai/providers/mockProvider";

function normalizeInput(input) {
  return typeof input === "string" ? input.trim() : "";
}

function normalizeType(type) {
  return typeof type === "string" && type.trim()
    ? type.trim()
    : "Prompt para ChatGPT";
}

function isProductionMode() {
  return AI_MODE === "production";
}

function shouldUseGemini() {
  return AI_PROVIDER === "gemini" || AI_MODE === "gemini";
}

function shouldUseGroqDirectly() {
  return (
    AI_PROVIDER === "groq" ||
    AI_MODE === "groq" ||
    AI_MODE === "production"
  );
}

function trackGeneration(reason) {
  try {
    trackAdAction(reason);
  } catch {
    return;
  }
}

function buildProviderError(providerName, error) {
  const message =
    error?.message ||
    String(error || "") ||
    "Error desconocido del proveedor IA";

  return new Error(
    `[AI_PROVIDER_ERROR] ${providerName} falló. Fallback local bloqueado para diagnóstico. Error real: ${message}`,
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

  console.log("[AI] Config", {
    provider: AI_PROVIDER,
    mode: AI_MODE,
    production: isProductionMode(),
  });

  if (isProductionMode() && AI_PROVIDER !== "groq") {
    throw new Error(
      `[AI_CONFIG_ERROR] En production el provider debe ser groq. Provider actual: ${AI_PROVIDER}`,
    );
  }

  if (!shouldUseGemini() && !shouldUseGroqDirectly()) {
    if (isProductionMode()) {
      throw new Error(
        "[AI_CONFIG_ERROR] Modo production activo, pero no hay provider remoto válido configurado.",
      );
    }

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
      console.error("[AI] Groq failed", groqError);

      throw buildProviderError("Groq", groqError);
    }
  }

  if (shouldUseGemini()) {
    try {
      console.log("[AI] Using Gemini");

      const geminiResult = await generateGeminiContent({
        input: safeInput,
        type: cleanType,
      });

      trackGeneration("ai-generation-gemini");

      return geminiResult;
    } catch (geminiError) {
      console.error("[AI] Gemini failed", geminiError);

      throw buildProviderError("Gemini", geminiError);
    }
  }

  throw new Error(
    `[AI_CONFIG_ERROR] Configuración IA inválida. Provider: ${AI_PROVIDER}. Mode: ${AI_MODE}`,
  );
}