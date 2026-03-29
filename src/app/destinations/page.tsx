import DestinationCard from "@/components/DestinationCard";
import { getFeaturedDestinations } from "@/lib/sanity.queries";
import type { Destination } from "@/types";

export default async function DestinationsPage() {
  let destinations: Destination[] = [];
  try {
    destinations = await getFeaturedDestinations();
  } catch {
    /* Sanity may not be configured */
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#1E1E1E] pb-16 pt-28">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-[#C10016]/20 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#C10016] uppercase">
            Explore
          </span>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Destinations
          </h1>
          <p className="mt-3 text-gray-400">
            Discover where Sky-Pass can take you
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {destinations.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <DestinationCard key={d._id} destination={d} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="mb-2 text-xl font-bold text-[#1E1E1E]">
              No destinations yet
            </h3>
            <p className="text-sm text-gray-500">
              Connect your Sanity CMS to manage destinations. See README for
              setup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
