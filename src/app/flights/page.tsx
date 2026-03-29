import { Suspense } from "react";
import FlightCard from "@/components/FlightCard";
import SearchWidget from "@/components/SearchWidget";
import { getAllFlights, searchFlights } from "@/lib/sanity.queries";
import type { Flight, SearchParams } from "@/types";

interface FlightsPageProps {
  searchParams: Promise<SearchParams>;
}

async function FlightResults({ searchParams }: FlightsPageProps) {
  const params = await searchParams;
  const passengers = Number(params.passengers) || 1;

  let flights: Flight[] = [];

  try {
    flights = params.origin && params.destination
      ? await searchFlights(params.origin, params.destination, params.departureDate)
      : await getAllFlights();
  } catch {
    /* Sanity may not be configured */
  }

  const maxPrice = Number(params.maxPrice) || Number.POSITIVE_INFINITY;
  const maxDuration = Number(params.maxDuration) || Number.POSITIVE_INFINITY;

  flights = flights
    .filter((flight) =>
      params.cabinClass ? flight.flightClass.includes(params.cabinClass) : true
    )
    .filter((flight) => flight.priceInCents <= maxPrice)
    .filter((flight) => flight.duration <= maxDuration);

  if (params.sort === "duration") {
    flights.sort((a, b) => a.duration - b.duration);
  } else if (params.sort === "departureTime") {
    flights.sort(
      (a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
    );
  } else {
    flights.sort((a, b) => a.priceInCents - b.priceInCents);
  }

  if (flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F5F5]">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-[#1E1E1E]">No flights found</h3>
        <p className="text-sm text-gray-500">
          {params.origin
            ? `No flights from ${params.origin} to ${params.destination || "your destination"}.`
            : "Connect your Sanity CMS to see flights. Check the README for setup instructions."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {flights.length} result{flights.length === 1 ? "" : "s"}
        </p>
        <p className="text-sm text-gray-500">Sorted by {params.sort || "price"}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {flights.map((flight) => (
          <FlightCard key={flight._id} flight={flight} passengers={passengers} />
        ))}
      </div>
    </>
  );
}

export default async function FlightsPage(props: FlightsPageProps) {
  const params = await props.searchParams;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-[#1E1E1E] pb-32 pt-28">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-2 text-4xl font-bold text-white">
            {params.origin && params.destination
              ? `${params.origin} → ${params.destination}`
              : "All Flights"}
          </h1>
          <p className="text-gray-400">
            {params.departureDate || "Browse our available routes"}
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-20 max-w-5xl px-6">
        <SearchWidget />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="surface-card h-fit p-6">
            <h2 className="mb-4 text-lg font-bold text-[#1E1E1E]">Filters</h2>
            <form className="space-y-4" action="/flights">
              <input type="hidden" name="origin" value={params.origin || ""} />
              <input type="hidden" name="destination" value={params.destination || ""} />
              <input type="hidden" name="departureDate" value={params.departureDate || ""} />
              <input type="hidden" name="returnDate" value={params.returnDate || ""} />
              <input type="hidden" name="passengers" value={params.passengers || "1"} />
              <input type="hidden" name="tripType" value={params.tripType || "one-way"} />
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                  Max Price (cents)
                </label>
                <input
                  name="maxPrice"
                  defaultValue={params.maxPrice}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                  Max Duration (minutes)
                </label>
                <input
                  name="maxDuration"
                  defaultValue={params.maxDuration}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Class</label>
                <select
                  name="cabinClass"
                  defaultValue={params.cabinClass || ""}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                >
                  <option value="">Any class</option>
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Sort by</label>
                <select
                  name="sort"
                  defaultValue={params.sort || "price"}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                >
                  <option value="price">Price</option>
                  <option value="duration">Duration</option>
                  <option value="departureTime">Departure time</option>
                </select>
              </div>
              <button className="primary-button w-full py-3 text-sm font-semibold">
                Apply Filters
              </button>
            </form>
          </aside>

          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="skeleton h-64 rounded-2xl" />
                ))}
              </div>
            }
          >
            <FlightResults searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
