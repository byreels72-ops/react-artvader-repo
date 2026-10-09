import { useEffect, useMemo, useRef } from "react";
import { thumbSrc } from "@/data/artworkMedia";
import { attachPan, categoriesOf, frameFor, mod, prefersReducedMotion, type Artwork } from "./layout";

type Props = {
  items: Artwork[];
  aspects: Record<string, number>;
  onOpen: (imgSrc: string) => void;
  onCategory: (category: string) => void;
  /** Play the entrance (rows sweep in on a curve) when this becomes true. */
  enter: boolean;
};

/**
 * An endless wall of small thumbnails. Columns come in pairs, one category per pair; the pair at
 * the centre of the screen is shown in colour and names the category, everything else rests faded.
 * Wheel / drag / swipe / arrow keys pan it; moving fast bends the rows into a curve.
 *
 * A fixed pool of tiles is recycled as it scrolls, and all per-frame work writes straight to the
 * DOM (no React renders while moving).
 */
export function WorkGrid({ items, aspects, onOpen, onCategory, enter }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { order, by } = useMemo(() => categoriesOf(items), [items]);
  const onOpenRef = useRef(onOpen);
  const onCategoryRef = useRef(onCategory);
  onOpenRef.current = onOpen;
  onCategoryRef.current = onCategory;
  const enterRef = useRef(enter);
  enterRef.current = enter;
  const aspectsRef = useRef(aspects);
  aspectsRef.current = aspects;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = prefersReducedMotion();

    // ---------- geometry ----------
    let vw = 0, vh = 0, cw = 0, ch = 0, box = 0, originX = 0, originY = 0, cols = 0, rows = 0;
    const keyStep = { x: 0, y: 0 };
    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const mobile = vw < 768;
      cw = mobile ? vw / 4 : Math.max(150, Math.min(220, vw / 8));
      ch = mobile ? 150 : Math.round(cw * 0.9);
      box = mobile ? Math.round(cw * 0.84) : Math.round(cw * 0.545);
      originX = vw / 2 - cw;
      originY = (mobile ? 64 : 60) + box / 2 - ch / 2;
      cols = Math.ceil(vw / cw) + 3;
      rows = Math.ceil(vh / ch) + 3;
      keyStep.x = cw * 2;
      keyStep.y = ch;
    };
    measure();

    // ---------- tile pool ----------
    type Tile = { el: HTMLDivElement; img: HTMLImageElement; key: string; pair: number };
    let pool: Tile[] = [];
    const build = () => {
      stage.replaceChildren();
      pool = [];
      for (let i = 0; i < cols * rows; i++) {
        const el = document.createElement("div");
        el.className = "work-tile";
        el.dataset.cursor = "view";
        const img = document.createElement("img");
        img.alt = "";
        img.draggable = false;
        img.decoding = "async";
        el.appendChild(img);
        stage.appendChild(el);
        pool.push({ el, img, key: "", pair: 0 });
      }
    };
    build();

    const itemAt = (col: number, row: number) => {
      const pair = Math.floor(col / 2);
      const cat = order[mod(pair, order.length)];
      const list = by.get(cat)!;
      const lap = Math.floor(pair / order.length);
      return { item: list[mod(row + (col % 2) * 2 + lap, list.length)], pair, cat };
    };

    // ---------- motion state ----------
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let velX = 0;
    let bend = 0;
    let lastInput = performance.now();
    let introStart = -1;
    let centerPair = Number.NaN;
    let knownAspects = aspectsRef.current;

    const pan = attachPan(stage, target, {
      axis: "xy",
      keyStep,
      onInput: () => (lastInput = performance.now()),
      onTap: (tile) => {
        const src = tile?.getAttribute("data-src");
        if (src) onOpenRef.current(src);
      },
    });

    let raf = 0;
    let prevT = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - prevT) / 16.67, 4);
      prevT = now;

      // snap so a category pair sits centred once input settles
      if (!pan.isDown() && now - lastInput > 220) {
        target.x = Math.round(target.x / (2 * cw)) * 2 * cw;
      }
      const k = reduce ? 1 : 1 - Math.pow(1 - 0.085, dt);
      const nx = pos.x + (target.x - pos.x) * k;
      velX = nx - pos.x;
      pos.x = nx;
      pos.y += (target.y - pos.y) * k;

      // curve the rows with speed (and strongly during the entrance)
      let intro = 0;
      let lift = 0;
      if (enterRef.current && introStart < 0) introStart = now;
      if (!reduce && introStart >= 0) {
        const t = Math.min((now - introStart) / 1900, 1);
        const e = 1 - Math.pow(1 - t, 3);
        intro = (1 - e) * 1.6;
        lift = 1 - e;
      } else if (!reduce && introStart < 0) {
        lift = 1;
        intro = 1.6;
      }
      const targetBend = reduce ? 0 : Math.max(-1, Math.min(1, velX * 0.018));
      bend += (targetBend - bend) * (1 - Math.pow(0.88, dt));
      const curve = bend + intro;

      if (aspectsRef.current !== knownAspects) {
        knownAspects = aspectsRef.current;
        pool.forEach((t) => (t.key = ""));
      }

      const firstCol = Math.floor((-originX - pos.x) / cw) - 1;
      const firstRow = Math.floor((-originY - pos.y) / ch) - 1;

      const cPair = Math.floor(Math.floor((vw / 2 - originX - pos.x) / cw) / 2);
      if (cPair !== centerPair) {
        centerPair = cPair;
        onCategoryRef.current(order[mod(cPair, order.length)]);
      }

      for (let i = 0; i < cols; i++) {
        const col = firstCol + mod(i - firstCol, cols);
        const sx = originX + col * cw + pos.x;
        const n = (sx + cw / 2 - vw / 2) / (vw / 2);
        const rot = curve * -n * 7;
        const bow = curve * (n * n * 0.55 - n * 0.35) * vh * 0.22;
        for (let j = 0; j < rows; j++) {
          const row = firstRow + mod(j - firstRow, rows);
          const tile = pool[i * rows + j];
          const key = `${col}:${row}`;
          if (tile.key !== key) {
            tile.key = key;
            const { item, pair } = itemAt(col, row);
            tile.pair = pair;
            const src = thumbSrc(item.imgSrc);
            if (tile.img.getAttribute("src") !== src) tile.img.src = src;
            const f = frameFor(knownAspects[item.imgSrc] ?? 0.6, box);
            tile.img.style.width = `${f.w}px`;
            tile.img.style.height = `${f.h}px`;
            tile.el.dataset.src = item.imgSrc;
            tile.el.dataset.index = String(item.id);
            tile.el.style.width = `${cw}px`;
            tile.el.style.height = `${ch}px`;
          }
          tile.el.dataset.focus = String(tile.pair === cPair);
          const sy = originY + row * ch + pos.y + bow + lift * (vh * 0.9 + i * 22);
          tile.el.style.transform = `translate3d(${sx}px, ${sy}px, 0) rotate(${rot}deg)`;
        }
      }
    };
    raf = requestAnimationFrame(frame);

    const onResize = () => {
      const prevCw = cw;
      measure();
      if (pool.length !== cols * rows) build();
      else pool.forEach((t) => (t.key = ""));
      // keep the same category centred
      const scale = cw / prevCw;
      pos.x *= scale;
      target.x *= scale;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      pan.detach();
      window.removeEventListener("resize", onResize);
      stage.replaceChildren();
    };
  }, [order, by]);

  return <div ref={stageRef} className="work-stage" aria-hidden="true" />;
}
