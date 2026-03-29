import { Plane, Mail, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { label: "Flights", href: "/flights" },
      { label: "Destinations", href: "/destinations" },
      { label: "Deals", href: "/flights" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Plane className="h-6 w-6 text-[#C10016]" />
              <span className="text-xl font-bold text-white">Sky-Pass</span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed">
              Redefining air travel with premium service, unmatched comfort, and
              destinations that inspire.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-[#C10016]"
                >
                  <Icon className="h-4 w-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#2a2a2a] p-8 md:flex-row">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#C10016]" />
            <div>
              <h4 className="text-sm font-semibold text-white">
                Stay updated with deals
              </h4>
              <p className="text-xs text-gray-400">
                Subscribe for exclusive flight offers
              </p>
            </div>
          </div>
          <div className="flex w-full max-w-md gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-full bg-gray-700 px-5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#C10016]"
            />
            <button
              type="button"
              className="rounded-full bg-[#C10016] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a00012]"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-xs">
            © {new Date().getFullYear()} Sky-Pass. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs hover:text-white">Terms</Link>
            <Link href="#" className="text-xs hover:text-white">Privacy</Link>
            <Link href="#" className="text-xs hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
