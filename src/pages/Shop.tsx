import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Shop() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Coming Soon Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-urban bg-clip-text text-transparent text-center">
          Coming Soon
        </h1>
        <p className="text-muted-foreground text-lg text-center">
          Our shop will be live shortly. Stay tuned!
        </p>
      </main>

      <Footer />
    </div>
  );
}
