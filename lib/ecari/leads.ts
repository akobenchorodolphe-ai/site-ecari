import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { getStorageDir } from "@/lib/env";
import {
  partnershipSupportTypes,
  ucaoUniversityUnits,
} from "@/lib/ecari/options";
import { partnershipProjectOptions } from "@/lib/ecari/partnership-projects";

const phoneSchema = z
  .string()
  .trim()
  .min(8, "Le numero de telephone est requis.")
  .max(30, "Le numero de telephone est trop long.")
  .regex(/^[+0-9()./\s-]+$/, "Le numero de telephone contient des caracteres invalides.");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Ce champ est requis.")
  .max(120, "Ce champ est trop long.");

const emailSchema = z
  .string()
  .trim()
  .email("Le courriel transmis est invalide.");

const messageSchema = z
  .string()
  .trim()
  .min(20, "Merci de preciser votre demande.")
  .max(1600, "Le message est trop long.");

const optionalMessageSchema = z
  .string()
  .trim()
  .max(1600, "Le message est trop long.")
  .optional()
  .transform((value) => value || undefined);

const donationLeadSchema = z.object({
  type: z.literal("donation"),
  amount: z.coerce
    .number()
    .int("Le montant doit etre un nombre entier.")
    .min(1, "Le montant doit etre superieur a zero.")
    .max(1_000_000_000, "Le montant semble trop eleve."),
  nom: nameSchema,
  prenom: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  operator: z.enum(["WAVE", "Orange", "MTN", "MOOV"], {
    error: () => ({ message: "Merci de choisir un operateur mobile." }),
  }),
});

const studentLeadSchema = z.object({
  type: z.literal("student-pre-registration"),
  nom: nameSchema,
  prenom: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  uniteUniversitaire: z.enum(ucaoUniversityUnits, {
    error: () => ({ message: "Merci de choisir une unite universitaire." }),
  }),
  niveauSouhaite: z
    .string()
    .trim()
    .min(2, "Le niveau souhaite est requis.")
    .max(120, "Le niveau souhaite est trop long."),
  filiereSouhaitee: z
    .string()
    .trim()
    .min(2, "La filiere souhaitee est requise.")
    .max(160, "La filiere souhaitee est trop longue."),
  message: optionalMessageSchema,
});

const partnershipLeadSchema = z.object({
  type: z.literal("partnership"),
  organisation: z
    .string()
    .trim()
    .min(2, "Le nom de l'organisation est requis.")
    .max(180, "Le nom de l'organisation est trop long."),
  contactName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  projectFocus: z.enum(partnershipProjectOptions, {
    error: () => ({ message: "Merci de choisir le projet cible." }),
  }),
  supportType: z.enum(partnershipSupportTypes, {
    error: () => ({ message: "Merci de preciser le type d'appui souhaite." }),
  }),
  message: messageSchema,
});

export const ecariLeadSchema = z.discriminatedUnion("type", [
  donationLeadSchema,
  studentLeadSchema,
  partnershipLeadSchema,
]);

export type EcariLeadInput = z.infer<typeof ecariLeadSchema>;

export type StoredEcariLead = EcariLeadInput & {
  id: string;
  status: "NEW";
  submittedAt: string;
};

function sanitizeFileStem(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getLeadStorageRoot() {
  return path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    getStorageDir(),
    "ecari-leads",
  );
}

function buildLeadId(type: EcariLeadInput["type"]) {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${sanitizeFileStem(type)}-${random}`;
}

export function parseEcariLead(payload: unknown) {
  return ecariLeadSchema.parse(payload);
}

export async function saveEcariLead(input: EcariLeadInput): Promise<StoredEcariLead> {
  const submittedAt = new Date().toISOString();
  const id = buildLeadId(input.type);
  const year = submittedAt.slice(0, 4);
  const month = submittedAt.slice(5, 7);
  const typeFolder = sanitizeFileStem(input.type);
  const folder = path.join(getLeadStorageRoot(), year, month, typeFolder);

  const record: StoredEcariLead = {
    ...input,
    id,
    status: "NEW",
    submittedAt,
  };

  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, `${id}.json`), JSON.stringify(record, null, 2), "utf8");

  return record;
}
