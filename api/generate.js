// api/generate.js

const MAX_INPUT_LENGTH = 1500;
const MAX_OUTPUT_TOKENS = 800;
const TEMPERATURE = 0.7;

const GEMINI_API_VERSION = "v1beta";
const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

const promptTemplates = {
  "Prompt para ChatGPT": {
    intro:
      "Actúa como un asistente experto y responde de forma clara, práctica y estructurada.",
    instruction:
      "Usa el siguiente contexto para generar una respuesta útil, directa y lista para aplicar:",
  },
  "Mensaje profesional": {
    intro:
      "Redacta un mensaje profesional, cordial y claro.",
    instruction:
      "Mantén un tono formal, breve y orientado a solución usando este contexto:",
  },
  "Respuesta para WhatsApp": {
    intro:
      "Redacta una respuesta breve y natural para WhatsApp.",
    instruction:
      "Usa un tono cercano, claro y directo considerando este contexto:",
  },
  "Publicación redes sociales": {
    intro:
      "Crea una publicación atractiva para redes sociales.",
    instruction:
      "Usa un mensaje claro, con energía profesional y enfoque en valor usando este contexto:",
  },
};

function sendJson(response, statusCode, data) {
  response.setHeader("Content-Type", "application/json");
  response.status(statusCode).json(data);
}

function normalizeType(type) {
  return typeof type === "string" && promptTemplates[type]
    ? type
    : "Prompt para ChatGPT";
}

function buildPrompt({ input, type }) {
  const selectedType = normalizeType(type);
  const template = promptTemplates[selectedType];

  return `${template.intro}

${template.instruction}

${input}`;
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => part?.text || "")
    .join("")
    .trim();
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, {
      error: "Method not allowed.",
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    sendJson(response, 500, {
      error: "Gemini API key is not configured.",
    });
    return;
  }

  try {
    const body = request.body || {};
    const rawInput = typeof body.input === "string" ? body.input : "";
    const input = rawInput.trim();
    const type = normalizeType(body.type);

    if (!input) {
      sendJson(response, 400, {
        error: "Input is required.",
      });
      return;
    }

    if (input.length > MAX_INPUT_LENGTH) {
      sendJson(response, 413, {
        error: `Input is too long. Maximum ${MAX_INPUT_LENGTH} characters allowed.`,
      });
      return;
    }

    const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
    const prompt = buildPrompt({
      input,
      type,
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${model}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: TEMPERATURE,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      sendJson(response, geminiResponse.status, {
        error:
          data?.error?.message ||
          "Gemini request failed.",
      });
      return;
    }

    const text = extractGeminiText(data);

    if (!text) {
      sendJson(response, 502, {
        error: "Gemini returned an empty response.",
      });
      return;
    }

    sendJson(response, 200, {
      text,
    });
  } catch {
    sendJson(response, 500, {
      error: "Unexpected server error.",
    });
  }
}