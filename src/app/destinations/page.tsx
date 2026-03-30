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
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pb-24 pt-32 border-b border-[#2A2A2A]">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-[#C10016]/10 border border-[#C10016]/30 px-4 py-1.5 text-xs font-bold tracking-widest text-[#C10016] uppercase">
            Explore
          </span>
          <h1 className="text-4xl font-black text-white md:text-6xl tracking-tight">
            Destinations
          </h1>
          <p className="mt-4 text-lg font-medium text-gray-400 max-w-2xl">
            Discover where Sky-Pass can take you. From bustling metropolises to serene escapes, your premium journey starts here.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        {destinations.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {destinations.map((d) => (
              <DestinationCard key={d._id} destination={d} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C10016]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
             </div>
            <h3 className="mb-3 text-2xl font-black text-white">
              No destinations yet
            </h3>
            <p className="text-base font-medium text-gray-400 max-w-sm">
              Connect your Sanity CMS to manage destinations. Check the repository instructions for setup details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
