import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

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
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-5xl md:text-6xl font-black mb-8 text-center bg-gradient-urban bg-clip-text text-transparent animate-fade-in">
          Get in Touch
        </h1>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto animate-fade-in">
          Have a project in mind? Want to commission a mural? Let's talk!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-muted border-border"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-muted border-border"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-muted border-border min-h-32"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-urban text-primary-foreground font-bold py-6 text-lg shadow-glow hover:scale-105 transition-transform"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8 animate-fade-in">
            <div className="bg-card p-6 rounded-lg border border-border shadow-deep">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-primary mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-muted-foreground">info@kashmirgraffiti.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="text-secondary mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-accent mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Location</h3>
                    <p className="text-muted-foreground">Srinagar, Kashmir, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center border border-border">
              <MapPin size={48} className="text-primary" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
