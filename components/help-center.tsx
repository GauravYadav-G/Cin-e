"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  ChevronDown,
  Clapperboard,
  MessageSquare,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { faqs, helpArticles, helpCategories } from "@/lib/help";
import SiteShell from "./site-shell";

export default function HelpCenter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const results = helpArticles.filter(
    (article) =>
      (category === "All topics" || category === article.category) &&
      `${article.title} ${article.summary} ${article.category} ${article.steps.map((step) => step.text).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <SiteShell>
      <div className="support-page">
        <section className="support-hero">
          <span className="eyebrow accent">THE CINÉ HELP CENTER</span>
          <h1>
            A little help.
            <br />
            Then back to the story.
          </h1>
          <p>Find an answer. Get comfortable. Enjoy the film.</p>
          <label className="support-search search-field">
            <Search size={21} />
            <input
              aria-label="Search help articles"
              placeholder="Try “playback”, “watchlist”, or “profile”…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button
                aria-label="Clear help search"
                onClick={() => setQuery("")}
              >
                <X size={17} />
              </button>
            ) : (
              <span>SEARCH</span>
            )}
          </label>
          <span className="support-hero-type" aria-hidden="true">
            help.
          </span>
        </section>
        <div className="support-content">
          <div className="support-topic-grid">
            {[
              {
                title: "Getting started",
                description: "Your first night with CINÉ.",
                icon: BookOpen,
              },
              {
                title: "Playback",
                description: "Get back to the good part.",
                icon: Clapperboard,
              },
              {
                title: "Your library",
                description: "Keep your favorites close.",
                icon: Bookmark,
              },
              {
                title: "Your profile",
                description: "Make yourself at home.",
                icon: UserRound,
              },
            ].map(({ title, description, icon: Icon }) => (
              <button
                key={title}
                className={category === title ? "selected" : ""}
                onClick={() => {
                  setCategory(category === title ? "All topics" : title);
                  document
                    .getElementById("help-articles")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <Icon size={24} />
                <h2>{title}</h2>
                <p>{description}</p>
                <ArrowUpRight size={17} />
              </button>
            ))}
          </div>
          <section id="help-articles" className="help-articles">
            <div className="section-label">
              <div>
                <span className="eyebrow accent">A GOOD PLACE TO START</span>
                <h2>
                  {query ? "Here’s what we found." : "A few helpful reads."}
                </h2>
              </div>
              <span className="eyebrow">{results.length} GUIDES</span>
            </div>
            <div className="genre-tabs">
              {helpCategories.map((item) => (
                <button
                  className={category === item ? "active" : ""}
                  key={item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            {results.length ? (
              <div className="help-article-grid">
                {results.map((article) => (
                  <Link href={`/support/${article.slug}`} key={article.slug}>
                    <span className="eyebrow">
                      {article.category} <i>·</i> {article.time}
                    </span>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <ArrowUpRight size={19} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Search size={30} />
                <h3>No answers in this frame.</h3>
                <p>Try another keyword or explore all topics.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setQuery("");
                    setCategory("All topics");
                  }}
                >
                  Show all guides
                </button>
              </div>
            )}
          </section>
          <section className="faq-section">
            <div>
              <span className="eyebrow accent">YOU MIGHT BE WONDERING</span>
              <h2>
                Good questions.
                <br />
                Simple answers.
              </h2>
            </div>
            <div>
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>
                    {faq.question}
                    <ChevronDown size={17} />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="support-contact-banner">
            <MessageSquare size={31} />
            <div>
              <span className="eyebrow accent">
                SOMETHING ELSE ON YOUR MIND?
              </span>
              <h2>Keep the conversation in one place.</h2>
              <p>
                Save a request and find it again in your profile’s request
                history.
              </p>
            </div>
            <div>
              <Link href="/support/contact" className="primary-button">
                Save a support request
                <ArrowUpRight size={15} />
              </Link>
              <Link href="/support/requests" className="support-history-link">
                Your requests
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
