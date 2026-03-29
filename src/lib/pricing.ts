import type { PricingResult } from "@/types";

const HOLIDAY_MONTHS = [6, 7, 11, 12];

export function calculateDynamicPrice(
  basePriceInCents: number,
  passengers: number,
  departureDate: string
): PricingResult {
  const date = new Date(departureDate);
  const now = new Date();
  const daysUntil = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
  const month = date.getMonth() + 1;

  let surchargePercent = 0;
  let surchargeLabel = "Standard";

  if (daysUntil < 3 && daysUntil >= 0) {
    surchargePercent = 30;
    surchargeLabel = "Last Minute (+30%)";
  } else if (HOLIDAY_MONTHS.includes(month)) {
    surchargePercent = 25;
    surchargeLabel = "Holiday Season (+25%)";
  } else if (dayOfWeek === 0 || dayOfWeek === 6) {
    surchargePercent = 15;
    surchargeLabel = "Weekend (+15%)";
  }

  const unitPrice = Math.round(
    basePriceInCents * (1 + surchargePercent / 100)
  );
  const originalTotalPriceInCents = basePriceInCents * passengers;
  const totalPriceInCents = unitPrice * passengers;

  return {
    basePriceInCents,
    unitPriceInCents: unitPrice,
    originalTotalPriceInCents,
    surchargePercent,
    surchargeLabel,
    totalPriceInCents,
  };
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
