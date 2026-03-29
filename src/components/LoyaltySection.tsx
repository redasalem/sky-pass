import Link from "next/link";
import { Award, Check, Crown, Star } from "lucide-react";

const TIERS = [
  {
    name: "Classic",
    icon: Star,
    color: "from-gray-600 to-gray-800",
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
    <section className="bg-[#1E1E1E] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#C10016]/20 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#C10016] uppercase">
            Loyalty Program
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Miles &amp; Rewards
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
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
                className={`relative rounded-2xl border transition-transform duration-300 hover:-translate-y-2 ${
                  tier.featured
                    ? "border-[#C10016] bg-[#2a2a2a] shadow-xl shadow-[#C10016]/15"
                    : "border-gray-700 bg-[#2a2a2a]"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#C10016] px-4 py-1 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tier.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="mb-6 text-2xl font-bold text-white">
                    {tier.name}
                  </h3>

                  <ul className="mb-8 space-y-3">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C10016]" />
                        <span className="text-sm text-gray-300">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/booking"
                    className={`w-full rounded-full py-3 text-sm font-semibold transition-colors ${
                      tier.featured
                        ? "bg-[#C10016] text-white hover:bg-[#a00012]"
                        : "border border-gray-600 text-white hover:border-[#C10016] hover:text-[#C10016]"
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
