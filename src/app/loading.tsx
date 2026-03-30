export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="flex flex-col items-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] shadow-inner mb-6">
          <svg className="absolute h-full w-full animate-spin text-[#C10016]/20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
          <svg className="absolute h-full w-full animate-[spin_2s_linear_infinite] text-[#C10016]" viewBox="0 0 100 100" strokeDasharray="300" strokeDashoffset="250">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <svg
            className="h-8 w-8 text-[#C10016]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">
          Loading Sky-Pass
        </h2>
        <p className="mt-2 text-sm font-medium text-gray-500">Preparing your premium experience...</p>
      </div>
    </div>
  );
}
