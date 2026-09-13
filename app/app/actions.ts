"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

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

export async function supprimerItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/app");
}

export async function modifierItem(id: string, content: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("items")
    .update({ content })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/app");
}