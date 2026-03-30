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
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] shadow-inner">
          <svg
            className="h-10 w-10 text-[#C10016]"
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
        <h3 className="mb-3 text-2xl font-black text-white">No flights found</h3>
        <p className="text-base text-gray-400 max-w-sm">
          {params.origin
            ? `We couldn't find any flights from ${params.origin} to ${params.destination || "your destination"} on these dates.`
            : "Connect your Sanity CMS to see flights. Check the README for setup instructions."}
        </p>
        {params.origin && (
          <a href="/flights" className="mt-8 outline-button text-sm inline-block">
             Try different dates
          </a>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-400">
          <span className="text-white text-base">{flights.length}</span> result{flights.length === 1 ? "" : "s"}
        </p>
        <p className="text-sm font-semibold text-gray-400">Sorted by <span className="text-white capitalize">{params.sort || "price"}</span></p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
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
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="bg-[#1A1A1A] pb-32 pt-32 border-b border-[#2A2A2A]">
        <div className="mx-auto max-w-7xl px-6 relative">
          <h1 className="mb-2 text-4xl font-black text-white md:text-5xl tracking-tight">
            {params.origin && params.destination
              ? `${params.origin} → ${params.destination}`
              : "All Premium Flights"}
          </h1>
          <p className="text-lg font-medium text-gray-400 mt-4">
            {params.departureDate ? `Departing: ${params.departureDate}` : "Browse our available routes globally"}
          </p>
          <div className="absolute right-6 top-0 hidden md:block">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#C10016]/10 text-[#C10016]">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6 0 .1 0 .3.1.4l5.6 5.6-3 3L4 14c-.3 0-.6.2-.7.5-.1.1-.1.2-.1.3L5 18l3.2 1.8c.1 0 .2.1.3.1.3 0 .5-.2.5-.5l-1.8-2.4 3-3 5.6 5.6c.1.1.2.1.4.1.4-.2.7-.6.6-1.1z"/></svg>
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-[72px] max-w-[1100px] px-6 relative z-10">
        <SearchWidget />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="surface-card h-fit p-6 bg-[#1A1A1A] border-[#2A2A2A]">
            <h2 className="mb-6 text-xl font-bold text-white border-b border-[#2A2A2A] pb-4">Filters</h2>
            <form className="space-y-6" action="/flights">
              <input type="hidden" name="origin" value={params.origin || ""} />
              <input type="hidden" name="destination" value={params.destination || ""} />
              <input type="hidden" name="departureDate" value={params.departureDate || ""} />
              <input type="hidden" name="returnDate" value={params.returnDate || ""} />
              <input type="hidden" name="passengers" value={params.passengers || "1"} />
              <input type="hidden" name="tripType" value={params.tripType || "one-way"} />
              
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">
                  Max Price (Cents)
                </label>
                <input
                  name="maxPrice"
                  defaultValue={params.maxPrice}
                  placeholder="e.g. 50000"
                  className="w-full rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 text-sm text-white focus:border-[#C10016] outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">
                  Max Duration (Minutes)
                </label>
                <input
                  name="maxDuration"
                  defaultValue={params.maxDuration}
                  placeholder="e.g. 300"
                  className="w-full rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 text-sm text-white focus:border-[#C10016] outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">Cabin Class</label>
                <select
                  name="cabinClass"
                  defaultValue={params.cabinClass || ""}
                  className="w-full rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 text-sm font-semibold text-white focus:border-[#C10016] outline-none transition-colors cursor-pointer"
                >
                  <option value="">Any Class</option>
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">Sort by</label>
                <select
                  name="sort"
                  defaultValue={params.sort || "price"}
                  className="w-full rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 text-sm font-semibold text-white focus:border-[#C10016] outline-none transition-colors cursor-pointer"
                >
                  <option value="price">Price (lowest first)</option>
                  <option value="duration">Duration (shortest first)</option>
                  <option value="departureTime">Departure time (earliest first)</option>
                </select>
              </div>
              
              <button className="primary-button w-full py-3.5 text-sm mt-4 tracking-wide">
                Apply Filters
              </button>
            </form>
          </aside>

          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="skeleton h-[360px] rounded-2xl border border-[#2A2A2A]" />
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
