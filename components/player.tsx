"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, LoaderCircle, RotateCcw } from "lucide-react";
import type { Film } from "@/lib/catalog";
type Playback = {
  title: string;
  youtubeId: string | null;
  stream: { url: string; statusUrl: string } | null;
  streamError?: string | null;
};
type TorrentStatus = {
  state: "connecting" | "ready" | "error";
  peers: number;
  downloadSpeed: number;
  fileName: string | null;
  transcode: boolean;
  error?: string;
};

export default function Player({
  film,
  progress,
  onClose,
  onError,
}: {
  film: Film;
  progress: number;
  onClose: () => void;
  onError: (message: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<Playback | null>(null);
  const [mode, setMode] = useState<"youtube" | "stream">("stream");
  const [error, setError] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<TorrentStatus | null>(null);
  const lastSave = useRef(0);
  const ready = status?.state === "ready";

  const saveProgress = useCallback(async () => {
    const video = videoRef.current;
    if (
      !video ||
      !Number.isFinite(video.duration) ||
      video.duration <= 0 ||
      video.currentTime === 0
    )
      return;
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        keepalive: true,
        signal: AbortSignal.timeout(5000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filmId: film.id,
          seconds: Math.min(video.currentTime, video.duration),
          duration: video.duration,
        }),
      });
      if (!response.ok) throw new Error();
    } catch {
      onError("Viewing progress couldn’t be saved. Playback can continue.");
    }
  }, [film.id, onError]);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Retire only the service worker installed by the old browser-side torrent player.
    if ("serviceWorker" in navigator)
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          for (const registration of registrations)
            if (
              registration.active &&
              new URL(registration.active.scriptURL).pathname === "/sw.min.js"
            )
              void registration.unregister();
        })
        .catch(() => {});
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/playback/${film.id}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("This film’s playback sources couldn’t load.");
        const data: Playback = await response.json();
        setSource(data);
        setMode(data.stream ? "stream" : "youtube");
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setSourceError(err.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [film.id, attempt]);

  useEffect(() => {
    if (mode !== "stream" || !source?.stream) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const response = await fetch(source.stream!.statusUrl, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data: TorrentStatus = await response.json();
        if (!response.ok || data.state === "error")
          throw new Error(
            data.error || "The torrent server couldn’t connect to this magnet.",
          );
        setStatus(data);
        if (!controller.signal.aborted) timer = setTimeout(poll, 2000);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError((err as Error).message);
          setLoading(false);
        }
      }
    };
    void poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [source, mode]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== "stream" || !source?.stream || !ready) return;
    video.src = source.stream.url;
    video.load();
    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [source, mode, ready]);
  useEffect(() => {
    if (!loading || !ready || mode !== "stream") return;
    const timer = setTimeout(() => {
      setError(
        "No playable data arrived. Check peer availability, or enable server-side transcoding for this film’s codec.",
      );
      setLoading(false);
    }, 90000);
    return () => clearTimeout(timer);
  }, [loading, ready, mode]);

  async function close() {
    videoRef.current?.pause();
    await saveProgress();
    onClose();
  }
  async function switchMode(next: "youtube" | "stream") {
    if (mode === next) return;
    videoRef.current?.pause();
    void saveProgress();
    setError("");
    setStatus(null);
    setLoading(true);
    setMode(next);
  }
  function retry() {
    setError("");
    setSourceError("");
    setStatus(null);
    setSource(null);
    setLoading(true);
    setAttempt((value) => value + 1);
  }
  const unavailable =
    source && (mode === "youtube" ? !source.youtubeId : !source.stream);
  const problem =
    sourceError ||
    (unavailable
      ? mode === "youtube"
        ? "No YouTube video is configured for this film."
        : source.streamError ||
          "No magnet stream is configured for this film. Add its magnet to the server’s per-film source configuration."
      : mode === "stream"
        ? error
        : "");

  return (
    <dialog
      ref={dialogRef}
      className="player-dialog"
      aria-label={`${film.title} player`}
      onCancel={(event) => {
        event.preventDefault();
        void close();
      }}
    >
      <div className="player-top player-top-clean">
        <button className="back-link" onClick={() => void close()}>
          <ArrowLeft size={17} />
          Back to film
        </button>
        <div className="player-film-title">
          <strong>{film.title}</strong>
          <span>
            {mode === "youtube" ? "YOUTUBE" : "SERVER TORRENT STREAM"}
          </span>
        </div>
        <div
          className="player-mode-toggle"
          role="group"
          aria-label="Playback source"
        >
          <button
            aria-pressed={mode === "youtube"}
            className={mode === "youtube" ? "active" : ""}
            onClick={() => void switchMode("youtube")}
          >
            YouTube
          </button>
          <button
            aria-pressed={mode === "stream"}
            className={mode === "stream" ? "active" : ""}
            onClick={() => void switchMode("stream")}
          >
            Stream
          </button>
        </div>
      </div>
      <div className="video-stage">
        {!problem && mode === "youtube" && source?.youtubeId && (
          <iframe
            key={source.youtubeId}
            className="youtube-frame"
            src={`https://www.youtube.com/embed/${source.youtubeId}?autoplay=1&rel=0`}
            title={`${film.title} YouTube video`}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )}
        {mode === "stream" && source?.stream && (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            preload="metadata"
            aria-label={`${film.title} torrent stream`}
            onLoadedMetadata={() => {
              const video = videoRef.current;
              if (
                video &&
                Number.isFinite(video.duration) &&
                progress > 0 &&
                progress < video.duration - 3
              )
                video.currentTime = progress;
            }}
            onCanPlay={() => setLoading(false)}
            onPlaying={() => setLoading(false)}
            onWaiting={() => setLoading(true)}
            onError={() => {
              if (videoRef.current?.getAttribute("src")) {
                setError(
                  "This torrent’s video could not play. Check the server connection or enable transcoding for its codec.",
                );
                setLoading(false);
              }
            }}
            onPause={() => void saveProgress()}
            onEnded={() => void saveProgress()}
            onTimeUpdate={() => {
              if (Date.now() - lastSave.current > 10000) {
                lastSave.current = Date.now();
                void saveProgress();
              }
            }}
          />
        )}
        {!problem && (!source || (mode === "stream" && loading)) && (
          <div className="player-loading">
            <LoaderCircle size={30} className="spin" />
            <span>
              {!source
                ? "Loading film sources…"
                : ready
                  ? status?.transcode
                    ? "Preparing video on the server…"
                    : "Buffering from torrent peers…"
                  : "Connecting to torrent peers on the server…"}
            </span>
          </div>
        )}
        {problem && (
          <div className="player-error">
            <h2>
              {unavailable
                ? "Source not available."
                : "The stream needs attention."}
            </h2>
            <p role="alert">{problem}</p>
            {!unavailable && (
              <button className="primary-button" onClick={retry}>
                <RotateCcw size={16} />
                Try again
              </button>
            )}
          </div>
        )}
      </div>
      <div className="player-bottom player-bottom-clean">
        <div>
          <span className="status-dot" />
          <p>
            {mode === "youtube"
              ? "YouTube video for this film"
              : status?.fileName || "This film’s server-side magnet stream"}
            {mode === "stream" && status?.transcode && (
              <>
                <br />
                <span>Converted for browser playback · sequential stream</span>
              </>
            )}
          </p>
        </div>
        {mode === "stream" && status && (
          <span>
            {status.peers} peers ·{" "}
            {(status.downloadSpeed / 1024 / 1024).toFixed(1)} MB/s
          </span>
        )}
      </div>
    </dialog>
  );
}
