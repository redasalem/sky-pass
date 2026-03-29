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
    ? calculateDynamicPrice(flight.priceInCents, passengers, flight.departureTime)
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
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-[#1E1E1E] pb-16 pt-28">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/flights"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to flights
          </Link>
          <h1 className="text-3xl font-bold text-white">Complete Your Booking</h1>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-3xl px-6 pb-16">
        <div className="mb-8 flex items-center justify-center gap-4">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon;
            const active = step === index + 1;
            const done = step > index + 1;

            return (
              <div key={stepItem.label} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    active || done ? "bg-[#C10016] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-sm font-medium ${active ? "text-[#1E1E1E]" : "text-gray-400"}`}
                >
                  {stepItem.label}
                </span>
                {index < steps.length - 1 && <div className="mx-2 h-px w-12 bg-gray-300" />}
              </div>
            );
          })}
        </div>

        <div className="surface-card p-8">
          {step === 1 && (
            <>
              <h2 className="mb-6 text-xl font-bold text-[#1E1E1E]">Passenger Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
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
                    <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1E1E1E] outline-none focus:border-[#C10016] focus:ring-2 focus:ring-[#C10016]/20"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.firstName || !form.lastName || !form.email}
                className="primary-button mt-8 w-full py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="mb-6 text-xl font-bold text-[#1E1E1E]">Review & Pay</h2>

              <div className="mb-6 rounded-xl bg-[#F5F5F5] p-6">
                <div className="flex items-center gap-3">
                  <Plane className="h-5 w-5 text-[#C10016]" />
                  <span className="text-sm font-semibold text-[#1E1E1E]">
                    {flight ? `${flight.origin} to ${flight.destination}` : `Flight #${flightId.slice(0, 8)}`}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm text-gray-500">
                  <p>
                    <strong>Passenger:</strong> {form.firstName} {form.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {form.email}
                  </p>
                  <p>
                    <strong>Passengers:</strong> {passengers}
                  </p>
                  {flight && (
                    <p>
                      <strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {pricing && (
                <div className="mb-6 rounded-xl border border-[#C10016]/10 bg-white p-6">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Base fare</span>
                    <span>{formatPrice(pricing.originalTotalPriceInCents)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>{pricing.surchargeLabel}</span>
                    <span>+{pricing.surchargePercent}%</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-[#1E1E1E]">Total</span>
                    <span className="text-2xl font-bold text-[#C10016]">
                      {formatPrice(pricing.totalPriceInCents)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-full border border-gray-200 py-3.5 text-sm font-semibold text-[#1E1E1E] transition-colors hover:border-[#C10016]"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="primary-button flex-1 py-3.5 text-sm font-semibold disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Pay with Stripe"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
