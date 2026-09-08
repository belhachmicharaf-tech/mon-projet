"use client";

import { useState } from "react";
import { crier } from "./actions";

export default function Form() {
  const [texte, setTexte] = useState("");
  const [resultat, setResultat] = useState("");

  async function handleClick() {
    const r = await crier(texte);
    setResultat(r);
  }

  return (
    <div className="p-8 flex flex-col gap-4 max-w-md">
      <input
        className="border p-2"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
      />
      <button className="border p-2" onClick={handleClick}>
        Envoyer
      </button>
      <p>{resultat}</p>
    </div>
  );
}