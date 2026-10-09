import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-img.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { featuredData, portfolioItems } from "@/data/featuredData";
import { displaySrc, thumbSrc } from "@/data/artworkMedia";
import { ArtworkLightbox } from "@/components/art/ArtworkLightbox";
import { WorkGrid } from "@/components/work/WorkGrid";
import { SlideStrip } from "@/components/work/SlideStrip";
import { CategoryTitle, Intro } from "@/components/work/Intro";
import { categoriesOf, prefersReducedMotion } from "@/components/work/layout";
import { cn } from "@/lib/utils";

const INTRO_KEY = "tav-intro-seen";

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    {[0, 6, 12].flatMap((x) => [0, 6, 12].map((y) => <rect key={`${x}${y}`} x={x} y={y} width="4" height="4" fill="currentColor" />))}
  </svg>
);
const SliderIcon = () => (
  <svg width="26" height="16" viewBox="0 0 26 16" aria-hidden="true">
    <rect x="0" y="0" width="3" height="16" fill="currentColor" opacity="0.5" />
    <rect x="5" y="0" width="16" height="16" fill="currentColor" />
    <rect x="23" y="0" width="3" height="16" fill="currentColor" opacity="0.5" />
  </svg>
);

const Home = () => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [mode, setMode] = useState<"grid" | "slider">("grid");
  const { order, by } = useMemo(() => categoriesOf(portfolioItems), []);
  const [category, setCategory] = useState(order[0]);
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !prefersReducedMotion() && !sessionStorage.getItem(INTRO_KEY);
    } catch {
      return !prefersReducedMotion();
    }
  });
  const [entered, setEntered] = useState(!showIntro);

  // the Work view is a full-screen wall: no page scroll while it is up
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // slider view hangs the work on a dark wall
  useEffect(() => {
    document.documentElement.classList.toggle("is-ink", mode === "slider");
    return () => document.documentElement.classList.remove("is-ink");
  }, [mode]);

  // thumbnail proportions, so each frame on the wall matches its piece
  useEffect(() => {
    if (showIntro) return;
    portfolioItems.forEach((item) => {
      const img = new Image();
      img.onload = () => setAspects((a) => ({ ...a, [item.imgSrc]: img.naturalWidth / img.naturalHeight }));
      img.src = thumbSrc(item.imgSrc);
    });
  }, [showIntro]);

  const count = by.get(category)?.length ?? 0;

  return (
    <div className="page-layer h-[100svh] overflow-hidden">
      <Navbar />

      {/* Hero copy for assistive tech and search; shown visually in the opening screen */}
      <h1 className="sr-only">The Art Vader</h1>
      <p className="sr-only">Coloring Kashmir, One Wall at a Time</p>

      {/* Featured Section */}
      <section aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="sr-only">
          Featured Work
        </h2>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredData.map(({ id, imgSrc, imgAlt }) => (
            <div
              key={id}
              onClick={() => setPreviewImg(imgSrc)}
              className="aspect-square bg-card rounded-lg overflow-hidden shadow-deep hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div> */}

        {/* keyboard / screen-reader access to every piece (the wall itself is pointer-driven) */}
        <ul className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:left-5 focus-within:top-16 focus-within:z-40 focus-within:space-y-1 focus-within:bg-background focus-within:p-4 focus-within:ui-text">
          {portfolioItems.map((item) => (
            <li key={item.id}>
              <button type="button" className="link-line" onClick={() => setPreviewImg(item.imgSrc)}>
                {item.title} — {item.category}
              </button>
            </li>
          ))}
        </ul>

        {mode === "grid" ? (
          <WorkGrid
            items={portfolioItems}
            aspects={aspects}
            onOpen={setPreviewImg}
            onCategory={setCategory}
            enter={entered}
          />
        ) : (
          <SlideStrip items={portfolioItems} onOpen={setPreviewImg} onCategory={setCategory} />
        )}
      </section>

      {/* ---------- bottom bar ---------- */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background/85 to-transparent px-5 pb-5 pt-16 md:bg-none md:px-6 md:pt-0">
        <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-3 md:items-end">
          {/* hero actions + footer links */}
          <div className="ui-text pointer-events-auto order-3 space-y-1 text-center md:order-1 md:text-left">
            <p>
              <Link to="/portfolio" className="link-line">
                View Portfolio
              </Link>
              ,{" "}
              <Link to="/book" className="link-line">
                Book Appointment
              </Link>
            </p>
            <Footer variant="compact" />
          </div>

          {/* category in focus */}
          <div className="order-1 text-center md:order-2">
            <p className="text-[clamp(3rem,6.2vw,5.6rem)] font-bold leading-[0.9] tracking-[-0.06em]">
              <CategoryTitle value={category} />
              <sup className="ml-1 align-top text-[0.2em] font-semibold tracking-normal">({count})</sup>
            </p>
            <p className="ui-text mt-1">/{portfolioItems.length}Works</p>
          </div>

          {/* view switch */}
          <div className="pointer-events-auto order-2 flex items-center gap-4 md:order-3 md:justify-end">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={mode === "grid"}
              onClick={() => setMode("grid")}
              className={cn("p-1 transition-opacity", mode === "grid" ? "opacity-100" : "opacity-35 hover:opacity-70")}
            >
              <GridIcon />
            </button>
            <button
              type="button"
              aria-label="Slider view"
              aria-pressed={mode === "slider"}
              onClick={() => setMode("slider")}
              className={cn("p-1 transition-opacity", mode === "slider" ? "opacity-100" : "opacity-35 hover:opacity-70")}
            >
              <SliderIcon />
            </button>
          </div>
        </div>
      </div>

      {showIntro && (
        <Intro
          image={displaySrc(heroImage)}
          preload={portfolioItems.map((p) => thumbSrc(p.imgSrc))}
          keys={portfolioItems.map((p) => p.imgSrc)}
          onAspects={setAspects}
          onLeave={() => setEntered(true)}
          onDone={() => {
            try {
              sessionStorage.setItem(INTRO_KEY, "1");
            } catch {
              /* private mode */
            }
            setShowIntro(false);
          }}
        />
      )}

      {/* Fullscreen Image Preview */}
      {previewImg && <ArtworkLightbox src={previewImg} onClose={() => setPreviewImg(null)} />}
    </div>
  );
};

export default Home;
