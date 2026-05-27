// src/services/auth/authService.js

import {
  signInWithGoogle,
} from "./googleAuthService";

export const AUTH_STORAGE_KEY =
  "capa8-auth-session";

const mockUser = {
  id: "demo-user",
  name: "Usuario CAPA 8",
  email: "demo@capa8.tools",
  picture: "",
  provider: "demo",
};

export function saveSession(
  session,
) {
  try {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(session),
    );

    return true;
  } catch {
    return false;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(
      AUTH_STORAGE_KEY,
    );

    return true;
  } catch {
    return false;
  }
}

export function restoreSession() {
  try {
    const saved =
      localStorage.getItem(
        AUTH_STORAGE_KEY,
      );

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

    createdAt:
      new Date().toISOString(),
  };

  saveSession(session);

  return session;
}

export async function loginGoogle() {
  const googleResult =
    await signInWithGoogle();

  const session = {
    provider: "google",

    user: {
      id:
        googleResult.user.id,

      name:
        googleResult.user.name,

      email:
        googleResult.user.email,

      picture:
        googleResult.user
          .picture,

      provider: "google",
    },

    createdAt:
      new Date().toISOString(),
  };

  saveSession(session);

  return session;
}

export async function logout() {
  clearSession();

  return true;
}