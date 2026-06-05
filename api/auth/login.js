import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(url = "") {
  return String(url || "")
    .trim()
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/auth\/v1\/?$/i, "")
    .replace(/\/+$/, "");
}

function getSupabaseConfig() {
  const supabaseUrl = normalizeSupabaseUrl(
    process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      "",
  );

  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "";

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

function createSupabaseClient() {
  const {
    supabaseUrl,
    supabaseAnonKey,
  } = getSupabaseConfig();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase no está configurado en Vercel.");
  }

  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}

function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

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

function getCleanErrorMessage(message) {
  const cleanMessage = String(message || "").trim();
  const lowerMessage = cleanMessage.toLowerCase();

  if (lowerMessage.includes("email not confirmed")) {
    return "Debes confirmar tu correo electrónico antes de iniciar sesión.";
  }

  if (lowerMessage.includes("invalid login credentials")) {
    return "Credenciales inválidas. Revisa tu correo y contraseña.";
  }

  if (lowerMessage.includes("invalid email")) {
    return "El correo electrónico no tiene un formato válido.";
  }

  return cleanMessage || "No se pudo iniciar sesión.";
}

export default async function handler(request, response) {
  setCors(response);

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({
      ok: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      email,
      password,
    } = request.body || {};

    const cleanEmail =
      normalizeEmail(email);

    const cleanPassword =
      String(password || "");

    if (!cleanEmail) {
      return response.status(400).json({
        ok: false,
        message: "El correo es obligatorio.",
      });
    }

    if (!cleanPassword) {
      return response.status(400).json({
        ok: false,
        message: "La contraseña es obligatoria.",
      });
    }

    const supabase =
      createSupabaseClient();

    const {
      data,
      error,
    } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (error) {
      return response.status(400).json({
        ok: false,
        message: getCleanErrorMessage(error.message),
      });
    }

    const supabaseUser =
      data?.user ||
      null;

    const supabaseSession =
      data?.session ||
      null;

    if (!supabaseUser?.id || !supabaseSession?.access_token) {
      return response.status(400).json({
        ok: false,
        message: "No se pudo crear una sesión válida.",
      });
    }

    const metadata =
      supabaseUser.user_metadata ||
      {};

    return response.status(200).json({
      ok: true,
      user: {
        id: supabaseUser.id,
        email:
          supabaseUser.email ||
          cleanEmail,
        name:
          metadata.name ||
          metadata.full_name ||
          metadata.display_name ||
          getNameFromEmail(
            supabaseUser.email ||
              cleanEmail,
          ),
        picture:
          metadata.picture ||
          metadata.avatar_url ||
          "",
        provider: "email",
      },
      session: {
        accessToken:
          supabaseSession.access_token,
        refreshToken:
          supabaseSession.refresh_token ||
          "",
        expiresAt:
          supabaseSession.expires_at ||
          null,
      },
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      message:
        error?.message ||
        "Error interno iniciando sesión.",
    });
  }
}