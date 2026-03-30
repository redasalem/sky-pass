"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Plane, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { calculateDynamicPrice, formatPrice } from "@/lib/pricing";
import { getFlightById } from "@/lib/sanity.queries";
import type { Flight, PassengerDetails } from "@/types";

export default function BookingFlow() {
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flight") || "";
  const passengers = Number(searchParams.get("passengers")) || 1;
  const cabinClass = (searchParams.get("class") as any) || "Economy";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [form, setForm] = useState<PassengerDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passportNumber: "",
  });

  useEffect(() => {
    let active = true;

    async function loadFlight() {
      if (!flightId) {
        return;
      }

      try {
        const result = await getFlightById(flightId);
        if (active) {
          setFlight(result);
        }
      } catch {
        if (active) {
          setFlight(null);
        }
      }
    }

    void loadFlight();

    return () => {
      active = false;
    };
  }, [flightId]);

  const pricing = flight
    ? calculateDynamicPrice(flight.priceInCents, passengers, flight.departureTime, cabinClass)
    : null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId,
          passengers,
          cabinClass,
          passenger: form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If API responds with authentication error, redirect to sign-in
        if (response.status === 401) {
          window.location.href = "/sign-in";
          return;
        }
        throw new Error(data.error || "Checkout failed.");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Passenger Details", icon: User },
    { label: "Review & Pay", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="bg-[#1A1A1A] pb-16 pt-32 border-b border-[#2A2A2A]">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/flights"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to flights
          </Link>
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-[#C10016]/10 border border-[#C10016]/30 px-3 py-1 text-xs font-bold tracking-widest text-[#C10016] uppercase">
              Secure Checkout
            </span>
            <h1 className="text-4xl font-black tracking-tight text-white">Complete Your Booking</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-3xl px-6 pb-24 relative z-10">
        <div className="mb-8 flex items-center justify-center gap-4">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon;
            const active = step === index + 1;
            const done = step > index + 1;

            return (
              <div key={stepItem.label} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    active || done ? "bg-[#C10016] text-white shadow-lg shadow-[#C10016]/20" : "bg-[#2A2A2A] text-gray-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-sm font-bold tracking-wide ${active ? "text-white" : "text-gray-500"}`}
                >
                  {stepItem.label}
                </span>
                {index < steps.length - 1 && <div className="mx-2 h-px w-12 bg-[#2A2A2A]" />}
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl bg-[#1A1A1A] border border-[#2A2A2A] shadow-2xl p-8 sm:p-12">
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 className="mb-6 text-2xl font-black tracking-tight text-white">Passenger Information</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {(
                  [
                    { name: "firstName", label: "First Name", type: "text" },
                    { name: "lastName", label: "Last Name", type: "text" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "phone", label: "Phone", type: "tel" },
                    { name: "passportNumber", label: "Passport Number", type: "text" },
                  ] as const
                ).map((field) => (
                  <div
                    key={field.name}
                    className={field.name === "email" ? "sm:col-span-2" : ""}
                  >
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3.5 text-sm font-semibold text-white outline-none transition-all placeholder:text-gray-600 focus:border-[#C10016] focus:ring-1 focus:ring-[#C10016]"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.firstName || !form.lastName || !form.email}
                className="primary-button mt-10 w-full py-4 text-sm font-bold tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Review
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 className="mb-6 text-2xl font-black tracking-tight text-white">Review & Pay</h2>

              <div className="mb-8 rounded-2xl bg-[#0A0A0A] border border-[#2A2A2A] p-6">
                <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-4 mb-4">
                  <Plane className="h-5 w-5 text-[#C10016]" />
                  <span className="text-base font-bold text-white">
                    {flight ? `${flight.origin} to ${flight.destination}` : `Flight #${flightId.slice(0, 8)}`}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-400 font-medium">
                  <p className="flex justify-between">
                    <strong className="text-gray-500 font-bold uppercase tracking-wider text-xs">Passenger</strong> 
                    <span className="text-white">{form.firstName} {form.lastName}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong className="text-gray-500 font-bold uppercase tracking-wider text-xs">Email</strong> 
                    <span className="text-white">{form.email}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong className="text-gray-500 font-bold uppercase tracking-wider text-xs">Passengers</strong> 
                    <span className="text-white">{passengers}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong className="text-gray-500 font-bold uppercase tracking-wider text-xs">Class</strong> 
                    <span className="text-white">{cabinClass}</span>
                  </p>
                  {flight && (
                    <p className="flex justify-between">
                      <strong className="text-gray-500 font-bold uppercase tracking-wider text-xs">Departure</strong> 
                      <span className="text-white">{new Date(flight.departureTime).toLocaleString()}</span>
                    </p>
                  )}
                </div>
              </div>

              {pricing && (
                <div className="mb-8 rounded-2xl border border-[#C10016]/20 bg-[#C10016]/5 p-6 shadow-inner">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-300">
                    <span>Base fare (x{passengers})</span>
                    <span className="text-white">{formatPrice(pricing.originalTotalPriceInCents)}</span>
                  </div>
                  {pricing.surchargeLabel !== "Base price" && (
                    <div className="mt-3 flex items-center justify-between text-sm font-semibold text-gray-300">
                      <span className="flex items-center gap-2">
                        {pricing.surchargeLabel}
                        <span className="rounded-full bg-[#C10016]/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#C10016]">Surcharge</span>
                      </span>
                      <span className="text-[#C10016]">+{pricing.surchargePercent}%</span>
                    </div>
                  )}
                  <div className="mt-5 flex items-end justify-between border-t border-[#C10016]/20 pt-5">
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Total</span>
                    <span className="text-4xl font-black text-[#C10016] tracking-tight">
                      {formatPrice(pricing.totalPriceInCents)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-1/3 rounded-full border border-[#2A2A2A] bg-transparent py-4 text-sm font-bold text-white transition-all hover:bg-[#2A2A2A]"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="primary-button w-full sm:w-2/3 py-4 text-sm tracking-wide shadow-lg shadow-red-900/20 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : "Pay Securely with Stripe"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
