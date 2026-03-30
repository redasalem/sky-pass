"use client";

import { SignIn } from "@clerk/nextjs";

const darkAppearance = {
  baseTheme: "dark",
  variables: {
    colorBackground: "#1A1A1A",
    colorInputBackground: "#0A0A0A",
    colorInputText: "#FFFFFF",
    colorPrimary: "#C10016",
    colorTextSecondary: "#A0A0A0",
  },
  elements: {
    card: "bg-transparent shadow-none border-0 p-0",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton: "border border-[#2A2A2A] bg-[#0A0A0A] hover:bg-[#333] transition-colors rounded-xl",
    socialButtonsBlockButtonText: "font-bold text-gray-300",
    dividerLine: "bg-[#2A2A2A]",
    dividerText: "text-gray-500",
    formFieldLabel: "text-gray-400 font-bold",
    formFieldInput: "bg-[#0A0A0A] border-[#2A2A2A] focus:border-[#C10016] rounded-xl text-white transition-colors",
    footerActionText: "text-gray-400 text-sm font-medium",
    footerActionLink: "text-[#C10016] font-bold hover:text-[#A0001F] transition-colors",
    formButtonPrimary: "bg-[#C10016] hover:bg-[#A0001F] rounded-full shadow-lg shadow-red-900/30 font-bold transition-colors py-4"
  }
} as any;

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-[#C10016]/20 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#1A1A1A] border border-[#2A2A2A] shadow-2xl p-8 sm:p-10 mb-20 animate-fade-in-up">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-sm font-medium text-gray-400">Sign in to manage your bookings</p>
        </div>
        <SignIn appearance={darkAppearance} />
      </div>
    </div>
  );
}
