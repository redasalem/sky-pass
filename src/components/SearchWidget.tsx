"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, CalendarDays, Search, Users } from "lucide-react";

const CITIES = [
  "Istanbul",
  "London",
  "Paris",
  "New York",
  "Dubai",
  "Tokyo",
  "Bangkok",
  "Rome",
  "Berlin",
  "Madrid",
  "Cairo",
  "Doha",
  "Singapore",
  "Los Angeles",
  "Barcelona",
];

export default function SearchWidget() {
  const [tripType, setTripType] = useState<"round-trip" | "one-way">("round-trip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showPassengers, setShowPassengers] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<string[]>([]);
  const [cabinClass, setCabinClass] = useState<"Economy" | "Business" | "First">("Economy");

  const filterCities = (query: string) =>
    query.length > 0
      ? CITIES.filter((city) => city.toLowerCase().includes(query.toLowerCase()))
      : [];

  const totalPassengers = useMemo(
    () => adults + children + infants,
    [adults, children, infants]
  );

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) {
      return;
    }

    const params = new URLSearchParams({
      origin,
      destination,
      departureDate,
      passengers: String(totalPassengers),
      tripType,
      cabinClass,
    });

    if (tripType === "round-trip" && returnDate) {
      params.set("returnDate", returnDate);
    }

    window.location.href = `/flights?${params.toString()}`;
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setTripType("round-trip")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
            tripType === "round-trip"
              ? "bg-[#C10016] text-white shadow-lg"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          Round-trip
        </button>
        <button
          type="button"
          onClick={() => setTripType("one-way")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
            tripType === "one-way"
              ? "bg-[#C10016] text-white shadow-lg"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          One-way
        </button>
        <select
          value={cabinClass}
          onChange={(event) =>
            setCabinClass(event.target.value as "Economy" | "Business" | "First")
          }
          className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white outline-none ring-1 ring-white/20"
        >
          <option value="Economy" className="text-[#1E1E1E]">
            Economy
          </option>
          <option value="Business" className="text-[#1E1E1E]">
            Business
          </option>
          <option value="First" className="text-[#1E1E1E]">
            First
          </option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="relative">
          <label className="mb-1 block text-xs font-medium text-white/70">From</label>
          <input
            type="text"
            value={origin}
            onChange={(event) => {
              setOrigin(event.target.value);
              setOriginSuggestions(filterCities(event.target.value));
            }}
            onBlur={() => setTimeout(() => setOriginSuggestions([]), 150)}
            placeholder="Istanbul"
            required
            className="w-full rounded-xl bg-white/90 px-4 py-3 text-sm text-[#1E1E1E] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#C10016]"
          />
          {originSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-auto rounded-xl bg-white shadow-lg">
              {originSuggestions.map((city) => (
                <li
                  key={city}
                  onMouseDown={() => {
                    setOrigin(city);
                    setOriginSuggestions([]);
                  }}
                  className="cursor-pointer px-4 py-2 text-sm text-[#1E1E1E] hover:bg-[#F5F5F5]"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <label className="mb-1 block text-xs font-medium text-white/70">To</label>
          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(event) => {
                setDestination(event.target.value);
                setDestSuggestions(filterCities(event.target.value));
              }}
              onBlur={() => setTimeout(() => setDestSuggestions([]), 150)}
              placeholder="London"
              required
              className="w-full rounded-xl bg-white/90 px-4 py-3 pr-12 text-sm text-[#1E1E1E] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#C10016]"
            />
            <button
              type="button"
              onClick={() => {
                setOrigin(destination);
                setDestination(origin);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#F5F5F5] p-1.5 shadow-sm transition-transform hover:rotate-180"
              aria-label="Swap cities"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-[#C10016]" />
            </button>
          </div>
          {destSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-auto rounded-xl bg-white shadow-lg">
              {destSuggestions.map((city) => (
                <li
                  key={city}
                  onMouseDown={() => {
                    setDestination(city);
                    setDestSuggestions([]);
                  }}
                  className="cursor-pointer px-4 py-2 text-sm text-[#1E1E1E] hover:bg-[#F5F5F5]"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-white/70">
            <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
            Departure
          </label>
          <input
            type="date"
            value={departureDate}
            onChange={(event) => setDepartureDate(event.target.value)}
            required
            className="w-full rounded-xl bg-white/90 px-4 py-3 text-sm text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#C10016]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-white/70">Return</label>
          <input
            type="date"
            value={returnDate}
            onChange={(event) => setReturnDate(event.target.value)}
            disabled={tripType !== "round-trip"}
            className="w-full rounded-xl bg-white/90 px-4 py-3 text-sm text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#C10016] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="relative">
          <label className="mb-1 block text-xs font-medium text-white/70">
            <Users className="mr-1 inline h-3.5 w-3.5" />
            Passengers
          </label>
          <button
            type="button"
            onClick={() => setShowPassengers((current) => !current)}
            className="w-full rounded-xl bg-white/90 px-4 py-3 text-left text-sm text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#C10016]"
          >
            {totalPassengers} Passenger{totalPassengers > 1 ? "s" : ""}
          </button>
          {showPassengers && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 space-y-3 rounded-xl bg-white p-4 shadow-lg">
              {[
                { label: "Adults", value: adults, set: setAdults, min: 1 },
                { label: "Children", value: children, set: setChildren, min: 0 },
                { label: "Infants", value: infants, set: setInfants, min: 0 },
              ].map((passengerGroup) => (
                <div key={passengerGroup.label} className="flex items-center justify-between">
                  <span className="text-sm text-[#1E1E1E]">{passengerGroup.label}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        passengerGroup.set(
                          Math.max(passengerGroup.min, passengerGroup.value - 1)
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border text-[#1E1E1E] transition-colors hover:border-[#C10016]"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-sm font-medium text-[#1E1E1E]">
                      {passengerGroup.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => passengerGroup.set(passengerGroup.value + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border text-[#1E1E1E] transition-colors hover:border-[#C10016]"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSearch}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#C10016] py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:bg-[#a00012] hover:shadow-2xl"
      >
        <Search className="h-4 w-4" />
        Search Flights
      </button>
    </div>
  );
}
