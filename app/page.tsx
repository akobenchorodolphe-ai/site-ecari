import type { Metadata } from "next";
import Image from "next/image";

import { HomeOptionGrid } from "@/components/ecari/home-option-grid";
import { SiteHeader } from "@/components/ecari/site-header";
import { buildPageMetadata } from "@/lib/ecari/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Accueil",
  description:
    "Accueil ECARI avec acces direct au don, au recensement Chercheur CERAO, a la preinscription etudiante et aux partenariats financiers.",
  path: "/",
});

export default function Home() {
  const googleFormUrl = process.env.NEXT_PUBLIC_CERAO_GOOGLE_FORM_URL ?? "";
  const year = new Date().getFullYear();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="ecari-home-bg" />

      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-4 md:px-6 md:py-6 lg:h-screen lg:max-h-screen">
        <SiteHeader />

        <section className="ecari-home-stage">
          <HomeOptionGrid googleFormUrl={googleFormUrl} />
        </section>

        <footer className="ecari-home-footer">
          <div className="ecari-home-footer__brandline">
            <span>ESPACE CONSEIL D&apos;APPUI A LA</span>
            <div className="ecari-home-footer__logo">
              <Image
                alt="Logo ECARI"
                className="ecari-home-footer__logo-image"
                height={800}
                sizes="64px"
                src="/ecari-logo.webp"
                width={1280}
              />
            </div>
            <span>RECHERCHE ET A L&apos;INNOVATION</span>
          </div>
          <p className="ecari-home-footer__copy">
            &copy; {year} ECARI. Tous droits reserves.
          </p>
        </footer>
      </div>
    </main>
  );
}
