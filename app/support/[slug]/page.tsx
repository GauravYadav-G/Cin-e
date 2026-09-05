import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { helpArticles } from "@/lib/help";
import SiteShell from "@/components/site-shell";
export function generateStaticParams() {
  return helpArticles.map((article) => ({ slug: article.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = helpArticles.find((item) => item.slug === slug);
  return { title: `${article?.title || "Guide not found"} — CINÉ Support` };
}
export default async function Guide({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = helpArticles.find((item) => item.slug === slug);
  if (!article) notFound();
  const related = helpArticles
    .filter((item) => item.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.category === article.category) -
        Number(a.category === article.category),
    )
    .slice(0, 3);
  return (
    <SiteShell>
      <article className="guide-page">
        <nav className="guide-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/support">Help center</Link>
          <ChevronRight size={12} />
          <span>{article.category}</span>
        </nav>
        <div className="guide-layout">
          <div>
            <span className="eyebrow accent">
              {article.category.toUpperCase()} / {article.time.toUpperCase()}
            </span>
            <h1>{article.title}</h1>
            <p className="guide-summary">{article.summary}</p>
            <div className="guide-steps">
              {article.steps.map((step, index) => (
                <section key={step.title} id={`step-${index + 1}`}>
                  <span>0{index + 1}</span>
                  <div>
                    <h2>{step.title}</h2>
                    <p>{step.text}</p>
                  </div>
                </section>
              ))}
            </div>
            <div className="guide-next">
              <div>
                <h3>Ready for the next scene?</h3>
                <p>
                  Explore the collection, or save a request if you still need
                  help.
                </p>
              </div>
              <Link href="/browse" className="primary-button">
                Back to films
                <ArrowUpRight size={15} />
              </Link>
            </div>
            <Link href="/support" className="guide-back">
              <ArrowLeft size={14} />
              All help articles
            </Link>
          </div>
          <aside>
            <span className="eyebrow">IN THIS GUIDE</span>
            {article.steps.map((step, index) => (
              <a key={step.title} href={`#step-${index + 1}`}>
                <span>0{index + 1}</span>
                {step.title}
              </a>
            ))}
            <div>
              <h3>Still have a question?</h3>
              <p>Keep a record of what you need help with.</p>
              <Link href="/support/contact">
                Save a request
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
        <section className="related-guides">
          <span className="eyebrow accent">KEEP EXPLORING</span>
          <h2>You might find these useful.</h2>
          <div>
            {related.map((item) => (
              <Link key={item.slug} href={`/support/${item.slug}`}>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <ArrowRight size={17} />
              </Link>
            ))}
          </div>
        </section>
      </article>
    </SiteShell>
  );
}
