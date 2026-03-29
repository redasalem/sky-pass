"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plane } from "lucide-react";

const NAV_LINKS = [
  { label: "Flights", href: "/flights" },
  { label: "Destinations", href: "/destinations" },
  { label: "My Bookings", href: "/booking" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
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

  const navTextClass = scrolled
    ? "text-[#1E1E1E]"
    : pathname === "/"
      ? "text-white"
      : "text-[#1E1E1E]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : pathname === "/"
            ? "bg-transparent"
            : "bg-white/95 shadow-sm backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Plane
            className={`h-7 w-7 text-[#C10016] transition-colors`}
          />
          <span className="text-2xl font-bold tracking-tight text-[#C10016]">
            Sky-Pass
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[#C10016] ${
                pathname === link.href ? "text-[#C10016]" : navTextClass
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/booking" className="primary-button px-6 py-2.5 text-sm font-semibold">
            Sign In
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className={navTextClass} />
          ) : (
            <Menu className={navTextClass} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute left-0 right-0 top-full border-t border-gray-100 bg-white px-6 py-4 shadow-lg md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-3 text-sm font-medium transition-colors hover:text-[#C10016] ${
                pathname === link.href ? "text-[#C10016]" : "text-[#1E1E1E]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="primary-button mt-2 block w-full px-6 py-2.5 text-center text-sm font-semibold"
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
