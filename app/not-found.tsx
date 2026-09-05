import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SiteShell from "@/components/site-shell";
export default function NotFound() {
  return (
    <SiteShell>
      <section className="not-found-page">
        <span className="eyebrow accent">404 / A SCENE THAT GOT CUT</span>
        <span className="not-found-number" aria-hidden="true">
          404
        </span>
        <h1>
          This story took
          <br />a different turn.
        </h1>
        <p>The page you’re looking for isn’t in our collection.</p>
        <div>
          <Link className="primary-button" href="/">
            <ArrowLeft size={15} />
            Back to home
          </Link>
          <Link className="secondary-button" href="/support">
            Find some help
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
