import { Suspense } from "react";
import BookingFlow from "@/components/BookingFlow";

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F5] pt-28" />}>
      <BookingFlow />
    </Suspense>
  );
}
