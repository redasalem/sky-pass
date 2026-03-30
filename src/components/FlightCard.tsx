"use client";

import { Clock, Plane } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { calculateDynamicPrice, formatPrice } from "@/lib/pricing";
import type { Flight } from "@/types";

interface FlightCardProps {
  flight: Flight;
  passengers?: number;
}

export default function FlightCard({ flight, passengers = 1 }: FlightCardProps) {
  const [selectedClass, setSelectedClass] = useState<"Economy" | "Business" | "First">(
    flight.flightClass[0] || "Economy"
  );

  const hours = Math.floor(flight.duration / 60);
  const mins = flight.duration % 60;
  const departureDate = new Date(flight.departureTime);
  const pricing = calculateDynamicPrice(
    flight.priceInCents,
    passengers,
    flight.departureTime,
    selectedClass
  );

  return (
    <div className="group surface-card p-6 flex flex-col h-full bg-[#1A1A1A] border-[#2A2A2A] transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:border-[#C10016] rounded-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A] group-hover:bg-[#C10016]/10 transition-colors">
            <Plane className="h-5 w-5 text-[#C10016]" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">{flight.airlineName}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-[#2A2A2A] px-3 py-1 text-xs font-semibold text-gray-300 shadow-inner">
            {flight.flightNumber}
          </span>
          {pricing.surchargeLabel && pricing.surchargeLabel !== "Base price" && (
             <span className="rounded-full bg-[#C10016]/20 border border-[#C10016]/30 px-2 py-0.5 text-[10px] font-bold text-[#C10016] uppercase tracking-wider">
               {pricing.surchargeLabel} (+{pricing.surchargePercent}%)
             </span>
          )}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between px-2">
        <div className="text-center">
          <p className="text-2xl font-black text-white">{flight.origin}</p>
          <p className="text-xs font-medium text-gray-400 mt-1">
            {departureDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center px-6">
          <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-gray-400">
            <Clock className="h-3 w-3" />
            {hours}H {mins}M
          </div>
          <div className="relative my-2 w-full flex items-center">
             <div className="h-[2px] w-full bg-[#2A2A2A] rounded-full" />
             <Plane className="absolute left-1/2 -translate-x-1/2 h-4 w-4 text-[#C10016] bg-[#1A1A1A] px-0.5" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#C10016]">Direct</span>
        </div>

        <div className="text-center">
          <p className="text-2xl font-black text-white">{flight.destination}</p>
          <p className="text-xs font-medium text-gray-400 mt-1">
            {departureDate.toLocaleDateString([], { month: "short", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value as any)}
          className="rounded-full border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-2 text-xs font-bold text-white outline-none focus:border-[#C10016] transition-colors cursor-pointer"
        >
          {flight.flightClass.map((flightClass: string) => (
            <option key={flightClass} value={flightClass}>
              {flightClass}
            </option>
          ))}
        </select>
        <span className="text-xs font-semibold text-gray-500">{flight.seatsAvailable} seats left</span>
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-[#2A2A2A] pt-5">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Price</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black tracking-tight text-[#C10016]">
              {formatPrice(pricing.totalPriceInCents)}
            </p>
            {pricing.originalTotalPriceInCents !== pricing.totalPriceInCents && (
              <p className="text-sm font-semibold text-gray-500 line-through">
                {formatPrice(pricing.originalTotalPriceInCents)}
              </p>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-semibold">
             For {passengers} passenger{passengers > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href={`/booking?flight=${flight._id}&passengers=${passengers}&class=${selectedClass}`}
          className="primary-button text-sm shadow-lg shadow-red-900/20"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
