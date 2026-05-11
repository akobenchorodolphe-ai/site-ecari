import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findCandidateByEmail: vi.fn(),
  createCandidateRecord: vi.fn(),
  saveFile: vi.fn(),
  removeFolder: vi.fn(),
}));

vi.mock("@/lib/cerao/repository", () => ({
  findCandidateByEmail: mocks.findCandidateByEmail,
  createCandidateRecord: mocks.createCandidateRecord,
}));

vi.mock("@/lib/cerao/storage", () => ({
  storage: {
    saveFile: mocks.saveFile,
    removeFolder: mocks.removeFolder,
  },
  PHOTO_UPLOAD_POLICY: {
    allowedContentTypes: ["image/jpeg", "image/png"],
    maxBytes: 5 * 1024 * 1024,
  },
  PREUVE_UPLOAD_POLICY: {
    allowedContentTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxBytes: 10 * 1024 * 1024,
  },
  THESE_UPLOAD_POLICY: {
    allowedContentTypes: ["application/pdf"],
    maxBytes: 100 * 1024 * 1024,
  },
}));

import {
  DuplicateEmailError,
  parseApplicationFormData,
  submitCandidateApplication,
} from "@/lib/cerao/service";

function buildFormData() {
  const payload = {
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

  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));
  formData.append(
    "degree-proof-0",
    new File(["proof"], "proof.pdf", { type: "application/pdf" }),
  );
  formData.append(
    "degree-thesis-0",
    new File(["thesis"], "thesis.pdf", { type: "application/pdf" }),
  );

  return formData;
}

describe("service CERAO", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parse le multipart et extrait les fichiers du dossier", async () => {
    const submission = await parseApplicationFormData(buildFormData());

    expect(submission.payload.nom).toBe("Kouassi");
    expect(submission.files.degreeProofs[0]?.name).toBe("proof.pdf");
    expect(submission.files.degreeTheses[0]?.name).toBe("thesis.pdf");
  });

  it("refuse un email deja existant", async () => {
    mocks.findCandidateByEmail.mockResolvedValue({
      id: BigInt(1),
      matricule: "2026-DrCERAO-0001",
    });

    await expect(
      submitCandidateApplication(await parseApplicationFormData(buildFormData())),
    ).rejects.toBeInstanceOf(DuplicateEmailError);
  });

  it("cree le dossier et les pieces quand l'email est libre", async () => {
    mocks.findCandidateByEmail.mockResolvedValue(null);
    mocks.saveFile
      .mockResolvedValueOnce({
        relativePath: "cerao/submissions/2026/abc/diplome-1-preuve.pdf",
      })
      .mockResolvedValueOnce({
        relativePath: "cerao/submissions/2026/abc/diplome-1-these.pdf",
      });
    mocks.createCandidateRecord.mockResolvedValue({
      id: BigInt(12),
      matricule: "2026-DrCERAO-0012",
    });

    const result = await submitCandidateApplication(
      await parseApplicationFormData(buildFormData()),
    );

    expect(mocks.saveFile).toHaveBeenCalledTimes(2);
    expect(mocks.createCandidateRecord).toHaveBeenCalledOnce();
    expect(mocks.removeFolder).not.toHaveBeenCalled();
    expect(result.matricule).toBe("2026-DrCERAO-0012");
  });
});
