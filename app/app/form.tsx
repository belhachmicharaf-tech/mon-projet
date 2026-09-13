"use client";

import { useState } from "react";
import { analyserEtSauver, type Resultat } from "./ai";
import { supprimerItem } from "./actions";

type Item = {
  id: string;
  content: string;
  created_at: string;
  result: Resultat | null;
};

const COULEURS: Record<string, string> = {
  critique: "border-red-600 bg-red-50",
  haute: "border-orange-400",
  moyenne: "border-gray-300",
  ignorer: "border-gray-200 opacity-50",
};

export default function Form({ items }: { items: Item[] }) {
  const [texte, setTexte] = useState("");
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [suppressionId, setSuppressionId] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setErreur("");
    setResultat(null);
    try {
      const r = await analyserEtSauver(texte);
      setResultat(r);
      setTexte("");
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function handleSupprimer(id: string) {
    setSuppressionId(id);
    setErreur("");
    try {
      await supprimerItem(id);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSuppressionId(null);
    }
  }

  return (
    <div className="p-8 flex flex-col gap-4 max-w-2xl">
      <textarea
        className="border p-2 h-40"
        placeholder="Colle un courriel ici"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
      />

      <button
        className="border p-2 disabled:opacity-50"
        onClick={handleClick}
        disabled={loading || texte.trim() === ""}
      >
        {loading ? "Analyse en cours…" : "Analyser"}
      </button>

      {erreur && <p className="text-red-600">{erreur}</p>}

      {resultat && (
        <div className={`border-2 p-3 ${COULEURS[resultat.urgence]}`}>
          {resultat.urgence === "critique" && (
            <p className="font-bold text-red-600">À traiter maintenant</p>
          )}
          <p className="font-bold">{resultat.sujet}</p>
          <p className="text-sm text-gray-600">
            {resultat.expediteur} · {resultat.urgence}
          </p>
          {resultat.resume && <p className="mt-2">{resultat.resume}</p>}
          {resultat.action_requise && (
            <p className="mt-1 italic">{resultat.action_requise}</p>
          )}
        </div>
      )}

      <hr className="my-4" />

      {items.length === 0 ? (
        <p className="text-gray-500">Aucun courriel analysé pour l&apos;instant.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`border p-2 flex justify-between gap-2 ${
                item.result ? COULEURS[item.result.urgence] : ""
              }`}
            >
              <div>
                <p className="font-medium">
                  {item.result?.sujet ?? item.content.slice(0, 60)}
                </p>
                {item.result?.resume && (
                  <p className="text-sm text-gray-600">{item.result.resume}</p>
                )}
              </div>
              <button
                className="text-red-600 disabled:opacity-50 shrink-0"
                onClick={() => handleSupprimer(item.id)}
                disabled={suppressionId === item.id}
              >
                {suppressionId === item.id ? "…" : "Suppr"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}