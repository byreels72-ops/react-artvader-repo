import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import { SplitText } from "@/components/site/SplitText";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon!",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen page-layer">
      <Navbar />
      
      <main className="px-5 pt-36 md:px-6 md:pt-44">
        <SplitText as="h1" text="Get in Touch" className="display-lg" />
        <p data-reveal="fade" className="ui-text mt-6 mb-16 max-w-md text-muted-foreground md:mb-24">
          Have a project in mind? Want to commission a mural? Let's talk!
        </p>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-6">
          {/* Contact Form */}
          <div data-reveal="fade" className="lg:col-span-6">
            <form onSubmit={handleSubmit} className="space-y-9">
              <div>
                <label htmlFor="name" className="ui-text block text-muted-foreground mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="field-line"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="ui-text block text-muted-foreground mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="field-line"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="ui-text block text-muted-foreground mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="field-line min-h-32 resize-y"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button
                type="submit"
                variant="ink"
                className="h-auto w-full rounded-full px-8 py-4 text-base md:w-auto"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8 lg:col-span-5 lg:col-start-8" data-reveal="fade" style={{ "--d": "120ms" } as React.CSSProperties}>
            <div className="border-t border-foreground pt-4">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="mt-1" size={20} strokeWidth={1.5} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-muted-foreground">info@kashmirgraffiti.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="mt-1" size={20} strokeWidth={1.5} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="mt-1" size={20} strokeWidth={1.5} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Location</h3>
                    <p className="text-muted-foreground">Srinagar, Kashmir, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-secondary h-64 flex items-center justify-center">
              <MapPin size={40} strokeWidth={1.5} className="text-foreground" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
