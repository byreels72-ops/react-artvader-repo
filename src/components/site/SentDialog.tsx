import { useEffect, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { lockScroll } from "@/lib/scrollLock";

type Props = {
  /** First name of the person who booked, if known. */
  name?: string;
  onClose: () => void;
};

/**
 * Confirmation shown after an appointment request is sent. Closes on Close, Escape or a click
 * outside the panel; focus moves into it and returns afterwards.
 */
export function SentDialog({ name, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    document.addEventListener("keydown", onKey);
    const unlock = lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlock();
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, []);

  const heading = name ? `Thank you, ${name}.` : "Thank you.";

  return createPortal(
    <div
      className="dialog-backdrop fixed inset-0 z-[999] flex items-end justify-center bg-foreground/45 p-3 backdrop-blur-sm md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sent-title"
        aria-describedby="sent-body"
        className="lightbox relative w-full max-w-xl bg-background px-6 pb-7 pt-6 text-foreground md:px-10 md:pb-10 md:pt-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ui-text flex items-center justify-between">
          <span className="text-muted-foreground">Book an Appointment</span>
          <button ref={closeRef} type="button" className="link-line" onClick={onClose}>
            Close
          </button>
        </div>

        <svg className="sent-check mt-10 h-14 w-14 md:mt-14" viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1.5" pathLength={1} />
          <path d="M17 29 L25 37 L40 20" fill="none" stroke="currentColor" strokeWidth="2.5" pathLength={1} />
        </svg>

        <h2 id="sent-title" className="mt-6 text-[clamp(2.6rem,7vw,4rem)] leading-[0.92]">
          {heading.split(" ").map((w, i, all) => (
            <span key={i}>
              <span className="rise inline-block overflow-hidden pb-[0.06em] align-bottom">
                <span className="inline-block" style={{ "--d": `${250 + i * 70}ms` } as CSSProperties}>
                  {w}
                </span>
              </span>
              {i < all.length - 1 ? " " : null}
            </span>
          ))}
        </h2>

        <div id="sent-body" className="ui-text mt-6 space-y-1 text-lg">
          <p>Appointment request sent successfully!</p>
          <p className="text-muted-foreground">We&apos;ll get back to you soon.</p>
        </div>

        <div className="ui-text mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-foreground/80 pt-4">
          <Link to="/portfolio" className="link-line" onClick={onClose}>
            View Portfolio
          </Link>
          <Link to="/" className="link-line" onClick={onClose}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
