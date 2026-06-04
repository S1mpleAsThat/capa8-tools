// src/services/ai/providers/geminiProvider.js

import {
  AI_RETRY_COUNT,
  AI_TIMEOUT,
} from "../../../config/aiConfig";

import { withTimeout } from "../utils/timeout";

const RETRY_DELAY_BASE = 1500;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableError(error) {
  const message = String(error?.message || "").toLowerCase();

  return (
    message.includes("429") ||
    message.includes("too many requests") ||
    message.includes("quota") ||
    message.includes("overloaded") ||
    message.includes("rate")
  );
}

async function runGeminiRequest({
  input = "",
  type = "Prompt para ChatGPT",
} = {}) {
  const cleanInput = input.trim();

  if (!cleanInput) {
    return "";
  }
  
  console.log(
  "[GEMINI] Calling:",
  "https://capa8-tools.vercel.app/api/generate"
);

  const response = await withTimeout(
    fetch("https://capa8-tools.vercel.app/api/generate", {
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
  
  console.log(
  "[GEMINI] Status:",
  response.status
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
      `${response.status}: ${
        data?.error ||
        "No se pudo generar contenido con Gemini."
      }`,
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

      const hasMoreAttempts = attempt < AI_RETRY_COUNT;

      if (!hasMoreAttempts || !isRetryableError(error)) {
        break;
      }

      await sleep(RETRY_DELAY_BASE * (attempt + 1));
    }
  }

  throw lastError;
}