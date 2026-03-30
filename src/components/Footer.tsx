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
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A] text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2 group">
              <Plane className="h-6 w-6 text-[#C10016] transition-transform group-hover:scale-110" />
              <span className="text-xl font-black text-white tracking-tight">SKY-PASS</span>
            </Link>
            <p className="mb-6 text-sm font-medium leading-relaxed text-gray-400">
              Redefining air travel with premium service, unmatched comfort, and
              destinations that inspire.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] transition-colors hover:bg-[#C10016] hover:border-[#C10016]"
                >
                  <Icon className="h-4 w-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#C10016]">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
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
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#1A1A1A] border border-[#2A2A2A] p-8 md:flex-row relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C10016]/5 rounded-full blur-3xl" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C10016]/10">
              <Mail className="h-5 w-5 text-[#C10016]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Stay updated with premium offers
              </h4>
              <p className="text-sm font-medium text-gray-400">
                Subscribe for exclusive flight deals and news.
              </p>
            </div>
          </div>
          <div className="flex w-full max-w-md gap-3 relative z-10">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-full bg-[#0A0A0A] border border-[#2A2A2A] px-6 py-3 text-sm font-medium text-white placeholder-gray-500 outline-none focus:border-[#C10016] transition-colors"
            />
            <button
              type="button"
              className="primary-button text-sm font-bold"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#2A2A2A] pt-8 md:flex-row">
          <p className="text-sm font-medium text-gray-500">
            © {new Date().getFullYear()} Sky-Pass. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
