import { handleBookingRequest } from "../server/booking";

/** Vercel serverless function: POST /api/book-appointment */
export function POST(request: Request) {
  return handleBookingRequest(request, process.env);
}
