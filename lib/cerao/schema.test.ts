import { describe, expect, it } from "vitest";

import {
  candidatePayloadSchema,
  validateApplicationFiles,
} from "@/lib/cerao/schema";
import type { CandidateApplicationPayload } from "@/lib/cerao/types";

function buildPayload(): CandidateApplicationPayload {
  return {
    nom: "Kouassi",
    prenoms: "Jean Baptiste",
    sexe: "M",
    dateNaissance: "1985-08-14",
    lieuNaissance: "Abidjan",
    nationalite: "Ivoirienne",
    telephone: "+2250700000000",
    whatsapp: "+2250700000000",
    email: "jean@example.org",
    etatVie: "PRETRE",
    affiliationReligieuse: "Diocese de Yopougon",
    avisSuperieur: "OUI",
    disponibiliteCandidat: true,
    certificationHonneur: true,
    degrees: [
      {
        typeDiplome: "DOCTORAT",
        intitule: "Doctorat en Droit Canonique",
        institution: "UCLy",
        pays: "France",
        anneeObtention: "2022",
      },
    ],
    publications: [],
  };
}

describe("candidatePayloadSchema", () => {
  it("valide un dossier CERAO minimal correct", () => {
    expect(() => candidatePayloadSchema.parse(buildPayload())).not.toThrow();
  });

  it("refuse un dossier religieux sans rattachement", () => {
    const payload = {
      ...buildPayload(),
      affiliationReligieuse: "",
    };

    const result = candidatePayloadSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message.toLowerCase()).toContain("institut");
    }
  });

  it("refuse un premier diplome qui n'est pas un doctorat principal", () => {
    const payload = {
      ...buildPayload(),
      degrees: [
        {
          ...buildPayload().degrees[0],
          typeDiplome: "MASTER",
        },
      ],
    };

    const result = candidatePayloadSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("doctorat principal");
    }
  });
});

describe("validateApplicationFiles", () => {
  it("impose une these pour un doctorat", () => {
    expect(() =>
      validateApplicationFiles(buildPayload(), {
        photo: undefined,
        degreeProofs: [new File(["proof"], "diplome.pdf", { type: "application/pdf" })],
        degreeTheses: [undefined],
      }),
    ).toThrow(/thèse est obligatoire|these est obligatoire/i);
  });
});
