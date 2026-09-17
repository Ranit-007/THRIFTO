"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ChangeEvent, type KeyboardEvent, useEffect, useMemo, useState } from "react";
import { mobileNavigation, primaryNavigation } from "@/config/navigation";
import { store } from "@/config/store";
import { products } from "@/lib/catalog";
import { Logo } from "@/components/site/logo";
import { useStore } from "@/components/providers/store-provider";

type Panel = "search" | "account" | "wishlist" | "cart";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 28);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || panel ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, panel]);

  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setPanel(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const { cartTotalQuantity } = useStore();

  function openPanel(nextPanel: Panel) {
    setMenuOpen(false);
    setPanel(nextPanel);
  }

  return (
    <>
      <div className="announcement-bar" role="status">
        <span>{store.announcement}</span>
        <span className="announcement-bar__detail">/ NEW COLLECTION ONLINE</span>
      </div>
      <header className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
        <Logo />
        <nav className="navbar__links" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link key={item.label} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="navbar__end">
          <HeaderAction label="Search" onClick={() => openPanel("search")}><Search aria-hidden="true" size={18} /></HeaderAction>
          <HeaderAction label="Account" onClick={() => openPanel("account")}><UserRound aria-hidden="true" size={18} /></HeaderAction>
          <HeaderAction label="Wishlist" onClick={() => openPanel("wishlist")}><Heart aria-hidden="true" size={18} /></HeaderAction>
          <HeaderAction label="Cart" onClick={() => openPanel("cart")} count={cartTotalQuantity}><ShoppingBag aria-hidden="true" size={18} /></HeaderAction>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={23} />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-navigation"
            className="mobile-nav"
            initial={shouldReduceMotion ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile navigation">
              {mobileNavigation.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.13 + index * 0.055, duration: 0.35 }}
                >
                  <Link href={item.href} onClick={() => setMenuOpen(false)}>
                    <span>0{index + 1}</span>{item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mobile-nav__utilities" aria-label="Store tools">
              <button type="button" onClick={() => openPanel("search")}><Search aria-hidden="true" size={18} /> Search</button>
              <button type="button" onClick={() => openPanel("account")}><UserRound aria-hidden="true" size={18} /> Account</button>
              <button type="button" onClick={() => openPanel("wishlist")}><Heart aria-hidden="true" size={18} /> Wishlist</button>
              <button type="button" onClick={() => openPanel("cart")}><ShoppingBag aria-hidden="true" size={18} /> Cart <span>0</span></button>
            </div>
            <p>Temporary brand identity. Premium streetwear for people who move different.</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <FeaturePanel panel={panel} onClose={() => setPanel(null)} />
    </>
  );
}

function HeaderAction({ children, label, count, onClick }: { children: React.ReactNode; label: string; count?: number; onClick: () => void }) {
  return (
    <button className="nav-icon" type="button" aria-label={label} onClick={onClick}>
      {children}
      {count !== undefined ? <span className="nav-icon__count" aria-label={`${count} items`}>{count}</span> : null}
    </button>
  );
}

function FeaturePanel({ panel, onClose }: { panel: Panel | null; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const matches = useMemo(
    () => products.filter((product) => `${product.name} ${product.category} ${product.collection}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4),
    [query],
  );

  useEffect(() => {
    if (!panel) setQuery("");
  }, [panel]);

  const info = {
    account: { title: "Your account", body: "Account access will be connected when authentication is introduced. No customer data is collected in this demo." },
    wishlist: { title: "Your wishlist", body: "Items saved to your wishlist are stored locally and persist across page reloads. Account-based saving arrives in a later phase." },
    cart: { title: "Your cart", body: "Your cart is saved locally and persists across page reloads. Checkout and payment processing will be built in a later phase." },
  } as const;

  return (
    <AnimatePresence>
      {panel ? (
        <motion.div className="feature-panel__backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.aside
            className="feature-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feature-panel-title"
            initial={shouldReduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="feature-panel__header">
              <p>{panel === "search" ? "Search the demo collection" : "Storefront preview"}</p>
              <button type="button" onClick={onClose} aria-label="Close panel"><X aria-hidden="true" size={20} /></button>
            </div>
            {panel === "search" ? (
              <SearchPanel query={query} matches={matches} onChange={(event) => setQuery(event.target.value)} onClose={onClose} />
            ) : (
              <div className="feature-panel__message">
                <h2 id="feature-panel-title">{info[panel].title}</h2>
                <p>{info[panel].body}</p>
                <button type="button" className="button button--dark" onClick={onClose}>Continue browsing</button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SearchPanel({ query, matches, onChange, onClose }: { query: string; matches: typeof products; onChange: (event: ChangeEvent<HTMLInputElement>) => void; onClose: () => void }) {
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  }

  return (
    <div className="search-panel">
      <label className="sr-only" htmlFor="site-search">Search demo products</label>
      <input id="site-search" autoFocus type="search" placeholder="Search tees, collections..." value={query} onChange={onChange} onKeyDown={handleKeyDown} />
      <div className="search-panel__results" aria-live="polite">
        <p>{query ? `${matches.length} matching pieces` : "Featured pieces"}</p>
        {matches.map((product) => (
          <Link href={`/product/${product.slug}`} key={product.id} onClick={onClose}>
            <span>{product.name}</span><span>{product.category}</span>
          </Link>
        ))}
        {query && matches.length === 0 ? <span className="search-panel__empty">No demo products match that search.</span> : null}
      </div>
    </div>
  );
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
