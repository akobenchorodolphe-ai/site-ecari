import Link from "next/link";
import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";

const contactBlocks = [
  {
    title: "Coordination ECARI",
    description:
      "Page prete a accueillir les coordonnees officielles de reference: email, telephone, adresse et horaires.",
    note: "Coordonnees institutionnelles a renseigner.",
  },
  {
    title: "Recensement CERAO",
    description:
      "Le recensement des chercheurs CERAO passe temporairement par un lien Google Form accessible depuis l'accueil.",
    href: "/",
    cta: "Retour a l'accueil",
  },
  {
    title: "Espace Rectorat",
    description:
      "Le back-office Rectorat reste disponible pour la lecture, le tri et l'export des candidatures.",
    href: "/rectorat/login",
    cta: "Ouvrir l'espace Rectorat",
  },
] as const;

export default function ContactPage() {
  return (
    <MarketingPageShell
      description="Les informations de contact utiles restent centralisees ici, sans surcharger la page d'accueil."
      eyebrow="Contact"
      title="Les points de contact importants d'ECARI."
    >
      <div className="grid gap-5 xl:grid-cols-3">
        {contactBlocks.map((block) => (
          <article className="ecari-content-card flex flex-col" key={block.title}>
            <h2 className="text-2xl leading-tight text-[#18322c]">{block.title}</h2>
            <p className="mt-4 flex-1 text-base leading-8 text-[#56675f]">
              {block.description}
            </p>

            {"href" in block ? (
              <Link className="btn-secondary mt-6 w-full text-center" href={block.href}>
                {block.cta}
              </Link>
            ) : (
              <div className="mt-6 rounded-[1.4rem] border border-dashed border-[rgba(53,79,69,0.22)] bg-white/62 px-4 py-4 text-sm leading-6 text-[#4f6158]">
                {block.note}
              </div>
            )}
          </article>
        ))}
      </div>
    </MarketingPageShell>
  );
}
