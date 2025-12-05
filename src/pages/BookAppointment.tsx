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

    if (isSubmitDisabled) return;

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch(
        `https://formspree.io/f/${import.meta.env.VITE_FORM_KEY}`,
        {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        }
      );

      const result = await response.json();

      // Formspree validation error (ex: TYPE_EMAIL)
      if (!response.ok) {
        if (result?.errors?.[0]?.field === "email") {
          setErrors((prev) => ({
            ...prev,
            email: result.errors[0].message || "Invalid email",
          }));
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
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-5xl md:text-6xl font-black mb-8 text-center bg-gradient-urban bg-clip-text text-transparent">
          Book an Appointment
        </h1>

        {submitted && (
          <p className="text-center text-green-500 text-lg mb-6 font-semibold animate-fade-in">
            Appointment request sent successfully!
          </p>
        )}

        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-card p-8 rounded-lg border border-border shadow-deep"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-2"
              >
                Name *
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="bg-muted border-border"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold mb-2"
              >
                Your Phone Number *
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="bg-muted border-border"
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="bg-muted border-border"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Artwork Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Type of Artwork *
              </label>
              <Select
                value={form.artworkType}
                onValueChange={handleArtworkTypeChange}
                required
              >
                <SelectTrigger className="bg-muted border-border">
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
                className="block text-sm font-semibold mb-2"
              >
                Desired Date *
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleDateChange}
                className="bg-muted border-border"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold mb-2"
              >
                Project Details *
              </label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                className="bg-muted border-border min-h-32"
                required
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full bg-gradient-urban text-primary-foreground font-bold py-6 text-lg shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Appointment
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
