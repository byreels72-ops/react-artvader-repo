import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Props = {
  image: string;
  /** Images to preload; the counter follows real progress. */
  preload: string[];
  /** Fires once each preloaded image's aspect ratio is known. */
  onAspects: (aspects: Record<string, number>) => void;
  onLeave: () => void;
  onDone: () => void;
  keys: string[];
};

const MIN_MS = 2200;

/**
 * Opening screen: the name set huge across the top, a portrait rising in the centre, the tagline,
 * and a counter running to 100 as the work loads. Then the whole sheet wipes upward.
 */
export function Intro({ image, preload, keys, onAspects, onLeave, onDone }: Props) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const shown = useRef(0);

  useEffect(() => {
    let loaded = 0;
    const aspects: Record<string, number> = {};
    const started = performance.now();
    let raf = 0;
    let finished = false;

    preload.forEach((src, i) => {
      const img = new Image();
      const done = () => {
        loaded++;
        if (img.naturalWidth) aspects[keys[i]] = img.naturalWidth / img.naturalHeight;
        if (loaded === preload.length) onAspects({ ...aspects });
      };
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });

    const tick = () => {
      const t = Math.min((performance.now() - started) / MIN_MS, 1);
      const real = preload.length ? loaded / preload.length : 1;
      const goal = Math.min(t, real) * 100;
      shown.current += (goal - shown.current) * 0.12;
      setCount(Math.round(shown.current));
      if (shown.current > 99.5 && !finished) {
        finished = true;
        setCount(100);
        setLeaving(true);
        onLeave();
        window.setTimeout(onDone, 1100);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("intro", leaving && "is-leaving")} aria-hidden="true">
      <div className="flex h-full flex-col px-5 pb-5 pt-4 md:px-6">
        <p className="display-xl flex flex-wrap gap-x-[0.22em] uppercase md:justify-between md:gap-x-[0.18em]">
          {["The", "Art", "Vader"].map((w, i) => (
            <span key={w} className="rise inline-block overflow-hidden pb-[0.04em]">
              <span style={{ "--d": `${i * 90}ms` } as CSSProperties}>{w}</span>
            </span>
          ))}
        </p>

        <div className="flex min-h-0 flex-1 items-center justify-center py-4">
          <div className="intro__image h-full max-h-[56vh] overflow-hidden">
            <img src={image} alt="" className="h-full w-auto object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-3 items-end gap-4">
          <p className="ui-text text-[0.72rem] text-muted-foreground">KASHMIR GRAFFITI</p>
          <p className="ui-text text-center">Coloring Kashmir, One Wall at a Time</p>
          <p className="text-right text-4xl font-semibold tabular-nums tracking-[-0.04em] md:text-5xl">{count}</p>
        </div>
      </div>
    </div>
  );
}

/** Big category name; on change the old word slides up and the new one rises in. */
export function CategoryTitle({ value }: { value: string }) {
  const [words, setWords] = useState<{ text: string; state: "in" | "out" | "pre"; id: number }[]>([
    { text: value, state: "in", id: 0 },
  ]);
  const id = useRef(0);

  useEffect(() => {
    setWords((prev) => {
      if (prev.length && prev[prev.length - 1].text === value) return prev;
      const next = ++id.current;
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          setWords((w) => w.map((x) => (x.id === next ? { ...x, state: "in" } : x))),
        ),
      );
      return [...prev.slice(-1).map((x) => ({ ...x, state: "out" as const })), { text: value, state: "pre", id: next }];
    });
    const t = window.setTimeout(() => setWords((w) => w.filter((x) => x.state !== "out")), 950);
    return () => window.clearTimeout(t);
  }, [value]);

  return (
    <span className="title-swap" aria-live="polite">
      {words.map((w) => (
        <span key={w.id} data-state={w.state} aria-hidden={w.state === "out" || undefined}>
          {w.text}
        </span>
      ))}
    </span>
  );
}
