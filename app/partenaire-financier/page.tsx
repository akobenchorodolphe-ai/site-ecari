import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";
import { PartnershipInterestForm } from "@/components/ecari/partnership-interest-form";
import { partnershipProjects } from "@/lib/ecari/partnership-projects";
import { buildPageMetadata } from "@/lib/ecari/metadata";

const partnershipAxes = [
  "Adhesion directe a un projet porte par ECARI.",
  "Aide financiere totale ou partielle a un etudiant.",
  "Subvention de recherche, d'innovation ou de structuration institutionnelle.",
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
      <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
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

        <section className="ecari-project-panel" aria-labelledby="project-list-title">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7b4e1f]">
            Projets ouverts
          </p>
          <h2 id="project-list-title">Listing des projets a soutenir</h2>
          <div className="ecari-project-grid">
            {partnershipProjects.map((project) => (
              <article className="ecari-project-card" key={project.title}>
                <div>
                  <span>{project.category}</span>
                  <h3>{project.title}</h3>
                </div>
                <p>{project.objective}</p>
                <dl>
                  <div>
                    <dt>Appui attendu</dt>
                    <dd>{project.support}</dd>
                  </div>
                  <div>
                    <dt>Impact recherche</dt>
                    <dd>{project.impact}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      </div>

      <PartnershipInterestForm />
    </MarketingPageShell>
  );
}
