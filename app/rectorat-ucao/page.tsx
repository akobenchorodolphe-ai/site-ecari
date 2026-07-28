import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";
import { buildPageMetadata } from "@/lib/ecari/metadata";

const rectoratSections = [
  {
    title: "Qu'est-ce que le Rectorat ?",
    body:
      "Le Rectorat est l'instance centrale de coordination academique et institutionnelle du reseau UCAO. Il donne de la coherence aux orientations communes et facilite le lien entre les unites universitaires.",
  },
  {
    title: "Sa composition",
    body:
      "Il s'appuie sur le Recteur, des responsables academiques et administratifs, ainsi que sur les relais institutionnels des unites universitaires selon les besoins de coordination.",
  },
  {
    title: "Sa mission",
    body:
      "Sa mission consiste a accompagner la qualite academique, harmoniser les procedures, soutenir les projets communs et renforcer le pilotage institutionnel au service des etudiants, enseignants et partenaires.",
  },
] as const;

const missionPoints = [
  "Coordination des politiques academiques communes.",
  "Suivi des dossiers structurants et des projets inter-unites.",
  "Appui a la qualite, a la gouvernance et a l'information institutionnelle.",
  "Interface entre les demandes publiques, ECARI et les espaces de traitement internes.",
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: "Rectorat UCAO",
  description:
    "Presentation du Rectorat UCAO, de sa composition, de sa mission et de son role de coordination institutionnelle.",
  path: "/rectorat-ucao",
});

export default function RectoratUcaoPage() {
  return (
    <MarketingPageShell
      description="Un espace dedie pour comprendre le role du Rectorat, sa composition et sa mission dans la coordination du reseau UCAO."
      eyebrow="Rectorat UCAO"
      title="Le point de coordination institutionnelle de l&apos;UCAO."
    >
      <div className="ecari-contact-grid">
        {rectoratSections.map((section) => (
          <article className="ecari-contact-card" key={section.title}>
            <span className="ecari-info-card__icon" aria-hidden="true">
              R
            </span>
            <h2>{section.title}</h2>
            <span className="ecari-page-rule" aria-hidden="true" />
            <p>{section.body}</p>
          </article>
        ))}
      </div>

      <section className="ecari-content-card ecari-callout-band">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7b4e1f]">
            Role operationnel
          </p>
          <h2>Un relais entre les publics, les unites et l&apos;administration.</h2>
        </div>
        <div className="grid gap-3">
          {missionPoints.map((point) => (
            <div className="ecari-list-row" key={point}>
              {point}
            </div>
          ))}
        </div>
        <div className="ecari-callout-band__actions">
          <Link className="ecari-outline-button" href="/contact">
            Contacter ECARI
          </Link>
          <Link className="ecari-solid-button" href="/rectorat/login">
            Acceder au back-office
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
