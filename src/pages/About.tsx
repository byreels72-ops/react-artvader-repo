import type { CSSProperties } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import artistImage from "@/assets/hero-img.jpg";
import { displaySrc } from "@/data/artworkMedia";
import { SplitText } from "@/components/site/SplitText";

const About = () => {
  const cards = [
    {
      title: "Artistic Style",
      body: "Bold, expressive graffiti with vibrant Kashmir-inspired colors. Each piece combines spray-paint techniques with cultural storytelling.",
    },
    {
      title: "Inspiration",
      body: "Kashmir's natural beauty, traditional patterns, street culture, and the vibrant stories of everyday life in the valley.",
    },
    {
      title: "Mission",
      body: "To bring art to the streets, color Kashmir's urban spaces, and create murals that inspire and connect communities.",
    },
  ];

  return (
    <div className="min-h-screen page-layer">
      <Navbar />

      <main className="px-5 pt-36 md:px-6 md:pt-44">
        <SplitText as="h1" text="About the Artist" className="display-lg max-w-[12ch]" />

        <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5" data-reveal="image">
            <img
              src={displaySrc(artistImage)}
              alt="Kashmir Graffiti Artist"
              decoding="async"
              className="w-full"
            />
          </div>

          <div className="md:col-span-6 md:col-start-7 md:pt-2">
            <SplitText as="h2" text="The Journey" className="ui-text mb-8 text-muted-foreground" />
            <div className="space-y-6 text-[1.35rem] font-medium leading-[1.3] tracking-[-0.02em] md:text-[1.6rem]">
              <p data-reveal="fade">
                Born and raised in the beautiful valleys of Kashmir, I discovered my passion for graffiti art
                at a young age. The vibrant culture, stunning landscapes, and rich heritage of Kashmir have
                always been my greatest inspiration.
              </p>
              <p data-reveal="fade" style={{ "--d": "80ms" } as CSSProperties}>
                My work is a fusion of traditional Kashmiri elements with contemporary street art aesthetics.
                Each piece tells a story - whether it's the majestic mountains, the iconic chinar leaves, or
                the warm spirit of the Kashmiri people.
              </p>
              <p data-reveal="fade" style={{ "--d": "160ms" } as CSSProperties}>
                Through spray paint and bold colors, I aim to transform urban spaces into canvases that
                celebrate our cultural identity while embracing the raw energy of street art culture.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-28 grid grid-cols-1 gap-10 md:mt-40 md:grid-cols-3 md:gap-6">
          {cards.map((card, i) => (
            <div
              key={card.title}
              data-reveal="fade"
              style={{ "--d": `${i * 100}ms` } as CSSProperties}
              className="border-t border-foreground/80 pt-4"
            >
              <p className="ui-text mb-10 text-muted-foreground">({String(i + 1).padStart(2, "0")})</p>
              <h3 className="mb-4 text-4xl md:text-5xl">{card.title}</h3>
              <p className="ui-text max-w-sm text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
