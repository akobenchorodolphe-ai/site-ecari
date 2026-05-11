import * as XLSX from "xlsx";

import { formatAvisSuperieur, formatDateTime, formatEtatVie } from "@/lib/cerao/format";

type ExportRow = {
  matricule: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string;
  pays: string;
  etatVie: "PRETRE" | "RELIGIEUX" | "LAIC_CELIBATAIRE" | "LAIC_MARIE";
  avisSuperieur: "OUI" | "NON" | "JE_NE_SAIS_PAS";
  disponibilite: string;
  doctoratPrincipal: string;
  dateSoumission: Date;
};

export function buildCandidatesWorkbook(rows: ExportRow[]) {
  const worksheet = XLSX.utils.json_to_sheet(
    rows.map((row) => ({
      Matricule: row.matricule,
      Nom: row.nom,
      "Prénoms": row.prenoms,
      Email: row.email,
      Téléphone: row.telephone,
      Pays: row.pays,
      "État de vie": formatEtatVie(row.etatVie),
      "Avis du supérieur": formatAvisSuperieur(row.avisSuperieur),
      Disponibilité: row.disponibilite,
      "Doctorat principal": row.doctoratPrincipal,
      "Date de soumission": formatDateTime(row.dateSoumission),
    })),
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Candidats CERAO");

  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
}
