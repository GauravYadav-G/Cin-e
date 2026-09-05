"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, LoaderCircle, RotateCcw, Volume2 } from "lucide-react";
import type { Film } from "@/lib/catalog";
type Playback = {
  url: string;
  demo: boolean;
  title: string;
  captions: string | null;
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const lastSave = useRef(0);
  const saveFailed = useRef(false);

  const saveProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0)
      return;
    return fetch("/api/progress", {
      method: "POST",
      keepalive: true,
      signal: AbortSignal.timeout(5000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filmId: film.id,
        seconds: Math.min(video.currentTime, video.duration),
        duration: video.duration,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Progress not saved");
        saveFailed.current = false;
      })
      .catch(() => {
        if (!saveFailed.current) {
          onError(
            "Your viewing progress couldn’t be saved. Playback can continue.",
          );
          saveFailed.current = true;
        }
      });
  }, [film.id, onError]);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
          throw new Error("This preview is unavailable right now.");
        setSource(await response.json());
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [film.id, attempt]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;
    let disposed = false;
    let hls: import("hls.js").default | undefined;
    if (
      new URL(source.url, window.location.origin).pathname.endsWith(".m3u8") &&
      !video.canPlayType("application/vnd.apple.mpegurl")
    ) {
      import("hls.js")
        .then(({ default: Hls }) => {
          if (disposed) return;
          if (!Hls.isSupported()) {
            setError("Your browser does not support this stream.");
            setLoading(false);
            return;
          }
          hls = new Hls();
          hls.loadSource(source.url);
          hls.attachMedia(video);
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              setError("The stream was interrupted. Please try again.");
              setLoading(false);
            }
          });
        })
        .catch(() => {
          setError("The player couldn’t start. Please try again.");
          setLoading(false);
        });
    } else {
      video.src = source.url;
      video.load();
    }
    return () => {
      disposed = true;
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [source]);

  async function close() {
    videoRef.current?.pause();
    await saveProgress();
    onClose();
  }
  return (
    <dialog
      ref={dialogRef}
      className="player-dialog"
      aria-label={`${film.title} player`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="player-top">
        <button className="back-link" onClick={close}>
          <ArrowLeft size={17} />
          Back to film
        </button>
        <div>
          <strong>{film.title}</strong>
          <span>{source?.demo ? "DEMO SCREENING" : "NOW PLAYING"}</span>
        </div>
        <span className="player-logo">ciné</span>
      </div>
      <div className="video-stage">
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          preload="metadata"
          aria-label={source?.title || "Film preview"}
          onLoadedMetadata={() => {
            const video = videoRef.current;
            if (video && progress > 0 && progress < video.duration - 3)
              video.currentTime = progress;
          }}
          onCanPlay={() => setLoading(false)}
          onWaiting={() => setLoading(true)}
          onPlaying={() => setLoading(false)}
          onError={() => {
            if (source) {
              setError(
                "The video couldn’t load. Check your connection and try again.",
              );
              setLoading(false);
            }
          }}
          onPause={saveProgress}
          onEnded={saveProgress}
          onTimeUpdate={() => {
            if (Date.now() - lastSave.current > 10000) {
              lastSave.current = Date.now();
              saveProgress();
            }
          }}
        >
          {source?.captions && (
            <track
              kind="captions"
              src={source.captions}
              srcLang="en"
              label="English descriptions"
            />
          )}
        </video>
        {loading && !error && (
          <div className="player-loading">
            <LoaderCircle size={32} className="spin" />
            <span>Setting the scene…</span>
          </div>
        )}
        {error && (
          <div className="player-error">
            <h2>A brief intermission.</h2>
            <p>{error}</p>
            <button
              className="primary-button"
              onClick={() => {
                setError("");
                setLoading(true);
                setSource(null);
                setAttempt(attempt + 1);
              }}
            >
              <RotateCcw size={16} />
              Try again
            </button>
          </div>
        )}
      </div>
      <div className="player-bottom">
        <div>
          <span className="status-dot" />
          <p>
            {source?.demo ? (
              <>
                Demo playback · <strong>Big Buck Bunny</strong> by Blender
                Foundation · CC BY 3.0.
                <br />
                <span>
                  This sample demonstrates the player; it is not {film.title}.
                </span>
              </>
            ) : (
              source?.title
            )}
          </p>
        </div>
        <span>
          <Volume2 size={14} />
          Best enjoyed with headphones
        </span>
      </div>
    </dialog>
  );
}
