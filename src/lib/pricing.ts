import type { PricingResult } from "../../types/index";

const HOLIDAY_MONTHS = [6, 7, 11, 12];

export function calculateDynamicPrice(
  basePriceInCents: number,
  passengers: number,
  departureDate: string,
  cabinClass: "Economy" | "Business" | "First" = "Economy"
): PricingResult {
  const date = new Date(departureDate);
  const now = new Date();
  const daysUntil = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
  const month = date.getMonth() + 1;

  let surchargePercent = 0;
  let surchargeLabel = "Base price";

  if (daysUntil < 3 && daysUntil >= 0) {
    surchargePercent = 30;
    surchargeLabel = "Last Minute";
  } else if (HOLIDAY_MONTHS.includes(month)) {
    surchargePercent = 25;
    surchargeLabel = "Holiday Season";
  } else if (dayOfWeek === 0 || dayOfWeek === 6) {
    surchargePercent = 15;
    surchargeLabel = "Weekend Premium";
  }

  let classMultiplier = 1;
  if (cabinClass === "Business") classMultiplier = 2.5;
  if (cabinClass === "First") classMultiplier = 4.0;

  const unitPrice = Math.round(
    basePriceInCents * (1 + surchargePercent / 100) * classMultiplier
  );
  
  // The original price should also reflect the class multiplier for a fair comparison of the dates
  const basePriceForClass = basePriceInCents * classMultiplier;
  const originalTotalPriceInCents = basePriceForClass * passengers;
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
