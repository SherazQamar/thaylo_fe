const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function RegisterStepLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#111023]">
      <p className="text-white/50 text-sm" style={inter}>
        Loading…
      </p>
    </div>
  );
}

export function RegisterStepError() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#111023] px-6">
      <div className="max-w-md text-center">
        <p className="text-white text-lg font-semibold mb-2" style={inter}>
          Unable to load this step
        </p>
        <p className="text-white/60 text-sm" style={inter}>
          Please try again later.
        </p>
      </div>
    </div>
  );
}
