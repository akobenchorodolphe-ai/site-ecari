import Link from "next/link";

import { ApplicationForm } from "@/components/cerao/application-form";

export default function CeraoInscriptionPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 md:px-10 lg:px-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link className="badge" href="/">
          Retour a l&apos;accueil
        </Link>
        <div className="hidden text-sm font-semibold text-[#6f6a58] md:block">
          UCAO - Rectorat - Collecte des candidatures exterieures
        </div>
      </div>

      <section className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel rounded-[2rem] px-6 py-7">
          <span className="badge">Module 1 prioritaire</span>
          <h1 className="mt-5 text-4xl leading-tight text-[#17322b] md:text-5xl">
            Dossier numerique du vivier CERAO
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#51625a]">
            Ce formulaire est destine aux docteurs et chercheurs exterieurs au
            corps enseignant UCAO. Le Rectorat analysera votre profil, vos preuves
            academiques et votre disponibilite pour de futures missions
            d&apos;enseignement ou de recherche.
          </p>
        </div>

        <aside className="panel rounded-[2rem] px-6 py-7">
          <h2 className="text-2xl text-[#1b342e]">A preparer avant l&apos;envoi</h2>
          <ul className="mt-4 space-y-3 text-[#596a62]">
            <li>Votre photo d&apos;identite au format JPG ou PNG.</li>
            <li>Le scan de chaque diplome declare.</li>
            <li>La these PDF pour chaque doctorat ou PhD.</li>
            <li>Les informations de disponibilite et l&apos;avis du superieur.</li>
          </ul>
        </aside>
      </section>

      <ApplicationForm />
    </main>
  );
}
