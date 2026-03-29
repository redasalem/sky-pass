import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sky-Pass | Premium Air Travel",
  description:
    "Discover premium flights to over 300 destinations worldwide. Experience comfort, reliability, and world-class service with every journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Always wrap with ClerkProvider to ensure hooks like useUser can be used during prerender.
            Provide a safe fallback publishable key to avoid build-time errors when the real key
            is not set in the environment. In production, set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY. */}
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "clerk.publishable.test"}>
          <div className="app-shell">
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
