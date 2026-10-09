import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SplitText } from "@/components/site/SplitText";

export default function Shop() {
  return (
    <div className="min-h-screen flex flex-col page-layer">
      <Navbar />

      {/* Coming Soon Section */}
      <main className="flex flex-1 flex-col justify-end px-5 pt-36 md:px-6">
        <SplitText as="h1" text="Coming Soon" className="display-xl" />
        <p data-reveal="fade" className="ui-text mt-6 text-muted-foreground">
          Our shop will be live shortly. Stay tuned!
        </p>
      </main>

      <Footer />
    </div>
  );
}
