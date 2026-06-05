// src/services/supabase/profileService.js

import { supabase } from "../../lib/supabase";

export async function upsertProfile({
  id,
  email = "",
  name = "",
  avatarUrl = "",
  provider = "email",
}) {
  if (!id) {
    throw new Error("No hay ID de usuario para guardar perfil.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id,
        email,
        name,
        avatar_url: avatarUrl,
        provider,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getProfile(userId) {
  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}