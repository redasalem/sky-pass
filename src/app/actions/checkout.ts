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

  return createStripeCheckoutSession({
    flightId: input.flightId,
    passengers: input.passengers,
    passenger: input.passenger,
    userId: userId || "guest",
    origin: input.origin,
  });
}
