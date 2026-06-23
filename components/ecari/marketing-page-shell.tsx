import type { ReactNode } from "react";
import Image from "next/image";

import { SiteFooter } from "@/components/ecari/site-footer";
import { SiteHeader } from "@/components/ecari/site-header";

type MarketingPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  heroAlt?: string;
  heroImage?: string;
  children: ReactNode;
};

export function MarketingPageShell({
  eyebrow,
  title,
  description,
  heroAlt,
  heroImage,
  children,
}: MarketingPageShellProps) {
  return (
    <main className="ecari-marketing-page">
      <div className="ecari-page-bg" />
      <div className="ecari-marketing-page__inner">
        <SiteHeader />

        <section className="ecari-page-stack">
          {heroImage ? (
            <div className="ecari-page-hero">
              <Image
                alt={heroAlt ?? ""}
                className="ecari-page-hero__image"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 82vw"
                src={heroImage}
              />
              <div className="ecari-page-hero__content">
                <p className="ecari-page-eyebrow">{eyebrow}</p>
                <h1>{title}</h1>
                <span className="ecari-page-rule" aria-hidden="true" />
                <p>{description}</p>
              </div>
            </div>
          ) : (
            <div className="ecari-page-hero ecari-page-hero--plain">
              <div className="ecari-page-hero__content">
                <p className="ecari-page-eyebrow">{eyebrow}</p>
                <h1>{title}</h1>
                <span className="ecari-page-rule" aria-hidden="true" />
                <p>{description}</p>
              </div>
            </div>
          )}

          {children}
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
