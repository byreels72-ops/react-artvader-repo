import { Instagram, Facebook, MessageCircleMore} from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/data/contact";

const social = [
  { name: "Instagram", href: "https://www.instagram.com/the_art_vader_", Icon: Instagram },
  // { name: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { name: "WhatsApp", href: whatsappUrl(), Icon: MessageCircleMore },
];

/**
 * `full` — the regular footer on scrolling pages.
 * `compact` — a single line pinned in the corner of the full-screen Work view, same links.
 */
const Footer = ({ variant = "full", className }: { variant?: "full" | "compact"; className?: string }) => {
  if (variant === "compact") {
    return (
      <footer className={cn("ui-text text-muted-foreground", className)}>
        {social.map(({ name, href }, i) => (
          <span key={name}>
            <a href={href} target="_blank" rel="noopener noreferrer" className="link-line text-foreground">
              {name}
            </a>
            {i < social.length - 1 && ", "}
          </span>
        ))}
        <span className="mx-2" aria-hidden="true">
          —
        </span>
        <span>&copy; 2025 The Art Vader</span>
      </footer>
    );
  }

  return (
    <footer className={cn("px-5 pb-6 pt-28 md:px-6", className)}>
      <div className="grid grid-cols-1 gap-10 border-t border-foreground/80 pt-6 md:grid-cols-12" data-reveal="fade">
        <div className="md:col-span-5">
          <h3 className="text-3xl md:text-4xl">
            KASHMIR GRAFFITI
          </h3>
          <p className="ui-text mt-3 text-muted-foreground">
            Coloring Kashmir, One Wall at a Time
          </p>
        </div>

        <div className="ui-text md:col-span-3">
          <h4 className="mb-3 text-muted-foreground">Quick Links</h4>
          <ul className="space-y-1.5">
            <li><a href="/about" className="link-line">About</a></li>
            <li><a href="/portfolio" className="link-line">Portfolio</a></li>
            <li><a href="/shop" className="link-line">Shop</a></li>
            {/* <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li> */}
          </ul>
        </div>

        <div className="ui-text md:col-span-4">
          <h4 className="mb-3 text-muted-foreground">Follow Us</h4>
          <ul className="space-y-1.5">
            {social.map(({ name, href, Icon }) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-2">
                  <Icon size={16} aria-hidden="true" />
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ui-text mt-16 text-muted-foreground">
        <p>&copy; 2025 The Art Vader. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
