import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Form from "./form";
import type { Resultat } from "./ai";

type Item = {
  id: string;
  content: string;
  created_at: string;
  result: Resultat | null;
};

const ORDRE: Record<string, number> = {
  critique: 0,
  haute: 1,
  moyenne: 2,
  ignorer: 3,
};

export default async function App() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  const items = ((data ?? []) as Item[]).sort(
    (a, b) =>
      (ORDRE[a.result?.urgence ?? ""] ?? 9) -
      (ORDRE[b.result?.urgence ?? ""] ?? 9)
  );

  return <Form items={items} />;
}