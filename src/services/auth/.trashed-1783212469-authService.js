// src/services/auth/authService.js

import {
  signInWithGoogle,
  signOutFromGoogle,
} from "./googleAuthService";

import { supabase } from "../../lib/supabase";

import {
  getProfile,
  upsertProfile,
} from "../supabase/profileService";

export const AUTH_STORAGE_KEY = "capa8-auth-session";

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

function normalizeSupabaseSession(authSession, profile = null) {
  const authUser = authSession?.user;

  if (!authUser) {
    return null;
  }

  const userName =
    profile?.name ||
    authUser.user_metadata?.name ||
    authUser.email ||
    "Usuario CAPA 8";

  return {
    provider: "email",
    accessToken: authSession.access_token || "",
    refreshToken: authSession.refresh_token || "",
    user: {
      id: authUser.id,
      name: userName,
      email: authUser.email || "",
      picture: profile?.avatar_url || "",
      provider: "email",
    },
    createdAt: new Date().toISOString(),
  };
}

export async function loginEmailPassword({ email, password }) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    throw new Error("Ingresa email y contraseña.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    throw new Error(error.message || "No se pudo iniciar sesión.");
  }

  const profile = await getProfile(data.user.id);

  const session = normalizeSupabaseSession(data.session, profile);

  saveSession(session);

  return session;
}

export async function registerEmailPassword({
  email,
  password,
  name,
}) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanEmail || !password || !cleanName) {
    throw new Error("Completa nombre, email y contraseña.");
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        name: cleanName,
      },
    },
  });

  if (error) {
    throw new Error(error.message || "No se pudo crear la cuenta.");
  }

  if (!data.user) {
    throw new Error("Supabase no devolvió usuario.");
  }

  let profile = null;

  if (data.session) {
    profile = await upsertProfile({
      id: data.user.id,
      email: data.user.email || cleanEmail,
      name: cleanName,
      avatarUrl: "",
      provider: "email",
    });
  }

  const session = data.session
    ? normalizeSupabaseSession(data.session, profile)
    : {
        provider: "email",
        pendingEmailConfirmation: true,
        user: {
          id: data.user.id,
          name: cleanName,
          email: data.user.email || cleanEmail,
          picture: "",
          provider: "email",
        },
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

export async function logout() {
  const currentSession = restoreSession();

  if (currentSession?.provider === "google") {
    await signOutFromGoogle();
  }

  if (currentSession?.provider === "email") {
    await supabase.auth.signOut();
  }

  clearSession();

  return true;
}