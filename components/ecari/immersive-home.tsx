"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ecariNavItems,
  type EcariSectionId,
  SiteHeader,
} from "@/components/ecari/site-header";

const aboutReasons = [
  {
    index: "01",
    title: "La recherche",
    lead:
      "Parce que la recherche est essentielle pour l'industrialisation, la creation d'emplois et la competitivite.",
    body:
      "La recherche de qualite permet de reagir aux urgences et de se preparer a l'avenir.",
  },
  {
    index: "02",
    title: "L'innovation",
    lead:
      "Parce qu'elle regroupe, rassemble diverses competences et facilite un apprentissage accelere, cadre et de qualite.",
    body:
      "L'innovation universitaire trace un chemin vers l'evolution participative et non subissante pour positionner l'institut comme un pole decideur et gardant son autonomie.",
  },
] as const;

const ceraoEssentials = [
  "Formulaire public pour les docteurs exterieurs du CERAO.",
  "Depot centralise des pieces academiques et des theses.",
  "Espace Rectorat pour lire, filtrer et exporter les candidatures.",
] as const;

const contactChannels = [
  {
    title: "Candidatures CERAO",
    description:
      "Point d'entree officiel pour les docteurs exterieurs souhaitant soumettre leur dossier.",
    href: "/cerao/inscription",
    cta: "Acceder au formulaire",
  },
  {
    title: "Espace Rectorat",
    description:
      "Acces reserve au traitement des dossiers, a la lecture des profils et a l'export des candidatures.",
    href: "/rectorat/login",
    cta: "Ouvrir l'espace Rectorat",
  },
  {
    title: "Coordination ECARI",
    description:
      "Email, telephone, adresse et horaires peuvent etre ajoutes ici sans alourdir la page.",
  },
] as const;

const morphShapes: Record<
  EcariSectionId,
  { primary: string; secondary: string; tertiary: string }
> = {
  hero: {
    primary:
      "M110 190 C210 80 430 20 630 90 C830 160 1020 60 1210 120 C1400 180 1560 360 1540 560 C1520 760 1380 940 1130 980 C880 1020 620 950 410 900 C200 850 20 680 40 470 C60 260 10 300 110 190 Z",
    secondary:
      "M980 420 C1100 320 1310 340 1430 460 C1550 580 1560 770 1460 890 C1360 1010 1150 1050 980 1010 C810 970 700 850 700 700 C700 550 860 520 980 420 Z",
    tertiary:
      "M120 730 C240 650 430 620 590 670 C750 720 900 700 1030 630 C1160 560 1340 570 1450 680 C1560 790 1540 940 1400 1020 C1260 1100 1030 1090 860 1020 C690 950 560 850 430 820 C300 790 170 810 120 730 Z",
  },
  mission: {
    primary:
      "M80 240 C190 110 380 30 610 70 C840 110 1030 30 1240 90 C1450 150 1600 340 1560 540 C1520 740 1320 910 1070 960 C820 1010 540 980 350 900 C160 820 20 650 30 480 C40 310 -30 370 80 240 Z",
    secondary:
      "M1020 360 C1170 300 1370 360 1470 500 C1570 640 1540 820 1410 930 C1280 1040 1080 1040 930 950 C780 860 720 720 760 590 C800 460 870 420 1020 360 Z",
    tertiary:
      "M100 650 C220 550 390 500 560 540 C730 580 920 570 1080 510 C1240 450 1410 480 1510 600 C1610 720 1560 900 1410 990 C1260 1080 1060 1080 890 1030 C720 980 600 870 460 830 C320 790 180 780 100 650 Z",
  },
  cerao: {
    primary:
      "M150 160 C310 20 500 30 700 130 C900 230 1060 140 1260 160 C1460 180 1580 340 1530 540 C1480 740 1280 900 1040 930 C800 960 610 920 420 860 C230 800 40 660 50 450 C60 240 -10 300 150 160 Z",
    secondary:
      "M900 400 C1040 280 1270 290 1410 400 C1550 510 1580 720 1480 860 C1380 1000 1180 1050 1000 1010 C820 970 700 830 710 660 C720 490 760 520 900 400 Z",
    tertiary:
      "M140 760 C280 660 470 620 640 650 C810 680 960 650 1100 580 C1240 510 1430 540 1530 660 C1630 780 1560 940 1410 1020 C1260 1100 1040 1090 870 1030 C700 970 560 870 420 840 C280 810 170 840 140 760 Z",
  },
  contact: {
    primary:
      "M120 220 C250 70 450 40 680 80 C910 120 1110 70 1290 140 C1470 210 1580 400 1540 600 C1500 800 1320 950 1080 980 C840 1010 600 950 390 880 C180 810 20 660 20 470 C20 280 -10 370 120 220 Z",
    secondary:
      "M940 380 C1090 290 1290 320 1420 450 C1550 580 1560 780 1450 910 C1340 1040 1130 1060 960 1000 C790 940 680 800 690 650 C700 500 790 470 940 380 Z",
    tertiary:
      "M100 700 C230 590 420 540 610 570 C800 600 980 580 1130 520 C1280 460 1460 500 1540 640 C1620 780 1540 950 1390 1030 C1240 1110 1020 1100 830 1040 C640 980 500 870 360 830 C220 790 110 810 100 700 Z",
  },
};

