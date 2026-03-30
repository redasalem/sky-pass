import Link from "next/link";
import { MapPin } from "lucide-react";
import { urlFor } from "@/lib/sanity.client";
import type { Destination } from "@/types";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const imageUrl = destination.image
    ? urlFor(destination.image).width(900).height(700).url()
    : null;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] transition-all duration-300 hover:border-[#C10016] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
      <div className="relative h-64 w-full overflow-hidden bg-[#2A2A2A]">
        {imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C10016]/20 to-[#0A0A0A]/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-sm">
          <h3 className="mb-2 text-3xl font-black text-white">{destination.city}</h3>
          <p className="mb-6 max-w-xs px-4 text-center text-sm font-medium text-gray-300">
            {destination.description.slice(0, 100)}
            {destination.description.length > 100 ? "..." : ""}
          </p>
          <Link
            href={`/flights?destination=${encodeURIComponent(destination.city)}`}
            className="primary-button px-8 py-3 text-sm font-bold"
          >
            Explore Flights
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#C10016]" />
          <h3 className="text-xl font-bold text-white">{destination.city}</h3>
        </div>
        <p className="mb-4 text-sm font-medium text-gray-400">{destination.country}</p>

        <div className="flex flex-wrap gap-2">
          {destination.highlights && destination.highlights.length > 0 ? (
            destination.highlights.slice(0, 3).map((highlight: string) => (
              <span
                key={highlight}
                className="rounded-full bg-[#2A2A2A] border border-[#333] px-3 py-1 text-xs font-semibold text-gray-300"
              >
                {highlight}
              </span>
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
}
