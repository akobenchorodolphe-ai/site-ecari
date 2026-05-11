import {
  AVIS_SUPERIEUR_LABELS,
  ETAT_VIE_LABELS,
  TYPE_DIPLOME_LABELS,
} from "@/lib/cerao/constants";

export function formatDate(date: Date | string | null | undefined) {
  if (!date) {
    return "Non renseigné";
  }

  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(value);
}

export function formatDateTime(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function formatEtatVie(value: keyof typeof ETAT_VIE_LABELS) {
  return ETAT_VIE_LABELS[value];
}

export function formatAvisSuperieur(value: keyof typeof AVIS_SUPERIEUR_LABELS) {
  return AVIS_SUPERIEUR_LABELS[value];
}

export function formatTypeDiplome(value: keyof typeof TYPE_DIPLOME_LABELS) {
  return TYPE_DIPLOME_LABELS[value];
}
