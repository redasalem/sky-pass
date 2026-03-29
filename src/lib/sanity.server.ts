import { createClient } from "next-sanity";

// Server-side Sanity client should use server-only env vars (no NEXT_PUBLIC_ prefix)
const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

export const serverClient =
  projectId && token
    ? createClient({
        projectId,
        dataset,
        apiVersion: "2024-01-01",
        token,
        useCdn: false,
      })
    : null;

// Helper: ensure server client is available when required
export function requireServerClient() {
  if (!serverClient) {
    throw new Error(
      "Sanity server client is not configured. Set SANITY_PROJECT_ID, SANITY_DATASET and SANITY_API_TOKEN."
    );
  }
  return serverClient;
}
