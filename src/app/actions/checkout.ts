"use server";

import { auth } from "@clerk/nextjs/server";
import { createStripeCheckoutSession } from "@/lib/booking";
import type { PassengerDetails } from "@/types";

export async function checkoutFlight(input: {
  flightId: string;
  passengers: number;
  passenger: PassengerDetails;
  origin: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    // Server Actions run on server — return a 401-style error by throwing
    const err = new Error("Authentication required");
    // @ts-ignore attach status for callers
    (err as any).status = 401;
    throw err;
  }

  // Always use server-provided userId
  return createStripeCheckoutSession({
    flightId: input.flightId,
    passengers: input.passengers,
    passenger: input.passenger,
    userId: userId,
    origin: input.origin,
  });
}
