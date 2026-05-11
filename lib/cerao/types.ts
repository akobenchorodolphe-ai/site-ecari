import type {
  AVIS_SUPERIEUR,
  ETATS_VIE,
  SEXES,
  TYPES_DIPLOME,
} from "@/lib/cerao/constants";

export type SexeOption = (typeof SEXES)[number];
export type EtatVieOption = (typeof ETATS_VIE)[number];
export type AvisSuperieurOption = (typeof AVIS_SUPERIEUR)[number];
export type TypeDiplomeOption = (typeof TYPES_DIPLOME)[number];

export type DegreeDraft = {
  typeDiplome: TypeDiplomeOption;
  intitule: string;
  institution: string;
  pays: string;
  anneeObtention: string;
};

export type PublicationDraft = {
  titre: string;
  revueEditeur: string;
  lieuParution: string;
  annee: string;
  lienUrl: string;
};

export type CandidateApplicationPayload = {
  nom: string;
  prenoms: string;
  sexe: SexeOption;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  telephone: string;
  whatsapp: string;
  email: string;
  etatVie: EtatVieOption;
  affiliationReligieuse: string;
  avisSuperieur: AvisSuperieurOption;
  disponibiliteCandidat: boolean;
  certificationHonneur: boolean;
  degrees: DegreeDraft[];
  publications: PublicationDraft[];
};

export type SavedUpload = {
  relativePath: string;
  contentType: string;
  filename: string;
  size: number;
};

export type ApplicationFileBundle = {
  photo?: File;
  degreeProofs: Array<File | undefined>;
  degreeTheses: Array<File | undefined>;
};

export type ApplicationSubmission = {
  payload: CandidateApplicationPayload;
  files: ApplicationFileBundle;
};
