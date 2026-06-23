import Image from "next/image";

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
    </footer>
  );
}
