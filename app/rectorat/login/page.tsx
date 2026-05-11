import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

function normaliseNextPath(raw?: string) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/rectorat/candidats";
  }

  return raw;
}

export default async function RectoratLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = normaliseNextPath(params.next);
  const session = await getAdminSession();

  if (session) {
    redirect(nextPath);
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-10 md:px-10">
      <section className="panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Link className="badge" href="/">
              Retour à l&apos;accueil
            </Link>
            <h1 className="mt-5 text-4xl text-[#16322b] md:text-5xl">
              Connexion Rectorat
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[#55675f]">
              Cet espace permet de consulter les candidatures reçues, télécharger
              les pièces jointes et exporter le vivier CERAO.
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-[#354f4518] bg-white/82 p-5">
            <h2 className="text-2xl text-[#213932]">Authentification</h2>
            {params.error ? (
              <div className="mt-4 rounded-2xl border border-[#a33d3028] bg-[#fff1ef] px-4 py-3 text-sm text-[#a33d30]">
                {params.error === "invalid"
                  ? "Email ou mot de passe invalide."
                  : "La connexion a échoué. Réessayez."}
              </div>
            ) : null}
            <form action="/api/rectorat/login" className="mt-5 space-y-4" method="post">
              <input name="next" type="hidden" value={nextPath} />
              <div>
                <label className="label" htmlFor="login-email">
                  Email
                </label>
                <input className="field" id="login-email" name="email" type="email" />
              </div>
              <div>
                <label className="label" htmlFor="login-password">
                  Mot de passe
                </label>
                <input
                  className="field"
                  id="login-password"
                  name="password"
                  type="password"
                />
              </div>
              <button className="btn-primary w-full" type="submit">
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
