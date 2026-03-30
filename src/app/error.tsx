"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Sky-Pass Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-6 text-center">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-[#1A1A1A] border border-[#2A2A2A] p-10 shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#C10016]/10 border border-[#C10016]/30">
          <AlertCircle className="h-10 w-10 text-[#C10016]" />
        </div>
        <h2 className="mb-3 text-3xl font-black text-white tracking-tight">System Notice</h2>
        <p className="mb-8 text-sm font-medium text-gray-400">
          We experienced an interruption in our services. Please try again or return home.
        </p>
        <div className="flex flex-col gap-3">
           <button
             onClick={() => reset()}
             className="primary-button w-full py-4 text-sm font-bold shadow-lg shadow-red-900/20"
           >
             Try Again
           </button>
           <a
             href="/"
             className="w-full rounded-full border border-[#2A2A2A] bg-transparent py-4 text-sm font-bold text-white transition-all hover:bg-[#2A2A2A]"
           >
             Return to Homepage
           </a>
        </div>
      </div>
    </div>
  );
}
