import type { Metadata } from "next";

import { DonationForm } from "@/components/ecari/donation-form";
import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";
import { buildPageMetadata } from "@/lib/ecari/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Faire un don",
  description:
    "Formulaire ECARI pour enregistrer une intention de don et preparer la future integration du paiement mobile.",
  path: "/faire-un-don",
});

export default function DonatePage() {
  return (
    <MarketingPageShell
      description="Cette page collecte les informations preparatoires au don avant l'activation complete du paiement mobile sur la plateforme."
      eyebrow="Faire un don"
      title="Preparer une contribution pour soutenir la recherche et l'innovation."
    >
      <DonationForm />
    </MarketingPageShell>
  );
}
