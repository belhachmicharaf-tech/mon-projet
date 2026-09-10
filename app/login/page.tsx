"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSignUp() {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else {
      router.push("/app");
      router.refresh();
    }
  }

  async function handleSignIn() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else {
      router.push("/app");
      router.refresh();
    }
  }

  return (
    <div className="p-8 flex flex-col gap-4 max-w-md">
      <input
        className="border p-2"
        type="email"
        placeholder="Courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button className="border p-2" onClick={handleSignIn}>
          Se connecter
        </button>
        <button className="border p-2" onClick={handleSignUp}>
          Créer un compte
        </button>
      </div>
      {message && <p className="text-red-600">{message}</p>}
    </div>
  );
}