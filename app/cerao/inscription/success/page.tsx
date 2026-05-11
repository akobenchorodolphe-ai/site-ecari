import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    matricule?: string;
    nom?: string;
  }>;
};

export default async function CeraoInscriptionSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 md:px-10">
      <section className="panel rounded-[2rem] px-6 py-8 md:px-10 md:py-12">
        <span className="badge">Dossier transmis</span>
        <h1 className="mt-5 text-4xl text-[#17322b] md:text-5xl">
          Merci {params.nom ? params.nom : "pour votre soumission"}
        </h1>
        <p className="mt-4 text-lg leading-8 text-[#55675f]">
          Votre dossier a bien été reçu par le Rectorat UCAO. Conservez votre
          matricule de suivi pour les échanges futurs.
        </p>

        <div className="mt-8 rounded-[1.6rem] border border-[#9b6b2f24] bg-[#fff8eb] px-5 py-5">
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-[#8d6b3f]">
            Matricule généré
          </div>
          <div className="mt-3 text-3xl text-[#1e342e]">
            {params.matricule || "En attente de génération"}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="btn-primary text-center" href="/cerao/inscription">
            Soumettre un autre dossier
          </Link>
          <Link className="btn-secondary text-center" href="/">
            Revenir à l&apos;accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
