// src/services/ai/providers/mockProvider.js

import { buildPromptPayload } from "../prompts/promptTemplates";

export function simulateAIResponseDelay(
  delay = 600,
) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function buildLocalResult(type, input) {
  if (type === "Mensaje profesional") {
    return `Hola. Te comparto la información de forma clara para avanzar correctamente:

${input}

Quedo atento para revisar cualquier detalle adicional y continuar con la solución.`;
  }

  if (type === "Respuesta para WhatsApp") {
    return `Hola, gracias por avisar. Revisaremos esto con la información que nos compartiste:

${input}

Te confirmo apenas tengamos una actualización.`;
  }

  if (
    type === "Publicación redes sociales"
  ) {
    return `🚀 ${input}

Una buena herramienta digital no solo ahorra tiempo: también reduce errores, mejora procesos y permite avanzar con más claridad.

#Productividad #Tecnología #Automatización`;
  }

  return `Necesito que analices el siguiente contexto y generes una respuesta clara, útil y bien estructurada:

${input}

Entrega:
1. Diagnóstico breve.
2. Propuesta concreta.
3. Pasos recomendados.
4. Resultado final listo para usar.`;
}

export function generateLocalContent({
  input = "",
  type = "Prompt para ChatGPT",
} = {}) {
  const cleanInput = input.trim();

  if (!cleanInput) {
    return "";
  }

  const promptPayload = buildPromptPayload({
    input: cleanInput,
    type,
  });

  return `${promptPayload.intro}

${promptPayload.instruction}

${cleanInput}

Resultado sugerido:
${buildLocalResult(type, cleanInput)}`;
}

export async function generateMockContent({
  input = "",
  type = "Prompt para ChatGPT",
} = {}) {
  await simulateAIResponseDelay();

  return generateLocalContent({
    input,
    type,
  });
}