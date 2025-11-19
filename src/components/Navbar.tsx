import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation(); // <-- detect active route

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Shop", path: "/shop" },
    // { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="text-2xl font-black bg-gradient-urban bg-clip-text text-transparent"
          >
            The Art Vader
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-primary underline underline-offset-4 decoration-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link to="/book">
              <Button className="bg-gradient-urban text-primary-foreground font-bold shadow-glow hover:scale-105 transition-transform">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 font-semibold transition-colors ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link to="/book" onClick={() => setIsOpen(false)}>
              <Button className="w-full mt-4 bg-gradient-urban text-primary-foreground font-bold">
                Book Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
