import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { portfolioItems } from "@/data/featuredData";

type Props = {
  src: string;
  onClose: () => void;
};

/**
 * Full-screen artwork preview. Clicking anywhere (or Close) closes it, as before; Escape also
 * closes it. Focus moves to Close and returns afterwards. Rendered in a portal so transformed
 * ancestors can never clip or offset it.
 */
export function ArtworkLightbox({ src, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const index = portfolioItems.findIndex((p) => p.imgSrc === src);
  const item = index >= 0 ? portfolioItems[index] : null;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item ? item.title : "Artwork preview"}
      className="lightbox fixed inset-0 z-[999] flex flex-col bg-background text-foreground"
      onClick={onClose}
      data-cursor="view"
    >
      <div className="ui-text flex items-start justify-between px-5 pt-5 md:px-6">
        <span className="text-muted-foreground">
          {index >= 0 ? `${String(index + 1).padStart(2, "0")} / ${String(portfolioItems.length).padStart(2, "0")}` : ""}
        </span>
        <button ref={closeRef} type="button" className="link-line" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-5 py-6">
        <img src={src} alt="Preview" className="lightbox__img max-h-full max-w-full object-contain" />
      </div>

      {item && (
        <div className="grid grid-cols-1 gap-2 px-5 pb-6 md:grid-cols-12 md:px-6">
          <h2 className="text-4xl md:col-span-5 md:text-5xl">{item.title}</h2>
          <p className="ui-text text-muted-foreground md:col-span-2 md:pt-2">{item.category}</p>
          <p className="ui-text max-w-md md:col-span-5 md:pt-2">{item.story}</p>
        </div>
      )}
    </div>,
    document.body,
  );
}
