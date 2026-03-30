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
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
            tripType === "round-trip"
              ? "bg-[#C10016] text-white shadow-lg shadow-red-900/30"
              : "bg-white/10 text-white hover:bg-white/20 border border-transparent hover:border-white/30"
          }`}
        >
          Round-trip
        </button>
        <button
          type="button"
          onClick={() => setTripType("one-way")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
            tripType === "one-way"
              ? "bg-[#C10016] text-white shadow-lg shadow-red-900/30"
              : "bg-white/10 text-white hover:bg-white/20 border border-transparent hover:border-white/30"
          }`}
        >
          One-way
        </button>
        <select
          value={cabinClass}
          onChange={(event) =>
            setCabinClass(event.target.value as "Economy" | "Business" | "First")
          }
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white outline-none border border-transparent hover:border-white/30 transition-all cursor-pointer"
        >
          <option value="Economy" className="text-[#0A0A0A]">
            Economy
          </option>
          <option value="Business" className="text-[#0A0A0A]">
            Business
          </option>
          <option value="First" className="text-[#0A0A0A]">
            First
          </option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="relative">
          <label className="mb-1 block text-xs font-medium text-gray-300">From</label>
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
            className="w-full rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C10016] transition-colors"
          />
          {originSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-auto rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] shadow-xl">
              {originSuggestions.map((city) => (
                <li
                  key={city}
                  onMouseDown={() => {
                    setOrigin(city);
                    setOriginSuggestions([]);
                  }}
                  className="cursor-pointer px-4 py-2 text-sm text-gray-300 hover:bg-[#2A2A2A] hover:text-white transition-colors"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <label className="mb-1 block text-xs font-medium text-gray-300">To</label>
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
              className="w-full rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C10016] transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                setOrigin(destination);
                setDestination(origin);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#2A2A2A] p-1.5 shadow-sm transition-transform hover:rotate-180 hover:bg-[#333]"
              aria-label="Swap cities"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-gray-300" />
            </button>
          </div>
          {destSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-auto rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] shadow-xl">
              {destSuggestions.map((city) => (
                <li
                  key={city}
                  onMouseDown={() => {
                    setDestination(city);
                    setDestSuggestions([]);
                  }}
                  className="cursor-pointer px-4 py-2 text-sm text-gray-300 hover:bg-[#2A2A2A] hover:text-white transition-colors"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300">
            <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
            Departure
          </label>
          <input
            type="date"
            value={departureDate}
            onChange={(event) => setDepartureDate(event.target.value)}
            required
            className="w-full rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3 text-sm text-white outline-none focus:border-[#C10016] transition-colors [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300">Return</label>
          <input
            type="date"
            value={returnDate}
            onChange={(event) => setReturnDate(event.target.value)}
            disabled={tripType !== "round-trip"}
            className="w-full rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3 text-sm text-white outline-none focus:border-[#C10016] transition-colors disabled:cursor-not-allowed disabled:opacity-30 [color-scheme:dark]"
          />
        </div>

        <div className="relative">
          <label className="mb-1 block text-xs font-medium text-gray-300">
            <Users className="mr-1 inline h-3.5 w-3.5" />
            Passengers
          </label>
          <button
            type="button"
            onClick={() => setShowPassengers((current) => !current)}
            className="w-full rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3 text-left text-sm text-white outline-none focus:border-[#C10016] transition-colors"
          >
            {totalPassengers} Passenger{totalPassengers > 1 ? "s" : ""}
          </button>
          {showPassengers && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 space-y-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] p-4 shadow-xl">
              {[
                { label: "Adults", value: adults, set: setAdults, min: 1 },
                { label: "Children", value: children, set: setChildren, min: 0 },
                { label: "Infants", value: infants, set: setInfants, min: 0 },
              ].map((passengerGroup) => (
                <div key={passengerGroup.label} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">{passengerGroup.label}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        passengerGroup.set(
                          Math.max(passengerGroup.min, passengerGroup.value - 1)
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#0A0A0A] text-white transition-colors hover:border-[#C10016] hover:text-[#C10016]"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-white">
                      {passengerGroup.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => passengerGroup.set(passengerGroup.value + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#0A0A0A] text-white transition-colors hover:border-[#C10016] hover:text-[#C10016]"
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
        className="primary-button mt-6 flex w-full items-center justify-center gap-2 text-sm shadow-lg shadow-red-900/30"
      >
        <Search className="h-4 w-4" />
        Search Flights
      </button>
    </div>
  );
}
