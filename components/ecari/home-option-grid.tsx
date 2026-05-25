"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HomeOptionGridProps = {
  googleFormUrl: string;
};

type LinkCard = {
  status: string;
  title: string;
  href: string;
  visual: "don" | "preinscription" | "partner";
  layout: "compact" | "tall";
  overline: string;
};

type ModalCard = {
  status: string;
  title: string;
  visual: "cerao";
  layout: "tall";
  overline: string;
  kind: "modal";
};

const cards: readonly (LinkCard | ModalCard)[] = [
  {
    status: "Priorite",
    title: "Faire un don",
    href: "/faire-un-don",
    visual: "don",
    layout: "compact",
    overline: "Soutenir une initiative",
  },
  {
    status: "Temporaire",
    title: "Recensement Chercheur CERAO",
    visual: "cerao",
    layout: "tall",
    overline: "Acces externe",
    kind: "modal",
  },
  {
    status: "Actif",
    title: "Preinscription Etudiant au rectorat UCAO",
    href: "/preinscription-etudiant",
    visual: "preinscription",
    layout: "compact",
    overline: "Demande ouverte",
  },
  {
    status: "Actif",
    title: "Partenaire financier Recherche et innovation",
    href: "/partenaire-financier",
    visual: "partner",
    layout: "tall",
    overline: "Demande ouverte",
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
                <div className="ecari-option-card__visual">
                  <div className="ecari-option-card__visual-top">
                    <span className="ecari-option-card__overline">{card.overline}</span>
                    <span className="ecari-option-card__status">{card.status}</span>
                  </div>
                  <span className="sr-only">{card.title}</span>
                </div>
                <div className="ecari-option-card__footer">
                  <h2 className="ecari-option-card__title">{card.title}</h2>
                  <span className="ecari-option-card__cta">Entrer</span>
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
                <div className="ecari-option-card__visual">
                  <div className="ecari-option-card__visual-top">
                    <span className="ecari-option-card__overline">{card.overline}</span>
                    <span className="ecari-option-card__status">{card.status}</span>
                  </div>
                  <span className="sr-only">{card.title}</span>
                </div>
                <div className="ecari-option-card__footer">
                  <h2 className="ecari-option-card__title">{card.title}</h2>
                  <span className="ecari-option-card__cta">Voir le lien</span>
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
