"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronRight,
  CircleHelp,
  Clapperboard,
  Grid2X2,
  ListFilter,
  LoaderCircle,
  Play,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { type Film, runtime } from "@/lib/catalog";
import Player from "./player";

type Panel =
  | "catalog"
  | "search"
  | "watchlist"
  | "profile"
  | "about"
  | "cast"
  | "story"
  | null;
export type Progress = { film_id: string; seconds: number; duration: number };

async function requestJson(url: string, method: string, body: unknown) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function Modal({
  children,
  title,
  onClose,
  wide = false,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "modal-wide" : ""}`}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-top">
          <span className="eyebrow">CINÉ / {title}</span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

export default function Cinema({ films }: { films: Film[] }) {
  const [selected, setSelected] = useState<Film | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [name, setName] = useState("Film lover");
  const [draftName, setDraftName] = useState("Film lover");
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All films");
  const [sort, setSort] = useState("curated");
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState("");

  const loadLibrary = useCallback(async () => {
    try {
      const response = await fetch("/api/library");
      if (!response.ok) throw new Error("Could not load library");
      const data = await response.json();
      setSaved(data.saved);
      setProgress(data.progress);
      setName(data.name);
      setDraftName(data.name);
      setLoaded(true);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  // Library state changes only after the asynchronous network response resolves.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLibrary();
  }, [loadLibrary]);
  useEffect(() => {
    const readLocation = () => {
      const id = new URLSearchParams(window.location.search).get("film");
      setSelected(films.find((film) => film.id === id) || null);
      setPanel(null);
      setPlaying(
        Boolean(
          id &&
          films.some((film) => film.id === id) &&
          new URLSearchParams(window.location.search).get("play") === "1",
        ),
      );
    };
    readLocation();
    window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, [films]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 3600);
    return () => clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        panel ||
        playing ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return;
      if (event.key === "/") {
        event.preventDefault();
        setPanel("search");
      }
      if (event.key === "Escape" && selected) {
        setSelected(null);
        window.history.pushState({}, "", "/collection");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, playing, selected]);

  function openFilm(film: Film) {
    setSelected(film);
    setPanel(null);
    setHovered(null);
    window.history.pushState({}, "", `/collection?film=${film.id}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function home() {
    setSelected(null);
    setPanel(null);
    window.history.pushState({}, "", "/collection");
  }
  async function toggleSaved(film: Film) {
    if (!loaded || saving) return;
    const next = !saved.includes(film.id);
    setSaving(true);
    try {
      await requestJson("/api/library", "POST", {
        filmId: film.id,
        saved: next,
      });
      setSaved((current) =>
        next ? [...current, film.id] : current.filter((id) => id !== film.id),
      );
      setToast(
        next
          ? `${film.title} added to your list`
          : `${film.title} removed from your list`,
      );
    } catch (error) {
      setToast((error as Error).message);
    } finally {
      setSaving(false);
    }
  }
  const active = films.find((film) => film.id === hovered);
  const genres = [
    "All films",
    ...new Set(films.flatMap((film) => film.genres)),
  ];
  let results = films.filter((film) => {
    const haystack =
      `${film.title} ${film.year} ${film.genres.join(" ")} ${film.cast.map((actor) => actor.name).join(" ")} Denis Villeneuve`.toLowerCase();
    return (
      haystack.includes(query.toLowerCase().trim()) &&
      (genre === "All films" || film.genres.includes(genre)) &&
      (panel !== "watchlist" || saved.includes(film.id))
    );
  });
  if (sort === "newest") results = [...results].sort((a, b) => b.year - a.year);
  if (sort === "rating")
    results = [...results].sort((a, b) => Number(b.rating) - Number(a.rating));
  function openPanel(next: Panel) {
    setQuery("");
    setGenre("All films");
    setPanel(next);
  }
  const watched = progress.filter((item) => item.seconds > 0);

  return (
    <MotionConfig reducedMotion="user">
      <main className={selected ? "cinema film-open" : "cinema"}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <header className="site-header">
          <Link className="wordmark" href="/" aria-label="CINÉ home">
            ciné<span>®</span>
          </Link>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <button onClick={() => openPanel("catalog")}>Films</button>
            <ChevronRight size={12} />
            <button onClick={home} className={!selected ? "current" : ""}>
              Denis Villeneuve
            </button>
            {selected && (
              <>
                <ChevronRight size={12} />
                <span className="current">{selected.title}</span>
              </>
            )}
          </nav>
          <Link className="header-note" href="/support">
            <span className="status-dot" />
            Help & support
            <ArrowUpRight size={12} />
          </Link>
        </header>

        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.section
              key="gallery"
              id="main-content"
              className="collection-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4 }}
            >
              <div className="collection-heading">
                <div>
                  <span className="eyebrow accent">IN FOCUS — VOL. 01</span>
                  <h1>A mind. An entire universe.</h1>
                </div>
                <p>
                  THE DENIS VILLENEUVE COLLECTION
                  <span>Seven films. One singular vision.</span>
                </p>
              </div>
              <div className="film-shelf" onMouseLeave={() => setHovered(null)}>
                {films.map((film, index) => (
                  <motion.button
                    key={film.id}
                    className={`film-strip ${hovered === film.id ? "is-active" : ""}`}
                    initial={{ opacity: 0, y: 65 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.065,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onMouseEnter={() => setHovered(film.id)}
                    onFocus={() => setHovered(film.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => openFilm(film)}
                    aria-label={`Explore ${film.title}`}
                  >
                    <Image
                      src={film.image}
                      alt={`${film.title} theatrical poster`}
                      fill
                      sizes="(max-width: 640px) 45vw, 20vw"
                      priority={index < 3}
                    />
                    <span className="strip-shade" />
                    <span className="strip-number">0{index + 1}</span>
                    <span className="strip-cta">
                      <ArrowUpRight size={23} />
                    </span>
                    <span className="strip-caption">
                      <span>{film.title}</span>
                      <small>
                        {film.year} <span>·</span> {runtime(film.duration)}
                      </small>
                    </span>
                  </motion.button>
                ))}
              </div>
              <div className="shelf-footer">
                <div className="shelf-status">
                  <span className="tiny-cross">+</span>
                  <span>
                    {active
                      ? active.tagline
                      : "EVERY FRAME, A WORLD OF ITS OWN."}
                  </span>
                </div>
                <button onClick={() => openPanel("catalog")}>
                  Explore the collection <ArrowUpRight size={13} />
                </button>
              </div>
              <div className="director-type" aria-hidden="true">
                Villeneuve
              </div>
              <div className="collection-footnote">
                <span>CURATED, NOT GENERATED.</span>
                <span>01 — 07</span>
                <span>SCROLL LESS. FEEL MORE.</span>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key={selected.id}
              id="main-content"
              className={`film-detail detail-${selected.id}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ "--film-color": selected.color } as React.CSSProperties}
            >
              <Image
                className="detail-backdrop"
                src={selected.backdrop}
                alt=""
                fill
                sizes="100vw"
                priority
              />
              <div className="detail-shade" />
              <div className="detail-heading">
                <button className="back-link" onClick={home}>
                  <ArrowLeft size={14} />
                  The collection
                </button>
                <h1>
                  {selected.title === "Dune: Part Two" ? (
                    <>
                      Dune:
                      <br />
                      Part Two
                    </>
                  ) : selected.title === "Blade Runner 2049" ? (
                    <>
                      Blade Runner
                      <br />
                      2049
                    </>
                  ) : (
                    selected.title
                  )}
                </h1>
                <p className="detail-tagline">{selected.tagline}</p>
              </div>
              <div className="detail-synopsis">
                <span className="eyebrow">A FILM BY DENIS VILLENEUVE</span>
                <p>{selected.description}</p>
                <div className="rating">
                  <span>IMDb</span>
                  <strong>{selected.rating}</strong>
                  <span className="rating-out">/ 10</span>
                </div>
              </div>
              <button
                className="hero-play"
                onClick={() => setPlaying(true)}
                aria-label={`Play ${selected.title}`}
              >
                <span>
                  <Play size={27} fill="currentColor" strokeWidth={1} />
                </span>
                <small>ENTER THE STORY</small>
              </button>
              <div className="film-facts">
                <div>
                  <span>Genre</span>
                  <p>
                    {selected.genres.map((genre) => (
                      <em key={genre}>{genre}</em>
                    ))}
                  </p>
                </div>
                <div>
                  <span>Studio</span>
                  <p>{selected.studio}</p>
                </div>
                <div>
                  <span>Runtime</span>
                  <p>{runtime(selected.duration)}</p>
                </div>
                <div>
                  <span>Released</span>
                  <p>{selected.year}</p>
                </div>
                <div>
                  <span>Rated</span>
                  <p>
                    <em>{selected.certificate}</em>
                  </p>
                </div>
              </div>
              <div className="detail-actions">
                <button
                  className="primary-button"
                  onClick={() => setPlaying(true)}
                >
                  <Play size={15} fill="currentColor" />
                  {progress.some(
                    (p) =>
                      p.film_id === selected.id &&
                      p.seconds > 0 &&
                      p.seconds < p.duration - 3,
                  )
                    ? "Continue watching"
                    : "Watch preview"}
                </button>
                <button
                  className={`secondary-button ${saved.includes(selected.id) ? "saved" : ""}`}
                  onClick={() => void toggleSaved(selected)}
                  disabled={!loaded || saving}
                >
                  {saved.includes(selected.id) ? (
                    <Check size={16} />
                  ) : (
                    <Bookmark size={16} />
                  )}
                  {saved.includes(selected.id)
                    ? "In your list"
                    : "Add to my list"}
                </button>
                <span className="preview-note">Sample playback available</span>
              </div>
              <div className="film-side-nav">
                <button
                  onClick={() => openPanel("story")}
                  aria-label="Film information"
                >
                  <CircleHelp size={18} />
                </button>
                <button
                  onClick={() => void toggleSaved(selected)}
                  disabled={!loaded || saving}
                  className={saved.includes(selected.id) ? "is-saved" : ""}
                  aria-label={
                    saved.includes(selected.id)
                      ? "Remove from watchlist"
                      : "Save to watchlist"
                  }
                >
                  <Bookmark
                    size={18}
                    fill={saved.includes(selected.id) ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={() => setPlaying(true)}
                  aria-label="Open player"
                >
                  <Play size={18} />
                </button>
              </div>
              <button
                className="next-film"
                onClick={() =>
                  openFilm(
                    films[
                      (films.findIndex((film) => film.id === selected.id) + 1) %
                        films.length
                    ],
                  )
                }
              >
                <span>NEXT IN THE COLLECTION</span>
                <ArrowRight size={19} />
              </button>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="dock-wrap">
          <nav className="dock" aria-label="Main navigation">
            <button
              className="dock-brand"
              onClick={home}
              aria-label="CINÉ collection"
            >
              ciné<span>®</span>
            </button>
            <div className="dock-links">
              <button className={!selected ? "nav-active" : ""} onClick={home}>
                <Grid2X2 size={13} />
                <span>Discover</span>
              </button>
              <button onClick={() => openPanel(selected ? "cast" : "catalog")}>
                {selected ? "Cast" : "Films"}
              </button>
              <button onClick={() => openPanel(selected ? "story" : "about")}>
                {selected ? "The story" : "Our story"}
              </button>
            </div>
            <span className="dock-divider" />
            <button
              className="dock-icon"
              onClick={() => openPanel("watchlist")}
              aria-label="My list"
            >
              <Bookmark size={17} />
              <span>My list</span>
              {saved.length > 0 && <i className="badge">{saved.length}</i>}
            </button>
            <button
              className="dock-icon"
              onClick={() => openPanel("search")}
              aria-label="Search films"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
            <button
              className="dock-icon"
              onClick={() => openPanel("profile")}
              aria-label="Your profile"
            >
              <UserRound size={17} />
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {(panel === "catalog" ||
          panel === "search" ||
          panel === "watchlist") && (
          <Modal
            title={
              panel === "watchlist" ? "Your collection" : "The film library"
            }
            onClose={() => setPanel(null)}
            wide
          >
            <div className="panel-heading">
              <div>
                <span className="eyebrow accent">
                  {panel === "watchlist"
                    ? "SAVED FOR A GOOD NIGHT"
                    : "FIND YOUR NEXT OBSESSION"}
                </span>
                <h2>
                  {panel === "watchlist"
                    ? "Your kind of cinema."
                    : panel === "search"
                      ? "What moves you?"
                      : "The collection."}
                </h2>
              </div>
              <span className="result-count">
                {results.length.toString().padStart(2, "0")} FILMS
              </span>
            </div>
            <label className="search-field">
              <Search size={20} />
              <input
                autoFocus={panel === "search"}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search films, actors, moods…"
                aria-label="Search films and actors"
              />
              {query ? (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <X size={17} />
                </button>
              ) : (
                <kbd>/</kbd>
              )}
            </label>
            <div className="catalog-controls">
              <div className="genre-tabs">
                {genres.map((item) => (
                  <button
                    key={item}
                    className={genre === item ? "active" : ""}
                    onClick={() => setGenre(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <label className="sort-label">
                <ListFilter size={15} />
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
            {panel === "watchlist" && !loaded ? (
              <div className="empty-state">
                {loadError ? (
                  <>
                    <CircleHelp size={30} />
                    <h3>Your list couldn’t load.</h3>
                    <button
                      className="primary-button"
                      onClick={() => void loadLibrary()}
                    >
                      Try again
                    </button>
                  </>
                ) : (
                  <>
                    <LoaderCircle className="spin" size={28} />
                    <p>Loading your collection…</p>
                  </>
                )}
              </div>
            ) : results.length ? (
              <div className="catalog-grid">
                {results.map((film) => (
                  <div key={film.id} className="catalog-card">
                    <button
                      className="catalog-poster"
                      onClick={() => openFilm(film)}
                      aria-label={`Open ${film.title}`}
                    >
                      <Image
                        src={film.image}
                        alt={`${film.title} poster`}
                        fill
                        sizes="(max-width: 600px) 40vw, 220px"
                      />
                      <span className="catalog-open">
                        <ArrowUpRight size={24} />
                      </span>
                      <span className="catalog-rating">★ {film.rating}</span>
                    </button>
                    <div className="catalog-card-info">
                      <button onClick={() => openFilm(film)}>
                        <h3>{film.title}</h3>
                        <p>
                          {film.year}
                          <span>·</span>
                          {runtime(film.duration)}
                        </p>
                      </button>
                      <button
                        className={`icon-button ${saved.includes(film.id) ? "is-saved" : ""}`}
                        aria-label={`${saved.includes(film.id) ? "Unsave" : "Save"} ${film.title}`}
                        disabled={!loaded || saving}
                        onClick={() => void toggleSaved(film)}
                      >
                        <Bookmark
                          size={16}
                          fill={
                            saved.includes(film.id) ? "currentColor" : "none"
                          }
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Bookmark size={31} />
                <h3>
                  {panel === "watchlist" && !query && genre === "All films"
                    ? "A great film is worth saving."
                    : "No films in this frame."}
                </h3>
                <p>
                  {panel === "watchlist" && !query
                    ? "Add films to your list and keep your next movie night close."
                    : "Try another title, actor, or genre."}
                </p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setQuery("");
                    setGenre("All films");
                    if (panel === "watchlist") setPanel("catalog");
                  }}
                >
                  Explore films
                  <ArrowUpRight size={15} />
                </button>
              </div>
            )}
          </Modal>
        )}

        {panel === "profile" && (
          <Modal title="Your space" onClose={() => setPanel(null)}>
            <div className="profile-avatar">
              {name.slice(0, 1).toUpperCase()}
              <span className="status-dot" />
            </div>
            <span className="eyebrow accent">THE BEST SEAT IS YOURS</span>
            <h2>Hello, {name}.</h2>
            <p className="muted">
              Your own little corner of cinema. Your list and viewing progress
              are saved for this browser.
            </p>
            <form
              className="profile-form"
              onSubmit={async (event) => {
                event.preventDefault();
                setSaving(true);
                try {
                  const data = await requestJson("/api/profile", "PATCH", {
                    name: draftName,
                  });
                  setName(data.name);
                  setToast("Your profile has been updated");
                } catch (error) {
                  setToast((error as Error).message);
                } finally {
                  setSaving(false);
                }
              }}
            >
              <label htmlFor="profile-name">What should we call you?</label>
              <input
                id="profile-name"
                required
                maxLength={40}
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
              />
              <button className="primary-button" disabled={!loaded || saving}>
                {saving ? (
                  <LoaderCircle size={16} className="spin" />
                ) : (
                  <Check size={16} />
                )}
                Save profile
              </button>
            </form>
            {loadError && (
              <button
                className="text-button"
                onClick={() => void loadLibrary()}
              >
                Couldn’t load your profile. Retry <ArrowRight size={14} />
              </button>
            )}
            <div className="profile-stats">
              <div>
                <strong>{saved.length.toString().padStart(2, "0")}</strong>
                <span>FILMS SAVED</span>
              </div>
              <div>
                <strong>{watched.length.toString().padStart(2, "0")}</strong>
                <span>PREVIEWS EXPLORED</span>
              </div>
            </div>
            {watched.length > 0 && (
              <div className="continue-list">
                <span className="eyebrow">CONTINUE EXPLORING</span>
                {watched.map((item) => {
                  const film = films.find((f) => f.id === item.film_id);
                  return (
                    film && (
                      <button
                        key={item.film_id}
                        onClick={() => {
                          openFilm(film);
                          setPlaying(true);
                        }}
                      >
                        <Play size={13} />
                        <span>{film.title}</span>
                        <small>
                          {Math.round((item.seconds / item.duration) * 100)}%
                        </small>
                        <div
                          style={{
                            width: `${Math.min(100, (item.seconds / item.duration) * 100)}%`,
                          }}
                        />
                      </button>
                    )
                  );
                })}
              </div>
            )}
            <p className="profile-note">
              <CircleHelp size={13} />
              Guest profile · No sign-up needed for the preview.
            </p>
          </Modal>
        )}

        {panel === "about" && (
          <Modal title="Our story" onClose={() => setPanel(null)}>
            <span className="eyebrow accent">FOR THE LOVE OF THE FRAME</span>
            <h2>
              Less noise.
              <br />
              More cinema.
            </h2>
            <div className="about-mark">
              ciné<span>®</span>
            </div>
            <p className="about-copy">
              Some films stay with you long after the credits. We made a place
              for them.
            </p>
            <p className="muted">
              CINÉ is a carefully curated space for singular filmmakers,
              unforgettable worlds, and stories that deserve your full
              attention. No endless feeds. Just the next film you’ll love.
            </p>
            <div className="about-feature">
              <Clapperboard size={22} />
              <div>
                <h3>In focus: Denis Villeneuve</h3>
                <p>
                  From the quiet mystery of Arrival to the vast landscapes of
                  Dune, explore seven films from a visionary storyteller.
                </p>
              </div>
            </div>
            <button
              className="primary-button"
              onClick={() => openPanel("catalog")}
            >
              Find your next film
              <ArrowUpRight size={16} />
            </button>
            <p className="profile-note">
              Independent concept · Film artwork belongs to its respective
              owners.
            </p>
          </Modal>
        )}

        {(panel === "cast" || panel === "story") && selected && (
          <Modal
            title={
              panel === "cast"
                ? "The people behind the story"
                : "Inside the film"
            }
            onClose={() => setPanel(null)}
          >
            <span className="eyebrow accent">
              {selected.title.toUpperCase()} / {selected.year}
            </span>
            <h2>
              {panel === "cast" ? "Unforgettable faces." : selected.tagline}
            </h2>
            {panel === "cast" ? (
              <div className="cast-list">
                {selected.cast.map((actor, index) => (
                  <div key={actor.name}>
                    <span className="cast-number">0{index + 1}</span>
                    <div>
                      <h3>{actor.name}</h3>
                      <p>{actor.role}</p>
                    </div>
                    <span className="cast-initials">
                      {actor.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="about-copy">{selected.description}</p>
                <div className="story-facts">
                  <div>
                    <span>Director</span>
                    <strong>Denis Villeneuve</strong>
                  </div>
                  <div>
                    <span>Studio</span>
                    <strong>{selected.studio}</strong>
                  </div>
                  <div>
                    <span>Runtime</span>
                    <strong>{runtime(selected.duration)}</strong>
                  </div>
                  <div>
                    <span>Genres</span>
                    <strong>{selected.genres.join(" / ")}</strong>
                  </div>
                </div>
                <button
                  className="primary-button"
                  onClick={() => {
                    setPanel(null);
                    setPlaying(true);
                  }}
                >
                  <Play size={15} fill="currentColor" />
                  Watch preview
                </button>
              </>
            )}
          </Modal>
        )}

        {playing && selected && (loaded || loadError) && (
          <Player
            film={selected}
            progress={
              progress.find((p) => p.film_id === selected.id)?.seconds || 0
            }
            onClose={() => {
              setPlaying(false);
              window.history.replaceState(
                {},
                "",
                `/collection?film=${selected.id}`,
              );
              void loadLibrary();
            }}
            onError={(message) => setToast(message)}
          />
        )}
        <div className="toast-region" role="status" aria-live="polite">
          <AnimatePresence>
            {toast && (
              <motion.div
                className="toast"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <span className="status-dot" />
                {toast}
                <button
                  onClick={() => setToast("")}
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </MotionConfig>
  );
}