const sectionIds = ecariNavItems.map((item) => item.id);

function getParallaxStyle(shift: string, delay: string): CSSProperties {
  return {
    "--parallax-shift": shift,
    "--parallax-delay": delay,
  } as CSSProperties;
}

function MorphBackground({
  activeSection,
  previousSection,
}: {
  activeSection: EcariSectionId;
  previousSection: EcariSectionId;
}) {
  const currentShapes = morphShapes[activeSection];
  const previousShapes = morphShapes[previousSection];

  return (
    <div aria-hidden="true" className="ecari-morph-bg">
      <div className="ecari-morph-bg__wash" data-theme={activeSection} />
      <svg
        className="ecari-morph-bg__svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1600 1100"
      >
        <defs>
          <filter id="ecariBlurPrimary">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="ecariBlurSecondary">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        <path
          d={currentShapes.primary}
          fill="rgba(220,199,163,0.55)"
          filter="url(#ecariBlurPrimary)"
          key={`primary-${activeSection}`}
        >
          <animate
            attributeName="d"
            begin="0s"
            dur="820ms"
            fill="freeze"
            from={previousShapes.primary}
            to={currentShapes.primary}
          />
        </path>

        <path
          d={currentShapes.secondary}
          fill="rgba(24,50,44,0.18)"
          filter="url(#ecariBlurSecondary)"
          key={`secondary-${activeSection}`}
        >
          <animate
            attributeName="d"
            begin="0s"
            dur="880ms"
            fill="freeze"
            from={previousShapes.secondary}
            to={currentShapes.secondary}
          />
        </path>

        <path
          d={currentShapes.tertiary}
          fill="rgba(155,107,47,0.14)"
          key={`tertiary-${activeSection}`}
        >
          <animate
            attributeName="d"
            begin="0s"
            dur="960ms"
            fill="freeze"
            from={previousShapes.tertiary}
            to={currentShapes.tertiary}
          />
        </path>
      </svg>
    </div>
  );
}

