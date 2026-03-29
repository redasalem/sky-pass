import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface Flight {
  _id: string;
  airlineName: string;
  flightNumber: string;
  priceInCents: number;
  origin: string;
  destination: string;
  departureTime: string;
  duration: number;
  seatsAvailable: number;
  flightClass: ("Economy" | "Business" | "First")[];
  featuredImage: SanityImageSource;
  isFeatured: boolean;
}

export interface Destination {
  _id: string;
  title: string;
  city: string;
  country: string;
  description: string;
  image: SanityImageSource;
  highlights: string[];
  isFeatured: boolean;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PassengerDetails extends Passenger {
  phone?: string;
  passportNumber?: string;
}

export interface BookingSession {
  flightId: string;
  passengers: number;
  totalPriceInCents: number;
  userId: string;
}

export interface SearchParams {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: string;
  tripType?: "round-trip" | "one-way";
  cabinClass?: "Economy" | "Business" | "First";
  sort?: "price" | "duration" | "departureTime";
  maxPrice?: string;
  maxDuration?: string;
}

export interface PricingResult {
  basePriceInCents: number;
  unitPriceInCents: number;
  originalTotalPriceInCents: number;
  surchargePercent: number;
  surchargeLabel: string;
  totalPriceInCents: number;
}

export interface BookingDocument {
  _id: string;
  _type: "booking";
  stripeSessionId: string;
  stripeEventId?: string;
  bookingReference: string;
  flightId: string;
  userId: string;
  passengers: number;
  passenger: PassengerDetails;
  totalPriceInCents: number;
  status: "paid" | "pending" | "cancelled";
  emailSent?: boolean;
  createdAt: string;
}
