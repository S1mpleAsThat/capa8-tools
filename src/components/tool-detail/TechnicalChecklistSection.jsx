// src/components/tool-detail/TechnicalChecklistSection.jsx

import { useEffect, useMemo, useState } from "react";

import { checklistTemplates } from "../../data/checklistTemplates";
import useLanguage from "../../hooks/useLanguage";
import {
  getUserItem,
  setUserItem,
} from "../../services/storage/userStorage";

import { generateChecklistAIResponse } from "../../services/checklistAIService";

const CHECKLIST_AI_KEY = "technical-checklist-ai";
const CHECKLIST_INCIDENTS_KEY = "technical-checklist-incidents";

const emptyAIState = {
  aiSuggestion: "",
  aiAnalysis: "",
  aiSolution: "",
  aiReport: "",
};

function buildIncidentStatus(checklistItems = []) {
  if (!Array.isArray(checklistItems) || checklistItems.length === 0) {
    return "0%";
  }

  const completed = checklistItems.filter((item) => item?.completed).length;
  const progress = Math.round((completed / checklistItems.length) * 100);

  return `${progress}%`;
}

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

function normalizeIncident(incident) {
  if (!incident || typeof incident !== "object") {
    return null;
  }

  const aiReport =
    typeof incident.aiReport === "string"
      ? incident.aiReport
      : "";

  const aiAnalysis =
    typeof incident.aiAnalysis === "string"
      ? incident.aiAnalysis
      : "";

  const aiSolution =
    typeof incident.aiSolution === "string"
      ? incident.aiSolution
      : "";

  const createdAt =
    typeof incident.createdAt === "string"
      ? incident.createdAt
      : new Date().toLocaleString("es-CL");

  return {
    id:
      typeof incident.id === "string"
        ? incident.id
        : `incident-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title:
      typeof incident.title === "string" && incident.title.trim()
        ? incident.title
        : "Checklist técnico",
    createdAt,
    checklist: normalizeChecklistItems(incident.checklist),
    aiAnalysis,
    aiSolution,
    aiReport,
    status:
      typeof incident.status === "string" && incident.status.trim()
        ? incident.status
        : "0%",
  };
}

function normalizeIncidents(items = []) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map(normalizeIncident).filter(Boolean);
}

function downloadTextFile(fileName, text) {
  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export default function TechnicalChecklistSection({
  userId,
  userName,
  checklistItems,
  newChecklistItem,
  setNewChecklistItem,
  handleToggleChecklistItem,
  handleAddChecklistItem,
  handleDeleteChecklistItem,
  handleResetChecklist,
  handleLoadChecklistTemplate,
  onBack,
}) {
  const languageContext = useLanguage();

  const t = languageContext?.t || {};
  const language = languageContext?.language || "es";

  const safeChecklistLabels = t?.checklist || {};
  const safeChecklistAI = t?.checklistAI || {};
  const safeAI = t?.ai || {};

  const safeChecklistItems = useMemo(
    () => normalizeChecklistItems(checklistItems),
    [checklistItems],
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState(
    checklistTemplates[0]?.id || "",
  );

  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiSolution, setAiSolution] = useState("");
  const [aiReport, setAiReport] = useState("");

  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingSolution, setLoadingSolution] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const [aiError, setAiError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [exportStatus, setExportStatus] = useState("");
  const [incidentHistory, setIncidentHistory] = useState([]);

  const selectedTemplate = useMemo(
    () =>
      checklistTemplates.find((template) => template.id === selectedTemplateId) ||
      checklistTemplates[0],
    [selectedTemplateId],
  );

  const backHomeLabel =
    language === "en" ? "← Back to Home" : "← Volver al inicio";

  const labels =
    language === "en"
      ? {
          templatesEyebrow: "TECHNICAL TEMPLATES",
          templatesTitle: "Load operational workflow",
          templatesText:
            "Use a predefined technical template without losing manual checklist support.",
          loadTemplate: "Load template",
          aiSuggestionTitle: "NEXT STEP",
          aiAnalysisTitle: "TECHNICAL ANALYSIS",
          aiSolutionTitle: "SOLUTION",
          aiReportTitle: "TECHNICAL REPORT",
          copyReport: "Copy report",
          exportReport: "Export TXT",
          copied: "Report copied.",
          exported: "TXT exported.",
          incidentTitle: "Incident history",
          incidentEmpty: "No saved incidents yet.",
          clearAI: "Clear AI results",
          loadingSuggestion: "Suggesting...",
          loadingAnalysis: "Analyzing...",
          loadingSolution: "Generating solution...",
          loadingReport: "Creating report...",
        }
      : {
          templatesEyebrow: "PLANTILLAS TÉCNICAS",
          templatesTitle: "Cargar workflow operativo",
          templatesText:
            "Usa una plantilla técnica predefinida sin perder soporte para checklist manual.",
          loadTemplate: "Cargar plantilla",
          aiSuggestionTitle: "SIGUIENTE PASO",
          aiAnalysisTitle: "ANÁLISIS TÉCNICO",
          aiSolutionTitle: "SOLUCIÓN",
          aiReportTitle: "REPORTE TÉCNICO",
          copyReport: "Copiar reporte",
          exportReport: "Exportar TXT",
          copied: "Reporte copiado.",
          exported: "TXT exportado.",
          incidentTitle: "Historial de incidentes",
          incidentEmpty: "Aún no hay incidentes guardados.",
          clearAI: "Limpiar resultados IA",
          loadingSuggestion: "Sugiriendo...",
          loadingAnalysis: "Analizando...",
          loadingSolution: "Generando solución...",
          loadingReport: "Creando reporte...",
        };

  const isAILoading =
    loadingSuggestion ||
    loadingAnalysis ||
    loadingSolution ||
    loadingReport;

  useEffect(() => {
    if (!userId) {
      setAiSuggestion("");
      setAiAnalysis("");
      setAiSolution("");
      setAiReport("");
      setIncidentHistory([]);
      return;
    }

    try {
      const savedAIState = getUserItem(userId, CHECKLIST_AI_KEY, emptyAIState);
      const savedIncidents = getUserItem(userId, CHECKLIST_INCIDENTS_KEY, []);

      setAiSuggestion(
        typeof savedAIState?.aiSuggestion === "string"
          ? savedAIState.aiSuggestion
          : "",
      );

      setAiAnalysis(
        typeof savedAIState?.aiAnalysis === "string"
          ? savedAIState.aiAnalysis
          : "",
      );

      setAiSolution(
        typeof savedAIState?.aiSolution === "string"
          ? savedAIState.aiSolution
          : "",
      );

      setAiReport(
        typeof savedAIState?.aiReport === "string"
          ? savedAIState.aiReport
          : "",
      );

      const normalizedIncidents = normalizeIncidents(savedIncidents);

      setIncidentHistory(normalizedIncidents);
      setUserItem(userId, CHECKLIST_INCIDENTS_KEY, normalizedIncidents);
    } catch {
      setAiSuggestion("");
      setAiAnalysis("");
      setAiSolution("");
      setAiReport("");
      setIncidentHistory([]);
      setUserItem(userId, CHECKLIST_INCIDENTS_KEY, []);
      setUserItem(userId, CHECKLIST_AI_KEY, emptyAIState);
    }
  }, [userId]);

  function saveAIState(nextState) {
    if (!userId) {
      return;
    }

    setUserItem(userId, CHECKLIST_AI_KEY, nextState);
  }

  function updateAIState(partialState) {
    const nextState = {
      aiSuggestion,
      aiAnalysis,
      aiSolution,
      aiReport,
      ...partialState,
    };

    setAiSuggestion(nextState.aiSuggestion);
    setAiAnalysis(nextState.aiAnalysis);
    setAiSolution(nextState.aiSolution);
    setAiReport(nextState.aiReport);

    saveAIState(nextState);
  }

  function saveIncident(nextReport) {
    if (!userId || !nextReport) {
      return;
    }

    const nextIncident = {
      id: `incident-${Date.now()}`,
      title:
        selectedTemplate?.title ||
        (language === "en" ? "Technical checklist" : "Checklist técnico"),
      createdAt: new Date().toLocaleString("es-CL"),
      checklist: safeChecklistItems,
      aiAnalysis,
      aiSolution,
      aiReport: nextReport,
      status: buildIncidentStatus(safeChecklistItems),
    };

    const normalizedIncident = normalizeIncident(nextIncident);

    if (!normalizedIncident) {
      return;
    }

    const nextHistory = normalizeIncidents([
      normalizedIncident,
      ...incidentHistory,
    ]).slice(0, 10);

    setIncidentHistory(nextHistory);
    setUserItem(userId, CHECKLIST_INCIDENTS_KEY, nextHistory);
  }

  async function handleChecklistAIAction(action) {
    if (isAILoading) {
      return;
    }

    setAiError("");
    setCopyStatus("");
    setExportStatus("");

    if (action === "next-step") {
      setLoadingSuggestion(true);
    }

    if (action === "analyze") {
      setLoadingAnalysis(true);
    }

    if (action === "solution") {
      setLoadingSolution(true);
    }

    if (action === "report") {
      setLoadingReport(true);
    }

    try {
      const result = await generateChecklistAIResponse({
        action,
        checklistItems: safeChecklistItems,
        language,
        userName,
      });

      if (action === "next-step") {
        updateAIState({
          aiSuggestion: result,
        });
      }

      if (action === "analyze") {
        updateAIState({
          aiAnalysis: result,
        });
      }

      if (action === "solution") {
        updateAIState({
          aiSolution: result,
        });
      }

      if (action === "report") {
        updateAIState({
          aiReport: result,
        });

        saveIncident(result);
      }
    } catch {
      setAiError(
        safeChecklistAI.error ||
          (language === "en"
            ? "AI analysis could not be completed."
            : "No se pudo completar el análisis inteligente del checklist."),
      );
    } finally {
      setLoadingSuggestion(false);
      setLoadingAnalysis(false);
      setLoadingSolution(false);
      setLoadingReport(false);
    }
  }
  function handleTemplateLoad() {
    if (!selectedTemplate || !handleLoadChecklistTemplate) {
      return;
    }

    handleLoadChecklistTemplate(selectedTemplate);
  }

  async function handleCopyReport() {
    if (!aiReport) {
      return;
    }

    try {
      await navigator.clipboard.writeText(aiReport);
      setCopyStatus(labels.copied);

      setTimeout(() => {
        setCopyStatus("");
      }, 1800);
    } catch {
      setCopyStatus(safeAI.error || "Error");
    }
  }

  function handleExportReport() {
    if (!aiReport) {
      return;
    }

    const date = new Date().toISOString().slice(0, 10);
    const safeName = selectedTemplate?.id || "technical-checklist";

    downloadTextFile(`capa8-${safeName}-report-${date}.txt`, aiReport);
    setExportStatus(labels.exported);

    setTimeout(() => {
      setExportStatus("");
    }, 1800);
  }

  function handleClearAIResults() {
    updateAIState(emptyAIState);
    setAiError("");
    setCopyStatus("");
    setExportStatus("");
  }

  function renderAIBlock(title, content) {
    if (!content) {
      return null;
    }

    return (
      <div
        className="tool-output"
        style={{
          marginTop: "18px",
        }}
      >
        <p
          style={{
            color: "#18ffad",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1px",
            marginBottom: "10px",
          }}
        >
          {title}
        </p>

        <p
          style={{
            whiteSpace: "pre-wrap",
            color: "rgba(255,255,255,.76)",
            fontSize: "14px",
            lineHeight: 1.58,
          }}
        >
          {content}
        </p>
      </div>
    );
  }

  return (
    <div className="tool-workspace">
      <div
        className="tool-output"
        style={{
          marginBottom: "18px",
        }}
      >
        <p
          style={{
            color: "#18ffad",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          {labels.templatesEyebrow}
        </p>

        <h3
          style={{
            marginBottom: "10px",
          }}
        >
          {labels.templatesTitle}
        </h3>

        <p
          style={{
            color: "rgba(255,255,255,.68)",
            fontSize: "14px",
            lineHeight: 1.5,
            marginBottom: "14px",
          }}
        >
          {labels.templatesText}
        </p>

        <select
          className="tool-select"
          value={selectedTemplateId}
          onChange={(event) => setSelectedTemplateId(event.target.value)}
        >
          {checklistTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.title} · {template.category}
            </option>
          ))}
        </select>

        <button
          className="ghost-btn tool-action-btn"
          type="button"
          onClick={handleTemplateLoad}
          style={{
            marginTop: "10px",
            width: "100%",
          }}
        >
          {labels.loadTemplate}
        </button>
      </div>

      <div className="tool-output">
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {safeChecklistItems.map((item) => (
            <label
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleChecklistItem(item.id)}
              />

              <span
                style={{
                  flex: 1,
                  textDecoration: item.completed ? "line-through" : "none",
                }}
              >
                {item.text}
              </span>

              {item.custom ? (
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={() => handleDeleteChecklistItem(item.id)}
                >
                  {safeChecklistLabels.delete || "Eliminar"}
                </button>
              ) : null}
            </label>
          ))}
        </div>
      </div>

      <textarea
        className="tool-input"
        value={newChecklistItem}
        onChange={(event) => setNewChecklistItem(event.target.value)}
        placeholder={safeChecklistLabels.placeholder || ""}
        rows="3"
      />

      <button
        className="primary-btn tool-action-btn"
        type="button"
        onClick={handleAddChecklistItem}
      >
        {safeChecklistLabels.add || "Agregar"}
      </button>

      <button
        className="ghost-btn tool-action-btn"
        type="button"
        onClick={handleResetChecklist}
      >
        {safeChecklistLabels.reset || "Reiniciar checklist"}
      </button>

      <div
        className="tool-output"
        style={{
          marginTop: "22px",
        }}
      >
        <p
          style={{
            color: "#18ffad",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          {safeChecklistAI.eyebrow || "CHECKLIST IA"}
        </p>

        <h3
          style={{
            marginBottom: "10px",
          }}
        >
          {safeChecklistAI.title || "Workflow inteligente"}
        </h3>

        <p
          style={{
            color: "rgba(255,255,255,.68)",
            fontSize: "14px",
            lineHeight: 1.5,
            marginBottom: "16px",
          }}
        >
          {safeChecklistAI.description || ""}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "10px",
          }}
        >
          <button
            className="ghost-btn tool-action-btn"
            type="button"
            disabled={isAILoading}
            onClick={() => handleChecklistAIAction("next-step")}
          >
            {loadingSuggestion
              ? labels.loadingSuggestion
              : safeChecklistAI.nextStep || "Sugerir siguiente paso"}
          </button>

          <button
            className="ghost-btn tool-action-btn"
            type="button"
            disabled={isAILoading}
            onClick={() => handleChecklistAIAction("analyze")}
          >
            {loadingAnalysis
              ? labels.loadingAnalysis
              : safeChecklistAI.analyze || "Analizar checklist"}
          </button>

          <button
            className="ghost-btn tool-action-btn"
            type="button"
            disabled={isAILoading}
            onClick={() => handleChecklistAIAction("solution")}
          >
            {loadingSolution
              ? labels.loadingSolution
              : safeChecklistAI.solution || "Generar solución"}
          </button>

          <button
            className="ghost-btn tool-action-btn"
            type="button"
            disabled={isAILoading}
            onClick={() => handleChecklistAIAction("report")}
          >
            {loadingReport
              ? labels.loadingReport
              : safeChecklistAI.report || "Convertir en reporte"}
          </button>
        </div>
      </div>

      {aiError ? (
        <div
          className="tool-output"
          style={{
            marginTop: "18px",
            border: "1px solid rgba(255,120,120,.18)",
            background: "rgba(120,0,0,.12)",
          }}
        >
          <p
            style={{
              color: "rgba(255,220,220,.88)",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            {safeChecklistAI.errorTitle || "ERROR IA"}
          </p>

          <p
            style={{
              whiteSpace: "pre-wrap",
              color: "rgba(255,255,255,.76)",
              fontSize: "14px",
              lineHeight: 1.58,
            }}
          >
            {aiError}
          </p>
        </div>
      ) : null}

      {renderAIBlock(labels.aiSuggestionTitle, aiSuggestion)}
      {renderAIBlock(labels.aiAnalysisTitle, aiAnalysis)}
      {renderAIBlock(labels.aiSolutionTitle, aiSolution)}
      {renderAIBlock(labels.aiReportTitle, aiReport)}

      {aiReport ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "14px",
          }}
        >
          <button
            className="ghost-btn tool-action-btn"
            type="button"
            onClick={handleCopyReport}
          >
            {labels.copyReport}
          </button>

          <button
            className="ghost-btn tool-action-btn"
            type="button"
            onClick={handleExportReport}
          >
            {labels.exportReport}
          </button>
        </div>
      ) : null}

      {copyStatus || exportStatus ? (
        <p
          style={{
            color: "#18ffad",
            fontSize: "12px",
            lineHeight: 1.4,
            marginTop: "10px",
          }}
        >
          {copyStatus || exportStatus}
        </p>
      ) : null}

      {aiSuggestion || aiAnalysis || aiSolution || aiReport ? (
        <button
          className="ghost-btn tool-action-btn"
          type="button"
          onClick={handleClearAIResults}
          style={{
            marginTop: "14px",
            width: "100%",
          }}
        >
          {labels.clearAI}
        </button>
      ) : null}

      <div
        className="tool-output"
        style={{
          marginTop: "22px",
        }}
      >
        <p
          style={{
            color: "#18ffad",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1px",
            marginBottom: "10px",
          }}
        >
          {labels.incidentTitle}
        </p>

        {incidentHistory.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: "10px",
            }}
          >
            {incidentHistory.slice(0, 5).map((incident) => (
              <div
                key={incident.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,255,170,.10)",
                  background: "rgba(0,0,0,.24)",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,.86)",
                    fontSize: "13px",
                    fontWeight: 800,
                    marginBottom: "4px",
                  }}
                >
                  {incident.title}
                </p>

                <p
                  style={{
                    color: "rgba(255,255,255,.48)",
                    fontSize: "11px",
                    lineHeight: 1.4,
                  }}
                >
                  {incident.createdAt} · {incident.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p
            style={{
              color: "rgba(255,255,255,.58)",
              fontSize: "13px",
              lineHeight: 1.45,
            }}
          >
            {labels.incidentEmpty}
          </p>
        )}
      </div>

      <div
        style={{
          marginTop: "28px",
          paddingTop: "4px",
        }}
      >
        <button
          className="ghost-btn tool-action-btn"
          type="button"
          onClick={onBack}
          style={{
            width: "100%",
            minHeight: "52px",
            borderRadius: "18px",
            border: "1px solid rgba(0,255,170,.18)",
            background:
              "linear-gradient(180deg, rgba(8,32,26,.74), rgba(0,0,0,.70))",
            boxShadow:
              "0 18px 42px rgba(0,0,0,.38), inset 0 0 22px rgba(0,255,170,.04), 0 0 24px rgba(0,255,170,.06)",
          }}
        >
          {backHomeLabel}
        </button>
      </div>
    </div>
  );
}