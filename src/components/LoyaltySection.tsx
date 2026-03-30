import Link from "next/link";
import { Award, Check, Crown, Star } from "lucide-react";

const TIERS = [
  {
    name: "Classic",
    icon: Star,
    color: "from-gray-700 to-gray-900",
    benefits: [
      "Earn 1 mile per $1 spent",
      "Priority waitlist",
      "Online check-in",
      "Free seat selection",
    ],
  },
  {
    name: "Elite",
    icon: Award,
    color: "from-[#C10016] to-[#8B0000]",
    featured: true,
    benefits: [
      "Earn 2 miles per $1 spent",
      "Priority boarding",
      "Lounge access (2 visits/year)",
      "Extra baggage allowance",
      "Dedicated support line",
    ],
  },
  {
    name: "Elite Plus",
    icon: Crown,
    color: "from-yellow-600 to-yellow-800",
    benefits: [
      "Earn 3 miles per $1 spent",
      "Unlimited lounge access",
      "Free upgrades (subject to availability)",
      "Companion ticket annually",
      "Premium concierge service",
      "Priority re-booking",
    ],
  },
];

export default function LoyaltySection() {
  return (
    <section className="bg-[#0A0A0A] py-24 relative overflow-hidden text-white border-y border-[#2A2A2A]">
      <div className="absolute top-0 right-0 h-[800px] w-[800px] rounded-full bg-[#C10016]/5 blur-3xl pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#C10016]/10 border border-[#C10016]/30 px-4 py-1.5 text-xs font-bold tracking-widest text-[#C10016] uppercase">
            Loyalty Program
          </span>
          <h2 className="mb-6 text-4xl font-black md:text-5xl">
            Miles &amp; Rewards
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium text-gray-400">
            Elevate every journey. Earn miles with every flight and unlock
            exclusive privileges as you rise through our membership tiers.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`relative rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  tier.featured
                    ? "border-[#C10016] bg-[#1A1A1A] shadow-xl shadow-[#C10016]/20"
                    : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#4A4A4A]"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#C10016] px-6 py-1.5 text-xs font-bold text-white shadow-lg tracking-wider uppercase">
                    Most Popular
                  </div>
                )}

                <div className="p-8 flex flex-col h-full">
                  <div
                    className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-inner ${tier.color}`}
                  >
                    <Icon className="h-8 w-8 text-white drop-shadow-md" />
                  </div>

                  <h3 className="mb-6 text-3xl font-black">
                    {tier.name}
                  </h3>

                  <ul className="mb-10 space-y-4 flex-1">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C10016]/20">
                           <Check className="h-3.5 w-3.5 flex-shrink-0 text-[#C10016]" />
                        </div>
                        <span className="text-sm font-medium text-gray-300 leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/sign-up"
                    className={`w-full block text-center rounded-full py-3.5 text-sm font-bold transition-all ${
                      tier.featured
                        ? "bg-[#C10016] text-white hover:bg-[#a00012] shadow-lg shadow-red-900/40"
                        : "bg-[#2A2A2A] text-white hover:bg-[#333]"
                    }`}
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
