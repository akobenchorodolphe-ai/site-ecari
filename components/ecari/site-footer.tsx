import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/contact", label: "Contact" },
  { href: "/rectorat-ucao", label: "Rectorat" },
  { href: "/oeuvres-pere-spirituel", label: "Oeuvres" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="ecari-site-footer">
      <div className="ecari-site-footer__brandline">
        <span>ESPACE CONSEIL D&apos;APPUI A LA</span>
        <div className="ecari-site-footer__logo">
          <Image
            alt="Logo ECARI"
            className="ecari-site-footer__logo-image"
            height={800}
            sizes="64px"
            src="/ecari-logo.webp"
            width={1280}
          />
        </div>
        <span>RECHERCHE ET A L&apos;INNOVATION</span>
      </div>
      <p className="ecari-site-footer__copy">
        &copy; {year} ECARI. Tous droits reserves.
      </p>
      <nav className="ecari-site-footer__links" aria-label="Liens secondaires ECARI">
        {footerLinks.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
