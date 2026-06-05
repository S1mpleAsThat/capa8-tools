// src/services/auth/authService.js

import {
  signInWithGoogle,
  signOutFromGoogle,
} from "./googleAuthService";

export const AUTH_STORAGE_KEY = "capa8-auth-session";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://capa8-tools.vercel.app";

const mockUser = {
  id: "demo-user",
  name: "Usuario CAPA 8",
  email: "demo@capa8.tools",
  picture: "",
  provider: "demo",
};

async function authApiRequest(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
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

    return JSON.parse(saved);
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
  const data = await authApiRequest("/api/auth/register", {
    name,
    email,
    password,
  });

  return data;
}

export async function loginWithEmail({ email, password }) {
  const data = await authApiRequest("/api/auth/login", {
    email,
    password,
  });

  return data;
}

export async function logout() {
  const currentSession = restoreSession();

  if (currentSession?.provider === "google") {
    await signOutFromGoogle();
  }

  clearSession();

  return true;
}