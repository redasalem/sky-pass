import SearchWidget from "@/components/SearchWidget";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] pt-28 sm:pt-32">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(10,10,10,0.8), rgba(10,10,10,0.5), transparent), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#C10016]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#C10016]/10 blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 py-16 text-center sm:py-20 animate-fade-in-up">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#C10016]/30 bg-[#C10016]/10 px-4 py-2 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#C10016]" />
          <span className="text-xs font-semibold tracking-wider text-[#C10016] uppercase">
            Turkish Airlines Inspired
          </span>
        </div>

        <h1 className="mb-6 text-6xl font-black tracking-tight text-white sm:text-7xl md:text-8xl">
          Fly Beyond
          <br />
          <span className="text-[#C10016]">Boundaries</span>
        </h1>

        <p className="mx-auto mb-16 max-w-2xl text-lg text-gray-400 font-medium">
          Experience world-class service, comfort, and reliability. Discover premium flights to over 300 destinations worldwide.
        </p>

        <SearchWidget />

        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: "300+", label: "Destinations" },
            { value: "50M+", label: "Passengers" },
            { value: "98%", label: "On-time" },
            { value: "4.8★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="text-4xl font-black text-white mb-2">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
    </section>
  );
}
