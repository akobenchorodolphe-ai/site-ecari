import type { Metadata } from "next";

import { HomeOptionGrid } from "@/components/ecari/home-option-grid";
import { SiteHeader } from "@/components/ecari/site-header";
import { SiteFooter } from "@/components/ecari/site-footer";
import { CERAO_GOOGLE_FORM_URL } from "@/lib/ecari/google-form";
import { buildPageMetadata } from "@/lib/ecari/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Accueil",
  description:
    "Accueil ECARI avec acces direct au don, au recensement Chercheur CERAO, a la preinscription etudiante et aux partenariats financiers.",
  path: "/",
});

export default function Home() {
  return (
    <main className="ecari-home-page">
      <SiteHeader />

      <section className="ecari-home-showcase">
        <div className="ecari-home-showcase__shade" />
        <div className="ecari-home-showcase__inner">
          <div className="ecari-home-heading">
            <h1>Recherche et innovation pour un impact durable</h1>
            <p>
              ECARI accompagne la communaute universitaire et la societe vers
              un avenir meilleur.
            </p>
          </div>

          <HomeOptionGrid googleFormUrl={CERAO_GOOGLE_FORM_URL} />

          <div className="ecari-impact-strip" aria-label="Axes ECARI">
            <div className="ecari-impact-strip__item">
              <span className="ecari-impact-strip__icon" aria-hidden="true">
                Q
              </span>
              <div>
                <strong>Valoriser la recherche</strong>
                <span>Promouvoir l&apos;excellence academique et scientifique.</span>
              </div>
            </div>
            <div className="ecari-impact-strip__item">
              <span className="ecari-impact-strip__icon" aria-hidden="true">
                I
              </span>
              <div>
                <strong>Soutenir l&apos;innovation</strong>
                <span>Encourager les idees creatives et les solutions durables.</span>
              </div>
            </div>
            <div className="ecari-impact-strip__item">
              <span className="ecari-impact-strip__icon" aria-hidden="true">
                U
              </span>
              <div>
                <strong>Former les leaders de demain</strong>
                <span>Accompagner les etudiants vers la reussite.</span>
              </div>
            </div>
            <div className="ecari-impact-strip__item">
              <span className="ecari-impact-strip__icon" aria-hidden="true">
                P
              </span>
              <div>
                <strong>Agir ensemble</strong>
                <span>Batir des partenariats solides pour l&apos;impact social.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
