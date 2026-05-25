import type { ReactNode } from "react";
import { SiteHeader } from "@/components/ecari/site-header";

type MarketingPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function MarketingPageShell({
  eyebrow,
  title,
  description,
  children,
}: MarketingPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="ecari-page-bg" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 md:px-8 md:py-6">
        <SiteHeader />

        <section className="ecari-page-stack">
          <div className="panel rounded-[2.4rem] px-6 py-7 md:px-8 md:py-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7b4e1f]">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl leading-tight text-[#18322c] md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#56675f] md:text-lg">
              {description}
            </p>
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}
