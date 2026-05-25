import { DonationForm } from "@/components/ecari/donation-form";
import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";

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
