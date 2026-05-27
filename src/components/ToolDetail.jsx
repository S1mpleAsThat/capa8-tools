// src/components/ToolDetail.jsx

import { useEffect, useMemo, useRef, useState } from "react";

import { generateAIContent } from "../services/aiService";
import {
  getUserItem,
  getUserScopedKey,
  migrateGlobalKeyToUser,
  removeUserItem,
  setUserItem,
} from "../services/storage/userStorage";

import useAuth from "../hooks/useAuth";

import ToolHeader from "./tool-detail/ToolHeader";
import AIGeneratorSection from "./tool-detail/AIGeneratorSection";
import TechnicalChecklistSection from "./tool-detail/TechnicalChecklistSection";
import QuickTemplatesSection from "./tool-detail/QuickTemplatesSection";

const generatorTypes = [
  "Prompt para ChatGPT",
  "Mensaje profesional",
  "Respuesta para WhatsApp",
  "Publicación redes sociales",
];

const quickTemplates = [
  {
    id: "support-restart",
    category: "Soporte técnico",
    title: "Reinicio de servicio",
    text: "Hola. Hemos realizado un reinicio controlado del servicio para estabilizar el sistema. Por favor vuelve a probar y confirma si el problema continúa.",
  },
  {
    id: "support-evidence",
    category: "Soporte técnico",
    title: "Solicitud de evidencia",
    text: "Necesitamos una captura de pantalla del error y una breve descripción de los pasos realizados antes de que ocurriera el problema.",
  },
  {
    id: "support-maintenance",
    category: "Soporte técnico",
    title: "Mantenimiento programado",
    text: "El sistema tendrá una ventana de mantenimiento programada durante las próximas horas. Algunos servicios podrían presentar lentitud temporal.",
  },
  {
    id: "customer-followup",
    category: "Atención cliente",
    title: "Seguimiento cliente",
    text: "Hola. Queríamos confirmar si la solución entregada resolvió correctamente tu solicitud. Quedamos atentos a cualquier duda adicional.",
  },
  {
    id: "customer-response",
    category: "Atención cliente",
    title: "Respuesta cordial",
    text: "Gracias por contactarnos. Revisaremos tu caso lo antes posible para entregarte una solución clara y rápida.",
  },
  {
    id: "customer-confirmation",
    category: "Atención cliente",
    title: "Confirmación recepción",
    text: "Tu solicitud fue recibida correctamente y ya está siendo revisada por nuestro equipo.",
  },
  {
    id: "sales-intro",
    category: "Ventas",
    title: "Presentación servicio",
    text: "Ofrecemos soluciones digitales rápidas y optimizadas para automatizar procesos y mejorar productividad.",
  },
  {
    id: "sales-offer",
    category: "Ventas",
    title: "Oferta limitada",
    text: "Tenemos disponibilidad limitada para nuevos proyectos este mes. Podemos coordinar una reunión rápida para revisar tu necesidad.",
  },
  {
    id: "sales-close",
    category: "Ventas",
    title: "Cierre comercial",
    text: "Quedamos atentos para avanzar con la implementación y comenzar el proyecto lo antes posible.",
  },
  {
    id: "social-productivity",
    category: "Redes sociales",
    title: "Post productividad",
    text: "🚀 Automatizar tareas simples puede ahorrar horas de trabajo cada semana. La eficiencia también es una ventaja competitiva.",
  },
  {
    id: "social-tech",
    category: "Redes sociales",
    title: "Post tecnología",
    text: "⚡ Herramientas digitales bien diseñadas permiten trabajar más rápido, con menos errores y mejor organización.",
  },
  {
    id: "social-motivation",
    category: "Redes sociales",
    title: "Post motivacional",
    text: "💡 Construir sistemas simples pero útiles es una de las mejores formas de crear productos escalables.",
  },
];

const defaultChecklistItems = [
  "Revisar conexión a internet",
  "Verificar energía y cables",
  "Reiniciar equipo o servicio",
  "Revisar mensajes de error",
  "Validar permisos de usuario",
  "Probar desde otro navegador o dispositivo",
  "Registrar diagnóstico final",
];

const storageKeys = {
  aiHistory: "ai-history",
  checklist: "technical-checklist",
  templateFavorites: "template-favorites",
  templateRecents: "template-recents",
  aiPrefill: "ai-prefill",
};

function buildDefaultChecklist() {
  return defaultChecklistItems.map((text, index) => ({
    id: `default-${index}`,
    text,
    completed: false,
    custom: false,
  }));
}

function downloadJsonFile(fileName, data) {
  const fileContent = JSON.stringify(data, null, 2);
  const blob = new Blob([fileContent], {
    type: "application/json",
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

function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No se seleccionó ningún archivo."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error("No se pudo leer el archivo JSON."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Ocurrió un error al leer el archivo."));
    };

    reader.readAsText(file);
  });
}

