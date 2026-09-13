"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function connexion() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErreur(error.message);
    else router.push("/app");
  }

  async function inscription() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setErreur(error.message);
    else router.push("/app");
  }

  return (
    <div className="p-8 flex flex-col gap-4 max-w-md">
      <input
        className="border p-2"
        placeholder="courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="border p-2" onClick={connexion}>Se connecter</button>
      <button className="border p-2" onClick={inscription}>Créer un compte</button>
      {erreur && <p className="text-red-600">{erreur}</p>}
    </div>
  );
}
