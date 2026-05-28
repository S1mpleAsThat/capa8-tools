// src/services/ai/prompts/checklistPrompts.js

function normalizeChecklistItems(items = []) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => ({
    index: index + 1,
    text: typeof item?.text === "string" ? item.text : "",
    completed: Boolean(item?.completed),
    custom: Boolean(item?.custom),
  }));
}

function buildChecklistSummary(items = []) {
  const safeItems = normalizeChecklistItems(items);

  if (safeItems.length === 0) {
    return "No hay tareas registradas.";
  }

  return safeItems
    .map((item) => {
      const status = item.completed ? "COMPLETADA" : "PENDIENTE";
      const origin = item.custom ? "manual" : "base";

      return `${item.index}. [${status}] (${origin}) ${item.text}`;
    })
    .join("\n");
}

function buildBaseContext({
  checklistItems = [],
  language = "es",
  userName = "",
} = {}) {
  const safeItems = normalizeChecklistItems(checklistItems);
  const completedCount = safeItems.filter((item) => item.completed).length;
  const totalCount = safeItems.length;
  const pendingCount = Math.max(totalCount - completedCount, 0);
  const responseLanguage = language === "en" ? "English" : "Spanish";

  return `Idioma de respuesta: ${responseLanguage}
Usuario: ${userName || "Usuario CAPA 8 TOOLS"}
Fecha: ${new Date().toLocaleString("es-CL")}

Estado actual:
- Total de pasos: ${totalCount}
- Pasos completados: ${completedCount}
- Pasos pendientes: ${pendingCount}

Checklist:
${buildChecklistSummary(checklistItems)}`;
}

export function buildChecklistPromptByAction({
  action = "analyze",
  checklistItems = [],
  language = "es",
  userName = "",
} = {}) {
  const context = buildBaseContext({
    checklistItems,
    language,
    userName,
  });

  if (action === "next-step") {
    return `Actúa como especialista senior en soporte TI y operaciones.

Analiza el checklist y sugiere el siguiente paso lógico.

${context}

Formato obligatorio:
- Siguiente paso recomendado
- Motivo técnico
- Acción exacta
- Riesgo si se omite

Respuesta corta, técnica y accionable.`;
  }

  if (action === "solution") {
    return `Actúa como especialista técnico en soporte TI, DevOps y resolución operacional.

Genera una solución concreta basada en el checklist.

${context}

Formato obligatorio:
1. Problema detectado
2. Solución recomendada
3. Pasos exactos
4. Validación final

Evita teoría innecesaria. Prioriza ejecución.`;
  }

  if (action === "report") {
    return `Actúa como coordinador de soporte TI.

Convierte este checklist en un reporte técnico profesional listo para enviar.

${context}

Formato obligatorio:
- Fecha
- Usuario
- Checklist realizado
- Pasos completados
- Diagnóstico IA
- Solución IA
- Estado final

Tono profesional, claro y orientado a cliente.`;
  }

  return `Actúa como analista técnico de soporte, DevOps y operaciones.

Analiza el checklist, detecta bloqueos, infiere causa raíz y recomienda acción inmediata.

${context}

Formato obligatorio:
- Diagnóstico detectado
- Posibles causas
- Riesgo
- Recomendación inmediata

Sé preciso, técnico y útil.`;
}