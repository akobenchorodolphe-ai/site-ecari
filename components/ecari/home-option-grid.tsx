"use client";

import Image from "next/image";
import Link from "next/link";
type LinkCard = {
  alt: string;
  badge: string;
  cta: string;
  description: string;
  status: string;
  title: string;
  href: string;
  imageSrc: string;
  visual: "cerao" | "don" | "preinscription" | "partner";
  layout: "compact" | "tall";
  overline: string;
};

const cards: readonly LinkCard[] = [
  {
    badge: "C",
    alt: "Photo de groupe illustrant le recensement des chercheurs CERAO.",
    status: "Actif",
    title: "Recensement Chercheur CERAO",
    description:
      "Un espace pour rejoindre le reseau et renseigner les informations chercheur.",
    href: "/cerao/inscription",
    imageSrc: "/ecari-card-cerao.webp",
    visual: "cerao",
    layout: "tall",
    overline: "Recensement",
    cta: "Rejoindre le Reseau",
  },
  {
    badge: "D",
    alt: "Pieces et monnaies symbolisant le don et la contribution financiere.",
    status: "Priorite",
    title: "Soutenir l'Innovation : Faire un Don",
    description:
      "Votre soutien financier alimente des idees innovantes et des projets a fort impact.",
    href: "/faire-un-don",
    imageSrc: "/ecari-card-don.webp",
    visual: "don",
    layout: "compact",
    overline: "Soutien",
    cta: "Donner Maintenant",
  },
  {
    badge: "E",
    alt: "Main en train d'ecrire pour representer la preinscription etudiante.",
    status: "Actif",
    title: "Preinscription Etudiant au Rectorat UCAO",
    description:
      "Preinscrivez-vous en ligne et rejoignez notre communaute academique.",
    href: "/preinscription-etudiant",
    imageSrc: "/ecari-card-preinscription.webp",
    visual: "preinscription",
    layout: "compact",
    overline: "Demande ouverte",
    cta: "S'inscrire",
  },
  {
    badge: "P",
    alt: "Documents et graphiques representant un partenariat financier et strategique.",
    status: "Actif",
    title: "Partenaire Financier, Recherche et Innovation UCAO",
    description:
      "Devenez un partenaire strategique et contribuez a un impact durable.",
    href: "/partenaire-financier",
    imageSrc: "/ecari-card-partenaire.webp",
    visual: "partner",
    layout: "tall",
    overline: "Demande ouverte",
    cta: "Devenir Partenaire",
  },
] as const;

export function HomeOptionGrid() {
  return (
    <div className="ecari-option-grid">
      {cards.map((card) => (
        <Link
          className="ecari-option-card"
          data-layout={card.layout}
          data-visual={card.visual}
          href={card.href}
          key={card.title}
        >
          <div className="ecari-option-card__media">
            <Image
              alt={card.alt}
              className="ecari-option-card__image"
              fill
              sizes={
                card.layout === "tall"
                  ? "(max-width: 1023px) 100vw, 33vw"
                  : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 28vw"
              }
              src={card.imageSrc}
            />
          </div>
          <div className="ecari-option-card__body">
            <span className="ecari-option-card__badge" aria-hidden="true">
              {card.badge}
            </span>
            <span className="ecari-option-card__status">{card.status}</span>
            <h2 className="ecari-option-card__title">{card.title}</h2>
            <p className="ecari-option-card__description">{card.description}</p>
            <span className="ecari-option-card__cta">{card.cta}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
