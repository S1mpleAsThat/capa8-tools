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
import useLanguage from "../hooks/useLanguage";

import ToolHeader from "./tool-detail/ToolHeader";
import AIGeneratorSection from "./tool-detail/AIGeneratorSection";
import TechnicalChecklistSection from "./tool-detail/TechnicalChecklistSection";
import QuickTemplatesSection from "./tool-detail/QuickTemplatesSection";

const storageKeys = {
  aiHistory: "ai-history",
  checklist: "technical-checklist",
  templateFavorites: "template-favorites",
  templateRecents: "template-recents",
  aiPrefill: "ai-prefill",
};

function buildDefaultChecklist(defaultItems) {
  return defaultItems.map((text, index) => ({
    id: `default-${index}`,
    text,
    completed: false,
    custom: false,
  }));
}

function localizeChecklistItems(items, defaultItems) {
  if (!Array.isArray(items) || items.length === 0) {
    return buildDefaultChecklist(defaultItems);
  }

  return items.map((item) => {
    if (item?.id?.startsWith("default-") && !item.custom) {
      const index = Number(item.id.replace("default-", ""));
      const translatedText = defaultItems[index];

      if (translatedText) {
        return {
          ...item,
          text: translatedText,
        };
      }
    }

    return item;
  });
}

function isValidTemplate(template) {
  return (
    template &&
    typeof template === "object" &&
    typeof template.id === "string" &&
    typeof template.category === "string" &&
    typeof template.title === "string" &&
    typeof template.text === "string"
  );
}

function normalizeTemplates(items, currentTemplates) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const currentTemplate = currentTemplates.find(
        (template) => template.id === item.id,
      );

      if (currentTemplate) {
        return currentTemplate;
      }

      return item;
    })
    .filter(isValidTemplate);
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
      reject(new Error("No file selected."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error("Invalid JSON file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("File reading error."));
    };

    reader.readAsText(file);
  });
}

