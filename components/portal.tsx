"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  CircleHelp,
  LoaderCircle,
  Play,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { films, runtime, type Film } from "@/lib/catalog";
import SiteShell from "./site-shell";

type Library = {
  name: string;
  saved: string[];
  progress: { film_id: string; seconds: number; duration: number }[];
};
const filmUrl = (film: Film, resume = false) =>
  `/collection?film=${film.id}${resume ? "&play=1" : ""}`;
function FilmCard({
  film,
  saved,
  onSave,
  disabled,
}: {
  film: Film;
  saved?: boolean;
  onSave?: () => void;
  disabled?: boolean;
}) {
  return (
    <article className="portal-film-card">
      <Link
        className="portal-poster"
        href={filmUrl(film)}
        aria-label={`Explore ${film.title}`}
      >
        <Image
          src={film.image}
          alt={`${film.title} poster`}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1000px) 28vw, 20vw"
        />
        <span className="poster-enter">
          <ArrowUpRight size={28} />
        </span>
        <span className="poster-rating">★ {film.rating}</span>
      </Link>
      <div className="portal-film-info">
        <div>
          <Link href={filmUrl(film)}>
            <h3>{film.title}</h3>
          </Link>
          <p>
            {film.year}
            <span>·</span>
            {runtime(film.duration)}
          </p>
        </div>
        {onSave && (
          <button
            className={`icon-button ${saved ? "is-saved" : ""}`}
            aria-label={`${saved ? "Remove" : "Save"} ${film.title}`}
            disabled={disabled}
            onClick={onSave}
          >
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
          </button>
        )}
      </div>
    </article>
  );
}

