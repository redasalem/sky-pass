import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
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

export function requireServerClient() {
  if (!serverClient) {
    throw new Error(
      "Sanity server client is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN."
    );
  }
  return serverClient;
}
