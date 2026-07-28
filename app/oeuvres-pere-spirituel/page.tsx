import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";
import { buildPageMetadata } from "@/lib/ecari/metadata";

const workAreas = [
  {
    icon: "B",
    title: "Bibliotheque des oeuvres",
    body:
      "Centraliser les publications, textes, notes et ressources disponibles autour du pere spirituel.",
  },
  {
    icon: "E",
    title: "Enseignements et conferences",
    body:
      "Structurer les contenus audio, video ou ecrits afin de faciliter leur consultation progressive.",
  },
  {
    icon: "A",
    title: "Archives et temoignages",
    body:
      "Rassembler les traces institutionnelles, temoignages et documents utiles a la memoire commune.",
  },
  {
    icon: "T",
    title: "Transmission",
    body:
      "Preparer un espace lisible pour valoriser l'heritage intellectuel, spirituel et academique.",
  },
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: "Oeuvres du pere spirituel",
  description:
    "Page ECARI dediee a la valorisation des oeuvres, enseignements, archives et temoignages du pere spirituel.",
  path: "/oeuvres-pere-spirituel",
});

export default function SpiritualFatherWorksPage() {
  return (
    <MarketingPageShell
      description="Cette page prepare un espace de memoire, de transmission et de valorisation autour des oeuvres du pere spirituel."
      eyebrow="Memoire et transmission"
      title="Oeuvres du pere spirituel."
    >
      <div className="ecari-feature-grid ecari-feature-grid--compact">
        {workAreas.map((area) => (
          <article className="ecari-info-card" key={area.title}>
            <span className="ecari-info-card__icon" aria-hidden="true">
              {area.icon}
            </span>
            <div className="ecari-info-card__content">
              <p className="ecari-page-eyebrow">{area.title}</p>
              <h2>{area.body}</h2>
              <span className="ecari-page-rule" aria-hidden="true" />
              <p>
                Le contenu detaille pourra etre ajoute progressivement: titres,
                fichiers, dates, supports et notices de presentation.
              </p>
            </div>
          </article>
        ))}
      </div>
    </MarketingPageShell>
  );
}
