"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { analyser, type Resultat } from "@/lib/analyser";

export type { Resultat };

export async function analyserEtSauver(texte: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  const resultat = await analyser(texte);

  const { error } = await supabase
    .from("items")
    .insert({ content: texte, user_id: user.id, result: resultat });

  if (error) throw new Error(error.message);

  revalidatePath("/app");
  return resultat;
}
