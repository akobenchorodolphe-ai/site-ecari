import Link from "next/link";
import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";

export default function StudentPreRegistrationPage() {
  return (
    <MarketingPageShell
      description="Cette page preparera le futur parcours de preinscription etudiante au Rectorat UCAO."
      eyebrow="Preinscription etudiant"
      title="Un espace en preparation pour orienter les futurs etudiants."
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="ecari-content-card">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7b4e1f]">
            Bientot disponible
          </p>
          <p className="mt-4 text-2xl leading-9 text-[#203730]">
            Le futur module de preinscription centralisera les informations
            initiales, les pieces a fournir et l&apos;orientation vers le Rectorat.
          </p>
          <p className="mt-5 text-base leading-8 text-[#56675f]">
            Nous pourrons ensuite y brancher un formulaire complet, des statuts
            de suivi et un parcours plus fin par niveau ou filiere.
          </p>
        </article>

        <aside className="ecari-side-note">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#dcc7a3]">
            Suite
          </p>
          <p className="mt-4 text-3xl text-[#f7f1e3]">UCAO</p>
          <p className="mt-4 text-sm leading-7 text-[#efe6d5]">
            Cette page sert deja de point d&apos;entree en attendant la construction
            du module de preinscription.
          </p>
          <Link className="btn-secondary mt-6 text-center" href="/contact">
            Contacter ECARI
          </Link>
        </aside>
      </div>
    </MarketingPageShell>
  );
}
