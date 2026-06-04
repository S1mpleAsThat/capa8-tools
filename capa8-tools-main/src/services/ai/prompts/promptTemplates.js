// src/services/ai/prompts/promptTemplates.js

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

export function buildPromptPayload({
  input = "",
  type = "Prompt para ChatGPT",
} = {}) {
  const selectedTemplate =
    promptTemplates[type] ||
    promptTemplates[
      "Prompt para ChatGPT"
    ];

  return {
    type,
    input,
    intro: selectedTemplate.intro,
    instruction:
      selectedTemplate.instruction,
  };
}

export { promptTemplates };