function SectionPagination({
  activeSection,
  onNavigate,
}: {
  activeSection: EcariSectionId;
  onNavigate: (sectionId: EcariSectionId) => void;
}) {
  return (
    <nav aria-label="Navigation verticale ECARI" className="ecari-pagination">
      {ecariNavItems.map((item) => {
        const isActive = activeSection === item.id;

        return (
          <button
            className="ecari-pagination__button"
            data-active={isActive}
            key={item.id}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <span className="ecari-pagination__dot" />
            <span className="ecari-pagination__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function ImmersiveHome() {
  const mainRef = useRef<HTMLElement | null>(null);
  const sectionRefs = useRef<Partial<Record<EcariSectionId, HTMLElement | null>>>({});
  const [{ current: activeSection, previous: previousSection }, setSectionState] =
    useState<{
      current: EcariSectionId;
      previous: EcariSectionId;
    }>({
      current: "hero",
      previous: "hero",
    });

  const observerThresholds = useMemo(() => [0.35, 0.55, 0.72], []);

  function updateActiveSection(sectionId: EcariSectionId) {
    setSectionState((currentState) => {
      if (currentState.current === sectionId) {
        return currentState;
      }

      return {
        current: sectionId,
        previous: currentState.current,
      };
    });
  }

  function navigateTo(sectionId: EcariSectionId) {
    const target = sectionRefs.current[sectionId];

    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    updateActiveSection(sectionId);
  }

  useEffect(() => {
    const root = mainRef.current;

    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const currentEntry = [...entries]
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (currentEntry) {
          updateActiveSection(currentEntry.target.id as EcariSectionId);
        }
      },
      {
        root,
        threshold: observerThresholds,
        rootMargin: "-12% 0px -12% 0px",
      },
    );

    sectionIds.forEach((sectionId) => {
      const section = sectionRefs.current[sectionId];

      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [observerThresholds]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hash = window.location.hash.replace("#", "") as EcariSectionId;

    if (sectionIds.includes(hash)) {
      window.requestAnimationFrame(() => {
        const target = sectionRefs.current[hash];

        if (!target) {
          return;
        }

        target.scrollIntoView({ behavior: "smooth", block: "start" });
        updateActiveSection(hash);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextUrl = activeSection === "hero" ? "/" : `/#${activeSection}`;
    window.history.replaceState(null, "", nextUrl);
  }, [activeSection]);

  return (
    <main className="ecari-immersive" ref={mainRef}>
      <MorphBackground
        activeSection={activeSection}
        previousSection={previousSection}
      />
      <SiteHeader activeSection={activeSection} onNavigate={navigateTo} />
      <SectionPagination activeSection={activeSection} onNavigate={navigateTo} />

      <section
        className="ecari-section"
        data-active={activeSection === "hero"}
        id="hero"
        ref={(section) => {
          sectionRefs.current.hero = section;
        }}
      >
        <div className="ecari-section__inner">
          <div className="ecari-shell panel ecari-shell--hero">
            <div className="max-w-4xl text-center">
              <h1
                className="mt-5 text-4xl leading-[1.05] text-[#18322c] md:text-6xl lg:text-7xl"
                data-parallax="true"
                style={getParallaxStyle("40px", "90ms")}
              >
                ECARI relie la recherche, l&apos;innovation et le module prioritaire
                CERAO dans une seule entree.
              </h1>
              <p
                className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#45574f] md:text-xl"
                data-parallax="true"
                style={getParallaxStyle("44px", "140ms")}
              >
                Une page claire pour comprendre l&apos;essentiel, puis passer
                directement a l&apos;action cote candidature ou Rectorat.
              </p>
            </div>

            <div
              className="flex flex-col gap-3 sm:flex-row"
              data-parallax="true"
              style={getParallaxStyle("48px", "190ms")}
            >
              <Link className="btn-primary text-center" href="/cerao/inscription">
                Acceder au module CERAO
              </Link>
              <Link className="btn-secondary text-center" href="/rectorat/login">
                Espace Rectorat
              </Link>
            </div>

            <div
              className="max-w-3xl rounded-[2rem] border border-[rgba(53,79,69,0.12)] bg-white/68 px-6 py-5 text-center text-sm leading-7 text-[#4f6158]"
              data-parallax="true"
              style={getParallaxStyle("52px", "240ms")}
            >
              Focus prioritaire: le vivier des docteurs CERAO, deja structure
              pour la soumission, la lecture des profils et l&apos;export Rectorat.
              </div>
          </div>
        </div>
      </section>

      <section
        className="ecari-section"
        data-active={activeSection === "mission"}
        id="mission"
        ref={(section) => {
          sectionRefs.current.mission = section;
        }}
      >
        <div className="ecari-section__inner">
          <div className="ecari-shell ecari-shell--about panel">
            <div className="max-w-3xl text-center">
              <h2
                className="mt-5 text-4xl leading-tight text-[#18322c] md:text-5xl"
                data-parallax="true"
                style={getParallaxStyle("36px", "80ms")}
              >
                Pourquoi ECARI s&apos;interesse a la recherche et a l&apos;innovation.
              </h2>
            </div>

            <div className="grid w-full gap-4 lg:grid-cols-2">
              {aboutReasons.map((reason, index) => (
                <article
                  className="ecari-focus-card"
                  data-parallax="true"
                  key={reason.index}
                  style={getParallaxStyle("44px", `${160 + index * 70}ms`)}
                >
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#7b4e1f]">
                    {reason.index} {reason.title}
                  </p>
                  <p className="mt-5 text-xl leading-8 text-[#203730] md:text-2xl">
                    {reason.lead}
                  </p>
                  <p className="mt-4 text-base leading-7 text-[#56675f]">
                    {reason.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="ecari-section"
        data-active={activeSection === "cerao"}
        id="cerao"
        ref={(section) => {
          sectionRefs.current.cerao = section;
        }}
      >
        <div className="ecari-section__inner">
          <div className="ecari-shell ecari-shell--module panel">
            <div className="max-w-3xl text-center">
              <h2
                className="mt-5 text-4xl leading-tight text-[#18322c] md:text-5xl"
                data-parallax="true"
                style={getParallaxStyle("34px", "80ms")}
              >
                Le module CERAO est le premier service actif de la plateforme.
              </h2>
              <p
                className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#56675f] md:text-lg"
                data-parallax="true"
                style={getParallaxStyle("44px", "150ms")}
              >
                Il transforme un besoin institutionnel en parcours numerique
                simple, du depot du dossier a l&apos;exploitation decisionnelle cote
                Rectorat.
              </p>
            </div>

            <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
              <div className="grid gap-3">
                {ceraoEssentials.map((item, index) => (
                  <div
                    className="ecari-list-item"
                    data-parallax="true"
                    key={item}
                    style={getParallaxStyle("48px", `${190 + index * 55}ms`)}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <aside
                className="ecari-module-aside"
                data-parallax="true"
                style={getParallaxStyle("52px", "260ms")}
              >
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#dcc7a3]">
                  Priorite active
                </p>
                <p className="mt-4 text-3xl text-[#f7f1e3]">CERAO</p>
                <p className="mt-4 text-sm leading-7 text-[#efe6d5]">
                  Vivier des docteurs exterieurs, disponibilite des profils,
                  theses, pieces academiques et export Excel.
                </p>
              </aside>
            </div>

            <div
              className="flex flex-col gap-3 sm:flex-row"
              data-parallax="true"
              style={getParallaxStyle("56px", "320ms")}
            >
              <Link className="btn-primary text-center" href="/cerao/inscription">
                Ouvrir le formulaire CERAO
              </Link>
              <Link className="btn-secondary text-center" href="/rectorat/login">
                Se connecter cote Rectorat
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="ecari-section"
        data-active={activeSection === "contact"}
        id="contact"
        ref={(section) => {
          sectionRefs.current.contact = section;
        }}
      >
        <div className="ecari-section__inner">
          <div className="ecari-shell ecari-shell--contact panel">
            <div className="max-w-3xl text-center">
              <h2
                className="mt-5 text-4xl leading-tight text-[#18322c] md:text-5xl"
                data-parallax="true"
                style={getParallaxStyle("36px", "80ms")}
              >
                Les points de contact essentiels restent immediatement visibles.
              </h2>
            </div>

            <div className="grid w-full gap-4 lg:grid-cols-3">
              {contactChannels.map((channel, index) => (
                <article
                  className="ecari-contact-card"
                  data-parallax="true"
                  key={channel.title}
                  style={getParallaxStyle("46px", `${150 + index * 70}ms`)}
                >
                  <h3 className="text-2xl leading-tight text-[#18322c]">
                    {channel.title}
                  </h3>
                  <p className="mt-4 flex-1 leading-7 text-[#56675f]">
                    {channel.description}
                  </p>
                  {"href" in channel ? (
                    <Link
                      className="btn-secondary mt-6 w-full text-center"
                      href={channel.href}
                    >
                      {channel.cta}
                    </Link>
                  ) : (
                    <div className="mt-6 rounded-[1.4rem] border border-dashed border-[rgba(53,79,69,0.22)] bg-white/62 px-4 py-4 text-sm leading-6 text-[#4f6158]">
                      Coordonnees institutionnelles a renseigner ici.
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
