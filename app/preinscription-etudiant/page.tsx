import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";
import { StudentPreRegistrationForm } from "@/components/ecari/student-pre-registration-form";
import { buildPageMetadata } from "@/lib/ecari/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Preinscription etudiant",
  description:
    "Point d'entree ECARI pour enregistrer une demande de preinscription etudiante avant l'ouverture du module complet du Rectorat UCAO.",
  path: "/preinscription-etudiant",
});

export default function StudentPreRegistrationPage() {
  return (
    <MarketingPageShell
      description="Cette page peut maintenant enregistrer des demandes de preinscription, en attendant le module etudiant complet du Rectorat UCAO."
      eyebrow="Preinscription etudiant"
      title="Laisser une demande de preinscription exploitable des maintenant."
    >
      <StudentPreRegistrationForm />
    </MarketingPageShell>
  );
}
