import { client } from "./sanity.client";
import type { Flight, Destination } from "@/types";

export async function getAllFlights(): Promise<Flight[]> {
  return client.fetch(
    `*[_type == "flight"] | order(departureTime asc) {
      _id, airlineName, flightNumber, priceInCents,
      origin, destination, departureTime, duration,
      seatsAvailable, flightClass, featuredImage, isFeatured
    }`
  );
}

export async function getFlightById(id: string): Promise<Flight | null> {
  return client.fetch(
    `*[_type == "flight" && _id == $id][0] {
      _id, airlineName, flightNumber, priceInCents,
      origin, destination, departureTime, duration,
      seatsAvailable, flightClass, featuredImage, isFeatured
    }`,
    { id }
  );
}

export async function searchFlights(
  origin: string,
  destination: string,
  date?: string
): Promise<Flight[]> {
  const hasDate = Boolean(date);
  const dateQuery = hasDate ? `&& departureTime >= $startOfDay && departureTime <= $endOfDay` : ``;
  
  return client.fetch(
    `*[_type == "flight"
      && lower(origin) match lower($origin) + "*"
      && lower(destination) match lower($destination) + "*"
      ${dateQuery}
    ] | order(departureTime asc) {
      _id, airlineName, flightNumber, priceInCents,
      origin, destination, departureTime, duration,
      seatsAvailable, flightClass, featuredImage, isFeatured
    }`,
    {
      origin,
      destination,
      ...(hasDate && {
        startOfDay: `${date}T00:00:00Z`,
        endOfDay: `${date}T23:59:59Z`,
      }),
    }
  );
}

export async function getFeaturedDestinations(): Promise<Destination[]> {
  return client.fetch(
    `*[_type == "destination" && isFeatured == true] | order(_createdAt desc) {
      _id, title, city, country, description, image, highlights, isFeatured
    }`
  );
}
