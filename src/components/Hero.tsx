import SearchWidget from "@/components/SearchWidget";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1E1E1E] pt-28 sm:pt-32">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(12,12,18,0.82), rgba(12,12,18,0.45)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#C10016]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#C10016]/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 py-16 text-center sm:py-20">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#C10016]/30 bg-[#C10016]/10 px-4 py-2 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#C10016]" />
          <span className="text-xs font-medium text-[#C10016]">
            Inspired by Istanbul's premium travel experience
          </span>
        </div>

        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
          Your Journey,
          <br />
          <span className="bg-gradient-to-r from-[#C10016] to-[#FF4D6A] bg-clip-text text-transparent">
            Elevated
          </span>
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-400">
          Discover premium flights to over 300 destinations worldwide.
          Experience comfort, reliability, and world-class service with every journey.
        </p>

        <SearchWidget />

        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: "300+", label: "Destinations" },
            { value: "50M+", label: "Passengers" },
            { value: "98%", label: "On-time" },
            { value: "4.8★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
