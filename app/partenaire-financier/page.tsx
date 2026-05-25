import Link from "next/link";
import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";

const partnershipAxes = [
  "Appui a la recherche appliquee et a l'innovation universitaire.",
  "Soutien a des projets pilotes, programmes ou initiatives structurees.",
  "Cooperation avec des acteurs institutionnels, philanthropiques ou prives.",
] as const;

export default function FinancialPartnerPage() {
  return (
    <MarketingPageShell
      description="Un futur espace dedie aux partenaires qui souhaitent accompagner durablement la recherche et l'innovation."
      eyebrow="Partenaire financier"
      title="Construire des partenariats utiles a la recherche et a l'innovation."
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
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
            Cette page sera ensuite enrichie avec un formulaire, des axes de
            collaboration et des modalites de prise de contact dediees.
          </p>
        </article>

        <aside className="ecari-side-note">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#dcc7a3]">
            Partenariat
          </p>
          <p className="mt-4 text-3xl text-[#f7f1e3]">Recherche</p>
          <p className="mt-4 text-sm leading-7 text-[#efe6d5]">
            Un cadre sobre pour accueillir les appuis financiers et les
            collaborations strategiques.
          </p>
          <Link className="btn-secondary mt-6 text-center" href="/contact">
            Ecrire a ECARI
          </Link>
        </aside>
      </div>
    </MarketingPageShell>
  );
}
