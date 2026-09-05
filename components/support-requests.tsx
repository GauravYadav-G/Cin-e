"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  LoaderCircle,
  MessageSquare,
} from "lucide-react";
import SiteShell from "./site-shell";
type Ticket = {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: "saved" | "closed";
  created_at: string;
};
export default function SupportRequests({
  form = false,
  newId,
}: {
  form?: boolean;
  newId?: string;
}) {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [topic, setTopic] = useState("Playback");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const load = useCallback(
    () =>
      fetch("/api/support")
        .then(async (response) => {
          if (!response.ok)
            throw new Error("Your requests couldn’t load. Please try again.");
          const data = await response.json();
          setTickets(data.requests);
          setError("");
        })
        .catch((err) => setError(err.message)),
    [],
  );
  useEffect(() => {
    if (!form) void load();
  }, [form, load]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: topic,
          subject,
          message: description,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Your request couldn’t be saved.");
      router.push(`/support/requests?new=${data.id}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }
  async function status(ticket: Ticket) {
    if (busy) return;
    setBusy(true);
    setError("");
    const next = ticket.status === "closed" ? "saved" : "closed";
    try {
      const response = await fetch("/api/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticket.id, status: next }),
      });
      if (!response.ok)
        throw new Error("Your request couldn’t be updated. Please try again.");
      setTickets(
        (current) =>
          current?.map((item) =>
            item.id === ticket.id ? { ...item, status: next } : item,
          ) || [],
      );
      setNotice(
        next === "closed"
          ? "Request closed. You can reopen it at any time."
          : "Request reopened.",
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const visible =
    tickets?.filter((ticket) => filter === "all" || ticket.status === filter) ||
    [];
  return (
    <SiteShell>
      <div className="portal-page request-page">
        <Link className="guide-back" href="/support">
          <ArrowLeft size={14} />
          Help center
        </Link>
        <div className="page-intro">
          <span className="eyebrow accent">
            {form ? "LET’S GET THE DETAILS RIGHT" : "EVERYTHING IN ONE PLACE"}
          </span>
          <h1>{form ? "What’s on your mind?" : "Your requests."}</h1>
          <p>
            {form
              ? "A few details now. An easier place to pick up later."
              : "A record of your questions, attached to this browser profile."}
          </p>
        </div>
        {form ? (
          <div className="request-form-layout">
            <form className="support-form" onSubmit={submit}>
              <label htmlFor="request-topic">What do you need help with?</label>
              <select
                id="request-topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              >
                {["Playback", "My library", "My profile", "Something else"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
              <label htmlFor="request-subject">Give your request a title</label>
              <input
                id="request-subject"
                required
                minLength={5}
                maxLength={120}
                placeholder="For example, my preview stops playing"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
              <label htmlFor="request-message">Tell us a little more</label>
              <textarea
                id="request-message"
                required
                minLength={20}
                maxLength={3000}
                rows={7}
                placeholder="What happened? Which film, device, and browser were you using? Include any error message you saw."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <span className="form-counter">
                20 characters minimum <span>{description.length} / 3,000</span>
              </span>
              <div className="request-disclosure">
                <CircleHelp size={17} />
                <p>
                  This preview saves requests to your profile. It doesn’t send
                  an email or notify a support team.
                </p>
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="request-submit">
                <Link href="/support">Cancel</Link>
                <button disabled={busy} className="primary-button">
                  {busy ? (
                    <LoaderCircle size={16} className="spin" />
                  ) : (
                    <MessageSquare size={16} />
                  )}
                  {busy ? "Saving request…" : "Save request"}
                </button>
              </div>
            </form>
            <aside className="request-aside">
              <FileText size={27} />
              <h2>
                A good request
                <br />
                starts with the details.
              </h2>
              <ul>
                <li>The film you were exploring</li>
                <li>Your device and browser</li>
                <li>What you expected to happen</li>
                <li>What actually happened</li>
              </ul>
              <p>
                Please leave out passwords, payment details, or other sensitive
                information.
              </p>
              <Link href="/support/requests">
                View your saved requests
                <ArrowUpRight size={15} />
              </Link>
              <Link href="/support/playback-help">
                Try the playback guide
                <ArrowUpRight size={15} />
              </Link>
            </aside>
          </div>
        ) : (
          <>
            {newId && tickets?.some((ticket) => ticket.id === newId) && (
              <div className="request-success" role="status">
                <Check size={25} />
                <div>
                  <h2>Your request is saved.</h2>
                  <p>
                    Reference CNE-{newId.slice(0, 8).toUpperCase()}. You can
                    review or close it below. No email has been sent.
                  </p>
                </div>
              </div>
            )}
            <div className="request-toolbar">
              <div className="genre-tabs">
                {[
                  ["all", "All requests"],
                  ["saved", "Saved"],
                  ["closed", "Closed"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={filter === value ? "active" : ""}
                    onClick={() => setFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Link className="primary-button" href="/support/contact">
                New request
                <ArrowUpRight size={15} />
              </Link>
            </div>
            {error && (
              <div className="form-error" role="alert">
                {error}
                <button onClick={() => void load()}>Try again</button>
              </div>
            )}
            {notice && (
              <p className="inline-status" role="status">
                {notice}
              </p>
            )}
            {!tickets && !error ? (
              <div className="empty-state">
                <LoaderCircle className="spin" />
                <p>Loading your requests…</p>
              </div>
            ) : visible.length ? (
              <div className="ticket-list">
                {visible.map((ticket) => (
                  <details key={ticket.id} open={ticket.id === newId}>
                    <summary>
                      <span className="ticket-icon">
                        <MessageSquare size={19} />
                      </span>
                      <div>
                        <span className="eyebrow">
                          CNE-{ticket.id.slice(0, 8).toUpperCase()} /{" "}
                          {ticket.category}
                        </span>
                        <h2>{ticket.subject}</h2>
                        <p>
                          {new Date(ticket.created_at).toLocaleDateString(
                            "en",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <span className={`ticket-status ${ticket.status}`}>
                        {ticket.status}
                      </span>
                      <ChevronDown size={17} />
                    </summary>
                    <div className="ticket-body">
                      <p>{ticket.message}</p>
                      <div>
                        <span>
                          Stored in this preview. No support inbox is connected.
                        </span>
                        <button
                          className="secondary-button"
                          disabled={busy}
                          onClick={() => void status(ticket)}
                        >
                          {ticket.status === "closed"
                            ? "Reopen request"
                            : "Close request"}
                        </button>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              !error && (
                <div className="empty-state portal-empty">
                  <MessageSquare size={34} />
                  <h2>
                    {filter === "all"
                      ? "A quiet inbox is a good thing."
                      : `No ${filter} requests.`}
                  </h2>
                  <p>
                    Find an answer in the help center, or keep a record of a new
                    question.
                  </p>
                  <Link className="primary-button" href="/support">
                    Explore the help center
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              )
            )}
          </>
        )}
      </div>
    </SiteShell>
  );
}
