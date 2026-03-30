import { auth } from "@clerk/nextjs/server";
import { requireServerClient } from "@/lib/sanity.server";
import { redirect } from "next/navigation";

async function fetchBookings(userId: string) {
  const client = requireServerClient();
  const bookings = await client.fetch(
    `*[_type == "booking" && userId == $userId] | order(createdAt desc){
      bookingReference,
      flightId,
      passenger,
      totalPriceInCents,
      status,
      createdAt
    }`,
    { userId }
  );

  return bookings;
}

export default async function MyBookingsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const bookings = await fetchBookings(userId);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 text-center md:text-left border-b border-[#2A2A2A] pb-6">
          <span className="mb-3 inline-block rounded-full bg-[#C10016]/10 border border-[#C10016]/30 px-4 py-1.5 text-xs font-bold tracking-widest text-[#C10016] uppercase">
             Passenger Portal
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight">My Bookings</h1>
        </div>
        
        {bookings && bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((b: any) => (
              <div key={b.bookingReference} className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 sm:p-8 transition-all hover:border-[#C10016]/50 hover:shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-6">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Booking Reference</div>
                    <div className="text-xl font-black text-white">{b.bookingReference}</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Status</div>
                    <div className="inline-flex items-center rounded-full bg-[#22C55E]/10 px-3 py-1 text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                      {b.status}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-sm">
                  <div>
                    <div className="text-base font-bold text-white mb-1">
                      {b.passenger?.firstName} {b.passenger?.lastName}
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                      Booked on: {new Date(b.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Paid</div>
                    <div className="text-2xl font-black text-[#C10016]">
                      {b.totalPriceInCents ? `$${(b.totalPriceInCents/100).toFixed(2)}` : "-"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center py-24 rounded-3xl bg-[#1A1A1A] border border-[#2A2A2A] text-center px-6">
             <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#0A0A0A] border border-[#2A2A2A] shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C10016]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                 </svg>
             </div>
            <h3 className="mb-3 text-2xl font-black text-white">
              No bookings yet
            </h3>
            <p className="text-base font-medium text-gray-400 max-w-sm">
              Your flight itineraries will appear here once you've completed a booking.
            </p>
            <a href="/flights" className="primary-button inline-block mt-8 font-bold">
               Browse Flights
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
