// src/services/auth/authService.js

import {
  signInWithGoogle,
  signOutFromGoogle,
} from "./googleAuthService";

export const AUTH_STORAGE_KEY = "capa8-auth-session";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://capa8-tools.vercel.app"
).replace(/\/+$/, "");

const mockUser = {
  id: "demo-user",
  name: "Usuario CAPA 8",
  email: "demo@capa8.tools",
  picture: "",
  provider: "demo",
};

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getNameFromEmail(email) {
  const cleanEmail = normalizeEmail(email);

  if (!cleanEmail || !cleanEmail.includes("@")) {
    return "Usuario CAPA 8";
  }

  return cleanEmail.split("@")[0];
}

function parseJsonSafe(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function authApiRequest(path, payload) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${cleanPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload || {}),
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor de autenticación. Revisa tu conexión e intenta nuevamente.",
    );
  }

  const responseText = await response.text();
  const data = responseText ? parseJsonSafe(responseText) : null;

  if (!data) {
    throw new Error("El servidor devolvió una respuesta inválida.");
  }

  if (!response.ok || data.ok === false) {
    throw new Error(
      data?.message ||
        data?.error ||
        "No se pudo completar la autenticación.",
    );
  }

  return data;
}

export function saveSession(session) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function restoreSession() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!saved) {
      return null;
    }

    const session = JSON.parse(saved);

    if (!session?.user) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function loginDemo() {
  const session = {
    provider: "demo",
    user: mockUser,
    createdAt: new Date().toISOString(),
  };

  saveSession(session);

  return session;
}

export async function loginGoogle() {
  const googleResult = await signInWithGoogle();

  const session = {
    provider: "google",
    accessToken: googleResult.accessToken || "",
    idToken: googleResult.idToken || "",
    user: {
      id: googleResult.user.id,
      name: googleResult.user.name,
      email: googleResult.user.email,
      picture: googleResult.user.picture,
      provider: "google",
    },
    createdAt: new Date().toISOString(),
  };

  saveSession(session);

  return session;
}

/* ==========================================
   EMAIL AUTH VIA API - NO SUPABASE SDK HERE
   ========================================== */

export async function registerWithEmail({ name, email, password }) {
  const cleanName = String(name || "").trim();
  const cleanEmail = normalizeEmail(email);

  if (!cleanName) {
    throw new Error("Ingresa tu nombre.");
  }

  if (!cleanEmail) {
    throw new Error("Ingresa tu correo electrónico.");
  }

  if (!password) {
    throw new Error("Ingresa tu contraseña.");
  }

  const data = await authApiRequest("/api/auth/register", {
    name: cleanName,
    email: cleanEmail,
    password,
  });

  return data;
}

export async function loginWithEmail({ email, password }) {
  const cleanEmail = normalizeEmail(email);

  if (!cleanEmail) {
    throw new Error("Ingresa tu correo electrónico.");
  }

  if (!password) {
    throw new Error("Ingresa tu contraseña.");
  }

  const data = await authApiRequest("/api/auth/login", {
    email: cleanEmail,
    password,
  });

  const apiUser = data?.user || {};
  const apiSession = data?.session || {};

  if (!apiUser?.id) {
    throw new Error("La API no devolvió un usuario válido.");
  }

  if (!apiSession?.accessToken) {
    throw new Error("La API no devolvió una sesión válida.");
  }

  const session = {
    provider: "email",
    accessToken: apiSession.accessToken || "",
    refreshToken: apiSession.refreshToken || "",
    user: {
      id: apiUser.id,
      name:
        apiUser.name ||
        getNameFromEmail(apiUser.email || cleanEmail),
      email: normalizeEmail(apiUser.email || cleanEmail),
      picture: apiUser.picture || "",
      provider: "email",
    },
    createdAt: new Date().toISOString(),
  };

  saveSession(session);

  return session;
}

export async function logout() {
  const currentSession = restoreSession();

  if (currentSession?.provider === "google") {
    await signOutFromGoogle();
  }

  clearSession();

  return true;
}