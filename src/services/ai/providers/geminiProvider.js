// src/services/ai/providers/geminiProvider.js

import {
  AI_RETRY_COUNT,
  AI_TIMEOUT,
} from "../../../config/aiConfig";

import { withTimeout } from "../utils/timeout";

async function runGeminiRequest({
  input = "",
  type = "Prompt para ChatGPT",
} = {}) {
  const cleanInput = input.trim();

  if (!cleanInput) {
    return "";
  }

  const response = await withTimeout(
    fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: cleanInput,
        type,
      }),
    }),
    AI_TIMEOUT,
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "La respuesta del servidor de IA no es válida.",
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "No se pudo generar contenido con Gemini.",
    );
  }

  if (
    !data?.text ||
    typeof data.text !== "string" ||
    !data.text.trim()
  ) {
    throw new Error(
      "Gemini devolvió una respuesta vacía.",
    );
  }

  return data.text.trim();
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
      return await runGeminiRequest({
        input,
        type,
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}