function normalizeImportedBackup(data) {
  if (!data || typeof data !== "object") {
    throw new Error("El archivo no tiene una estructura válida.");
  }

  return {
    aiHistory: Array.isArray(data.aiHistory) ? data.aiHistory : [],
    checklist: Array.isArray(data.checklist) ? data.checklist : [],
    templateFavorites: Array.isArray(data.templateFavorites)
      ? data.templateFavorites
      : [],
    templateRecents: Array.isArray(data.templateRecents)
      ? data.templateRecents
      : [],
  };
}

export default function ToolDetail({ tool, onBack }) {
  const { user } = useAuth();

  const userId = user?.id || "";

  const [input, setInput] = useState("");
  const [type, setType] = useState(generatorTypes[0]);
  const [output, setOutput] = useState("");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingDots, setLoadingDots] = useState(".");
  const [copyLabel, setCopyLabel] = useState("Copiar");
  const [backupStatus, setBackupStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [checklistItems, setChecklistItems] = useState(buildDefaultChecklist());
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [favoriteTemplates, setFavoriteTemplates] = useState([]);
  const [recentTemplates, setRecentTemplates] = useState([]);

  const textareaRef = useRef(null);
  const generatorFormRef = useRef(null);
  const backupFileInputRef = useRef(null);

  const isAiGenerator = tool.id === "ai-generator";
  const isTechnicalChecklist = tool.id === "technical-checklist";
  const isQuickTemplates = tool.id === "quick-templates";

  const filteredTemplates = useMemo(() => {
    const search = templateSearch.toLowerCase();

    return quickTemplates.filter(
      (template) =>
        template.title.toLowerCase().includes(search) ||
        template.category.toLowerCase().includes(search) ||
        template.text.toLowerCase().includes(search),
    );
  }, [templateSearch]);

  function saveHistory(nextHistory) {
    setUserItem(userId, storageKeys.aiHistory, nextHistory.slice(0, 10));
  }

  function saveChecklist(nextChecklist) {
    setUserItem(userId, storageKeys.checklist, nextChecklist);
  }

  function saveFavorites(nextFavorites) {
    setUserItem(userId, storageKeys.templateFavorites, nextFavorites);
  }

  function saveRecents(nextRecents) {
    setUserItem(userId, storageKeys.templateRecents, nextRecents.slice(0, 5));
  }

  useEffect(() => {
    if (!userId) {
      setHistory([]);
      setChecklistItems(buildDefaultChecklist());
      setFavoriteTemplates([]);
      setRecentTemplates([]);
      setInput("");
      setOutput("");
      setDisplayedOutput("");
      setBackupStatus("");
      setCopyLabel("Copiar");
      return;
    }

    migrateGlobalKeyToUser(userId, storageKeys.aiHistory, []);
    migrateGlobalKeyToUser(userId, storageKeys.checklist, []);
    migrateGlobalKeyToUser(userId, storageKeys.templateFavorites, []);
    migrateGlobalKeyToUser(userId, storageKeys.templateRecents, []);

    const savedHistory = getUserItem(userId, storageKeys.aiHistory, []);
    const savedChecklist = getUserItem(userId, storageKeys.checklist, []);
    const savedFavorites = getUserItem(userId, storageKeys.templateFavorites, []);
    const savedRecents = getUserItem(userId, storageKeys.templateRecents, []);

    setHistory(Array.isArray(savedHistory) ? savedHistory.slice(0, 10) : []);

    setChecklistItems(
      Array.isArray(savedChecklist) && savedChecklist.length > 0
        ? savedChecklist
        : buildDefaultChecklist(),
    );

    setFavoriteTemplates(Array.isArray(savedFavorites) ? savedFavorites : []);
    setRecentTemplates(Array.isArray(savedRecents) ? savedRecents.slice(0, 5) : []);
    setInput("");
    setOutput("");
    setDisplayedOutput("");
    setBackupStatus("");
    setCopyLabel("Copiar");
  }, [userId]);

  useEffect(() => {
    if (!isAiGenerator || !userId) {
      return;
    }

    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    try {
      const prefillKey = getUserScopedKey(userId, storageKeys.aiPrefill);
      const savedPrefill = localStorage.getItem(prefillKey);

      if (savedPrefill) {
        setInput(savedPrefill);
        localStorage.removeItem(prefillKey);
      }
    } catch {
      return;
    }
  }, [isAiGenerator, userId]);

  useEffect(() => {
    if (!isGenerating) {
      return undefined;
    }

    const dots = [".", "..", "..."];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % dots.length;
      setLoadingDots(dots[index]);
    }, 300);

    return () => clearInterval(interval);
  }, [isGenerating]);
  async function handleGenerate() {
    if (isGenerating || !input.trim() || !userId) {
      return;
    }

    setIsGenerating(true);
    setOutput("");
    setDisplayedOutput("");
    setCopyLabel("Copiar");

    try {
      const generatedOutput = await generateAIContent({
        input,
        type,
      });

      const historyItem = {
        id: `history-${Date.now()}`,
        type,
        input,
        output: generatedOutput,
        createdAt: new Date().toLocaleString("es-CL"),
      };

      const nextHistory = [historyItem, ...history].slice(0, 10);

      setOutput(generatedOutput);
      setDisplayedOutput(generatedOutput);
      setHistory(nextHistory);
      saveHistory(nextHistory);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy(text = output) {
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      setCopyLabel("Copiado");

      setTimeout(() => {
        setCopyLabel("Copiar");
      }, 2000);
    } catch {
      setCopyLabel("Error");

      setTimeout(() => {
        setCopyLabel("Copiar");
      }, 2000);
    }
  }

  function handleClearOutput() {
    setOutput("");
    setDisplayedOutput("");
  }

  function handleReuseHistory(item) {
    setInput(item.input);
    setType(item.type);
    setOutput(item.output || "");
    setDisplayedOutput(item.output || "");
    setCopyLabel("Copiar");

    setTimeout(() => {
      if (generatorFormRef.current) {
        generatorFormRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  }

  function handleDeleteHistory(id) {
    const nextHistory = history.filter((item) => item.id !== id);

    setHistory(nextHistory);
    saveHistory(nextHistory);
  }

  function handleClearHistory() {
    setHistory([]);
    saveHistory([]);
  }

  function handleExportBackup() {
    if (!userId) {
      setBackupStatus("No hay usuario activo para exportar datos.");
      return;
    }

    try {
      const date = new Date().toISOString().slice(0, 10);

      const backupData = {
        app: "CAPA 8 TOOLS",
        version: 2,
        userId,
        provider: user?.provider || "unknown",
        exportedAt: new Date().toISOString(),
        aiHistory: history.slice(0, 10),
        checklist: checklistItems,
        templateFavorites: favoriteTemplates,
        templateRecents: recentTemplates.slice(0, 5),
      };

      downloadJsonFile(`capa8-tools-backup-${userId}-${date}.json`, backupData);

      setBackupStatus("Backup exportado correctamente.");
    } catch {
      setBackupStatus("No se pudo exportar el backup.");
    }
  }

  function handleOpenImportBackup() {
    if (backupFileInputRef.current) {
      backupFileInputRef.current.click();
    }
  }

  async function handleImportBackup(event) {
    const file = event.target.files?.[0];

    if (!file || !userId) {
      return;
    }

    try {
      const parsedData = await readJsonFile(file);
      const importedData = normalizeImportedBackup(parsedData);

      const nextHistory = importedData.aiHistory.slice(0, 10);
      const nextChecklist =
        importedData.checklist.length > 0
          ? importedData.checklist
          : buildDefaultChecklist();
      const nextFavorites = importedData.templateFavorites;
      const nextRecents = importedData.templateRecents.slice(0, 5);

      setHistory(nextHistory);
      setChecklistItems(nextChecklist);
      setFavoriteTemplates(nextFavorites);
      setRecentTemplates(nextRecents);

      saveHistory(nextHistory);
      saveChecklist(nextChecklist);
      saveFavorites(nextFavorites);
      saveRecents(nextRecents);

      setBackupStatus("Backup importado correctamente.");
    } catch (error) {
      setBackupStatus(error.message || "No se pudo importar el backup.");
    } finally {
      event.target.value = "";
    }
  }

  function handleClearBackupData() {
    if (!userId) {
      setBackupStatus("No hay usuario activo para limpiar datos.");
      return;
    }

    const confirmed = window.confirm(
      "¿Seguro que quieres limpiar historial, favoritos, recientes y checklist técnico de este usuario?",
    );

    if (!confirmed) {
      return;
    }

    const historyCleared = removeUserItem(userId, storageKeys.aiHistory);
    const checklistCleared = removeUserItem(userId, storageKeys.checklist);
    const favoritesCleared = removeUserItem(userId, storageKeys.templateFavorites);
    const recentsCleared = removeUserItem(userId, storageKeys.templateRecents);

    if (!historyCleared || !checklistCleared || !favoritesCleared || !recentsCleared) {
      setBackupStatus("No se pudieron limpiar los datos.");
      return;
    }

    setHistory([]);
    setChecklistItems(buildDefaultChecklist());
    setFavoriteTemplates([]);
    setRecentTemplates([]);
    setOutput("");
    setDisplayedOutput("");
    setBackupStatus("Datos locales limpiados correctamente.");
  }

  function handleToggleChecklistItem(id) {
    const nextChecklist = checklistItems.map((item) =>
      item.id === id
        ? {
            ...item,
            completed: !item.completed,
          }
        : item,
    );

    setChecklistItems(nextChecklist);
    saveChecklist(nextChecklist);
  }

  function handleAddChecklistItem() {
    const cleanItem = newChecklistItem.trim();

    if (!cleanItem || !userId) {
      return;
    }

    const nextChecklist = [
      ...checklistItems,
      {
        id: `custom-${Date.now()}`,
        text: cleanItem,
        completed: false,
        custom: true,
      },
    ];

    setChecklistItems(nextChecklist);
    saveChecklist(nextChecklist);
    setNewChecklistItem("");
  }

  function handleDeleteChecklistItem(id) {
    const nextChecklist = checklistItems.filter((item) => item.id !== id);

    setChecklistItems(nextChecklist);
    saveChecklist(nextChecklist);
  }

  function handleResetChecklist() {
    const nextChecklist = buildDefaultChecklist();

    setChecklistItems(nextChecklist);
    saveChecklist(nextChecklist);
    setNewChecklistItem("");
  }

  function handleTemplateRecent(template) {
    if (!userId) {
      return;
    }

    const filtered = recentTemplates.filter((item) => item.id !== template.id);
    const nextRecents = [template, ...filtered].slice(0, 5);

    setRecentTemplates(nextRecents);
    saveRecents(nextRecents);
  }

  function handleTemplateFavorite(template) {
    if (!userId) {
      return;
    }

    const exists = favoriteTemplates.some((item) => item.id === template.id);

    const nextFavorites = exists
      ? favoriteTemplates.filter((item) => item.id !== template.id)
      : [template, ...favoriteTemplates];

    setFavoriteTemplates(nextFavorites);
    saveFavorites(nextFavorites);
  }

  async function handleTemplateCopy(template) {
    await handleCopy(template.text);

    handleTemplateRecent(template);
  }

  function handleUseTemplate(template) {
    if (!userId) {
      return;
    }

    try {
      localStorage.setItem(
        getUserScopedKey(userId, storageKeys.aiPrefill),
        template.text,
      );
    } catch {
      return;
    }

    handleTemplateRecent(template);
  }

  function isTemplateFavorite(id) {
    return favoriteTemplates.some((item) => item.id === id);
  }

  return (
    <section className="tools-section">
      <ToolHeader tool={tool} onBack={onBack} />

      {isAiGenerator ? (
        <AIGeneratorSection
          input={input}
          setInput={setInput}
          type={type}
          setType={setType}
          output={output}
          displayedOutput={displayedOutput}
          isGenerating={isGenerating}
          loadingDots={loadingDots}
          copyLabel={copyLabel}
          history={history}
          generatorTypes={generatorTypes}
          textareaRef={textareaRef}
          generatorFormRef={generatorFormRef}
          backupFileInputRef={backupFileInputRef}
          backupStatus={backupStatus}
          handleGenerate={handleGenerate}
          handleCopy={handleCopy}
          handleClearOutput={handleClearOutput}
          handleReuseHistory={handleReuseHistory}
          handleDeleteHistory={handleDeleteHistory}
          handleClearHistory={handleClearHistory}
          handleExportBackup={handleExportBackup}
          handleOpenImportBackup={handleOpenImportBackup}
          handleImportBackup={handleImportBackup}
          handleClearBackupData={handleClearBackupData}
        />
      ) : null}

      {isTechnicalChecklist ? (
        <TechnicalChecklistSection
          checklistItems={checklistItems}
          newChecklistItem={newChecklistItem}
          setNewChecklistItem={setNewChecklistItem}
          handleToggleChecklistItem={handleToggleChecklistItem}
          handleAddChecklistItem={handleAddChecklistItem}
          handleDeleteChecklistItem={handleDeleteChecklistItem}
          handleResetChecklist={handleResetChecklist}
        />
      ) : null}

      {isQuickTemplates ? (
        <QuickTemplatesSection
          templateSearch={templateSearch}
          setTemplateSearch={setTemplateSearch}
          favoriteTemplates={favoriteTemplates}
          recentTemplates={recentTemplates}
          filteredTemplates={filteredTemplates}
          handleTemplateCopy={handleTemplateCopy}
          handleUseTemplate={handleUseTemplate}
          handleTemplateFavorite={handleTemplateFavorite}
          isTemplateFavorite={isTemplateFavorite}
        />
      ) : null}

      {!isAiGenerator && !isTechnicalChecklist && !isQuickTemplates ? (
        <div className="tool-output">
          <p>Herramienta en construcción.</p>
        </div>
      ) : null}
    </section>
  );
}