/**
 * Appointment requests → email via Resend (https://resend.com).
 *
 * Runs server-side only (Vercel function in production, Vite middleware in dev), so the
 * Resend API key never reaches the browser.
 *
 * Environment:
 *   RESEND_API_KEY             required — from resend.com/api-keys
 *   BOOKING_TO_EMAIL           required — inbox that receives requests. Until a domain is verified
 *                              in Resend this MUST be the email address of the Resend account.
 *   BOOKING_FROM_EMAIL         optional — sender, default "The Art Vader <onboarding@resend.dev>".
 *                              Use an address on your verified domain once you have one.
 *   BOOKING_SEND_CONFIRMATION  optional — "true" to also email the customer a confirmation
 *                              (needs a verified domain; doubles emails used per booking).
 *   RESEND_API_URL             optional — override the API base (used by tests).
 */

export type Env = Record<string, string | undefined>;

export type Booking = {
  name: string;
  email: string;
  phone: string;
  artworkType: string;
  date: string;
  message: string;
};

type FieldError = { field?: keyof Booking; message: string };

// Same rules as the form on /book
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.(?:[a-zA-Z]{2,})$/;
const phoneRegex = /^[6-9]\d{9}$/;
const artworkTypes: Record<string, string> = {
  "wall-mural": "Wall Mural",
  canvas: "Canvas Art",
  "custom-design": "Custom Design",
};

export function validateBooking(input: Record<string, unknown>): { data?: Booking; errors: FieldError[] } {
  const str = (k: string, max: number) => String(input[k] ?? "").trim().slice(0, max);
  const data: Booking = {
    name: str("name", 120),
    email: str("email", 254),
    phone: str("phone", 20),
    artworkType: str("artworkType", 40),
    date: str("date", 10),
    message: str("message", 5000),
  };
  const errors: FieldError[] = [];
  if (data.name.length < 2) errors.push({ field: "name", message: "Name must be at least 2 characters." });
  if (!emailRegex.test(data.email)) errors.push({ field: "email", message: "Invalid email format." });
  if (!phoneRegex.test(data.phone))
    errors.push({ field: "phone", message: "Phone number must be a valid 10-digit mobile number." });
  if (!artworkTypes[data.artworkType]) errors.push({ field: "artworkType", message: "Please choose a type of artwork." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)))
    errors.push({ field: "date", message: "Please choose a valid date." });
  if (data.message.length < 20) errors.push({ field: "message", message: "Project details must be at least 20 characters." });
  return errors.length ? { errors } : { data, errors };
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function prettyDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function ownerEmail(b: Booking) {
  const type = artworkTypes[b.artworkType];
  const rows: [string, string][] = [
    ["Name", b.name],
    ["Phone", b.phone],
    ["Email", b.email],
    ["Type of artwork", type],
    ["Desired date", prettyDate(b.date)],
  ];
  const subject = `New appointment request — ${type} — ${b.name}`;
  const html = `<!doctype html><html><body style="margin:0;background:#f1efe7;font-family:Helvetica,Arial,sans-serif;color:#252726">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
  <p style="font-size:13px;margin:0 0 24px;color:#6f6e69">The Art Vader — Book an Appointment</p>
  <h1 style="font-size:28px;line-height:1.1;letter-spacing:-0.03em;margin:0 0 24px">New appointment request</h1>
  <table style="width:100%;border-collapse:collapse;font-size:15px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:10px 0;border-top:1px solid #d4d1c7;color:#6f6e69;width:40%">${k}</td><td style="padding:10px 0;border-top:1px solid #d4d1c7;font-weight:600">${escape(v)}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="font-size:13px;color:#6f6e69;margin:28px 0 8px">Project details</p>
  <p style="font-size:15px;line-height:1.5;margin:0;white-space:pre-wrap">${escape(b.message)}</p>
  <p style="font-size:13px;color:#6f6e69;margin:32px 0 0">Reply to this email to answer ${escape(b.name)} directly.</p>
</div></body></html>`;
  const text = [
    "New appointment request",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Project details:",
    b.message,
    "",
    `Reply to this email to answer ${b.name} directly.`,
  ].join("\n");
  return { subject, html, text };
}

export function customerEmail(b: Booking) {
  const subject = "We received your appointment request — The Art Vader";
  const text = `Hi ${b.name},\n\nThanks for your request for a ${artworkTypes[b.artworkType]} on ${prettyDate(b.date)}. We'll get back to you soon.\n\n— The Art Vader`;
  const html = `<!doctype html><html><body style="margin:0;background:#f1efe7;font-family:Helvetica,Arial,sans-serif;color:#252726">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;font-size:15px;line-height:1.5">
  <h1 style="font-size:28px;line-height:1.1;letter-spacing:-0.03em;margin:0 0 20px">Thank you, ${escape(b.name)}.</h1>
  <p>We received your request for a <strong>${escape(artworkTypes[b.artworkType])}</strong> on <strong>${escape(prettyDate(b.date))}</strong>. We'll get back to you soon.</p>
  <p style="color:#6f6e69">— The Art Vader</p>
</div></body></html>`;
  return { subject, html, text };
}

async function sendEmail(env: Env, payload: Record<string, unknown>) {
  const base = env.RESEND_API_URL || "https://api.resend.com";
  const res = await fetch(`${base}/emails`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body.message ?? body.name ?? "unknown error"}`);
  return body.id;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

/** POST handler shared by the Vercel function and the dev server. Response shape matches what the form expects. */
export async function handleBookingRequest(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json(405, { errors: [{ message: "Method not allowed" }] });

  let input: Record<string, unknown>;
  try {
    const type = request.headers.get("content-type") || "";
    input = type.includes("application/json")
      ? ((await request.json()) as Record<string, unknown>)
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return json(400, { errors: [{ message: "Invalid request body" }] });
  }

  // honeypot: real visitors never see or fill this field
  if (String(input.company ?? "").trim()) return json(200, { ok: true });

  const { data, errors } = validateBooking(input);
  if (!data) return json(422, { errors });

  if (!env.RESEND_API_KEY || !env.BOOKING_TO_EMAIL) {
    console.error("Booking email not configured: set RESEND_API_KEY and BOOKING_TO_EMAIL");
    return json(500, { errors: [{ message: "Booking service is not configured." }] });
  }

  const from = env.BOOKING_FROM_EMAIL || "The Art Vader <onboarding@resend.dev>";
  try {
    const owner = ownerEmail(data);
    const id = await sendEmail(env, {
      from,
      to: env.BOOKING_TO_EMAIL.split(",").map((s) => s.trim()),
      reply_to: data.email,
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
    });

    if (env.BOOKING_SEND_CONFIRMATION === "true") {
      const c = customerEmail(data);
      // a failed confirmation must not fail the booking itself
      await sendEmail(env, { from, to: [data.email], subject: c.subject, html: c.html, text: c.text }).catch((e) =>
        console.error("Confirmation email failed:", e),
      );
    }
    return json(200, { ok: true, id });
  } catch (e) {
    console.error("Booking email failed:", e);
    return json(502, { errors: [{ message: "Could not send your request. Please try again." }] });
  }
}
