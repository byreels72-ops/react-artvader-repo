import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Site-wide motion plumbing, rendered once inside the router:
 *  - scroll reveals for any [data-reveal] element (masked text, images, fades)
 *  - the crosshair cursor on fine-pointer devices
 *  - an ink curtain that lifts off the new page on route change
 *  - start each new page at the top (back/forward keeps the browser's position)
 */
export function SiteChrome() {
  useRevealObserver();
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useLayoutEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    else if (navType !== "POP") window.scrollTo(0, 0);
  }, [pathname, hash, navType]);

  return (
    <>
      <Curtain pathname={pathname} />
      <Cursor />
    </>
  );
}

function useRevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const canAnimate = () => !reducedMotion() && "IntersectionObserver" in window;
    root.classList.toggle("motion-ok", canAnimate());

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (e.isIntersecting || e.boundingClientRect.top < 0) {
                  e.target.classList.add("is-in");
                  io?.unobserve(e.target);
                }
              }
            },
            { rootMargin: "0px 0px -6% 0px" },
          )
        : null;

    const seen = new WeakSet<Element>();
    const scan = () =>
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (io) io.observe(el);
        else el.classList.add("is-in");
      });

    let pending = 0;
    const mo = new MutationObserver(() => {
      if (!pending) pending = requestAnimationFrame(() => ((pending = 0), scan()));
    });
    mo.observe(document.getElementById("root") ?? document.body, { childList: true, subtree: true });
    scan();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPref = () => root.classList.toggle("motion-ok", canAnimate());
    mq.addEventListener("change", onPref);

    return () => {
      io?.disconnect();
      mo.disconnect();
      cancelAnimationFrame(pending);
      mq.removeEventListener("change", onPref);
    };
  }, []);
}

function Curtain({ pathname }: { pathname: string }) {
  const first = useRef(true);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setRun((r) => r + 1);
  }, [pathname]);
  if (!run) return null;
  return <div key={run} className="curtain is-running" aria-hidden="true" onAnimationEnd={() => setRun(0)} />;
}

/** A fine crosshair that trails the pointer; shows "View" over artwork, shrinks over links. */
function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    document.documentElement.classList.add("has-cursor");
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cur = { ...pos };
    let raf = 0;
    let visible = false;

    const tick = () => {
      const k = reducedMotion() ? 1 : 0.28;
      cur.x += (pos.x - cur.x) * k;
      cur.y += (pos.y - cur.y) * k;
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
      const t = e.target as Element | null;
      const view = !!t?.closest?.('[data-cursor="view"]');
      el.classList.toggle("is-view", view);
      el.classList.toggle("is-link", !view && !!t?.closest?.("a, button, [role='button'], input, textarea, select, label"));
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className="cursor" style={{ opacity: 0 }} aria-hidden="true">
      <div className="cursor__cross" />
      <div className="cursor__label">View</div>
    </div>
  );
}
