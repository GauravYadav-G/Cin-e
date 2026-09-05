"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Bookmark,
  CircleHelp,
  Grid2X2,
  House,
  Search,
  UserRound,
} from "lucide-react";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);
  return (
    <div className="portal-shell">
      <a className="skip-link" href="#page-content">
        Skip to content
      </a>
      <header className="portal-header">
        <Link href="/" className="wordmark" aria-label="CINÉ home">
          ciné<span>®</span>
        </Link>
        <nav aria-label="Site navigation">
          {[
            ["/", "Home"],
            ["/browse", "Films"],
            ["/collection", "In focus"],
            ["/support", "Support"],
          ].map(([url, title]) => (
            <Link
              key={url}
              href={url}
              aria-current={active(url) ? "page" : undefined}
            >
              {title}
            </Link>
          ))}
        </nav>
        <Link href="/account" className="portal-account">
          <UserRound size={15} />
          <span>Your space</span>
          <ArrowUpRight size={12} />
        </Link>
      </header>
      <main id="page-content">{children}</main>
      <footer className="portal-footer">
        <div>
          <Link href="/" className="wordmark">
            ciné<span>®</span>
          </Link>
          <p>Less noise. More cinema.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/browse">Explore films</Link>
          <Link href="/collection">Director collection</Link>
          <Link href="/library">My list</Link>
          <Link href="/account">Your profile</Link>
          <Link href="/support">Help center</Link>
          <Link href="/about">Our story</Link>
        </nav>
        <div className="footer-bottom">
          <span>INDEPENDENT CINEMA CONCEPT · 2026</span>
          <span>
            <i className="status-dot" />
            Made for the love of the frame.
          </span>
        </div>
      </footer>
      <div className="dock-wrap">
        <nav className="dock portal-dock" aria-label="Quick navigation">
          <Link className="dock-brand" href="/">
            ciné<span>®</span>
          </Link>
          {[
            { href: "/", title: "Home", icon: House },
            { href: "/browse", title: "Explore", icon: Grid2X2 },
            { href: "/library", title: "My list", icon: Bookmark },
            { href: "/browse?search=1", title: "Search", icon: Search },
            { href: "/support", title: "Support", icon: CircleHelp },
          ].map(({ href, title, icon: Icon }) => (
            <Link
              key={title}
              className={`dock-icon ${active(href) ? "dock-current" : ""}`}
              href={href}
              aria-label={title}
            >
              <Icon size={17} />
              <span>{title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
