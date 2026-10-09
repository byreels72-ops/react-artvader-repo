"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SplitText } from "@/components/site/SplitText";
import { whatsappUrl } from "@/data/contact";

export default function BookAppointment() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    artworkType: "",
    date: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const microsoftEmailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.(?:[a-zA-Z]{2,})$/;

  const phoneRegex = /^[6-9]\d{9}$/;

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "name") {
      if (value.trim().length < 2) {
        error = "Name must be at least 2 characters.";
      }
    }

    if (name === "email") {
      if (!microsoftEmailRegex.test(value)) {
        error = "Invalid email format.";
      }
    }

    if (name === "phone") {
      if (!phoneRegex.test(value)) {
        error = "Phone number must be a valid 10-digit mobile number.";
      }
    }

    if (name === "message") {
      if (value.trim().length < 20) {
        error = "Project details must be at least 20 characters.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value); // Real-time validation
  };

  // For Select component
  const handleArtworkTypeChange = (value: string) => {
    setForm((prev) => ({ ...prev, artworkType: value }));
  };

  // For date input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, date: e.target.value }));
  };

  // Disable button if any validation error or missing fields
  const isSubmitDisabled =
    !form.name ||
    !form.email ||
    !form.phone ||
    !form.artworkType ||
    !form.date ||
    !form.message ||
    errors.name !== "" ||
    errors.email !== "" ||
    errors.phone !== "" ||
    errors.message !== "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitDisabled || sending) return;

    const data = new FormData(e.currentTarget);
    Object.entries(form).forEach(([key, value]) => {
      data.set(key, value);
    });

    setSending(true);
    setSubmitError("");
    try {
      // emailed to the artist through Resend (see server/booking.ts)
      const response = await fetch("/api/book-appointment", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      const result = await response.json().catch(() => ({}));

      // server-side validation error (ex: email)
      if (!response.ok) {
        if (result?.errors?.[0]?.field === "email") {
          setErrors((prev) => ({
            ...prev,
            email: result.errors[0].message || "Invalid email",
          }));
        } else {
          setSubmitError(result?.errors?.[0]?.message || "Could not send your request. Please try again.");
        }
        return;
      }

      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        artworkType: "",
        date: "",
        message: "",
        phone: "",
      });
    } catch (err) {
      console.error("Form error:", err);
      setSubmitError("Could not send your request. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen page-layer">
      <Navbar />

      <main className="grid grid-cols-1 gap-12 px-5 pt-36 md:grid-cols-12 md:gap-6 md:px-6 md:pt-44">
        <div className="md:col-span-5">
          <SplitText as="h1" text="Book an Appointment" className="display-md max-w-[10ch] md:sticky md:top-32" />
        </div>
        <div className="md:col-span-6 md:col-start-7">

        <div
          role="note"
          data-reveal="fade"
          className="ui-text mb-12 border-t border-foreground pt-3"
        >
          <p className="text-muted-foreground">Note</p>
          <p className="mt-2 max-w-md text-lg">
            Our email service is under maintenance for now, so requests sent through this form may be
            delayed. For a quicker reply, message us on{" "}
            <a
              href={whatsappUrl("Hi! I'd like to book an appointment.")}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line"
            >
              WhatsApp
            </a>
            .
          </p>
        </div>

        {submitted && (
          <p
            role="status"
            className="ui-text mb-8 border-t border-foreground pt-3 text-lg animate-fade-in"
          >
            Appointment request sent successfully!
          </p>
        )}

        <div data-reveal="fade">
          <form
            onSubmit={handleSubmit}
            className="space-y-9"
          >
            {/* spam trap: hidden from people, bots fill it in */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="ui-text block text-muted-foreground mb-1"
              >
                Name *
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="field-line"
                required
              />
              {errors.name && (
                <p id="name-error" className="text-destructive text-sm mt-2">{errors.name}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="ui-text block text-muted-foreground mb-1"
              >
                Your Phone Number *
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className="field-line"
                required
              />
              {errors.phone && (
                <p id="phone-error" className="text-destructive text-sm mt-2">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="ui-text block text-muted-foreground mb-1"
              >
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="field-line"
                required
              />
              {errors.email && (
                <p id="email-error" className="text-destructive text-sm mt-2">{errors.email}</p>
              )}
            </div>

            {/* Artwork Type */}
            <div>
              <label id="artworkType-label" className="ui-text block text-muted-foreground mb-1">
                Type of Artwork *
              </label>
              <Select
                value={form.artworkType}
                onValueChange={handleArtworkTypeChange}
                required
              >
                <SelectTrigger aria-labelledby="artworkType-label" className="field-line">
                  <SelectValue placeholder="Select artwork type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wall-mural">Wall Mural</SelectItem>
                  <SelectItem value="canvas">Canvas Art</SelectItem>
                  <SelectItem value="custom-design">Custom Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="ui-text block text-muted-foreground mb-1"
              >
                Desired Date *
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleDateChange}
                className="field-line"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="ui-text block text-muted-foreground mb-1"
              >
                Project Details *
              </label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "message-error" : undefined}
                className="field-line min-h-32 resize-y"
                required
              />
              {errors.message && (
                <p id="message-error" className="text-destructive text-sm mt-2">{errors.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitDisabled || sending}
              aria-busy={sending}
              variant="ink"
              className="h-auto w-full rounded-full px-8 py-4 text-base disabled:opacity-30 disabled:cursor-not-allowed md:w-auto"
            >
              {sending ? "Sending…" : "Submit Appointment"}
            </Button>

            {submitError && (
              <p role="alert" className="text-destructive text-sm">
                {submitError}
              </p>
            )}
          </form>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
