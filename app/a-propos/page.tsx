import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";
import { buildPageMetadata } from "@/lib/ecari/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "A propos",
  description:
    "Pourquoi ECARI s'interesse a la recherche et a l'innovation pour renforcer la decision, l'autonomie et l'impact academique de l'UCAO.",
  path: "/a-propos",
});

const focusAreas = [
  {
    icon: "Q",
    title: "La recherche",
    lead:
      "Parce que la recherche est essentielle pour l'industrialisation, la creation d'emplois et la competitivite.",
    body:
      "La recherche de qualite permet de reagir aux urgences et de se preparer a l'avenir.",
  },
  {
    icon: "I",
    title: "L'innovation",
    lead:
      "Parce qu'elle regroupe, rassemble diverses competences et facilite un apprentissage accelere, cadre et de qualite.",
    body:
      "L'innovation universitaire trace un chemin vers l'evolution participative et non subissante pour positionner l'institut comme un pole decideur et gardant son autonomie.",
  },
] as const;

export default function AboutPage() {
  return (
    <MarketingPageShell
      description="ECARI accompagne la recherche et l'innovation comme deux leviers complementaires pour renforcer la decision, l'autonomie institutionnelle et l'impact academique."
      eyebrow="A propos"
      heroAlt="Diplome universitaire face a un paysage naturel."
      heroImage="/ecari-about-hero.webp"
      title="Pourquoi ECARI s'interesse a la recherche et a l'innovation."
    >
      <div className="ecari-feature-grid">
        {focusAreas.map((area) => (
          <article className="ecari-info-card" key={area.title}>
            <span className="ecari-info-card__icon" aria-hidden="true">
              {area.icon}
            </span>
            <div className="ecari-info-card__content">
              <p className="ecari-page-eyebrow">{area.title}</p>
              <h2>{area.lead}</h2>
              <span className="ecari-page-rule" aria-hidden="true" />
              <p>{area.body}</p>
              <a className="ecari-outline-button" href="/contact">
                En savoir plus
              </a>
            </div>
          </article>
        ))}
      </div>
    </MarketingPageShell>
  );
}
