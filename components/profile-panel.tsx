"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, LoaderCircle, UserRound } from "lucide-react";
import { films } from "@/lib/catalog";
import type { Library } from "@/lib/profile-types";

async function send(url: string, body: unknown, method = "POST") {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}

function navigateAfterAuth(path: string) {
  try {
    sessionStorage.removeItem("cine-artwork-theme-v1");
    localStorage.setItem("cine-auth-change", String(Date.now()));
  } catch {
    /* Authentication still works with browser storage disabled. */
  }
  // A full navigation clears private component state after an identity change.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(path);
}

function AuthPanel({ name }: { name: string }) {
  const [mode, setMode] = useState<"register" | "login">("register");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="account-panel auth-panel">
      <span className="eyebrow accent">YOUR CINEMA, EVERYWHERE</span>
      <h2>
        {mode === "register"
          ? "Keep your collection with you."
          : "Welcome back."}
      </h2>
      <p>
        {mode === "register"
          ? "Create an account to keep this profile, its saved films, and viewing progress across devices."
          : "Sign in to open your own dashboard and In Focus collection."}
      </p>
      <div className="auth-tabs" role="group" aria-label="Account access">
        <button
          type="button"
          aria-pressed={mode === "register"}
          onClick={() => {
            setMode("register");
            setError("");
          }}
        >
          Create account
        </button>
        <button
          type="button"
          aria-pressed={mode === "login"}
          onClick={() => {
            setMode("login");
            setError("");
          }}
        >
          Sign in
        </button>
      </div>
      <form
        key={mode}
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setBusy(true);
          setError("");
          try {
            await send(`/api/auth/${mode}`, {
              name: data.get("name") || name,
              email: data.get("email"),
              password: data.get("password"),
            });
            sessionStorage.removeItem("cine-artwork-theme-v1");
            // Clear all guest state after the identity changes.
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.assign("/dashboard");
          } catch (err) {
            setError((err as Error).message);
            setBusy(false);
          }
        }}
      >
        {mode === "register" && (
          <>
            <label htmlFor="signup-name">Display name</label>
            <input
              id="signup-name"
              name="name"
              defaultValue={name === "Film lover" ? "" : name}
              required
              maxLength={40}
              autoComplete="nickname"
            />
          </>
        )}
        <label htmlFor="auth-email">Email address</label>
        <input
          id="auth-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
        />
        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 12 : 1}
          maxLength={128}
          autoComplete={
            mode === "register" ? "new-password" : "current-password"
          }
        />
        {mode === "register" && <p>Use at least 12 characters.</p>}
        {error && <p role="alert">{error}</p>}
        <button className="primary-button" disabled={busy}>
          {busy ? (
            <LoaderCircle size={16} className="spin" />
          ) : (
            <ArrowUpRight size={16} />
          )}
          {mode === "register" ? "Create my account" : "Sign in to my account"}
        </button>
      </form>
    </section>
  );
}

