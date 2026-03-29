import Hero from "@/components/Hero";
import DestinationCard from "@/components/DestinationCard";
import LoyaltySection from "@/components/LoyaltySection";
import { getFeaturedDestinations } from "@/lib/sanity.queries";
import type { Destination } from "@/types";
import { Globe, Shield, Clock, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Globe,
    title: "300+ Destinations",
    desc: "Fly to the world's most exciting cities with direct and connecting routes.",
  },
  {
    icon: Shield,
    title: "Secure Booking",
    desc: "Bank-level security with Stripe for all payment processing.",
  },
  {
    icon: Clock,
    title: "98% On-Time",
    desc: "Industry-leading punctuality so you arrive when you plan to.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Dedicated customer service available around the clock.",
  },
];

export default async function HomePage() {
  let destinations: Destination[] = [];
  try {
    destinations = await getFeaturedDestinations();
  } catch {
    /* Sanity may not be configured yet */
  }

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Features */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#C10016]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#C10016] uppercase">
              Why Choose Us
            </span>
            <h2 className="text-4xl font-bold text-[#1E1E1E] md:text-5xl">
              The Sky-Pass Experience
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-gray-100 bg-white p-8 text-center transition-all duration-300 hover:border-[#C10016]/20 hover:shadow-xl"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C10016]/10 transition-colors group-hover:bg-[#C10016]">
                    <Icon className="h-6 w-6 text-[#C10016] transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#1E1E1E]">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      {destinations.length > 0 && (
        <section className="bg-[#F5F5F5] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <span className="mb-4 inline-block rounded-full bg-[#C10016]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#C10016] uppercase">
                Explore
              </span>
              <h2 className="text-4xl font-bold text-[#1E1E1E] md:text-5xl">
                Popular Destinations
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.slice(0, 6).map((d) => (
                <DestinationCard key={d._id} destination={d} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loyalty */}
      <LoyaltySection />

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#C10016] to-[#8B0000] py-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Ready to Fly?
          </h2>
          <p className="mb-10 text-lg text-white/80">
            Book your next adventure with Sky-Pass and experience the difference
            of premium air travel.
          </p>
          <a
            href="/flights"
            className="inline-block rounded-full bg-white px-10 py-4 text-sm font-bold text-[#C10016] shadow-2xl transition-all hover:bg-gray-100"
          >
            Search Flights
          </a>
        </div>
      </section>
    </>
  );
}
