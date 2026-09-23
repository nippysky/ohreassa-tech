"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  X,
  Zap,
} from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { whatsappContact, type StoreSettings } from "@/lib/store";
import type { Category } from "@/lib/commerce/types";

export function Header({
  settings,
  categories,
}: {
  settings: StoreSettings;
  categories: Category[];
}) {
  const pathname = usePathname();
  const { count } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchButton = useRef<HTMLButtonElement>(null);
  function closeSearch() {
    setSearchOpen(false);
    searchButton.current?.focus();
  }
  return (
    <>
      {settings.announcement && (
        <div className="announcement">
          <div className="container announcement-inner">
            <span>
              <Zap size={13} fill="currentColor" />
              {settings.announcement}
            </span>
            <a href={whatsappContact(settings.whatsappNumber)}>
              Let’s find your power <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      )}
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label={`${settings.name} home`}>
            <Image
              src={settings.logo?.url || "/brand/logo-optimized.png"}
              alt={settings.logo?.alt || settings.name}
              width={207}
              height={52}
              preload
            />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
              Home
            </Link>
            <div className="nav-products">
              <Link
                href="/shop"
                aria-current={pathname.startsWith("/shop") ? "page" : undefined}
              >
                Shop products <ChevronDown size={13} />
              </Link>
              <div className="nav-dropdown">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop?category=${encodeURIComponent(c.slug)}`}
                  >
                    {c.name}
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
                <Link href="/shop">
                  View all products <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
            <Link
              href="/about"
              aria-current={pathname === "/about" ? "page" : undefined}
            >
              Our story
            </Link>
            <Link
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
            >
              Contact
            </Link>
          </nav>
          <div className="header-actions">
            <button
              ref={searchButton}
              className="icon-button"
              aria-label="Search products"
              aria-expanded={searchOpen}
              aria-controls="site-search"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={21} />
            </button>
            <span className="header-divider" />
            <Link
              className="cart-link"
              href="/cart"
              aria-label={`Shopping cart, ${count} items`}
            >
              <ShoppingBag size={21} />
              <span className="cart-word">Cart</span>
              <span className="cart-count">{count}</span>
            </Link>
            <button
              className="icon-button mobile-menu-button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {searchOpen && (
          <div
            id="site-search"
            className="search-panel container"
            onKeyDown={(e) => {
              if (e.key === "Escape") closeSearch();
            }}
          >
            <form
              action="/shop"
              role="search"
              onSubmit={() => setSearchOpen(false)}
            >
              <Search size={20} />
              <input
                autoFocus
                aria-label="Search the catalog"
                type="search"
                name="q"
                placeholder="Find your next power solution…"
                maxLength={100}
              />
              <button className="button button-dark" type="submit">
                Search
              </button>
              <button
                className="icon-button"
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
              >
                <X size={20} />
              </button>
            </form>
          </div>
        )}
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
            onKeyDown={(e) => {
              if (e.key === "Escape") setMenuOpen(false);
            }}
          >
            {[
              { name: "Home", href: "/" },
              { name: "All products", href: "/shop" },
              ...categories.map((c) => ({
                name: c.name,
                href: `/shop?category=${encodeURIComponent(c.slug)}`,
              })),
              { name: "Our story", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
