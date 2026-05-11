import { z } from "zod";

import { ETATS_VIE, SEXES, TYPES_DIPLOME, isDoctorateType } from "@/lib/cerao/constants";
import type { ApplicationFileBundle, CandidateApplicationPayload } from "@/lib/cerao/types";

const currentYear = new Date().getFullYear();

function trimmedString(label: string, min = 1, max = 255) {
  return z
    .string()
    .trim()
    .min(min, `${label} est requis.`)
    .max(max, `${label} est trop long.`);
}

const degreeSchema = z.object({
  typeDiplome: z.enum(TYPES_DIPLOME, { error: "Le type de diplôme est requis." }),
  intitule: trimmedString("L'intitulé du diplôme"),
  institution: trimmedString("L'institution"),
  pays: trimmedString("Le pays", 2, 100),
  anneeObtention: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "L'année d'obtention doit être au format AAAA.")
    .refine((value) => {
      const year = Number(value);
      return year >= 1950 && year <= currentYear + 1;
    }, "L'année d'obtention est invalide."),
});

const publicationSchema = z.object({
  titre: trimmedString("Le titre"),
  revueEditeur: trimmedString("La revue ou l'éditeur"),
  lieuParution: z.string().trim().max(100, "Le lieu de parution est trop long."),
  annee: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "L'année de publication doit être au format AAAA.")
    .refine((value) => {
      const year = Number(value);
      return year >= 1950 && year <= currentYear + 1;
    }, "L'année de publication est invalide."),
  lienUrl: z
    .string()
    .trim()
    .max(255, "Le lien URL est trop long.")
    .optional()
    .transform((value) => value ?? ""),
});

export const candidatePayloadSchema = z
  .object({
    nom: trimmedString("Le nom", 2, 100),
    prenoms: trimmedString("Les prénoms", 2, 150),
    sexe: z.enum(SEXES, { error: "Le sexe est requis." }),
    dateNaissance: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "La date de naissance est requise."),
    lieuNaissance: z.string().trim().max(100, "Le lieu de naissance est trop long."),
    nationalite: trimmedString("La nationalité", 2, 100),
    telephone: trimmedString("Le téléphone", 8, 20),
    whatsapp: trimmedString("Le numéro WhatsApp", 8, 20),
    email: z.email("L'adresse email est invalide.").trim(),
    etatVie: z.enum(ETATS_VIE, { error: "L'état de vie est requis." }),
    affiliationReligieuse: z.string().trim().max(255, "Le rattachement est trop long."),
    avisSuperieur: z.enum(["OUI", "NON", "JE_NE_SAIS_PAS"], {
      error: "L'avis du supérieur est requis.",
    }),
    disponibiliteCandidat: z.boolean(),
    certificationHonneur: z.literal(true, {
      error: "La certification sur l'honneur est obligatoire.",
    }),
    degrees: z.array(degreeSchema).min(1, "Au moins un doctorat est requis."),
    publications: z.array(publicationSchema).max(20, "Trop de publications saisies."),
  })
  .superRefine((payload, ctx) => {
    if (
      (payload.etatVie === "PRETRE" || payload.etatVie === "RELIGIEUX") &&
      !payload.affiliationReligieuse.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le diocèse ou l'institut religieux est requis pour cet état de vie.",
        path: ["affiliationReligieuse"],
      });
    }

    if (!isDoctorateType(payload.degrees[0].typeDiplome)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le premier diplôme doit être le doctorat principal.",
        path: ["degrees", 0, "typeDiplome"],
      });
    }
  });

export function parseCandidatePayload(payload: unknown): CandidateApplicationPayload {
  return candidatePayloadSchema.parse(payload);
}

export function validateApplicationFiles(
  payload: CandidateApplicationPayload,
  files: ApplicationFileBundle,
) {
  for (const [index, degree] of payload.degrees.entries()) {
    if (!files.degreeProofs[index]) {
      throw new Error(`La preuve du diplôme n°${index + 1} est obligatoire.`);
    }

    if (isDoctorateType(degree.typeDiplome) && !files.degreeTheses[index]) {
      throw new Error(
        `La thèse est obligatoire pour le diplôme principal n°${index + 1}.`,
      );
    }
  }
}
