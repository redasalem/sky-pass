import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Restrict Clerk middleware to routes that require authentication.
// Keep a fairly broad matcher for pages and API paths that should be protected.
export const config = {
  matcher: [
    "/api/checkout",
    "/api/checkout/:path*",
    "/booking",
    "/booking/:path*",
  ],
};
