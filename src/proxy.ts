import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Restrict Clerk middleware to routes that require authentication.
// Keep a fairly broad matcher for pages and API paths that should be protected.
export const config = {
  // Protect booking, payment and my-bookings routes via Clerk middleware
  matcher: [
    "/booking",
    "/booking/:path*",
    "/payment",
    "/payment/:path*",
    "/my-bookings",
    "/my-bookings/:path*",
  ],
};
