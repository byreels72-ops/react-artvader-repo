import { useEffect, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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

  // close the mobile menu with Escape and lock page scroll while it is open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      {/* white + difference blend reads as ink on paper and as paper on photos / dark mode */}
      <nav className="pointer-events-none fixed left-0 right-0 top-0 z-50 text-white mix-blend-difference">
        <div className="flex items-start justify-between px-5 pt-5 md:px-6">
          <Link to="/" className="pointer-events-auto text-[1.45rem] font-bold leading-none tracking-[-0.06em]">
            The Art Vader
          </Link>

          {/* Desktop Navigation */}
          <div className="ui-text pointer-events-auto hidden items-center md:flex">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.path;
              return (
                <span key={link.path}>
                  <Link to={link.path} aria-current={isActive ? "page" : undefined} className="link-line">
                    {link.name}
                  </Link>
                  {i < navLinks.length - 1 && <span aria-hidden="true">,&nbsp;</span>}
                </span>
              );
            })}
            <span aria-hidden="true" className="mx-3 h-3 w-px bg-current opacity-50" />
            <Link to="/book" aria-current={pathname === "/book" ? "page" : undefined} className="link-line">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="ui-text link-line pointer-events-auto md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="lightbox fixed inset-0 z-[45] flex flex-col justify-end bg-background px-5 pb-10 pt-24 md:hidden"
        >
          <ul className="space-y-1">
            {[...navLinks, { name: "Book Now", path: "/book" }].map((link, i) => {
              const isActive = pathname === link.path;
              return (
                <li key={link.path} className="overflow-hidden">
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "rise block text-[15vw] font-bold leading-[0.95] tracking-[-0.06em]",
                      !isActive && "text-foreground/40",
                    )}
                  >
                    <span style={{ "--d": `${120 + i * 70}ms` } as CSSProperties}>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
