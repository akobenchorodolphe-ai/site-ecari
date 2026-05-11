import { Prisma } from "@prisma/client";

import { generateCeraoMatricule } from "@/lib/cerao/matricule";
import type { CandidateApplicationPayload } from "@/lib/cerao/types";
import { prisma } from "@/lib/prisma";

export type CandidateFilters = {
  q?: string;
  pays?: string;
  etatVie?: string;
  disponibilite?: string;
};

export async function findCandidateByEmail(email: string) {
  return prisma.ceraoCandidate.findUnique({
    where: {
      email: email.toLowerCase(),
    },
    select: {
      id: true,
      matricule: true,
    },
  });
}

export async function createCandidateRecord(args: {
  payload: CandidateApplicationPayload;
  photoPath?: string;
  degreeFiles: Array<{
    preuvePath: string;
    thesePath?: string;
  }>;
}) {
  const { payload, photoPath, degreeFiles } = args;

  return prisma.$transaction(async (tx) => {
    const candidate = await tx.ceraoCandidate.create({
      data: {
        nom: payload.nom,
        prenoms: payload.prenoms,
        sexe: payload.sexe,
        dateNaissance: new Date(payload.dateNaissance),
        lieuNaissance: payload.lieuNaissance || null,
        nationalite: payload.nationalite,
        photoPath: photoPath ?? null,
        telephone: payload.telephone,
        whatsapp: payload.whatsapp,
        email: payload.email.toLowerCase(),
        etatVie: payload.etatVie,
        affiliationReligieuse: payload.affiliationReligieuse || null,
        avisSuperieur: payload.avisSuperieur,
        disponibiliteCandidat: payload.disponibiliteCandidat,
        statutDossier: "SOUMIS",
        degrees: {
          create: payload.degrees.map((degree, index) => ({
            typeDiplome: degree.typeDiplome,
            intitule: degree.intitule,
            institution: degree.institution,
            pays: degree.pays,
            anneeObtention: Number(degree.anneeObtention),
            ordreAffichage: index + 1,
            fichierPreuvePath: degreeFiles[index].preuvePath,
            fichierThesePath: degreeFiles[index].thesePath ?? null,
          })),
        },
        publications: {
          create: payload.publications.map((publication) => ({
            titre: publication.titre,
            revueEditeur: publication.revueEditeur,
            lieuParution: publication.lieuParution || null,
            annee: Number(publication.annee),
            lienUrl: publication.lienUrl || null,
          })),
        },
      },
      include: {
        degrees: {
          orderBy: {
            ordreAffichage: "asc",
          },
        },
        publications: true,
      },
    });

    return tx.ceraoCandidate.update({
      where: {
        id: candidate.id,
      },
      data: {
        matricule: generateCeraoMatricule(candidate.id),
      },
      include: {
        degrees: {
          orderBy: {
            ordreAffichage: "asc",
          },
        },
        publications: {
          orderBy: {
            annee: "desc",
          },
        },
      },
    });
  });
}

export async function getCandidates(filters: CandidateFilters = {}) {
  const where: Prisma.CeraoCandidateWhereInput = {
    statutDossier: "SOUMIS",
  };

  if (filters.pays) {
    where.nationalite = {
      equals: filters.pays,
    };
  }

  if (filters.etatVie) {
    where.etatVie = filters.etatVie as Prisma.EnumEtatVieFilter["equals"];
  }

  if (filters.disponibilite) {
    where.disponibiliteCandidat = filters.disponibilite === "oui";
  }

  if (filters.q) {
    where.OR = [
      { nom: { contains: filters.q } },
      { prenoms: { contains: filters.q } },
      { email: { contains: filters.q } },
      { matricule: { contains: filters.q } },
    ];
  }

  return prisma.ceraoCandidate.findMany({
    where,
    include: {
      degrees: {
        orderBy: {
          ordreAffichage: "asc",
        },
      },
    },
    orderBy: {
      dateSoumission: "desc",
    },
  });
}

export async function getCandidateDetail(candidateId: bigint) {
  return prisma.ceraoCandidate.findUnique({
    where: {
      id: candidateId,
    },
    include: {
      degrees: {
        orderBy: {
          ordreAffichage: "asc",
        },
      },
      publications: {
        orderBy: [{ annee: "desc" }, { createdAt: "desc" }],
      },
    },
  });
}

export async function getCandidatePhotoPath(candidateId: bigint) {
  const candidate = await prisma.ceraoCandidate.findUnique({
    where: { id: candidateId },
    select: { photoPath: true },
  });

  return candidate?.photoPath ?? null;
}

export async function getDegreeDocumentPaths(candidateId: bigint, degreeId: bigint) {
  return prisma.ceraoDegree.findFirst({
    where: {
      id: degreeId,
      candidateId,
    },
    select: {
      fichierPreuvePath: true,
      fichierThesePath: true,
      intitule: true,
    },
  });
}
