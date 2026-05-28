// src/services/checklistAIService.js

import { generateAIContent } from "./aiService";

import {
  buildChecklistPromptByAction,
} from "./ai/prompts/checklistPrompts";

function normalizeChecklistItems(items = []) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id:
        typeof item.id === "string"
          ? item.id
          : `checklist-item-${Date.now()}-${index}`,
      text:
        typeof item.text === "string"
          ? item.text
          : "",
      completed: Boolean(item.completed),
      custom: Boolean(item.custom),
    }))
    .filter((item) => item.text.trim());
}

export function buildChecklistContext(checklistItems = []) {
  const safeItems = normalizeChecklistItems(checklistItems);

  const completedItems = safeItems.filter((item) => item.completed);
  const pendingItems = safeItems.filter((item) => !item.completed);

  return {
    totalItems: safeItems.length,
    completedItems,
    pendingItems,
    checklistItems: safeItems,
  };
}

export function buildIncidentSummary(aiResult = "") {
  if (typeof aiResult !== "string" || !aiResult.trim()) {
    return "";
  }

  const clean = aiResult.trim().replace(/\s+/g, " ");

  return clean.length > 180 ? `${clean.slice(0, 180)}...` : clean;
}

export async function generateChecklistAIResponse({
  action = "analyze",
  checklistItems = [],
  language = "es",
  userName = "",
} = {}) {
  const safeAction =
    typeof action === "string" && action.trim()
      ? action
      : "analyze";

  const prompt = buildChecklistPromptByAction({
    action: safeAction,
    checklistItems: normalizeChecklistItems(checklistItems),
    language,
    userName,
  });

  try {
    const result = await generateAIContent({
      input: prompt,
      type: "Prompt para ChatGPT",
    });

    if (typeof result !== "string" || !result.trim()) {
      throw new Error("Invalid AI response.");
    }

    return result.trim();
  } catch {
    return buildLocalChecklistFallback({
      action: safeAction,
      checklistItems,
      language,
    });
  }
}

export function buildLocalChecklistFallback({
  action = "analyze",
  checklistItems = [],
  language = "es",
} = {}) {
  const {
    completedItems,
    pendingItems,
    totalItems,
  } = buildChecklistContext(checklistItems);

  const isEnglish = language === "en";

  if (action === "next-step") {
    return isEnglish
      ? `Recommended next step:
Review the highest-impact pending validation.

Technical reason:
${pendingItems.length} pending tasks still require confirmation.

Immediate action:
Prioritize connectivity, logs, permissions and affected services.

Operational risk:
Skipping this validation may hide the root cause.`
      : `Siguiente paso recomendado:
Revisar la validación pendiente de mayor impacto técnico.

Motivo técnico:
Aún existen ${pendingItems.length} tareas pendientes por confirmar.

Acción inmediata:
Priorizar conectividad, logs, permisos y servicios afectados.

Riesgo operacional:
Omitir esta validación puede ocultar la causa raíz.`;
  }

  if (action === "solution") {
    return isEnglish
      ? `1. Detected issue
The operational workflow still requires validation.

2. Recommended solution
Complete pending checks and confirm system stability.

3. Exact steps
- Review logs
- Validate connectivity
- Confirm permissions
- Restart the affected service if needed
- Test again from a clean session

4. Final validation
Confirm stable operation and no recurring incident.`
      : `1. Problema detectado
El flujo operacional aún requiere validaciones.

2. Solución recomendada
Completar revisiones pendientes y confirmar estabilidad del sistema.

3. Pasos exactos
- Revisar logs
- Validar conectividad
- Confirmar permisos
- Reiniciar el servicio afectado si corresponde
- Probar nuevamente desde una sesión limpia

4. Validación final
Confirmar operación estable y que el incidente no se repite.`;
  }

  if (action === "report") {
    return isEnglish
      ? `Technical report

Total tasks: ${totalItems}
Completed tasks: ${completedItems.length}
Pending tasks: ${pendingItems.length}

Status:
Operational review completed with pending validations.

Recommendation:
Continue technical validation before closing the incident.`
      : `Reporte técnico

Total de tareas: ${totalItems}
Tareas completadas: ${completedItems.length}
Tareas pendientes: ${pendingItems.length}

Estado:
Revisión operacional realizada con validaciones pendientes.

Recomendación:
Continuar validaciones técnicas antes de cerrar el incidente.`;
  }

  return isEnglish
    ? `Technical analysis

Detected status:
Operational workflow partially completed.

Possible causes:
- Connectivity
- Permissions
- Service instability
- Environment configuration

Risk:
The incident may persist if pending validations are skipped.

Immediate recommendation:
Continue with pending checks and confirm service health.`
    : `Análisis técnico

Estado detectado:
Flujo operacional parcialmente completado.

Posibles causas:
- Conectividad
- Permisos
- Inestabilidad del servicio
- Configuración de entorno

Riesgo:
El incidente podría persistir si se omiten validaciones pendientes.

Recomendación inmediata:
Continuar con las revisiones pendientes y confirmar salud del servicio.`;
}

export function buildIncidentPayload({
  action = "analyze",
  aiResult = "",
  checklistItems = [],
  template = null,
} = {}) {
  const context = buildChecklistContext(checklistItems);

  const safeAction =
    typeof action === "string" && action.trim()
      ? action
      : "analyze";

  const safeResult =
    typeof aiResult === "string" ? aiResult.trim() : "";

  return {
    id: `incident-${Date.now()}`,
    title:
      template?.title && typeof template.title === "string"
        ? template.title
        : "Workflow operativo",
    category:
      template?.category && typeof template.category === "string"
        ? template.category
        : "General",
    createdAt: new Date().toISOString(),
    checklist: context.checklistItems,
    completedItems: context.completedItems,
    pendingItems: context.pendingItems,
    aiAction: safeAction,
    aiResult: safeResult,
    summary: buildIncidentSummary(safeResult),
    status: context.pendingItems.length === 0 ? "resolved" : "pending",
  };
}