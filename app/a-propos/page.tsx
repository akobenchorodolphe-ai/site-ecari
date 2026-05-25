import { MarketingPageShell } from "@/components/ecari/marketing-page-shell";

const focusAreas = [
  {
    title: "La recherche",
    lead:
      "Parce que la recherche est essentielle pour l'industrialisation, la creation d'emplois et la competitivite.",
    body:
      "La recherche de qualite permet de reagir aux urgences et de se preparer a l'avenir.",
  },
  {
    title: "L'innovation",
    lead:
      "Parce qu'elle regroupe, rassemble diverses competences et facilite un apprentissage accelere, cadre et de qualite.",
    body:
      "L'innovation universitaire trace un chemin vers l'evolution participative et non subissante pour positionner l'institut comme un pole decideur et gardant son autonomie.",
  },
] as const;

export default function AboutPage() {
  return (
    <MarketingPageShell
      description="ECARI accompagne la recherche et l'innovation comme deux leviers complementaires pour renforcer la decision, l'autonomie institutionnelle et l'impact academique."
      eyebrow="A propos"
      title="Pourquoi ECARI s'interesse a la recherche et a l'innovation."
    >
      <div className="grid gap-5 xl:grid-cols-2">
        {focusAreas.map((area) => (
          <article className="ecari-content-card" key={area.title}>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7b4e1f]">
              {area.title}
            </p>
            <p className="mt-4 text-2xl leading-9 text-[#203730]">{area.lead}</p>
            <p className="mt-5 text-base leading-8 text-[#56675f]">{area.body}</p>
          </article>
        ))}
      </div>
    </MarketingPageShell>
  );
}
