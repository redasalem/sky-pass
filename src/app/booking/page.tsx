import { Suspense } from "react";
import BookingFlow from "@/components/BookingFlow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function BookingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F5] pt-28" />}>
      <BookingFlow />
    </Suspense>
  );
}
