// src/services/storage/userStorage.js

const LEGACY_KEYS = {
  "ai-history": "capa8-ai-history",
  "technical-checklist": "capa8-technical-checklist",
  "template-favorites": "capa8-template-favorites",
  "template-recents": "capa8-template-recents",
};

const migrationCache = new Set();

export function getCurrentUserStorageKey(userId) {
  return `capa8-user-${userId}`;
}

export function getUserScopedKey(userId, key) {
  return `${getCurrentUserStorageKey(userId)}-${key}`;
}

function getMigrationKey(userId, key) {
  return `${getCurrentUserStorageKey(userId)}-${key}-migration-v1`;
}

function safeParse(value, fallback) {
  try {
    if (!value) {
      return fallback;
    }

    const parsed = JSON.parse(value);

    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify([]);
  }
}

export function getUserItem(userId, key, fallback = []) {
  if (!userId) {
    return fallback;
  }

  try {
    const scopedKey = getUserScopedKey(userId, key);
    const saved = localStorage.getItem(scopedKey);

    return safeParse(saved, fallback);
  } catch {
    return fallback;
  }
}

export function setUserItem(userId, key, value) {
  if (!userId) {
    return false;
  }

  try {
    const scopedKey = getUserScopedKey(userId, key);
    const nextValue = safeStringify(value);
    const currentValue = localStorage.getItem(scopedKey);

    if (currentValue === nextValue) {
      return true;
    }

    localStorage.setItem(scopedKey, nextValue);

    return true;
  } catch {
    return false;
  }
}

export function removeUserItem(userId, key) {
  if (!userId) {
    return false;
  }

  try {
    const scopedKey = getUserScopedKey(userId, key);

    localStorage.removeItem(scopedKey);

    return true;
  } catch {
    return false;
  }
}

export function migrateGlobalKeyToUser(userId, key, fallback = []) {
  if (!userId || !key) {
    return;
  }

  const cacheId = `${userId}-${key}`;

  if (migrationCache.has(cacheId)) {
    return;
  }

  try {
    const migrationKey = getMigrationKey(userId, key);
    const alreadyMigrated = localStorage.getItem(migrationKey);

    if (alreadyMigrated) {
      migrationCache.add(cacheId);
      return;
    }

    const legacyKey = LEGACY_KEYS[key];

    if (!legacyKey) {
      migrationCache.add(cacheId);
      return;
    }

    const scopedKey = getUserScopedKey(userId, key);
    const existingScoped = localStorage.getItem(scopedKey);

    if (existingScoped !== null) {
      localStorage.setItem(
        migrationKey,
        JSON.stringify({
          completed: true,
          migratedAt: new Date().toISOString(),
        }),
      );

      migrationCache.add(cacheId);
      return;
    }

    const legacyValue = safeParse(
      localStorage.getItem(legacyKey),
      fallback,
    );

    localStorage.setItem(scopedKey, safeStringify(legacyValue));

    localStorage.setItem(
      migrationKey,
      JSON.stringify({
        completed: true,
        migratedAt: new Date().toISOString(),
      }),
    );

    migrationCache.add(cacheId);
  } catch {
    return;
  }
}