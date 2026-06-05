import { createClient } from "@supabase/supabase-js";

const REGISTER_SUCCESS_MESSAGE =
  "Cuenta creada correctamente.\nRevisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.";

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

function getCleanErrorMessage(message) {
  const cleanMessage = String(message || "").trim();
  const lowerMessage = cleanMessage.toLowerCase();

  if (lowerMessage.includes("user already registered")) {
    return "Este correo ya está registrado. Intenta iniciar sesión.";
  }

  if (lowerMessage.includes("already registered")) {
    return "Este correo ya está registrado. Intenta iniciar sesión.";
  }

  if (lowerMessage.includes("password")) {
    return "La contraseña no cumple con los requisitos mínimos.";
  }

  if (lowerMessage.includes("invalid email")) {
    return "El correo electrónico no tiene un formato válido.";
  }

  return cleanMessage || "No se pudo crear la cuenta.";
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
      name,
      email,
      password,
    } = request.body || {};

    const cleanName = String(name || "").trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = String(password || "");

    if (!cleanName) {
      return response.status(400).json({
        ok: false,
        message: "El nombre es obligatorio.",
      });
    }

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
    } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        data: {
          name: cleanName || "",
        },
      },
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

    if (!supabaseUser?.id) {
      return response.status(400).json({
        ok: false,
        message: "No se pudo crear el usuario.",
      });
    }

    return response.status(200).json({
      ok: true,
      requiresEmailConfirmation:
        !data.session,
      user: {
        id: supabaseUser.id,
        email:
          supabaseUser.email ||
          cleanEmail,
        name:
          supabaseUser.user_metadata?.name ||
          cleanName,
        picture: "",
        provider: "email",
      },
      session:
        data.session ||
        null,
      message: data.session
        ? "Cuenta creada correctamente."
        : REGISTER_SUCCESS_MESSAGE,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      message:
        error?.message ||
        "Error interno creando cuenta.",
    });
  }
}