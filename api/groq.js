// api/groq.js

const DEFAULT_MODEL = "llama-3.1-8b-instant";
const MAX_INPUT_LENGTH = 6000;

function sendJson(response, statusCode, data) {
  response.status(statusCode).json(data);
}

function normalizeInput(input) {
  return typeof input === "string" ? input.trim() : "";
}

function normalizeType(type) {
  return typeof type === "string" && type.trim()
    ? type.trim()
    : "Prompt para ChatGPT";
}

function buildSystemPrompt(type) {
  if (type === "Mensaje profesional") {
    return "Eres un asistente experto en redacción profesional. Responde en español claro, directo, útil y listo para copiar.";
  }

  if (type === "Respuesta para WhatsApp") {
    return "Eres un asistente experto en comunicación breve para WhatsApp. Responde natural, claro, cordial y directo.";
  }

  if (type === "Publicación redes sociales") {
    return "Eres un asistente experto en contenido para redes sociales. Genera textos atractivos, claros, profesionales y accionables.";
  }

  return "Eres un asistente experto en productividad, soporte técnico, operaciones y automatización. Responde de forma clara, práctica, estructurada y lista para aplicar.";
}

function buildUserPrompt({ input, type }) {
  return `Tipo de generación: ${type}

Contexto del usuario:
${input}

Entrega una respuesta útil, bien estructurada y directamente aplicable.`;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", ["POST"]);
    sendJson(response, 405, {
      error: "Method not allowed.",
    });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    sendJson(response, 500, {
      error: "Missing GROQ_API_KEY.",
    });
    return;
  }

  try {
    const input = normalizeInput(request.body?.input);
    const type = normalizeType(request.body?.type);

    if (!input) {
      sendJson(response, 400, {
        error: "Input is required.",
      });
      return;
    }

    const safeInput =
      input.length > MAX_INPUT_LENGTH
        ? input.slice(0, MAX_INPUT_LENGTH)
        : input;

    const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          max_tokens: 900,
          messages: [
            {
              role: "system",
              content: buildSystemPrompt(type),
            },
            {
              role: "user",
              content: buildUserPrompt({
                input: safeInput,
                type,
              }),
            },
          ],
        }),
      },
    );

    const data = await groqResponse.json().catch(() => null);

    if (!groqResponse.ok) {
      sendJson(response, groqResponse.status, {
        error:
          data?.error?.message ||
          data?.message ||
          "Groq request failed.",
      });
      return;
    }

    const text =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      "";

    if (!text || typeof text !== "string") {
      sendJson(response, 502, {
        error: "Groq returned an empty response.",
      });
      return;
    }

    sendJson(response, 200, {
      text: text.trim(),
    });
  } catch (error) {
    sendJson(response, 500, {
      error:
        error?.message ||
        "Unexpected Groq serverless error.",
    });
  }
}