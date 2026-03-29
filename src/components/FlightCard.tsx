import { Clock, Plane } from "lucide-react";
import Link from "next/link";
import { calculateDynamicPrice, formatPrice } from "@/lib/pricing";
import type { Flight } from "@/types";

interface FlightCardProps {
  flight: Flight;
  passengers?: number;
}

export default function FlightCard({ flight, passengers = 1 }: FlightCardProps) {
  const hours = Math.floor(flight.duration / 60);
  const mins = flight.duration % 60;
  const departureDate = new Date(flight.departureTime);
  const pricing = calculateDynamicPrice(
    flight.priceInCents,
    passengers,
    flight.departureTime
  );

  return (
    <div className="group surface-card p-6 transition-all duration-300 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-[#C10016]" />
          <span className="text-sm font-semibold text-[#1E1E1E]">{flight.airlineName}</span>
        </div>
        <span className="rounded-full bg-[#F5F5F5] px-3 py-1 text-xs font-medium text-gray-500">
          {flight.flightNumber}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-center">
          <p className="text-lg font-bold text-[#1E1E1E]">{flight.origin}</p>
          <p className="text-xs text-gray-400">
            {departureDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center px-4">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {hours}h {mins}m
          </div>
          <div className="relative my-1 h-px w-full bg-gray-200">
            <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#C10016]" />
            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#C10016]" />
          </div>
          <span className="text-xs text-gray-400">Direct</span>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-[#1E1E1E]">{flight.destination}</p>
          <p className="text-xs text-gray-400">
            {departureDate.toLocaleDateString([], { month: "short", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <select className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 outline-none focus:border-[#C10016]">
          {flight.flightClass.map((flightClass) => (
            <option key={flightClass} value={flightClass}>
              {flightClass}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-400">{flight.seatsAvailable} seats left</span>
      </div>

      <div className="flex items-end justify-between border-t border-gray-100 pt-4">
        <div>
          {pricing.originalTotalPriceInCents !== pricing.totalPriceInCents && (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(pricing.originalTotalPriceInCents)}
            </p>
          )}
          <p className="text-2xl font-bold text-[#C10016]">
            {formatPrice(pricing.totalPriceInCents)}
          </p>
          <p className="text-xs text-gray-400">
            {pricing.surchargeLabel} for {passengers} passenger{passengers > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href={`/booking?flight=${flight._id}&passengers=${passengers}`}
          className="primary-button px-6 py-2.5 text-sm font-semibold"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
