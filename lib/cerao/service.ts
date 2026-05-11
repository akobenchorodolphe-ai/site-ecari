import { randomUUID } from "node:crypto";

import { isDoctorateType } from "@/lib/cerao/constants";
import { createCandidateRecord, findCandidateByEmail } from "@/lib/cerao/repository";
import {
  PHOTO_UPLOAD_POLICY,
  PREUVE_UPLOAD_POLICY,
  THESE_UPLOAD_POLICY,
  storage,
} from "@/lib/cerao/storage";
import {
  parseCandidatePayload,
  validateApplicationFiles,
} from "@/lib/cerao/schema";
import type { ApplicationSubmission, CandidateApplicationPayload } from "@/lib/cerao/types";

export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`Un dossier existe déjà pour l'adresse ${email}.`);
    this.name = "DuplicateEmailError";
  }
}

export async function parseApplicationFormData(formData: FormData): Promise<ApplicationSubmission> {
  const rawPayload = formData.get("payload");
  if (typeof rawPayload !== "string") {
    throw new Error("Le formulaire transmis est incomplet.");
  }

  const parsedPayload = parseCandidatePayload(JSON.parse(rawPayload));

  const photo = formData.get("photo");
  const degreeProofs = parsedPayload.degrees.map((_, index) => {
    const file = formData.get(`degree-proof-${index}`);
    return file instanceof File && file.size > 0 ? file : undefined;
  });
  const degreeTheses = parsedPayload.degrees.map((_, index) => {
    const file = formData.get(`degree-thesis-${index}`);
    return file instanceof File && file.size > 0 ? file : undefined;
  });

  const files = {
    photo: photo instanceof File && photo.size > 0 ? photo : undefined,
    degreeProofs,
    degreeTheses,
  };

  validateApplicationFiles(parsedPayload, files);

  return {
    payload: parsedPayload,
    files,
  };
}

async function saveApplicationFiles(payload: CandidateApplicationPayload, files: ApplicationSubmission["files"]) {
  const folder = `cerao/submissions/${new Date().getFullYear()}/${randomUUID()}`;

  try {
    const photoUpload = files.photo
      ? await storage.saveFile(files.photo, {
          folder,
          filenamePrefix: "photo-identite",
          policy: PHOTO_UPLOAD_POLICY,
        })
      : undefined;

    const degreeFiles = [];
    for (const [index, degree] of payload.degrees.entries()) {
      const preuve = files.degreeProofs[index];
      const these = files.degreeTheses[index];

      if (!preuve) {
        throw new Error(`La preuve du diplôme n°${index + 1} est obligatoire.`);
      }

      const savedProof = await storage.saveFile(preuve, {
        folder,
        filenamePrefix: `diplome-${index + 1}-preuve`,
        policy: PREUVE_UPLOAD_POLICY,
      });

      const savedThesis =
        these && isDoctorateType(degree.typeDiplome)
          ? await storage.saveFile(these, {
              folder,
              filenamePrefix: `diplome-${index + 1}-these`,
              policy: THESE_UPLOAD_POLICY,
            })
          : undefined;

      degreeFiles.push({
        preuvePath: savedProof.relativePath,
        thesePath: savedThesis?.relativePath,
      });
    }

    return {
      folder,
      photoPath: photoUpload?.relativePath,
      degreeFiles,
    };
  } catch (error) {
    await storage.removeFolder(folder);
    throw error;
  }
}

export async function submitCandidateApplication(submission: ApplicationSubmission) {
  const existing = await findCandidateByEmail(submission.payload.email);

  if (existing) {
    throw new DuplicateEmailError(submission.payload.email);
  }

  const savedFiles = await saveApplicationFiles(submission.payload, submission.files);

  try {
    return await createCandidateRecord({
      payload: submission.payload,
      photoPath: savedFiles.photoPath,
      degreeFiles: savedFiles.degreeFiles,
    });
  } catch (error) {
    await storage.removeFolder(savedFiles.folder);
    throw error;
  }
}
