export type Artwork = { id: number; imgSrc: string; title: string; category: string; story: string };

export const mod = (n: number, m: number) => ((n % m) + m) % m;

export function categoriesOf(items: Artwork[]) {
  const order: string[] = [];
  const by = new Map<string, Artwork[]>();
  for (const it of items) {
    if (!by.has(it.category)) {
      by.set(it.category, []);
      order.push(it.category);
    }
    by.get(it.category)!.push(it);
  }
  return { order, by };
}

/** Thumbnail frame for an image aspect: tall, wide or square inside a `box`-sized square. */
export function frameFor(aspect: number, box: number) {
  if (aspect < 0.85) return { w: Math.round(box * 0.64), h: box };
  if (aspect > 1.18) return { w: box, h: Math.round(box * 0.64) };
  return { w: Math.round(box * 0.8), h: Math.round(box * 0.8) };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Shared pan input: wheel, drag/touch with inertia, arrow keys. Writes into `target`. */
export function attachPan(
  el: HTMLElement,
  target: { x: number; y: number },
  opts: {
    axis: "x" | "xy";
    onTap: (tile: Element | null) => void;
    onInput: () => void;
    keyStep: { x: number; y: number };
  },
) {
  let down = false;
  let moved = 0;
  let start = { px: 0, py: 0, tx: 0, ty: 0 };
  let last = { x: 0, y: 0, t: 0 };
  let vel = { x: 0, y: 0 };
  let pressedTile: Element | null = null;

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    target.x -= d * (e.deltaMode === 1 ? 32 : 1);
    opts.onInput();
  };
  const onDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    down = true;
    moved = 0;
    pressedTile = (e.target as Element).closest("[data-index]");
    start = { px: e.clientX, py: e.clientY, tx: target.x, ty: target.y };
    last = { x: e.clientX, y: e.clientY, t: performance.now() };
    vel = { x: 0, y: 0 };
    el.setPointerCapture(e.pointerId);
    opts.onInput();
  };
  const onMove = (e: PointerEvent) => {
    if (!down) return;
    const dx = e.clientX - start.px;
    const dy = e.clientY - start.py;
    moved = Math.max(moved, Math.hypot(dx, dy));
    const k = e.pointerType === "touch" ? 1.6 : 1.3;
    target.x = start.tx + dx * k;
    if (opts.axis === "xy") target.y = start.ty + dy * k;
    const now = performance.now();
    const dt = Math.max(now - last.t, 1);
    vel = { x: ((e.clientX - last.x) / dt) * 16, y: ((e.clientY - last.y) / dt) * 16 };
    last = { x: e.clientX, y: e.clientY, t: now };
    opts.onInput();
  };
  const onUp = (e: PointerEvent) => {
    if (!down) return;
    down = false;
    el.releasePointerCapture?.(e.pointerId);
    if (moved < 6) {
      opts.onTap(pressedTile);
      return;
    }
    // inertia: carry on in the direction of the throw
    target.x += vel.x * 14;
    if (opts.axis === "xy") target.y += vel.y * 14;
    opts.onInput();
  };
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (t && (t.closest("input, textarea, select, [role='dialog']") || t.isContentEditable)) return;
    if (document.querySelector("[role='dialog']")) return;
    const map: Record<string, [number, number]> = {
      ArrowLeft: [opts.keyStep.x, 0],
      ArrowRight: [-opts.keyStep.x, 0],
      ArrowUp: [0, opts.keyStep.y],
      ArrowDown: [0, -opts.keyStep.y],
    };
    const m = map[e.key];
    if (!m) return;
    if (opts.axis === "x" && m[0] === 0) return;
    e.preventDefault();
    target.x += m[0];
    target.y += m[1];
    opts.onInput();
  };

  el.addEventListener("wheel", onWheel, { passive: false });
  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onUp);
  window.addEventListener("keydown", onKey);
  return {
    isDown: () => down,
    detach: () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey);
    },
  };
}