export default function Portal({
  page,
}: {
  page: "home" | "browse" | "library" | "account";
}) {
  const [library, setLibrary] = useState<Library | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All films");
  const [sort, setSort] = useState("curated");
  const [tab, setTab] = useState("saved");
  const [name, setName] = useState("");
  const load = useCallback(
    () =>
      fetch("/api/library")
        .then(async (response) => {
          if (!response.ok)
            throw new Error("Your profile couldn’t load. Please try again.");
          const data: Library = await response.json();
          setLibrary(data);
          setName(data.name);
          setError("");
        })
        .catch((err) => setError(err.message)),
    [],
  );
  useEffect(() => {
    void load();
  }, [load]);
  async function save(film: Film) {
    if (!library || busy) return;
    setBusy(true);
    setMessage("");
    const saved = !library.saved.includes(film.id);
    try {
      const response = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filmId: film.id, saved }),
      });
      if (!response.ok)
        throw new Error("Your change couldn’t be saved. Please try again.");
      setLibrary(
        (current) =>
          current && {
            ...current,
            saved: saved
              ? [...current.saved, film.id]
              : current.saved.filter((id) => id !== film.id),
          },
      );
      setMessage(
        `${film.title} ${saved ? "added to" : "removed from"} your list.`,
      );
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const inProgress =
    library?.progress.filter(
      (item) => item.seconds > 0 && item.seconds < item.duration - 3,
    ) || [];
  const recent = library?.progress.filter((item) => item.seconds > 0) || [];
  let results = films.filter((film) => {
    const matches =
      `${film.title} ${film.year} ${film.genres.join(" ")} ${film.cast.map((actor) => actor.name).join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
    return (
      matches &&
      (genre === "All films" || film.genres.includes(genre)) &&
      (page !== "library" ||
        (tab === "saved"
          ? library?.saved.includes(film.id)
          : recent.some((item) => item.film_id === film.id)))
    );
  });
  if (sort === "newest") results = [...results].sort((a, b) => b.year - a.year);
  if (sort === "rating")
    results = [...results].sort((a, b) => Number(b.rating) - Number(a.rating));
  const cards = (items: Film[]) => (
    <div className="portal-film-grid">
      {items.map((film) => (
        <FilmCard
          key={film.id}
          film={film}
          saved={library?.saved.includes(film.id)}
          onSave={() => void save(film)}
          disabled={!library || busy}
        />
      ))}
    </div>
  );
  const continueWatching = (
    <section className="portal-section continue-section">
      <div className="section-label">
        <div>
          <span className="eyebrow accent">RIGHT WHERE YOU LEFT OFF</span>
          <h2>Stay in the story.</h2>
        </div>
        <Link href="/library">
          Your library <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="continue-grid">
        {inProgress.map((item) => {
          const film = films.find((f) => f.id === item.film_id);
          return (
            film && (
              <Link
                href={filmUrl(film, true)}
                className="resume-card"
                key={film.id}
              >
                <Image
                  src={film.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 90vw, 40vw"
                />
                <span className="resume-shade" />
                <span className="resume-play">
                  <Play size={20} fill="currentColor" />
                </span>
                <div className="resume-info">
                  <strong>{film.title}</strong>
                  <span>
                    Continue preview ·{" "}
                    {Math.round((item.seconds / item.duration) * 100)}% watched
                  </span>
                </div>
                <div className="resume-track">
                  <span
                    style={{
                      width: `${(item.seconds / item.duration) * 100}%`,
                    }}
                  />
                </div>
              </Link>
            )
          );
        })}
      </div>
    </section>
  );

  return (
    <SiteShell>
      {page === "home" ? (
        <>
          <section className="home-hero">
            <Image
              className="home-art"
              src="/images/dune-two-hero.jpg"
              alt="Dune: Part Two ensemble artwork"
              fill
              priority
              sizes="100vw"
            />
            <div className="home-shade" />
            <div className="home-hero-content">
              <span className="eyebrow accent">
                <i className="status-dot" /> THE CINÉ SELECTION / 001
              </span>
              <h1>
                Some stories
                <br />
                stay with you.
              </h1>
              <p>
                Extraordinary films. Singular voices.
                <br />A little less scrolling. A little more feeling.
              </p>
              <div className="home-hero-actions">
                <Link className="primary-button" href={filmUrl(films[1])}>
                  <Play size={15} fill="currentColor" />
                  Discover Dune: Part Two
                </Link>
                <Link className="hero-secondary" href="/browse">
                  Explore all films
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
            <div className="home-feature-label">
              <span>FEATURED THIS WEEK</span>
              <strong>Dune: Part Two</strong>
              <p>
                Denis Villeneuve <span>·</span> 2024 <span>·</span> Sci-fi
              </p>
            </div>
            <div className="home-bottom-line">
              <span>A DIFFERENT KIND OF CINEMA</span>
              <span>
                01 <i /> 07
              </span>
            </div>
          </section>
          {inProgress.length > 0 && continueWatching}
          <section className="portal-section">
            <div className="section-label">
              <div>
                <span className="eyebrow accent">
                  HANDPICKED, FRAME BY FRAME
                </span>
                <h2>Your next great film.</h2>
              </div>
              <Link href="/browse">
                View the collection
                <ArrowUpRight size={14} />
              </Link>
            </div>
            {cards([films[1], films[0], films[5], films[3]])}
          </section>
          <section className="director-feature">
            <div className="director-feature-copy">
              <span className="eyebrow accent">IN FOCUS — VOL. 01</span>
              <h2>
                A mind.
                <br />
                An entire universe.
              </h2>
              <p>
                From the language of the unknown to the sands of Arrakis. Step
                inside the extraordinary worlds of Denis Villeneuve.
              </p>
              <Link href="/collection" className="primary-button">
                Enter the collection
                <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="director-poster-stack">
              {[films[0], films[1], films[5]].map((film, i) => (
                <div
                  key={film.id}
                  style={{ "--index": i } as React.CSSProperties}
                >
                  <Image src={film.image} alt={film.title} fill sizes="25vw" />
                </div>
              ))}
            </div>
            <span className="director-feature-type" aria-hidden="true">
              Villeneuve
            </span>
          </section>
          <section className="portal-section">
            <div className="section-label">
              <div>
                <span className="eyebrow accent">FOLLOW A FEELING</span>
                <h2>What are you in the mood for?</h2>
              </div>
            </div>
            <div className="mood-grid">
              {[
                {
                  title: "Beyond the ordinary",
                  genre: "Sci-fi",
                  image: films[0].image,
                  caption: "Worlds worth getting lost in.",
                },
                {
                  title: "On the edge",
                  genre: "Thriller",
                  image: films[3].image,
                  caption: "Just one more scene.",
                },
                {
                  title: "The human condition",
                  genre: "Drama",
                  image: films[2].image,
                  caption: "Stories that hit closer to home.",
                },
              ].map((mood) => (
                <Link
                  href={`/browse?genre=${mood.genre}`}
                  key={mood.genre}
                  className="mood-card"
                >
                  <Image
                    src={mood.image}
                    alt=""
                    fill
                    sizes="(max-width:640px) 90vw, 30vw"
                  />
                  <div />
                  <span className="eyebrow">{mood.genre}</span>
                  <h3>{mood.title}</h3>
                  <p>{mood.caption}</p>
                  <ArrowUpRight size={20} />
                </Link>
              ))}
            </div>
          </section>
          <section className="home-help">
            <div>
              <span className="eyebrow accent">MAKE YOURSELF AT HOME</span>
              <h2>A better movie night starts here.</h2>
            </div>
            <Link className="secondary-button" href="/support">
              Visit the help center
              <ArrowUpRight size={15} />
            </Link>
          </section>
        </>
      ) : page === "account" ? (
        <div className="portal-page account-page">
          <div className="page-intro">
            <span className="eyebrow accent">THE BEST SEAT IS YOURS</span>
            <h1>Your space.</h1>
            <p>A name, a list, and a world of cinema that feels like you.</p>
          </div>
          <div className="account-grid">
            <section className="account-panel">
              <div className="account-identity">
                <div className="profile-avatar">
                  {(library?.name || "C")[0].toUpperCase()}
                </div>
                <div>
                  <h2>{library?.name || "Your profile"}</h2>
                  <span className="eyebrow">GUEST PROFILE</span>
                </div>
              </div>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  setBusy(true);
                  setMessage("");
                  try {
                    const response = await fetch("/api/profile", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name }),
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error);
                    setLibrary(
                      (current) => current && { ...current, name: data.name },
                    );
                    setMessage("Your profile has been updated.");
                  } catch (err) {
                    setMessage((err as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <label htmlFor="account-name">What should we call you?</label>
                <input
                  id="account-name"
                  required
                  maxLength={40}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={!library}
                />
                <p>Saved on this browser. No password or sign-up needed.</p>
                <button className="primary-button" disabled={!library || busy}>
                  {busy ? (
                    <LoaderCircle className="spin" size={15} />
                  ) : (
                    <Check size={15} />
                  )}
                  Save changes
                </button>
              </form>
              <div className="inline-status" role="status">
                {message}
              </div>
            </section>
            <aside className="account-side">
              <div className="account-stats">
                <Link href="/library">
                  <strong>
                    {String(library?.saved.length || 0).padStart(2, "0")}
                  </strong>
                  <span>
                    FILMS SAVED
                    <ArrowUpRight size={13} />
                  </span>
                </Link>
                <Link href="/library?tab=history">
                  <strong>{String(recent.length).padStart(2, "0")}</strong>
                  <span>
                    PREVIEWS EXPLORED
                    <ArrowUpRight size={13} />
                  </span>
                </Link>
              </div>
              <div className="account-note">
                <UserRound size={21} />
                <h3>One browser. Your own space.</h3>
                <p>
                  Your list and progress belong to this browser profile.
                  Clearing its cookies starts a new guest profile; profiles
                  don’t sync between devices.
                </p>
                <Link href="/support/your-profile">
                  How your profile works
                  <ArrowRight size={14} />
                </Link>
              </div>
              <Link className="account-support" href="/support">
                <CircleHelp size={22} />
                <div>
                  <strong>A little help?</strong>
                  <p>We’ll point you in the right direction.</p>
                </div>
                <ArrowUpRight size={20} />
              </Link>
            </aside>
          </div>
        </div>
      ) : (
        <div className="portal-page">
          <div className="page-intro">
            <span className="eyebrow accent">
              {page === "library"
                ? "SAVED FOR A GOOD NIGHT"
                : "THE FILM LIBRARY"}
            </span>
            <h1>
              {page === "library"
                ? "Your kind of cinema."
                : "Find your next obsession."}
            </h1>
            <p>
              {page === "library"
                ? "The films you’re keeping close. The stories you’ve already started."
                : "Seven extraordinary films. Endless reasons to fall in love with cinema."}
            </p>
          </div>
          <BrowseLocation onGenre={setGenre} onTab={setTab} />
          {page === "library" && (
            <div className="library-tabs">
              <button
                className={tab === "saved" ? "active" : ""}
                onClick={() => setTab("saved")}
              >
                My list <span>{library?.saved.length || 0}</span>
              </button>
              <button
                className={tab === "history" ? "active" : ""}
                onClick={() => setTab("history")}
              >
                Viewing history <span>{recent.length}</span>
              </button>
            </div>
          )}
          <div className="browse-toolbar">
            <label className="search-field">
              <Search size={18} />
              <input
                id="catalog-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search films, actors, or a year…"
                aria-label="Search the film library"
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={16} />
                </button>
              )}
            </label>
            <label className="sort-label">
              Sort by
              <select
                aria-label="Sort films"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="curated">Curated order</option>
                <option value="newest">Newest first</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
          <div className="browse-filters">
            <div className="genre-tabs">
              {[
                "All films",
                ...new Set(films.flatMap((film) => film.genres)),
              ].map((item) => (
                <button
                  className={genre === item ? "active" : ""}
                  key={item}
                  onClick={() => setGenre(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <span>{results.length} FILMS</span>
          </div>
          {page === "library" && !library && !error ? (
            <div className="empty-state">
              <LoaderCircle className="spin" />
              <p>Getting your collection ready…</p>
            </div>
          ) : results.length > 0 ? (
            cards(results)
          ) : (
            !error && (
              <div className="empty-state portal-empty">
                <Bookmark size={35} />
                <h2>
                  {query || genre !== "All films"
                    ? "No films in this frame."
                    : tab === "history"
                      ? "Your story starts with a play."
                      : "A great film is worth saving."}
                </h2>
                <p>
                  {query || genre !== "All films"
                    ? "Try a different title, actor, or genre."
                    : tab === "history"
                      ? "Explore a film and play its preview to begin your viewing history."
                      : "Tap the bookmark on any film. Your next movie night will be waiting here."}
                </p>
                {query || genre !== "All films" ? (
                  <button
                    className="primary-button"
                    onClick={() => {
                      setQuery("");
                      setGenre("All films");
                    }}
                  >
                    Reset filters
                  </button>
                ) : (
                  <Link className="primary-button" href="/browse">
                    Explore films
                    <ArrowUpRight size={15} />
                  </Link>
                )}
              </div>
            )
          )}
          {page === "library" &&
            tab === "history" &&
            inProgress.length > 0 &&
            continueWatching}
        </div>
      )}
      {error && (
        <div className="portal-error" role="alert">
          <CircleHelp size={18} />
          <p>{error}</p>
          <button onClick={() => void load()}>Try again</button>
        </div>
      )}
      {message && page !== "account" && (
        <div className="portal-notice" role="status">
          <Check size={15} />
          <span>{message}</span>
          <button aria-label="Dismiss message" onClick={() => setMessage("")}>
            <X size={14} />
          </button>
        </div>
      )}
    </SiteShell>
  );
}

function BrowseLocation({
  onGenre,
  onTab,
}: {
  onGenre: (value: string) => void;
  onTab: (value: string) => void;
}) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const genre = params.get("genre");
    if (genre && films.some((film) => film.genres.includes(genre)))
      onGenre(genre);
    if (params.get("tab") === "history") onTab("history");
    if (params.has("search"))
      document.getElementById("catalog-search")?.focus();
  }, [onGenre, onTab]);
  return null;
}
