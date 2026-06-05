import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(url = "") {
  return url
    .trim()
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/auth\/v1\/?$/, "")
    .replace(/\/$/, "");
}

const supabaseUrl = normalizeSupabaseUrl(
  process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "",
);

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "";

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
);

function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(request, response) {
  setCors(response);

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const { name, email, password } = request.body || {};

    if (!supabaseUrl || !supabaseAnonKey) {
      return response.status(500).json({
        message: "Supabase no está configurado en Vercel.",
      });
    }

    if (!email || !password) {
      return response.status(400).json({
        message: "Correo y contraseña son obligatorios.",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || "",
        },
      },
    });

    if (error) {
      return response.status(400).json({
        message: error.message,
      });
    }

    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({
      message:
        error?.message ||
        "Error interno creando cuenta.",
    });
  }
}