import { createHash, randomUUID } from "node:crypto";
import Stripe from "stripe";
import { calculateDynamicPrice } from "@/lib/pricing";
import { getFlightById } from "@/lib/sanity.queries";
import { serverClient } from "@/lib/sanity.server";
import type { BookingDocument, BookingSession, PassengerDetails } from "@/types";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    })
  : null;

function createBookingReference() {
  return `SP-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function createIdempotencyKey(payload: {
  flightId: string;
  passengers: number;
  email: string;
  departureTime: string;
}) {
  return createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}

export async function createStripeCheckoutSession(input: {
  flightId: string;
  passengers: number;
  passenger: PassengerDetails;
  userId: string;
  origin: string;
}) {
  if (!stripe) {
    throw new Error("Stripe is not configured.");
  }

  const flight = await getFlightById(input.flightId);

  if (!flight) {
    throw new Error("Flight not found.");
  }

  if (flight.seatsAvailable < input.passengers) {
    throw new Error("Not enough seats are available for this booking.");
  }

  const pricing = calculateDynamicPrice(
    flight.priceInCents,
    input.passengers,
    flight.departureTime
  );

  const bookingSession: BookingSession = {
    flightId: flight._id,
    passengers: input.passengers,
    totalPriceInCents: pricing.totalPriceInCents,
    userId: input.userId,
  };

  const bookingReference = createBookingReference();

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      customer_email: input.passenger.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${flight.airlineName} ${flight.flightNumber}`,
              description: `${flight.origin} to ${flight.destination}`,
            },
            unit_amount: pricing.unitPriceInCents,
          },
          quantity: input.passengers,
        },
      ],
      metadata: {
        bookingReference,
        flightId: flight._id,
        flightNumber: flight.flightNumber,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: flight.departureTime,
        passengers: String(input.passengers),
        userId: bookingSession.userId,
        passengerFirstName: input.passenger.firstName,
        passengerLastName: input.passenger.lastName,
        passengerEmail: input.passenger.email,
        passengerPhone: input.passenger.phone || "",
        passportNumber: input.passenger.passportNumber || "",
        totalPriceInCents: String(bookingSession.totalPriceInCents),
        surchargeLabel: pricing.surchargeLabel,
      },
      success_url: `${input.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${input.origin}/flights`,
    },
    {
      idempotencyKey: createIdempotencyKey({
        flightId: flight._id,
        passengers: input.passengers,
        email: input.passenger.email,
        departureTime: flight.departureTime,
      }),
    }
  );

  return { session, flight, pricing, bookingReference };
}

export async function persistCompletedBooking(input: {
  stripeSessionId: string;
  stripeEventId: string;
  flightId: string;
  userId: string;
  passengers: number;
  passenger: PassengerDetails;
  totalPriceInCents: number;
  bookingReference: string;
}) {
  if (!serverClient) {
    return null;
  }

  const booking: BookingDocument = {
    _id: `booking.${input.stripeSessionId}`,
    _type: "booking",
    stripeSessionId: input.stripeSessionId,
    stripeEventId: input.stripeEventId,
    bookingReference: input.bookingReference,
    flightId: input.flightId,
    userId: input.userId,
    passengers: input.passengers,
    passenger: input.passenger,
    totalPriceInCents: input.totalPriceInCents,
    status: "paid",
    emailSent: false,
    createdAt: new Date().toISOString(),
  };

  await serverClient.createOrReplace(booking);

  const flight = await getFlightById(input.flightId);
  if (flight) {
    await serverClient
      .patch(input.flightId)
      .set({ seatsAvailable: Math.max(0, flight.seatsAvailable - input.passengers) })
      .commit();
  }

  return booking;
}

export async function markBookingEmailSent(stripeSessionId: string) {
  if (!serverClient) {
    return;
  }

  await serverClient.patch(`booking.${stripeSessionId}`).set({ emailSent: true }).commit();
}
