import { useState, type CSSProperties, type KeyboardEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { portfolioItems } from "@/data/featuredData";
import { displaySrc } from "@/data/artworkMedia";
import { ArtworkLightbox } from "@/components/art/ArtworkLightbox";
import { SplitText } from "@/components/site/SplitText";

const Portfolio = () => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  return (
    <div className="min-h-screen page-layer">
      <Navbar />

      <main className="px-5 pt-36 md:px-6 md:pt-44">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <SplitText as="h1" text="Portfolio" className="display-lg md:col-span-8">
            <sup className="ml-2 align-top text-[0.16em] font-semibold tracking-normal">({portfolioItems.length})</sup>
          </SplitText>
          <p data-reveal="fade" className="ui-text max-w-sm text-muted-foreground md:col-span-4 md:pb-3">
            Explore my collection of graffiti art across Kashmir - from massive wall murals to canvas pieces and street art.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
          {portfolioItems.map((item, index) => {
            const open = () => setPreviewImg(item.imgSrc);
            const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
              }
            };
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                aria-label={`${item.title} — open preview`}
                onClick={open}
                onKeyDown={onKeyDown}
                data-cursor="view"
                className="group block text-left"
              >
                <div
                  data-reveal="image"
                  style={{ "--d": `${(index % 3) * 90}ms` } as CSSProperties}
                  className="aspect-[4/5] overflow-hidden bg-secondary"
                >
                  <img
                    src={displaySrc(item.imgSrc)}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="ui-text mt-3 grid grid-cols-[2.5rem_1fr_auto] gap-x-2">
                  <span className="text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="text-[0.9375rem] tracking-[-0.01em]">
                    <span className="link-line">{item.title}</span>
                  </h3>
                  <span className="text-muted-foreground">{item.category}</span>
                  <p className="col-start-2 col-end-4 mt-2 max-w-sm font-medium text-muted-foreground">{item.story}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />

      {/* Fullscreen Preview Modal */}
      {previewImg && <ArtworkLightbox src={previewImg} onClose={() => setPreviewImg(null)} />}
    </div>
  );
};

export default Portfolio;
