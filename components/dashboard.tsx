"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bookmark, Play } from "lucide-react";
import { films } from "@/lib/catalog";
import type { Library } from "@/lib/profile-types";

export default function Dashboard({ library }: { library: Library }) {
  const saved = library.saved
    .map((id) => films.find((film) => film.id === id))
    .filter((film) => Boolean(film));
  const started = library.progress.filter((item) => item.seconds > 0);
  const completed = started.filter((item) => item.seconds >= item.duration - 3);
  const ongoing = started.filter((item) => item.seconds < item.duration - 3);
  return (
    <div className="portal-page dashboard-page">
      <div className="page-intro">
        <span className="eyebrow accent">YOUR DASHBOARD</span>
        <h1>{library.name}’s cinema.</h1>
        <p>
          {library.preferences?.bio ||
            "Everything you saved. Every story you’re still in."}
        </p>
      </div>
      <div className="profile-shortcuts">
        <Link href="/account">
          Edit profile <ArrowUpRight size={15} />
        </Link>
        <Link href="/collection">
          Open In Focus <ArrowUpRight size={15} />
        </Link>
        <Link href="/browse">
          Find a film <ArrowUpRight size={15} />
        </Link>
      </div>
      {!library.email && (
        <div className="dashboard-signin">
          <span>Keep this dashboard across devices.</span>
          <Link href="/account">
            Create an account or sign in <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
      <div className="dashboard-stats">
        <Link href="/collection">
          <strong>{saved.length}</strong>
          <span>Films in focus</span>
        </Link>
        <Link href="/library?tab=history">
          <strong>{ongoing.length}</strong>
          <span>In progress</span>
        </Link>
        <Link href="/library?tab=history">
          <strong>{completed.length}</strong>
          <span>Finished</span>
        </Link>
      </div>
      <section className="dashboard-section">
        <div className="section-label">
          <h2>Continue your evening.</h2>
          <Link href="/library?tab=history">
            Viewing history <ArrowUpRight size={14} />
          </Link>
        </div>
        {ongoing.length ? (
          <div className="continue-grid">
            {ongoing.map((item) => {
              const film = films.find((entry) => entry.id === item.film_id);
              return (
                film && (
                  <Link
                    className="resume-card"
                    key={film.id}
                    href={`/collection?film=${film.id}&play=1`}
                  >
                    <Image
                      src={`/images/watch-cards/${film.id}.jpg`}
                      alt=""
                      fill
                      sizes="(max-width:640px) 90vw, 28vw"
                    />
                    <span className="resume-shade" />
                    <span className="resume-play">
                      <Play size={18} fill="currentColor" />
                    </span>
                    <div className="resume-info">
                      <strong>{film.title}</strong>
                      <span>
                        {Math.round((item.seconds / item.duration) * 100)}%
                        watched
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
        ) : (
          <div className="dashboard-empty">
            <Play size={25} />
            <p>Your next play starts the story here.</p>
            <Link href="/browse">
              Explore films <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
      </section>
      <section className="dashboard-section">
        <div className="section-label">
          <h2>Your In Focus.</h2>
          <Link href="/library">
            Manage your list <ArrowUpRight size={14} />
          </Link>
        </div>
        {saved.length ? (
          <div className="dashboard-saved">
            {saved.map(
              (film) =>
                film && (
                  <Link
                    key={film.id}
                    href={`/collection?film=${film.id}`}
                    aria-label={`Explore ${film.title}`}
                  >
                    <div>
                      <Image
                        src={film.image}
                        alt={`${film.title} poster`}
                        fill
                        sizes="(max-width:640px) 42vw, 18vw"
                      />
                    </div>
                    <strong>{film.title}</strong>
                    <span>{film.year}</span>
                  </Link>
                ),
            )}
          </div>
        ) : (
          <div className="dashboard-empty">
            <Bookmark size={25} />
            <p>
              No saved films yet. Add films to build your own In Focus
              collection.
            </p>
            <Link href="/browse">
              Choose your first film <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
