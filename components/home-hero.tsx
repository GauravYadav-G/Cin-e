"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { films } from "@/lib/catalog";
import { useArtworkTheme } from "./artwork-theme";

const selection = [
  "dune-part-two",
  "oppenheimer",
  "avengers-endgame",
  "interstellar",
  "lion-king",
  "the-dark-knight",
  "star-wars-a-new-hope",
]
  .map((id) => films.find((film) => film.id === id)!)
  .filter(Boolean);

/** Keep carousel updates local and decode incoming artwork before crossfading. */
export default function HomeHero() {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [slots, setSlots] = useState<[number, number | null]>([0, null]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [pending, setPending] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const index = slots[activeSlot] ?? 0;
  const film = selection[index];
  useArtworkTheme(film.id);
  const select = useCallback(
    (next: number) => {
      if (pending || next === index) return;
      setError("");
      setPending(true);
      setSlots((current) =>
        activeSlot === 0 ? [current[0], next] : [next, current[1]],
      );
    },
    [activeSlot, index, pending],
  );

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    let onScreen = false;
    const update = () =>
      setVisible(onScreen && document.visibilityState === "visible");
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        update();
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!visible || paused || interacting || reducedMotion || pending) return;
    const timer = setTimeout(
      () => select((index + 1) % selection.length),
      9000,
    );
    return () => clearTimeout(timer);
  }, [visible, paused, interacting, reducedMotion, pending, index, select]);

  return (
    <section
      ref={section}
      className="home-hero"
      aria-label="Featured films"
      aria-roledescription="carousel"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setInteracting(false);
      }}
    >
      {slots.map((filmIndex, slot) =>
        filmIndex === null ? null : (
          <div
            key={slot}
            className={`home-art-layer ${slot === activeSlot ? "is-visible" : ""}`}
            aria-hidden="true"
          >
            <Image
              key={filmIndex}
              className="home-art"
              src={selection[filmIndex].backdrop}
              alt=""
              fill
              unoptimized
              priority={slot === 0 && filmIndex === 0}
              loading={slot === 0 && filmIndex === 0 ? undefined : "eager"}
              onLoad={async (event) => {
                const img = event.currentTarget;
                await img.decode().catch(() => {});
                if (slot !== activeSlot) {
                  setActiveSlot(slot);
                  setPending(false);
                }
              }}
              onError={() => {
                setPending(false);
                setPaused(true);
                setError(
                  "Artwork could not load. Select another film to try again.",
                );
              }}
            />
          </div>
        ),
      )}
      <div className="home-shade" />
      <div className="home-hero-content">
        <span className="eyebrow accent">
          <i className="status-dot" /> THE CINÉ SELECTION / 00{index + 1}
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
          <Link
            className="primary-button"
            href={`/collection?film=${film.id}`}
            aria-label={`Discover ${film.title}`}
          >
            <Play size={15} fill="currentColor" /> Discover {film.title}
          </Link>
          <Link className="hero-secondary" href="/browse">
            Explore all films <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <div className="home-feature-label">
        <span>FEATURED FILM</span>
        <strong>{film.title}</strong>
        <p>
          {film.director || film.studio} <span>·</span> {film.year}{" "}
          <span>·</span> {film.genres[0]}
        </p>
      </div>
      <div className="home-bottom-line">
        <span>A DIFFERENT KIND OF CINEMA</span>
        <div
          className="hero-dots"
          role="group"
          aria-label="Choose a featured film"
        >
          {selection.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`hero-dot ${i === index ? "dot-active" : ""}`}
              onClick={() => select(i)}
              aria-label={`Switch to ${item.title}`}
            />
          ))}
        </div>
        <span>
          0{index + 1} <i /> 0{selection.length}
        </span>
      </div>
      {error && (
        <p className="hero-load-error" role="status">
          {error}
        </p>
      )}
    </section>
  );
}
