import { CheckCircle, Download, Plane, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F5] px-6 pt-20">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-xl">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-[#1E1E1E]">
          Booking Confirmed!
        </h1>

        <p className="mb-8 text-gray-500">
          Your flight has been booked successfully. A confirmation email has been
          sent.
        </p>

        {/* Boarding Pass Preview */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-dashed border-gray-300">
          <div className="bg-[#C10016] px-6 py-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-white" />
                <span className="text-sm font-bold text-white">SKY-PASS</span>
              </div>
              <span className="text-xs text-white/80">BOARDING PASS</span>
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-2xl font-bold text-[#1E1E1E]">IST</p>
                <p className="text-xs text-gray-400">Istanbul</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#C10016]" />
              <div className="text-right">
                <p className="text-2xl font-bold text-[#1E1E1E]">LHR</p>
                <p className="text-xs text-gray-400">London</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-2 rounded-full bg-[#C10016] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a00012]">
            <Download className="h-4 w-4" />
            Download Boarding Pass
          </button>
          <Link
            href="/"
            className="rounded-full border border-gray-200 py-3 text-sm font-semibold text-[#1E1E1E] transition-colors hover:border-[#C10016] hover:text-[#C10016]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
