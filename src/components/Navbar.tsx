"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plane } from "lucide-react";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";

const NAV_LINKS = [
  { label: "Flights", href: "/flights" },
  { label: "Destinations", href: "/destinations" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Plane className="h-7 w-7 text-[#C10016] transition-transform group-hover:scale-110" />
          <span className="text-2xl font-black tracking-tight text-[#C10016]">
            SKY-PASS
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all py-2 ${
                  isActive
                    ? "text-white border-b-2 border-[#C10016]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          {!isLoaded ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-[#2A2A2A]" />
          ) : !isSignedIn ? (
            <Link href="/sign-in" className="primary-button text-sm">
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/my-bookings"
                className={`text-sm font-semibold transition-all py-2 ${
                  pathname === "/my-bookings"
                    ? "text-white border-b-2 border-[#C10016]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                My Bookings
              </Link>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-[#2A2A2A]" } }} />
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute left-0 right-0 top-full border-t border-[#2A2A2A] bg-[#0A0A0A] bg-opacity-95 px-6 py-4 shadow-xl backdrop-blur-md md:hidden"
        >
          {NAV_LINKS.map((link) => {
             const isActive = pathname === link.href;
             return (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 text-base font-medium transition-colors ${
                  isActive ? "text-[#C10016]" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
             )
          })}
          
          {!isLoaded ? (
            <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
              <div className="h-10 w-10 animate-pulse rounded-full bg-[#2A2A2A]" />
            </div>
          ) : isSignedIn ? (
            <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
               <Link
                href="/my-bookings"
                className={`block py-3 text-base font-medium transition-colors ${
                  pathname === "/my-bookings" ? "text-[#C10016]" : "text-gray-300 hover:text-white"
                }`}
              >
                My Bookings
              </Link>
              <div className="mt-4">
                 <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          ) : (
             <Link
                href="/sign-in"
                className="primary-button mt-4 block w-full text-center text-sm"
              >
                Sign In
              </Link>
          )}
        </div>
      )}
    </header>
  );
}
