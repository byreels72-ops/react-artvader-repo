import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-img.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { featuredData, portfolioItems } from "@/data/featuredData";
import { X } from "lucide-react";

const Home = () => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-urban bg-clip-text text-transparent drop-shadow-2xl">
            The Art Vader
          </h1>
          <p className="text-2xl md:text-3xl text-foreground mb-8 font-semibold">
            Coloring Kashmir, One Wall at a Time
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/portfolio">
              <Button className="bg-gradient-urban text-primary-foreground px-8 py-6 text-lg font-bold shadow-glow hover:scale-105 transition-transform">
                View Portfolio
              </Button>
            </Link>
            <Link to="/book">
              <Button
                variant="outline"
                className="px-8 py-6 text-lg font-bold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-12 bg-gradient-kashmir bg-clip-text text-transparent">
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

        <div className="text-center mt-12">
          <Link to="/portfolio">
            <Button className="bg-gradient-urban text-primary-foreground px-8 py-4 font-bold hover:scale-105 transition-transform">
              View Full Portfolio
            </Button>
          </Link>
        </div>
      </section>

      <Footer />

      {/* Fullscreen Image Preview */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999]"
          onClick={() => setPreviewImg(null)}
        >
          <button
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-2 rounded-full"
            onClick={() => setPreviewImg(null)}
          >
            <X className="text-white" size={32} />
          </button>

          <img
            src={previewImg}
            alt="Preview"
            className="max-w-[95vw] max-h-[90vh] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default Home;
