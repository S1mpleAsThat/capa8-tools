// src/services/ai/providers/groqProvider.js

import {
  AI_RETRY_COUNT,
  AI_TIMEOUT,
} from "../../../config/aiConfig";

import { withTimeout } from "../utils/timeout";

import { CapacitorHttp } from "@capacitor/core";

async function runGroqRequest({
  input = "",
  type = "Prompt para ChatGPT",
} = {}) {
  const cleanInput = typeof input === "string" ? input.trim() : "";
  const cleanType =
    typeof type === "string" && type.trim()
      ? type.trim()
      : "Prompt para ChatGPT";

  if (!cleanInput) {
    return "";
  }
  
  console.log(
  "[GROQ] Calling:",
  "https://capa8-tools.vercel.app/api/groq"
);

  const response = await CapacitorHttp.post({
  url: "https://capa8-tools.vercel.app/api/groq",
  headers: {
    "Content-Type": "application/json",
  },
  data: {
    input: cleanInput,
    type: cleanType,
  },
});

const data = response.data || null;
  
  console.log(
  "[GROQ] Status:",
  response.status
);

  if (!(response.status >= 200 && response.status < 300)) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Groq request failed with status ${response.status}.`,
    );
  }

  if (!data?.text || typeof data.text !== "string") {
    throw new Error("Groq devolvió una respuesta vacía.");
  }

  return data.text.trim();
}

export async function generateGroqContent({
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
        runGroqRequest({
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
          "Groq devolvió una respuesta vacía.",
        );
      }

      return response.trim();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}