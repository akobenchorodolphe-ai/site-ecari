"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type HomeOptionGridProps = {
  googleFormUrl: string;
};

type LinkCard = {
  alt: string;
  badge: string;
  cta: string;
  description: string;
  status: string;
  title: string;
  href: string;
  imageSrc: string;
  visual: "don" | "preinscription" | "partner";
  layout: "compact" | "tall";
  overline: string;
};

type ModalCard = {
  alt: string;
  badge: string;
  cta: string;
  description: string;
  status: string;
  title: string;
  imageSrc: string;
  visual: "cerao";
  layout: "tall";
  overline: string;
  kind: "modal";
};

const cards: readonly (LinkCard | ModalCard)[] = [
  {
    badge: "C",
    alt: "Photo de groupe illustrant le recensement des chercheurs CERAO.",
    status: "Temporaire",
    title: "Recensement Chercheur CERAO",
    description:
      "Un espace pour rejoindre le reseau et renseigner les informations chercheur.",
    imageSrc: "/ecari-card-cerao.webp",
    visual: "cerao",
    layout: "tall",
    overline: "Recensement",
    cta: "Rejoindre le Reseau",
    kind: "modal",
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

export function HomeOptionGrid({ googleFormUrl }: HomeOptionGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("ecari-modal-open", isModalOpen);

    return () => {
      document.body.classList.remove("ecari-modal-open");
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="ecari-option-grid">
        {cards.map((card) => {
          const cardClassName = "ecari-option-card";

          if ("href" in card) {
            return (
              <Link
                className={cardClassName}
                href={card.href}
                data-layout={card.layout}
                data-visual={card.visual}
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
            );
          }

          if ("kind" in card && card.kind === "modal") {
            return (
              <button
                className={cardClassName}
                data-layout={card.layout}
                data-visual={card.visual}
                key={card.title}
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                <div className="ecari-option-card__media">
                  <Image
                    alt={card.alt}
                    className="ecari-option-card__image"
                    fill
                    sizes="(max-width: 1023px) 100vw, 33vw"
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
              </button>
            );
          }

          return null;
        })}
      </div>

      {isModalOpen ? (
        <div
          aria-labelledby="cerao-modal-title"
          aria-modal="true"
          className="ecari-modal"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
        >
          <div
            className="ecari-modal__panel panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7b4e1f]">
                  Recensement CERAO
                </p>
                <h2
                  className="mt-3 text-3xl leading-tight text-[#18322c]"
                  id="cerao-modal-title"
                >
                  Acceder au Google Form temporaire
                </h2>
              </div>
              <button
                aria-label="Fermer la fenetre"
                className="rounded-full border border-[rgba(53,79,69,0.16)] bg-white/82 px-3 py-2 text-sm font-semibold text-[#223a33] transition hover:border-[rgba(155,107,47,0.4)]"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                Fermer
              </button>
            </div>

            <p className="mt-5 text-base leading-7 text-[#56675f]">
              Le recensement des chercheurs CERAO passe temporairement par un
              formulaire Google. Ce lien remplacera provisoirement le module
              integre deja developpe.
            </p>

            <div className="mt-6 rounded-[1.8rem] border border-[rgba(53,79,69,0.12)] bg-white/72 px-5 py-5 text-sm leading-7 text-[#44564d]">
              {googleFormUrl ? (
                <>
                  <p>
                    Cliquez ci-dessous pour poursuivre vers le formulaire externe.
                  </p>
                  <a
                    className="btn-primary mt-5 inline-flex"
                    href={googleFormUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Ouvrir le Google Form
                  </a>
                </>
              ) : (
                <>
                  <p>
                    Le lien Google Form n&apos;a pas encore ete renseigne dans la
                    configuration publique du site.
                  </p>
                  <div className="mt-5 inline-flex rounded-full border border-dashed border-[rgba(53,79,69,0.22)] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#6f7d75]">
                    Lien a configurer
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
