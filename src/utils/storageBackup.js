// src/utils/storageBackup.js

const storageKeys = {
  aiHistory: "capa8-ai-history",
  checklist: "capa8-technical-checklist",
  templateFavorites: "capa8-template-favorites",
  templateRecents: "capa8-template-recents",
};

function safeParseStorage(key) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function safeWriteArray(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(
        Array.isArray(value)
          ? value
          : [],
      ),
    );

    return true;
  } catch {
    return false;
  }
}

function normalizeBackupData(data) {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return null;
  }

  return {
    aiHistory: Array.isArray(data.aiHistory)
      ? data.aiHistory
      : [],
    checklist: Array.isArray(data.checklist)
      ? data.checklist
      : [],
    templateFavorites: Array.isArray(
      data.templateFavorites,
    )
      ? data.templateFavorites
      : [],
    templateRecents: Array.isArray(
      data.templateRecents,
    )
      ? data.templateRecents
      : [],
  };
}

export function exportAppData() {
  const backupData = {
    app: "CAPA 8 TOOLS",
    version: 1,
    exportedAt: new Date().toISOString(),
    aiHistory: safeParseStorage(
      storageKeys.aiHistory,
    ),
    checklist: safeParseStorage(
      storageKeys.checklist,
    ),
    templateFavorites: safeParseStorage(
      storageKeys.templateFavorites,
    ),
    templateRecents: safeParseStorage(
      storageKeys.templateRecents,
    ),
  };

  const fileContent = JSON.stringify(
    backupData,
    null,
    2,
  );

  const blob = new Blob([fileContent], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  const date = new Date()
    .toISOString()
    .slice(0, 10);

  link.href = url;
  link.download = `capa8-tools-backup-${date}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  return backupData;
}

export function importAppData(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(
        new Error(
          "No se seleccionó ningún archivo.",
        ),
      );

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(
          reader.result,
        );

        const normalized =
          normalizeBackupData(parsed);

        if (!normalized) {
          reject(
            new Error(
              "El archivo no tiene una estructura válida.",
            ),
          );

          return;
        }

        safeWriteArray(
          storageKeys.aiHistory,
          normalized.aiHistory,
        );

        safeWriteArray(
          storageKeys.checklist,
          normalized.checklist,
        );

        safeWriteArray(
          storageKeys.templateFavorites,
          normalized.templateFavorites,
        );

        safeWriteArray(
          storageKeys.templateRecents,
          normalized.templateRecents,
        );

        resolve(normalized);
      } catch {
        reject(
          new Error(
            "No se pudo leer el archivo JSON.",
          ),
        );
      }
    };

    reader.onerror = () => {
      reject(
        new Error(
          "Ocurrió un error al leer el archivo.",
        ),
      );
    };

    reader.readAsText(file);
  });
}

export function clearAppData() {
  try {
    localStorage.removeItem(
      storageKeys.aiHistory,
    );

    localStorage.removeItem(
      storageKeys.checklist,
    );

    localStorage.removeItem(
      storageKeys.templateFavorites,
    );

    localStorage.removeItem(
      storageKeys.templateRecents,
    );

    return true;
  } catch {
    return false;
  }
}