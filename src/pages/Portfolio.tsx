import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { portfolioItems } from "@/data/featuredData";
import { X } from "lucide-react";

const Portfolio = () => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-5xl md:text-6xl font-black mb-8 text-center bg-gradient-urban bg-clip-text text-transparent animate-fade-in">
          Portfolio
        </h1>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto animate-fade-in">
          Explore my collection of graffiti art across Kashmir - from massive wall murals to canvas pieces and street art.
        </p>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setPreviewImg(item.imgSrc)}
              className="group relative overflow-hidden rounded-lg shadow-deep hover:shadow-glow transition-all duration-300 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={item.imgSrc}
                alt={item.title}
                className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-foreground">{item.story}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      {/* Fullscreen Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center"
          onClick={() => setPreviewImg(null)}
        >
          <button
            onClick={() => setPreviewImg(null)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-2 rounded-full"
          >
            <X size={32} className="text-white" />
          </button>

          <img
            src={previewImg}
            alt="Preview"
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default Portfolio;
