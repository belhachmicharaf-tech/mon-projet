"use client";

import { useState } from "react";
import { creerItem, supprimerItem, modifierItem } from "./actions";

type Item = { id: string; content: string };

export default function Form({ items }: { items: Item[] }) {
  const [texte, setTexte] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTexte, setEditTexte] = useState("");

  async function ajouter() {
    await creerItem(texte);
    setTexte("");
  }

  async function sauvegarder(id: string) {
    await modifierItem(id, editTexte);
    setEditId(null);
  }

  return (
    <div className="p-8 flex flex-col gap-4 max-w-md">
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
        />
        <button className="border p-2" onClick={ajouter}>
          Ajouter
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className="flex gap-2 items-center">
            {editId === item.id ? (
              <>
                <input
                  className="border p-2 flex-1"
                  value={editTexte}
                  onChange={(e) => setEditTexte(e.target.value)}
                />
                <button className="border p-2" onClick={() => sauvegarder(item.id)}>
                  Sauver
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{item.content}</span>
                <button
                  className="border p-2"
                  onClick={() => {
                    setEditId(item.id);
                    setEditTexte(item.content);
                  }}
                >
                  Modifier
                </button>
                <button className="border p-2" onClick={() => supprimerItem(item.id)}>
                  Supprimer
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}