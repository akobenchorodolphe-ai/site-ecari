"use client";

import Link from "next/link";
import { useState } from "react";

export const ecariNavItems = [
  { id: "hero", href: "#hero", label: "Accueil" },
  { id: "mission", href: "#mission", label: "A propos" },
  { id: "cerao", href: "#cerao", label: "Module CERAO" },
  { id: "contact", href: "#contact", label: "Contact" },
] as const;

export type EcariSectionId = (typeof ecariNavItems)[number]["id"];

type SiteHeaderProps = {
  activeSection?: EcariSectionId;
  onNavigate?: (sectionId: EcariSectionId) => void;
};

export function SiteHeader({ activeSection = "hero", onNavigate }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleNavigate(sectionId: EcariSectionId) {
    onNavigate?.(sectionId);
    setIsMenuOpen(false);
  }

  return (
    <header className="pointer-events-auto fixed left-1/2 top-4 z-40 w-[min(95vw,72rem)] -translate-x-1/2">
      <div className="panel overflow-hidden rounded-[2rem] px-4 py-3 md:px-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#18322c] text-sm font-bold tracking-[0.18em] text-[#f7f1e3] shadow-[0_12px_24px_rgba(24,50,44,0.18)]">
            EC
          </div>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#5d6d64]">
              UCAO
            </p>
            <p className="truncate text-sm font-semibold text-[#18322c] md:text-base">
              Espace Conseil d&apos;Appui a la Recherche et a l&apos;Innovation
            </p>
          </div>
        </div>

        <nav
          aria-label="Navigation principale ECARI"
          className="hidden items-center gap-1 rounded-full border border-white/60 bg-white/72 p-1.5 text-sm font-semibold text-[#355046] lg:flex"
        >
          {ecariNavItems.map((item) => (
            <a
              aria-current={activeSection === item.id ? "page" : undefined}
              className={`rounded-full px-4 py-2 transition ${
                activeSection === item.id
                  ? "bg-[#18322c] text-[#f7f1e3] shadow-[0_10px_24px_rgba(24,50,44,0.16)]"
                  : "hover:bg-[#18322c] hover:text-[#f7f1e3]"
              }`}
              href={item.href}
              key={item.href}
              onClick={(event) => {
                if (!onNavigate) {
                  return;
                }

                event.preventDefault();
                handleNavigate(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link className="btn-secondary text-center" href="/rectorat/login">
            Rectorat
          </Link>
          <Link className="btn-primary text-center" href="/cerao/inscription">
            Candidater
          </Link>
        </div>

        <button
          aria-controls="ecari-mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-[rgba(53,79,69,0.16)] bg-white/78 text-[#18322c] shadow-[0_10px_24px_rgba(29,47,42,0.08)] transition hover:-translate-y-0.5 lg:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          <span className="sr-only">
            {isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          </span>
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${
                isMenuOpen ? "translate-y-[0.45rem] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[0.45rem] h-0.5 w-5 rounded-full bg-current transition ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[0.9rem] h-0.5 w-5 rounded-full bg-current transition ${
                isMenuOpen ? "-translate-y-[0.45rem] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out lg:hidden ${
          isMenuOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        id="ecari-mobile-menu"
      >
        <div className="overflow-hidden">
          <div className="rounded-[1.8rem] border border-[rgba(53,79,69,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(248,243,231,0.98)_100%)] p-4 shadow-[0_18px_36px_rgba(29,47,42,0.08)]">
            <div className="grid gap-2">
              {ecariNavItems.map((item) => (
                <a
                  aria-current={activeSection === item.id ? "page" : undefined}
                  className={`rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition ${
                    activeSection === item.id
                      ? "bg-[#18322c] text-[#f7f1e3]"
                      : "text-[#355046] hover:bg-white hover:text-[#18322c]"
                  }`}
                  href={item.href}
                  key={item.href}
                  onClick={(event) => {
                    if (!onNavigate) {
                      setIsMenuOpen(false);
                      return;
                    }

                    event.preventDefault();
                    handleNavigate(item.id);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                className="btn-secondary text-center"
                href="/rectorat/login"
                onClick={() => setIsMenuOpen(false)}
              >
                Espace Rectorat
              </Link>
              <Link
                className="btn-primary text-center"
                href="/cerao/inscription"
                onClick={() => setIsMenuOpen(false)}
              >
                Formulaire CERAO
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
}
