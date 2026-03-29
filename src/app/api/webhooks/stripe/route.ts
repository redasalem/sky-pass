import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { markBookingEmailSent, persistCompletedBooking } from "@/lib/booking";
import { requireServerClient, serverClient } from "@/lib/sanity.server";
import { sendBookingConfirmation } from "@/lib/email";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const processedEvents = new Set<string>();

async function sendEmailWithRetry(payload: Parameters<typeof sendBookingConfirmation>[0]) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await sendBookingConfirmation(payload);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // In-memory dedupe fast-path
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Durable dedupe using Sanity
  try {
    const client = serverClient || requireServerClient();
    const existing = await client.fetch(
      `count(*[_type == "webhookEvent" && eventId == $id])`,
      { id: event.id }
    );
    if (existing > 0) {
      processedEvents.add(event.id);
      return NextResponse.json({ received: true, duplicate: true });
    }
  } catch (err) {
    // If Sanity is misconfigured, fallback to processing but log the error server-side
    console.error("Sanity dedupe check failed:", err);
  }

  // mark in-memory as processed immediately to prevent concurrent handling in this instance
  processedEvents.add(event.id);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    // Persist booking and then record the webhook event to prevent duplicates
    await persistCompletedBooking({
      stripeSessionId: session.id,
      stripeEventId: event.id,
      bookingReference: metadata.bookingReference || session.id,
      flightId: metadata.flightId || "",
      userId: metadata.userId || "guest",
      passengers: Number(metadata.passengers) || 1,
      passenger: {
        firstName: metadata.passengerFirstName || "Guest",
        lastName: metadata.passengerLastName || "Traveler",
        email: metadata.passengerEmail || session.customer_details?.email || "",
        phone: metadata.passengerPhone || "",
        passportNumber: metadata.passportNumber || "",
      },
      totalPriceInCents: Number(metadata.totalPriceInCents) || 0,
    });

    try {
      const client = serverClient || requireServerClient();
      // create a webhookEvent doc to mark this event as processed
      await client.createIfNotExists({
        _id: `webhookEvent.${event.id}`,
        _type: "webhookEvent",
        eventId: event.id,
        type: event.type,
        receivedAt: new Date().toISOString(),
        payload: {},
      });
    } catch (err) {
      // Don't fail the webhook if recording fails - log for investigation
      console.error("Failed to record webhook event in Sanity:", err);
    }

    if (metadata.passengerEmail) {
      try {
        await sendEmailWithRetry({
          to: metadata.passengerEmail,
          passengerName:
            `${metadata.passengerFirstName || ""} ${metadata.passengerLastName || ""}`.trim() ||
            "Traveler",
          flightNumber: metadata.flightNumber || "Sky-Pass",
          route: `${metadata.origin || "Origin"} -> ${metadata.destination || "Destination"}`,
          departureTime: metadata.departureTime || "TBD",
          passengers: Number(metadata.passengers) || 1,
          bookingReference: metadata.bookingReference || session.id,
        });
        await markBookingEmailSent(session.id);
      } catch {
        /* Retry is handled above; leave booking record unsent if still failing. */
      }
    }
  } else if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
    // release any held seats if we have hold info
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};
    const hold = Number(metadata.holdPassengers) || 0;
    const flightId = metadata.flightId;

    if (hold > 0 && flightId && serverClient) {
      try {
        await serverClient.patch(flightId).inc({ seatsHeld: -hold }).commit();
      } catch (err) {
        // best-effort: don't fail the webhook for release errors
      }
    }
  }

  return NextResponse.json({ received: true });
}
