"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function crier(texte: string) {
  return texte.toUpperCase();
}

export async function creerItem(content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  const { error } = await supabase
    .from("items")
    .insert({ content, user_id: user.id });

  if (error) throw new Error(error.message);
  revalidatePath("/app");
}