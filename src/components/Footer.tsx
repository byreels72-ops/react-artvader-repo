import { Instagram, Facebook, MessageCircleMore} from "lucide-react";


const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-black bg-gradient-urban bg-clip-text text-transparent mb-4">
              KASHMIR GRAFFITI
            </h3>
            <p className="text-muted-foreground">
              Coloring Kashmir, One Wall at a Time
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="/portfolio" className="hover:text-primary transition-colors">Portfolio</a></li>
              <li><a href="/shop" className="hover:text-primary transition-colors">Shop</a></li>
              {/* <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li> */}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/the_art_vader_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-urban rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-glow"
              >
                <Instagram size={20} className="text-primary-foreground" />
              </a>
              {/* <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-urban rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-glow"
              >
                <Facebook size={20} className="text-primary-foreground" />
              </a> */}
              <a
                href="https://wa.me/7006903188"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-urban rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-glow"
              >
                <MessageCircleMore  size={20} className="text-primary-foreground" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 The Art Vader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
