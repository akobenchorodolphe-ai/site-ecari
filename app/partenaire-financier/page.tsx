import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";
import { PartnershipInterestForm } from "@/components/ecari/partnership-interest-form";
import { buildPageMetadata } from "@/lib/ecari/metadata";

const partnershipAxes = [
  "Appui a la recherche appliquee et a l'innovation universitaire.",
  "Soutien a des projets pilotes, programmes ou initiatives structurees.",
  "Cooperation avec des acteurs institutionnels, philanthropiques ou prives.",
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: "Partenaire financier",
  description:
    "Espace ECARI pour enregistrer une proposition de partenariat financier ou institutionnel autour de la recherche et de l'innovation.",
  path: "/partenaire-financier",
});

export default function FinancialPartnerPage() {
  return (
    <MarketingPageShell
      description="Cette page peut maintenant enregistrer des propositions de collaboration et d&apos;appui financier autour de la recherche et de l&apos;innovation."
      eyebrow="Partenaire financier"
      title="Laisser une proposition concrete de partenariat a ECARI."
    >
      <div className="grid gap-5">
        <article className="ecari-content-card">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7b4e1f]">
            Orientation
          </p>
          <div className="mt-5 grid gap-3">
            {partnershipAxes.map((axis) => (
              <div className="ecari-list-row" key={axis}>
                {axis}
              </div>
            ))}
          </div>
          <p className="mt-5 text-base leading-8 text-[#56675f]">
            Les demandes deposees ici servent deja de base de travail exploitable
            avant l&apos;ouverture d&apos;un espace partenaire plus complet.
          </p>
        </article>
      </div>

      <PartnershipInterestForm />
    </MarketingPageShell>
  );
}
