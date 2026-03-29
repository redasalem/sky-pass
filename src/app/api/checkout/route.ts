import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createStripeCheckoutSession } from "@/lib/booking";
import type { PassengerDetails } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      flightId?: string;
      passengers?: number;
      passenger?: PassengerDetails;
    };

    if (!body.flightId || !body.passengers || !body.passenger?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { userId } = await auth();

    const { session } = await createStripeCheckoutSession({
      flightId: body.flightId,
      passengers: body.passengers,
      passenger: body.passenger,
      userId: userId || "guest",
      origin: request.nextUrl.origin,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
