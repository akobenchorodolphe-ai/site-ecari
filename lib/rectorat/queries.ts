import { getCandidates } from "@/lib/cerao/repository";

export async function getCandidateRowsForExport() {
  const candidates = await getCandidates();

  return candidates.map((candidate) => {
    const principalDegree = candidate.degrees[0];

    return {
      matricule: candidate.matricule ?? "",
      nom: candidate.nom,
      prenoms: candidate.prenoms,
      email: candidate.email,
      telephone: candidate.telephone,
      pays: candidate.nationalite ?? "",
      etatVie: candidate.etatVie,
      avisSuperieur: candidate.avisSuperieur,
      disponibilite: candidate.disponibiliteCandidat ? "Oui" : "Non",
      doctoratPrincipal: principalDegree?.intitule ?? "",
      dateSoumission: candidate.dateSoumission,
    };
  });
}
