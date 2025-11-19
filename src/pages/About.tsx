import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import artistImage from "@/assets/hero-img.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-5xl md:text-6xl font-black mb-12 text-center bg-gradient-urban bg-clip-text text-transparent animate-fade-in">
          About the Artist
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in">
            <img
              src={artistImage}
              alt="Kashmir Graffiti Artist"
              className="w-full rounded-lg shadow-deep"
            />
          </div>

          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-primary">The Journey</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Born and raised in the beautiful valleys of Kashmir, I discovered my passion for graffiti art 
              at a young age. The vibrant culture, stunning landscapes, and rich heritage of Kashmir have 
              always been my greatest inspiration.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My work is a fusion of traditional Kashmiri elements with contemporary street art aesthetics. 
              Each piece tells a story - whether it's the majestic mountains, the iconic chinar leaves, or 
              the warm spirit of the Kashmiri people.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Through spray paint and bold colors, I aim to transform urban spaces into canvases that 
              celebrate our cultural identity while embracing the raw energy of street art culture.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          <div className="bg-card p-8 rounded-lg border border-border shadow-deep">
            <h3 className="text-2xl font-bold text-primary mb-4">Artistic Style</h3>
            <p className="text-muted-foreground">
              Bold, expressive graffiti with vibrant Kashmir-inspired colors. Each piece combines 
              spray-paint techniques with cultural storytelling.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border shadow-deep">
            <h3 className="text-2xl font-bold text-secondary mb-4">Inspiration</h3>
            <p className="text-muted-foreground">
              Kashmir's natural beauty, traditional patterns, street culture, and the vibrant 
              stories of everyday life in the valley.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border shadow-deep">
            <h3 className="text-2xl font-bold text-accent mb-4">Mission</h3>
            <p className="text-muted-foreground">
              To bring art to the streets, color Kashmir's urban spaces, and create murals that 
              inspire and connect communities.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
