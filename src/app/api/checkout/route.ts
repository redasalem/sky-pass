import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createStripeCheckoutSession } from "@/lib/booking";
import { ValidationError, NotFoundError, ConflictError } from "@/lib/errors";
import type { PassengerDetails } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      flightId?: string;
      passengers?: number;
      passenger?: PassengerDetails;
    };

    // Validate request body and return 400 for client errors
    if (!body.flightId) {
      return NextResponse.json({ error: "flightId is required" }, { status: 400 });
    }
    if (!body.passengers || body.passengers <= 0) {
      return NextResponse.json({ error: "passengers must be a positive number" }, { status: 400 });
    }
    if (!body.passenger || !body.passenger.email) {
      return NextResponse.json({ error: "passenger.email is required" }, { status: 400 });
    }

    const { userId } = await auth();
    // Enforce Clerk authentication — no guest users allowed
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { session } = await createStripeCheckoutSession({
      flightId: body.flightId,
      passengers: body.passengers,
      passenger: body.passenger,
      userId: userId,
      origin: request.nextUrl.origin,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // Map known domain errors to appropriate HTTP statuses
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof ConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
