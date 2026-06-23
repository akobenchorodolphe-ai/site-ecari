import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";
import { CERAO_GOOGLE_FORM_URL } from "@/lib/ecari/google-form";
import { buildPageMetadata } from "@/lib/ecari/metadata";

const contactBlocks = [
  {
    icon: "D",
    title: "Demandes enregistrees",
    description:
      "Les pages Don, Preinscription et Partenaire enregistrent maintenant de vraies demandes exploitables pour traitement manuel.",
    note: "Chaque demande genere une reference et un horodatage.",
  },
  {
    icon: "C",
    title: "Recensement CERAO",
    description:
      "Le recensement des chercheurs CERAO passe temporairement par un lien Google Form accessible depuis l'accueil.",
    href: CERAO_GOOGLE_FORM_URL,
    cta: "Ouvrir le formulaire CERAO",
    external: true,
  },
  {
    icon: "R",
    title: "Espace Rectorat",
    description:
      "Le back-office Rectorat reste disponible pour la lecture, le tri et l'export des candidatures.",
    href: "/rectorat/login",
    cta: "Ouvrir l'espace Rectorat",
  },
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Page de contact et d'orientation ECARI pour retrouver les points d'entree utiles du site et les demandes deja activables.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <MarketingPageShell
      description="Les informations de contact utiles restent centralisees ici, sans surcharger la page d'accueil."
      eyebrow="Contact"
      heroAlt="Toque universitaire posee sur des livres."
      heroImage="/ecari-contact-hero.webp"
      title="Les points de contact importants d'ECARI."
    >
      <div className="ecari-contact-grid">
        {contactBlocks.map((block) => (
          <article className="ecari-contact-card" key={block.title}>
            <span className="ecari-info-card__icon" aria-hidden="true">
              {block.icon}
            </span>
            <h2>{block.title}</h2>
            <span className="ecari-page-rule" aria-hidden="true" />
            <p>{block.description}</p>

            {"href" in block ? (
              "external" in block && block.external ? (
                <a
                  className="ecari-outline-button ecari-outline-button--wide"
                  href={block.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {block.cta}
                </a>
              ) : (
                <Link
                  className="ecari-solid-button ecari-solid-button--wide"
                  href={block.href}
                >
                  {block.cta}
                </Link>
              )
            ) : (
              <div className="ecari-note-box">
                {block.note}
              </div>
            )}
          </article>
        ))}
      </div>
    </MarketingPageShell>
  );
}
