import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdminSession } from "@/lib/auth/session";
import {
  formatAvisSuperieur,
  formatDate,
  formatDateTime,
  formatEtatVie,
  formatTypeDiplome,
} from "@/lib/cerao/format";
import { getCandidateDetail } from "@/lib/cerao/repository";

type CandidateDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const { id } = await params;
  await requireAdminSession(`/rectorat/candidats/${id}`);

  let candidateId: bigint;
  try {
    candidateId = BigInt(id);
  } catch {
    notFound();
  }

  const candidate = await getCandidateDetail(candidateId);
  if (!candidate) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 md:px-10 lg:px-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link className="badge" href="/rectorat/candidats">
          Retour à la liste
        </Link>
        <form action="/api/rectorat/logout" method="post">
          <button className="btn-secondary" type="submit">
            Déconnexion
          </button>
        </form>
      </div>

      <section className="panel rounded-[2rem] px-6 py-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="badge">{candidate.matricule}</span>
            <h1 className="mt-5 text-4xl text-[#17322b] md:text-5xl">
              {candidate.nom} {candidate.prenoms}
            </h1>
            <p className="mt-4 text-lg text-[#55675f]">
              {candidate.email} • {candidate.telephone}
            </p>
          </div>
          <div className="panel rounded-[1.6rem] p-4 lg:min-w-[280px]">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8d6b3f]">
              État du dossier
            </div>
            <div className="mt-3 text-2xl text-[#1d342d]">{candidate.statutDossier}</div>
            <div className="mt-2 text-sm text-[#68756d]">
              Soumis le {formatDateTime(candidate.dateSoumission)}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="panel rounded-[2rem] px-6 py-7">
          <h2 className="text-3xl text-[#19312b]">Identité & disponibilité</h2>
          <dl className="mt-6 grid gap-4">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#857659]">
                Sexe
              </dt>
              <dd className="mt-2">{candidate.sexe === "M" ? "Masculin" : "Féminin"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#857659]">
                Date de naissance
              </dt>
              <dd className="mt-2">{formatDate(candidate.dateNaissance)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#857659]">
                Lieu de naissance
              </dt>
              <dd className="mt-2">{candidate.lieuNaissance || "Non renseigné"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#857659]">
                Nationalité
              </dt>
              <dd className="mt-2">{candidate.nationalite || "Non renseignée"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#857659]">
                État de vie
              </dt>
              <dd className="mt-2">{formatEtatVie(candidate.etatVie)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#857659]">
                Diocèse / institut
              </dt>
              <dd className="mt-2">
                {candidate.affiliationReligieuse || "Sans rattachement renseigné"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#857659]">
                Avis du supérieur
              </dt>
              <dd className="mt-2">{formatAvisSuperieur(candidate.avisSuperieur)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#857659]">
                Disponibilité
              </dt>
              <dd className="mt-2">
                {candidate.disponibiliteCandidat ? "Disponible" : "Non disponible"}
              </dd>
            </div>
          </dl>

          {candidate.photoPath ? (
            <div className="mt-6">
              <a
                className="btn-secondary inline-flex"
                href={`/api/rectorat/candidats/${candidate.id.toString()}/photo`}
              >
                Voir la photo d&apos;identité
              </a>
            </div>
          ) : null}
        </article>

        <article className="panel rounded-[2rem] px-6 py-7">
          <h2 className="text-3xl text-[#19312b]">Diplômes & preuves</h2>
          <div className="mt-6 space-y-5">
            {candidate.degrees.map((degree) => (
              <div
                className="rounded-[1.5rem] border border-[#354f4518] bg-white/80 p-5"
                key={degree.id.toString()}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#8d7752]">
                      {degree.ordreAffichage === 1
                        ? "Doctorat principal"
                        : `Diplôme n°${degree.ordreAffichage}`}
                    </div>
                    <h3 className="mt-2 text-2xl text-[#1f352f]">{degree.intitule}</h3>
                    <p className="mt-2 text-[#5b6a63]">
                      {formatTypeDiplome(degree.typeDiplome)} • {degree.institution} •{" "}
                      {degree.pays} • {degree.anneeObtention}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      className="btn-secondary text-center"
                      href={`/api/rectorat/candidats/${candidate.id.toString()}/degrees/${degree.id.toString()}/preuve`}
                    >
                      Voir le diplôme
                    </a>
                    {degree.fichierThesePath ? (
                      <a
                        className="btn-primary text-center"
                        href={`/api/rectorat/candidats/${candidate.id.toString()}/degrees/${degree.id.toString()}/these`}
                      >
                        Télécharger la thèse
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel mt-6 rounded-[2rem] px-6 py-7">
        <h2 className="text-3xl text-[#19312b]">Publications</h2>
        <div className="mt-6 space-y-4">
          {candidate.publications.length === 0 ? (
            <p className="text-[#64716a]">Aucune publication n&apos;a été renseignée.</p>
          ) : null}
          {candidate.publications.map((publication) => (
            <article
              className="rounded-[1.4rem] border border-[#354f4515] bg-white/80 p-5"
              key={publication.id.toString()}
            >
              <h3 className="text-xl text-[#213932]">{publication.titre}</h3>
              <p className="mt-2 text-[#5d6b64]">
                {publication.revueEditeur} • {publication.annee}
                {publication.lieuParution ? ` • ${publication.lieuParution}` : ""}
              </p>
              {publication.lienUrl ? (
                <a
                  className="mt-3 inline-block font-semibold text-[#9b6b2f] underline-offset-4 hover:underline"
                  href={publication.lienUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Ouvrir le lien de référence
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
