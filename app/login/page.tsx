"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);

  async function handleLogin() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/confirm` },
    });
    if (error) alert(error.message);
    else setEnvoye(true);
  }

  if (envoye) return <p className="p-8">Regarde tes courriels.</p>;

  return (
    <div className="p-8 flex flex-col gap-4 max-w-md">
      <input
        className="border p-2"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="border p-2" onClick={handleLogin}>
        Envoyer le lien
      </button>
    </div>
  );
}