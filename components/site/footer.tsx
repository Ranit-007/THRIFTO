import { ArrowUpRight, Instagram, Youtube } from "lucide-react";
import { brand } from "@/config/brand";
import { footerNavigation } from "@/config/navigation";
import { Logo } from "@/components/site/logo";

export function Footer() {
  const socialLinks: Array<{ label: string; href: string | undefined; icon: React.ReactNode }> = [
    { label: "Instagram", href: brand.social.instagram, icon: <Instagram aria-hidden="true" size={17} /> },
    { label: "YouTube", href: brand.social.youtube, icon: <Youtube aria-hidden="true" size={18} /> },
    { label: "X", href: brand.social.x, icon: <span aria-hidden="true">X</span> },
  ];

  const validSocialLinks = socialLinks.filter((link): link is { label: string; href: string; icon: React.ReactNode } => typeof link.href === "string");

  return (
    <footer className="footer" id="footer">
      <div className="page-shell">
        <div className="footer__top">
          <div className="footer__identity">
            <Logo inverse />
            <p>{brand.description}</p>
            {brand.isDemo ? <span className="footer__demo">Temporary identity / Phase 1</span> : null}
          </div>
          <FooterColumn title="Explore" links={footerNavigation.explore} />
          <FooterColumn title="Customer care" links={footerNavigation.care} />
          <FooterColumn title="Information" links={footerNavigation.legal} />
          <div className="footer__contact">
            <p className="footer__label">Find us</p>
            <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>
            <span>{brand.contact.location}</span>
            {validSocialLinks.length ? <div className="footer__socials">{validSocialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>{link.icon}</a>)}</div> : <p className="footer__social-note">Social channels coming soon.</p>}
          </div>
        </div>
        <div className="footer__wordmark" aria-hidden="true">{brand.name}</div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {brand.legalName}</span>
          <span>Designed in India / Worn everywhere</span>
          <a href="#top">Back to top <ArrowUpRight aria-hidden="true" size={14} /></a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div className="footer__column">
      <p className="footer__label">{title}</p>
      {links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
    </div>
  );
}
