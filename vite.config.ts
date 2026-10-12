import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Runs /api/book-appointment during `npm run dev` (on Vercel it's a serverless function).
 * Reads server-only secrets (RESEND_API_KEY, BOOKING_*) from .env.local without exposing them
 * to the browser bundle.
 */
function bookingApi(env: Record<string, string>): Plugin {
  return {
    name: "booking-api",
    configureServer(server) {
      server.middlewares.use("/api/book-appointment", async (req, res) => {
        try {
          const { handleBookingRequest } = await server.ssrLoadModule("/api/book-appointment.ts");
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const request = new Request(`http://localhost${req.originalUrl ?? req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
          });
          const response: Response = await handleBookingRequest(request, { ...process.env, ...env });
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (e) {
          console.error(e);
          res.statusCode = 500;
          res.end(JSON.stringify({ errors: [{ message: "Dev API error" }] }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), bookingApi(loadEnv(mode, process.cwd(), "")), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
