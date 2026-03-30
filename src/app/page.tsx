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
    <div className="bg-[#0A0A0A]">
      {/* Hero */}
      <Hero />

      {/* Features */}
      <section className="bg-[#0A0A0A] py-32 border-b border-[#2A2A2A]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#C10016]/10 border border-[#C10016]/30 px-4 py-1.5 text-xs font-bold tracking-widest text-[#C10016] uppercase">
              Why Choose Us
            </span>
            <h2 className="text-4xl font-black text-white md:text-5xl tracking-tight">
              The Sky-Pass Experience
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-3xl border border-[#2A2A2A] bg-[#1A1A1A] p-8 text-center transition-all duration-300 hover:border-[#C10016]/50 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2A2A2A] transition-colors group-hover:bg-[#C10016]/10">
                    <Icon className="h-7 w-7 text-[#C10016]" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white tracking-wide">{f.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-gray-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      {destinations.length > 0 && (
        <section className="bg-[#0A0A0A] py-32 border-b border-[#2A2A2A]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-20 text-center">
              <span className="mb-4 inline-block rounded-full bg-[#C10016]/10 border border-[#C10016]/30 px-4 py-1.5 text-xs font-bold tracking-widest text-[#C10016] uppercase">
                Explore Destinations
              </span>
              <h2 className="text-4xl font-black text-white md:text-5xl tracking-tight">
                Popular Routes
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E0000] to-[#0A0A0A] py-32 text-center border-t border-[#2A2A2A]">
        <div className="absolute inset-0 bg-[#C10016]/5 bg-[radial-gradient(#C10016_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-3xl px-6 relative z-10">
          <h2 className="mb-8 text-5xl font-black text-white md:text-6xl tracking-tight leading-tight">
            Ready to <span className="text-[#C10016]">Fly?</span>
          </h2>
          <p className="mb-12 text-xl font-medium text-gray-300 leading-relaxed">
            Book your next adventure with Sky-Pass and experience the difference
            of premium air travel.
          </p>
          <a
            href="/flights"
            className="primary-button inline-block text-base shadow-lg shadow-red-900/40 hover:shadow-2xl hover:scale-105"
          >
            Search Flights
          </a>
        </div>
      </section>
    </div>
  );
}