export default function ProfilePanel({
  library,
  reload,
}: {
  library: Library;
  reload: () => Promise<void>;
}) {
  const [name, setName] = useState(library.name);
  const [bio, setBio] = useState(library.preferences?.bio || "");
  const [genres, setGenres] = useState<string[]>(
    library.preferences?.favoriteGenres || [],
  );
  const [avatar, setAvatar] = useState(library.preferences?.avatar || "amber");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const allGenres = [...new Set(films.flatMap((film) => film.genres))].sort();
  return (
    <div className="portal-page account-page">
      <div className="page-intro">
        <span className="eyebrow accent">YOUR PROFILE</span>
        <h1>Your space.</h1>
        <p>Your taste, your films, your own corner of cinema.</p>
      </div>
      <div className="profile-shortcuts">
        <Link href="/dashboard">
          Your dashboard <ArrowUpRight size={15} />
        </Link>
        <Link href="/collection">
          Your In Focus <ArrowUpRight size={15} />
        </Link>
        <Link href="/library">
          Manage saved films <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="account-grid">
        <section className="account-panel profile-editor">
          <div className="account-identity">
            <div className={`profile-avatar avatar-${avatar}`}>
              {(name || "C")[0].toUpperCase()}
            </div>
            <div>
              <h2>{library.name}</h2>
              <span className="eyebrow">
                {library.email || "GUEST PROFILE"}
              </span>
            </div>
          </div>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              setMessage("");
              try {
                await send(
                  "/api/profile",
                  { name, bio, favoriteGenres: genres, avatar },
                  "PATCH",
                );
                await reload();
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
              autoComplete="nickname"
            />
            <label htmlFor="profile-bio">A little about your film taste</label>
            <textarea
              id="profile-bio"
              rows={3}
              maxLength={160}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="The films, filmmakers, and worlds you love…"
            />
            <small>{bio.length}/160</small>
            <fieldset>
              <legend>Profile color</legend>
              <div className="avatar-options">
                {["amber", "sage", "ocean", "rose", "violet"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`avatar-option avatar-${color}`}
                    aria-label={`${color} profile color`}
                    aria-pressed={avatar === color}
                    onClick={() => setAvatar(color)}
                  >
                    {avatar === color && <Check size={17} />}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>
                Favorite genres <small>Choose up to five</small>
              </legend>
              <div className="preference-genres">
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    aria-pressed={genres.includes(genre)}
                    disabled={!genres.includes(genre) && genres.length >= 5}
                    onClick={() =>
                      setGenres((current) =>
                        current.includes(genre)
                          ? current.filter((item) => item !== genre)
                          : [...current, genre],
                      )
                    }
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="primary-button" disabled={busy}>
              {busy ? (
                <LoaderCircle className="spin" size={15} />
              ) : (
                <Check size={15} />
              )}
              Save changes
            </button>
            <div className="inline-status" role="status">
              {message}
            </div>
          </form>
        </section>
        <aside className="account-side">
          <div className="account-stats">
            <Link href="/collection">
              <strong>{library.saved.length}</strong>
              <span>
                FILMS IN FOCUS <ArrowUpRight size={13} />
              </span>
            </Link>
            <Link href="/library?tab=history">
              <strong>
                {library.progress.filter((item) => item.seconds > 0).length}
              </strong>
              <span>
                FILMS STARTED <ArrowUpRight size={13} />
              </span>
            </Link>
          </div>
          {!library.email ? (
            <AuthPanel name={library.name} />
          ) : (
            <section className="account-panel auth-panel">
              <UserRound size={24} />
              <h2>One account. Every screen.</h2>
              <p>
                Sign in with {library.email} on another device to find the same
                saved films, profile, and progress.
              </p>
              <details className="password-settings">
                <summary>Change password</summary>
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const form = event.currentTarget;
                    const data = new FormData(form);
                    setBusy(true);
                    setPasswordMessage("");
                    try {
                      await send("/api/auth/password", {
                        currentPassword: data.get("currentPassword"),
                        password: data.get("password"),
                      });
                      form.reset();
                      setPasswordMessage(
                        "Password changed. Other devices have been signed out.",
                      );
                    } catch (err) {
                      setPasswordMessage((err as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <label htmlFor="current-password">Current password</label>
                  <input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    required
                    maxLength={128}
                    autoComplete="current-password"
                  />
                  <label htmlFor="new-password">New password</label>
                  <input
                    id="new-password"
                    name="password"
                    type="password"
                    required
                    minLength={12}
                    maxLength={128}
                    autoComplete="new-password"
                  />
                  <button className="secondary-button" disabled={busy}>
                    Update password
                  </button>
                  <p role="status">{passwordMessage}</p>
                </form>
              </details>
              <button
                className="secondary-button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await send("/api/auth/logout", {});
                    navigateAfterAuth("/account");
                  } catch (err) {
                    setMessage((err as Error).message);
                    setBusy(false);
                  }
                }}
              >
                Sign out
              </button>
            </section>
          )}
          <div className="account-note">
            <h3>Your list is your In Focus.</h3>
            <p>
              Save a film anywhere on the site and it appears in your personal
              collection. Remove it from your list to remove it from In Focus.
            </p>
            <Link href="/browse">
              Find films to add <ArrowUpRight size={14} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
