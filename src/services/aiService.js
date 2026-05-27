// src/services/aiService.js

// Future Gemini API integration goes here

export async function generateAIContent({
  input,
  type,
}) {
  const cleanInput = input.trim();

  if (!cleanInput) {
    return "Escribe una idea, problema o contexto para generar el contenido.";
  }

  if (type === "Prompt para ChatGPT") {
    return `Actúa como un asistente experto y ayúdame con lo siguiente:

Contexto:
${cleanInput}

Necesito una respuesta clara, ordenada y práctica. Entrega pasos concretos, evita relleno y prioriza una solución fácil de aplicar.`;
  }

  if (type === "Mensaje profesional") {
    return `Hola, espero que estés bien.

Te escribo para comentar lo siguiente: ${cleanInput}

Quedo atento a tus comentarios para coordinar los próximos pasos.

Saludos.`;
  }

  if (type === "Respuesta para WhatsApp") {
    return `Hola, gracias por escribirme.

Sobre lo que me comentas: ${cleanInput}

Lo reviso y te confirmo apenas tenga una respuesta más clara.`;
  }

  return `🚀 ${cleanInput}

Una solución práctica, rápida y pensada para optimizar el trabajo digital.

#Productividad #Tecnología #HerramientasDigitales`;
}