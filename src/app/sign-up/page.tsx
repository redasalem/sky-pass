"use client";

import { SignUp } from "@clerk/nextjs";

const darkAppearance = {
  baseTheme: "dark",
} as any;

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1724] p-6">
      <div className="w-full max-w-md rounded-xl bg-[#0b1220] p-8 text-white shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Create account</h1>
        <SignUp appearance={darkAppearance} />
      </div>
    </div>
  );
}