function normalizeImportedBackup(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid backup structure.");
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
  const { t, language } = useLanguage();

  const userId = user?.id || "";

  const generatorTypes = t.ai.types;
  const quickTemplates = t.templates.items;
  const defaultChecklistItems = t.checklist.defaultItems;

  const defaultChecklist = useMemo(
    () => buildDefaultChecklist(defaultChecklistItems),
    [defaultChecklistItems],
  );

  const [input, setInput] = useState("");
  const [type, setType] = useState(generatorTypes[0]);
  const [output, setOutput] = useState("");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingDots, setLoadingDots] = useState(".");
  const [copyLabel, setCopyLabel] = useState(t.ai.copy);
  const [backupStatus, setBackupStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [checklistItems, setChecklistItems] = useState(defaultChecklist);
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
        isValidTemplate(template) &&
        (template.title.toLowerCase().includes(search) ||
          template.category.toLowerCase().includes(search) ||
          template.text.toLowerCase().includes(search)),
    );
  }, [quickTemplates, templateSearch]);

  useEffect(() => {
    if (!generatorTypes.includes(type)) {
      setType(generatorTypes[0]);
    }

    setCopyLabel(t.ai.copy);
  }, [generatorTypes, type, t.ai.copy]);

  function saveHistory(nextHistory) {
    setUserItem(userId, storageKeys.aiHistory, nextHistory.slice(0, 10));
  }

  function saveChecklist(nextChecklist) {
    setUserItem(userId, storageKeys.checklist, nextChecklist);
  }

  function saveFavorites(nextFavorites) {
    const safeFavorites = normalizeTemplates(nextFavorites, quickTemplates);

    setUserItem(userId, storageKeys.templateFavorites, safeFavorites);
  }

  function saveRecents(nextRecents) {
    const safeRecents = normalizeTemplates(nextRecents, quickTemplates);

    setUserItem(userId, storageKeys.templateRecents, safeRecents.slice(0, 5));
  }

  useEffect(() => {
    if (!userId) {
      setHistory([]);
      setChecklistItems(defaultChecklist);
      setFavoriteTemplates([]);
      setRecentTemplates([]);
      setInput("");
      setOutput("");
      setDisplayedOutput("");
      setBackupStatus("");
      setCopyLabel(t.ai.copy);
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

    const nextFavorites = normalizeTemplates(savedFavorites, quickTemplates);
    const nextRecents = normalizeTemplates(savedRecents, quickTemplates).slice(0, 5);

    setHistory(Array.isArray(savedHistory) ? savedHistory.slice(0, 10) : []);

    setChecklistItems(
      localizeChecklistItems(savedChecklist, defaultChecklistItems),
    );

    setFavoriteTemplates(nextFavorites);
    setRecentTemplates(nextRecents);
    setInput("");
    setOutput("");
    setDisplayedOutput("");
    setBackupStatus("");
    setCopyLabel(t.ai.copy);

    setUserItem(userId, storageKeys.templateFavorites, nextFavorites);
    setUserItem(userId, storageKeys.templateRecents, nextRecents);
  }, [
    userId,
    language,
    defaultChecklist,
    defaultChecklistItems,
    quickTemplates,
    t.ai.copy,
  ]);

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
    setCopyLabel(t.ai.copy);

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

      setCopyLabel(t.ai.copied);

      setTimeout(() => {
        setCopyLabel(t.ai.copy);
      }, 2000);
    } catch {
      setCopyLabel(t.ai.error);

      setTimeout(() => {
        setCopyLabel(t.ai.copy);
      }, 2000);
    }
  }

  function handleClearOutput() {
    setOutput("");
    setDisplayedOutput("");
  }

  function handleReuseHistory(item) {
    setInput(item.input);
    setType(generatorTypes.includes(item.type) ? item.type : generatorTypes[0]);
    setOutput(item.output || "");
    setDisplayedOutput(item.output || "");
    setCopyLabel(t.ai.copy);

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
      setBackupStatus(
        language === "en"
          ? "No active user."
          : "No hay usuario activo.",
      );
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
        templateFavorites: normalizeTemplates(favoriteTemplates, quickTemplates),
        templateRecents: normalizeTemplates(recentTemplates, quickTemplates).slice(0, 5),
      };

      downloadJsonFile(`capa8-tools-backup-${userId}-${date}.json`, backupData);

      setBackupStatus(
        language === "en"
          ? "Backup exported successfully."
          : "Backup exportado correctamente.",
      );
    } catch {
      setBackupStatus(
        language === "en"
          ? "Backup could not be exported."
          : "No se pudo exportar el backup.",
      );
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
          ? localizeChecklistItems(importedData.checklist, defaultChecklistItems)
          : defaultChecklist;

      const nextFavorites = normalizeTemplates(
        importedData.templateFavorites,
        quickTemplates,
      );

      const nextRecents = normalizeTemplates(
        importedData.templateRecents,
        quickTemplates,
      ).slice(0, 5);

      setHistory(nextHistory);
      setChecklistItems(nextChecklist);
      setFavoriteTemplates(nextFavorites);
      setRecentTemplates(nextRecents);

      saveHistory(nextHistory);
      saveChecklist(nextChecklist);
      saveFavorites(nextFavorites);
      saveRecents(nextRecents);

      setBackupStatus(
        language === "en"
          ? "Backup imported successfully."
          : "Backup importado correctamente.",
      );
    } catch (error) {
      setBackupStatus(
        error.message ||
          (language === "en"
            ? "Backup import failed."
            : "No se pudo importar el backup."),
      );
    } finally {
      event.target.value = "";
    }
  }

  function handleClearBackupData() {
    if (!userId) {
      setBackupStatus(
        language === "en"
          ? "No active user."
          : "No hay usuario activo para limpiar datos.",
      );
      return;
    }

    const confirmed = window.confirm(
      language === "en"
        ? "Are you sure you want to clear this user's local data?"
        : "¿Seguro que quieres limpiar historial, favoritos, recientes y checklist técnico de este usuario?",
    );

    if (!confirmed) {
      return;
    }

    const historyCleared = removeUserItem(userId, storageKeys.aiHistory);
    const checklistCleared = removeUserItem(userId, storageKeys.checklist);
    const favoritesCleared = removeUserItem(userId, storageKeys.templateFavorites);
    const recentsCleared = removeUserItem(userId, storageKeys.templateRecents);

    if (!historyCleared || !checklistCleared || !favoritesCleared || !recentsCleared) {
      setBackupStatus(
        language === "en"
          ? "Data could not be cleared."
          : "No se pudieron limpiar los datos.",
      );
      return;
    }

    setHistory([]);
    setChecklistItems(defaultChecklist);
    setFavoriteTemplates([]);
    setRecentTemplates([]);
    setOutput("");
    setDisplayedOutput("");
    setBackupStatus(
      language === "en"
        ? "Local data cleared successfully."
        : "Datos locales limpiados correctamente.",
    );
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
    const nextChecklist = defaultChecklist;

    setChecklistItems(nextChecklist);
    saveChecklist(nextChecklist);
    setNewChecklistItem("");
  }

  function handleTemplateRecent(template) {
    if (!userId || !isValidTemplate(template)) {
      return;
    }

    const safeRecents = normalizeTemplates(recentTemplates, quickTemplates);
    const filtered = safeRecents.filter((item) => item.id !== template.id);
    const nextRecents = [template, ...filtered].slice(0, 5);

    setRecentTemplates(nextRecents);
    saveRecents(nextRecents);
  }

  function handleTemplateFavorite(template) {
    if (!userId || !isValidTemplate(template)) {
      return;
    }

    const safeFavorites = normalizeTemplates(favoriteTemplates, quickTemplates);

    const exists = safeFavorites.some((item) => item.id === template.id);

    const nextFavorites = exists
      ? safeFavorites.filter((item) => item.id !== template.id)
      : [template, ...safeFavorites];

    setFavoriteTemplates(nextFavorites);
    saveFavorites(nextFavorites);
  }

  async function handleTemplateCopy(template) {
    if (!isValidTemplate(template)) {
      return;
    }

    await handleCopy(template.text);

    handleTemplateRecent(template);
  }

  function handleUseTemplate(template) {
    if (!userId || !isValidTemplate(template)) {
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
    const safeFavorites = normalizeTemplates(favoriteTemplates, quickTemplates);

    return safeFavorites.some((item) => item.id === id);
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
          onBack={onBack}
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
          onBack={onBack}
        />
      ) : null}

      {isQuickTemplates ? (
        <QuickTemplatesSection
          templateSearch={templateSearch}
          setTemplateSearch={setTemplateSearch}
          favoriteTemplates={normalizeTemplates(favoriteTemplates, quickTemplates)}
          recentTemplates={normalizeTemplates(recentTemplates, quickTemplates)}
          filteredTemplates={filteredTemplates}
          handleTemplateCopy={handleTemplateCopy}
          handleUseTemplate={handleUseTemplate}
          handleTemplateFavorite={handleTemplateFavorite}
          isTemplateFavorite={isTemplateFavorite}
          onBack={onBack}
        />
      ) : null}

      {!isAiGenerator && !isTechnicalChecklist && !isQuickTemplates ? (
        <div className="tool-output">
          <p>{tool.description}</p>
        </div>
      ) : null}
    </section>
  );
}