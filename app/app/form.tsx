"use client";

import { useState } from "react";
import { creerItem } from "./actions";

export default function Form({ items }: { items: any[] }) {
  const [texte, setTexte] = useState("");

  async function handleClick() {
    await creerItem(texte);
    setTexte("");
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
      <ul className="flex flex-col gap-2">
        {items.map((it) => (
          <li key={it.id} className="border p-2">{it.content}</li>
        ))}
      </ul>
    </div>
  );
}