export const ETATS_VIE = [
  "PRETRE",
  "RELIGIEUX",
  "LAIC_CELIBATAIRE",
  "LAIC_MARIE",
] as const;

export const AVIS_SUPERIEUR = ["OUI", "NON", "JE_NE_SAIS_PAS"] as const;

export const TYPES_DIPLOME = ["DOCTORAT", "PHD", "MASTER", "AUTRE"] as const;

export const SEXES = ["M", "F"] as const;

export const MAX_THESE_SIZE_BYTES = 100 * 1024 * 1024;
export const MAX_SUPPORTING_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

export const PHOTO_CONTENT_TYPES = ["image/jpeg", "image/png"] as const;
export const PREUVE_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;
export const THESE_CONTENT_TYPES = ["application/pdf"] as const;

export const ETAT_VIE_LABELS: Record<(typeof ETATS_VIE)[number], string> = {
  PRETRE: "Prêtre",
  RELIGIEUX: "Religieux / Religieuse",
  LAIC_CELIBATAIRE: "Laïc célibataire",
  LAIC_MARIE: "Laïc marié",
};

export const AVIS_SUPERIEUR_LABELS: Record<(typeof AVIS_SUPERIEUR)[number], string> =
  {
    OUI: "Oui, avis favorable",
    NON: "Non, avis défavorable",
    JE_NE_SAIS_PAS: "Je ne sais pas / en discussion",
  };

export const TYPE_DIPLOME_LABELS: Record<(typeof TYPES_DIPLOME)[number], string> = {
  DOCTORAT: "Doctorat",
  PHD: "PhD / 3e cycle",
  MASTER: "Master",
  AUTRE: "Autre diplôme",
};

export function isDoctorateType(type: (typeof TYPES_DIPLOME)[number]) {
  return type === "DOCTORAT" || type === "PHD";
}
