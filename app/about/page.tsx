import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteShell from "@/components/site-shell";
export const metadata = { title: "Our Story — CINÉ" };
export default function About() {
  return (
    <SiteShell>
      <div className="about-page">
        <span className="eyebrow accent">FOR THE LOVE OF THE FRAME</span>
        <h1>
          Less noise.
          <br />
          More cinema.
        </h1>
        <div className="about-page-mark" aria-hidden="true">
          ciné®
        </div>
        <div className="about-page-copy">
          <p>
            Some films stay with you long after the credits. We made a place for
            them.
          </p>
          <p>
            CINÉ is a carefully curated space for singular filmmakers,
            unforgettable worlds, and stories that deserve your full attention.
            No endless feeds. Just the next film you’ll love.
          </p>
          <p>
            Our first collection explores Denis Villeneuve: seven films spanning
            intimate mysteries, impossible choices, and entire universes.
          </p>
          <Link href="/collection" className="primary-button">
            Enter the collection
            <ArrowUpRight size={16} />
          </Link>
          <Link href="/support/about-previews" className="guide-back">
            About this platform preview
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
