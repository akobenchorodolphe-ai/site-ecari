import Link from "next/link";

import { requireAdminSession } from "@/lib/auth/session";
import { formatAvisSuperieur, formatDateTime, formatEtatVie } from "@/lib/cerao/format";
import { getCandidates } from "@/lib/cerao/repository";
import { ETATS_VIE, ETAT_VIE_LABELS } from "@/lib/cerao/constants";

type CandidatesPageProps = {
  searchParams: Promise<{
    q?: string;
    pays?: string;
    etatVie?: string;
    disponibilite?: string;
  }>;
};

export default async function RectoratCandidatesPage({
  searchParams,
}: CandidatesPageProps) {
  const params = await searchParams;
  await requireAdminSession("/rectorat/candidats");
  const candidates = await getCandidates({
    q: params.q?.trim(),
    pays: params.pays?.trim(),
    etatVie: params.etatVie?.trim(),
    disponibilite: params.disponibilite?.trim(),
  });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8 md:px-10 lg:px-12">
      <section className="panel rounded-[2rem] px-6 py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="badge">Back-office Rectorat</span>
            <h1 className="mt-5 text-4xl text-[#17322b] md:text-5xl">
              Candidatures reçues
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#56675f]">
              Consultez, filtrez et exportez les dossiers des docteurs extérieurs
              enregistrés dans le vivier CERAO.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a className="btn-primary text-center" href="/api/rectorat/exports/candidats.xlsx">
              Exporter en Excel
            </a>
            <form action="/api/rectorat/logout" method="post">
              <button className="btn-secondary w-full sm:w-auto" type="submit">
                Déconnexion
              </button>
            </form>
          </div>
        </div>

        <form className="mt-7 grid gap-4 rounded-[1.6rem] border border-[#354f4517] bg-white/75 p-5 md:grid-cols-4" method="get">
          <div>
            <label className="label" htmlFor="q">
              Recherche libre
            </label>
            <input
              className="field"
              defaultValue={params.q}
              id="q"
              name="q"
              placeholder="Nom, prénoms, email, matricule"
            />
          </div>
          <div>
            <label className="label" htmlFor="pays">
              Pays
            </label>
            <input
              className="field"
              defaultValue={params.pays}
              id="pays"
              name="pays"
              placeholder="Ex: Côte d'Ivoire"
            />
          </div>
          <div>
            <label className="label" htmlFor="etatVie">
              État de vie
            </label>
            <select
              className="field"
              defaultValue={params.etatVie ?? ""}
              id="etatVie"
              name="etatVie"
            >
              <option value="">Tous</option>
              {ETATS_VIE.map((etatVie) => (
                <option key={etatVie} value={etatVie}>
                  {ETAT_VIE_LABELS[etatVie]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="disponibilite">
              Disponibilité
            </label>
            <select
              className="field"
              defaultValue={params.disponibilite ?? ""}
              id="disponibilite"
              name="disponibilite"
            >
              <option value="">Toutes</option>
              <option value="oui">Disponible</option>
              <option value="non">Indisponible</option>
            </select>
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button className="btn-primary" type="submit">
              Appliquer les filtres
            </button>
          </div>
        </form>
      </section>

      <section className="panel mt-6 overflow-hidden rounded-[2rem]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f4ebd9] text-[#5f5b4d]">
              <tr>
                <th className="px-5 py-4 font-semibold">Candidat</th>
                <th className="px-5 py-4 font-semibold">Doctorat principal</th>
                <th className="px-5 py-4 font-semibold">État de vie</th>
                <th className="px-5 py-4 font-semibold">Avis supérieur</th>
                <th className="px-5 py-4 font-semibold">Disponibilité</th>
                <th className="px-5 py-4 font-semibold">Soumission</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-[#69756e]" colSpan={6}>
                    Aucun dossier ne correspond aux filtres actuels.
                  </td>
                </tr>
              ) : null}
              {candidates.map((candidate) => (
                <tr
                  className="border-t border-[#354f4512] transition-colors hover:bg-white/70"
                  key={candidate.id.toString()}
                >
                  <td className="px-5 py-4">
                    <Link
                      className="font-semibold text-[#1b342e] underline-offset-4 hover:underline"
                      href={`/rectorat/candidats/${candidate.id.toString()}`}
                    >
                      {candidate.nom} {candidate.prenoms}
                    </Link>
                    <div className="mt-1 text-xs text-[#67736b]">
                      {candidate.matricule} • {candidate.email}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#485952]">
                    {candidate.degrees[0]?.intitule ?? "Non renseigné"}
                  </td>
                  <td className="px-5 py-4">{formatEtatVie(candidate.etatVie)}</td>
                  <td className="px-5 py-4">
                    {formatAvisSuperieur(candidate.avisSuperieur)}
                  </td>
                  <td className="px-5 py-4">
                    {candidate.disponibiliteCandidat ? "Disponible" : "Non disponible"}
                  </td>
                  <td className="px-5 py-4">{formatDateTime(candidate.dateSoumission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
