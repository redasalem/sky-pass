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
    <div className="min-h-screen bg-[#F5F5F5] pt-28">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-6 text-2xl font-bold">My Bookings</h1>
        {bookings && bookings.length > 0 ? (
          <div className="grid gap-4">
            {bookings.map((b: any) => (
              <div key={b.bookingReference} className="rounded-xl bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Booking</div>
                    <div className="text-lg font-semibold">{b.bookingReference}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="text-lg font-semibold">{b.status}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <div>{b.passenger?.firstName} {b.passenger?.lastName}</div>
                    <div className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{b.totalPriceInCents ? `$${(b.totalPriceInCents/100).toFixed(2)}` : "-"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center">
            <p className="text-lg">No bookings yet</p>
            <a href="/flights" className="mt-4 inline-block rounded bg-red-600 px-4 py-2 text-white">Browse Flights</a>
          </div>
        )}
      </div>
    </div>
  );
}
