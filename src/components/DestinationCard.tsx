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
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        {imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C10016]/20 to-[#1E1E1E]/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1E1E1E]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 className="mb-2 text-2xl font-bold text-white">{destination.city}</h3>
          <p className="mb-4 max-w-xs px-4 text-center text-sm text-white/80">
            {destination.description.slice(0, 100)}
            {destination.description.length > 100 ? "..." : ""}
          </p>
          <Link
            href={`/flights?destination=${encodeURIComponent(destination.city)}`}
            className="primary-button px-6 py-2 text-sm font-semibold"
          >
            Explore
          </Link>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-[#C10016]" />
          <h3 className="text-lg font-bold text-[#1E1E1E]">{destination.city}</h3>
        </div>
        <p className="mb-3 text-sm text-gray-500">{destination.country}</p>

        <div className="flex flex-wrap gap-2">
          {destination.highlights.slice(0, 3).map((highlight) => (
            <span
              key={highlight}
              className="rounded-full bg-[#F5F5F5] px-3 py-1 text-xs font-medium text-gray-600"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
