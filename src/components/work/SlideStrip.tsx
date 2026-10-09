import { useEffect, useRef } from "react";
import { displaySrc } from "@/data/artworkMedia";
import { attachPan, mod, prefersReducedMotion, type Artwork } from "./layout";

type Props = {
  items: Artwork[];
  onOpen: (imgSrc: string) => void;
  onCategory: (category: string) => void;
};

/**
 * Slider view: an endless strip of full-height pieces on a dark wall. The centred piece is in
 * colour; clicking it opens the preview, clicking a neighbour brings that one to the centre.
 */
export function SlideStrip({ items, onOpen, onCategory }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const onOpenRef = useRef(onOpen);
  const onCategoryRef = useRef(onCategory);
  onOpenRef.current = onOpen;
  onCategoryRef.current = onCategory;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = prefersReducedMotion();
    const n = items.length;

    let vw = 0, vh = 0, sw = 0, slots = 0;
    const keyStep = { x: 0, y: 0 };
    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      sw = vw < 768 ? vw * 0.78 : Math.min(vh * 0.68, vw * 0.5);
      slots = Math.ceil(vw / sw) + 3;
      keyStep.x = sw;
    };
    measure();

    type Slot = { el: HTMLDivElement; img: HTMLImageElement; k: number };
    let pool: Slot[] = [];
    const build = () => {
      stage.replaceChildren();
      pool = Array.from({ length: slots }, () => {
        const el = document.createElement("div");
        el.className = "slide absolute left-0 top-0 h-full overflow-hidden";
        el.dataset.cursor = "view";
        const img = document.createElement("img");
        img.alt = "";
        img.draggable = false;
        img.decoding = "async";
        img.className = "h-full w-full object-cover";
        el.appendChild(img);
        stage.appendChild(el);
        return { el, img, k: Number.NaN };
      });
    };
    build();

    // x = 0 centres slide 0
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let lastInput = performance.now();
    let centre = Number.NaN;

    const pan = attachPan(stage, target, {
      axis: "x",
      keyStep,
      onInput: () => (lastInput = performance.now()),
      onTap: (tile) => {
        if (!tile) return;
        const k = Number(tile.getAttribute("data-k"));
        if (k === centre) onOpenRef.current(tile.getAttribute("data-src")!);
        else {
          target.x = -k * sw;
          lastInput = 0;
        }
      },
    });

    let raf = 0;
    let prevT = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - prevT) / 16.67, 4);
      prevT = now;
      if (!pan.isDown() && now - lastInput > 220) target.x = Math.round(target.x / sw) * sw;
      const k = reduce ? 1 : 1 - Math.pow(1 - 0.08, dt);
      pos.x += (target.x - pos.x) * k;

      const left = vw / 2 - sw / 2 + pos.x;
      const first = Math.floor(-left / sw) - 1;
      const c = Math.round(-pos.x / sw);
      if (c !== centre) {
        centre = c;
        onCategoryRef.current(items[mod(c, n)].category);
      }
      for (let i = 0; i < slots; i++) {
        const kk = first + mod(i - first, slots);
        const s = pool[i];
        if (s.k !== kk) {
          s.k = kk;
          const item = items[mod(kk, n)];
          s.img.src = displaySrc(item.imgSrc);
          s.el.dataset.src = item.imgSrc;
          s.el.dataset.k = String(kk);
          s.el.dataset.index = String(item.id);
          s.el.style.width = `${sw}px`;
        }
        const x = left + kk * sw;
        // gentle parallax inside each frame
        const off = ((x + sw / 2 - vw / 2) / vw) * -12;
        s.img.style.transform = `translate3d(${off}%, 0, 0) scale(1.25)`;
        s.el.style.transform = `translate3d(${x}px, 0, 0)`;
        s.el.dataset.focus = String(kk === c);
      }
    };
    raf = requestAnimationFrame(frame);

    const onResize = () => {
      const prev = sw;
      measure();
      if (pool.length !== slots) build();
      pool.forEach((s) => (s.k = Number.NaN));
      pos.x *= sw / prev;
      target.x *= sw / prev;
    };
    window.addEventListener("resize", onResize);
    void vh;

    return () => {
      cancelAnimationFrame(raf);
      pan.detach();
      window.removeEventListener("resize", onResize);
      stage.replaceChildren();
    };
  }, [items]);

  return <div ref={stageRef} className="work-stage lightbox" aria-hidden="true" />;
}
