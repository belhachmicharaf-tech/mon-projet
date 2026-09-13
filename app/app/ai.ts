"use server";

import Anthropic from "@anthropic-ai/sdk";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

const client = new Anthropic();

export type Resultat = {
  expediteur: string;
  sujet: string;
  langue: "fr" | "en";
  urgence: "critique" | "haute" | "moyenne" | "ignorer";
  resume: string | null;
  action_requise: string | null;
};

 const SYSTEM = `Tu tries les courriels d'un entrepreneur débordé qui n'a que quelques minutes par jour pour sa boîte de réception.

Ton rôle : lire un courriel brut et en extraire ce qui permet de décider en trois secondes s'il faut agir.

Langue :
- Détecte la langue du courriel et indique-la dans "langue".
- Rédige "resume" et "action_requise" dans cette même langue.

Niveaux d'urgence :
- "critique" : le lecteur doit ouvrir ce courriel maintenant. Réservé aux cas où l'inaction coûte cher — échéance dans moins de 48 h, client qui menace de partir, problème de paiement, urgence légale ou de sécurité.
- "haute" : demande une réponse cette semaine. Inclut toute facture, tout devis, toute échéance de paiement, et toute demande d'un vrai humain.
- "moyenne" : à lire quand il aura le temps.
- "ignorer" : infolettre, promotion, notification automatique sans conséquence (confirmation de connexion, mise à jour de produit, notification de réseau social), hameçonnage. Mets "resume" et "action_requise" à null dans ce cas.

Règles :
- Une facture, un reçu, un rappel de paiement ou un relevé n'est jamais "ignorer", même s'il est envoyé automatiquement. Si de l'argent est en jeu, le lecteur doit le voir.
- Un courriel écrit par un humain qui pose une question n'est jamais "ignorer".
- "resume" fait une seule phrase, maximum 20 mots.
- "action_requise" est une phrase impérative décrivant ce que le lecteur doit faire. null s'il n'y a rien à faire.
- Si l'expéditeur ou le sujet n'apparaît pas dans le texte fourni, mets "inconnu".
- Base-toi uniquement sur le contenu fourni, n'invente aucun détail.
- Sois strict sur "critique" : au maximum un courriel sur vingt le mérite.

Réponds uniquement avec un objet JSON valide, sans texte avant ni après, sans blocs de code markdown.

Schéma :
{
  "expediteur": string,
  "sujet": string,
  "langue": "fr" | "en",
  "urgence": "critique" | "haute" | "moyenne" | "ignorer",
  "resume": string | null,
  "action_requise": string | null
}`;
function extraireJson(texte: string): Resultat {
  const nettoye = texte.replace(/```json|```/g, "").trim();
  const obj = JSON.parse(nettoye);
  if (
    typeof obj.expediteur !== "string" ||
    typeof obj.sujet !== "string" ||
    typeof obj.urgence !== "string"
  ) {
    throw new Error("Schéma invalide");
  }
  return obj as Resultat;
}

export async function analyserEtSauver(texte: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  let resultat: Resultat | null = null;

  for (let essai = 0; essai < 2; essai++) {
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: texte }],
    });

    const bloc = res.content[0];
    if (bloc.type !== "text") continue;

    try {
      resultat = extraireJson(bloc.text);
      break;
    } catch {
      if (essai === 1) throw new Error("Réponse illisible du modèle");
    }
  }

  if (!resultat) throw new Error("Aucune réponse du modèle");

  const { error } = await supabase
    .from("items")
    .insert({ content: texte, user_id: user.id, result: resultat });

  if (error) throw new Error(error.message);

  revalidatePath("/app");
  return resultat;
}