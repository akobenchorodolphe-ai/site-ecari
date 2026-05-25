"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="ecari-site-header panel overflow-hidden px-4 py-3 md:px-5">
      <div className="flex items-center justify-between gap-4">
        <Link
          className="flex min-w-0 items-center gap-3"
          href="/"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="ecari-header-logo">
            <Image
              alt="Logo ECARI"
              className="h-auto w-[7.9rem] mix-blend-multiply md:w-[10.8rem]"
              height={800}
              priority
              src="/ecari-logo.png"
              width={1280}
            />
          </div>
        </Link>

        <nav
          aria-label="Navigation principale ECARI"
          className="hidden items-center gap-4 lg:flex"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                className={`ecari-site-header__link ${
                  isActive
                    ? "ecari-site-header__link--active"
                    : ""
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          aria-controls="ecari-mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-12 w-12 flex-none items-center justify-center rounded-[1rem] border border-[rgba(155,107,47,0.24)] bg-white/82 text-[#7b4e1f] shadow-[0_10px_24px_rgba(29,47,42,0.08)] transition hover:-translate-y-0.5 lg:hidden"
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
          <div className="rounded-[1.2rem] border border-[rgba(155,107,47,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(248,243,231,0.98)_100%)] p-4 shadow-[0_18px_36px_rgba(29,47,42,0.08)]">
            <div className="grid gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    className={`rounded-[1rem] border px-4 py-3 text-center text-sm font-black uppercase tracking-[0.18em] transition ${
                      isActive
                        ? "border-[#9b6b2f] bg-[#9b6b2f] text-white"
                        : "border-[rgba(155,107,47,0.18)] bg-white/75 text-[#7b4e1f] hover:bg-white"
                    }`}
                    href={item.href}
                    key={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
