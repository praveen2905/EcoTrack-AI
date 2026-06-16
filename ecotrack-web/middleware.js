/**
 * @module middleware
 * @description Next.js middleware for global rate limiting of API routes.
 * Runs on the edge to block spam/abuse before routing requests to handlers.
 */

import { NextResponse } from "next/server";

/**
 * In-memory map to track request counts per IP.
 * @type {Map<string, { count: number, resetTime: number }>}
 */
const rateLimitMap = new Map();

/**
 * Prunes expired entries from the rate-limiting map to prevent memory leaks.
 */
function pruneRateLimitMap() {
  const now = Date.now();
  if (rateLimitMap.size > 1000) {
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }
}

/**
 * Middleware handler to check and enforce rate limits on API requests.
 *
 * @param {import('next/server').NextRequest} request - Incoming request object.
 * @returns {NextResponse} Response object or Next response.
 */
export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    pruneRateLimitMap();

    const ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    let rateData = rateLimitMap.get(ip);

    if (!rateData || now > rateData.resetTime) {
      rateData = {
        count: 0,
        resetTime: now + 60000, // 1 minute window
      };
    }

    rateData.count += 1;
    rateLimitMap.set(ip, rateData);

    const LIMIT = 100; // 100 requests per minute

    if (rateData.count > LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again in a minute." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
