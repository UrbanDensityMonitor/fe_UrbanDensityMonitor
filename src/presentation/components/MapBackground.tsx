// src/presentation/components/MapBackground.tsx
"use client";

export function MapBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-app-bg" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,121,249,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(232,121,249,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Secondary micro-grid */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,171,252,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(240,171,252,0.04) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* SVG city road network mockup */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Major roads - horizontal */}
        <line x1="0" y1="180" x2="1440" y2="180" stroke="#E879F9" strokeWidth="2" filter="url(#glow)" />
        <line x1="0" y1="360" x2="1440" y2="360" stroke="#E879F9" strokeWidth="3" filter="url(#glow)" />
        <line x1="0" y1="540" x2="1440" y2="540" stroke="#E879F9" strokeWidth="2" filter="url(#glow)" />
        <line x1="0" y1="720" x2="1440" y2="720" stroke="#E879F9" strokeWidth="1.5" />

        {/* Major roads - vertical */}
        <line x1="240" y1="0" x2="240" y2="900" stroke="#E879F9" strokeWidth="1.5" />
        <line x1="480" y1="0" x2="480" y2="900" stroke="#E879F9" strokeWidth="2.5" filter="url(#glow)" />
        <line x1="720" y1="0" x2="720" y2="900" stroke="#E879F9" strokeWidth="3" filter="url(#glow)" />
        <line x1="960" y1="0" x2="960" y2="900" stroke="#E879F9" strokeWidth="2" filter="url(#glow)" />
        <line x1="1200" y1="0" x2="1200" y2="900" stroke="#E879F9" strokeWidth="1.5" />

        {/* Secondary roads */}
        <line x1="0" y1="90" x2="1440" y2="90" stroke="#A78BFA" strokeWidth="0.8" opacity="0.5" />
        <line x1="0" y1="270" x2="1440" y2="270" stroke="#A78BFA" strokeWidth="0.8" opacity="0.5" />
        <line x1="0" y1="450" x2="1440" y2="450" stroke="#A78BFA" strokeWidth="0.8" opacity="0.5" />
        <line x1="0" y1="630" x2="1440" y2="630" stroke="#A78BFA" strokeWidth="0.8" opacity="0.5" />
        <line x1="120" y1="0" x2="120" y2="900" stroke="#A78BFA" strokeWidth="0.8" opacity="0.5" />
        <line x1="360" y1="0" x2="360" y2="900" stroke="#A78BFA" strokeWidth="0.8" opacity="0.5" />
        <line x1="600" y1="0" x2="600" y2="900" stroke="#A78BFA" strokeWidth="0.8" opacity="0.5" />
        <line x1="840" y1="0" x2="840" y2="900" stroke="#A78BFA" strokeWidth="0.8" opacity="0.5" />
        <line x1="1080" y1="0" x2="1080" y2="900" stroke="#A78BFA" strokeWidth="0.8" opacity="0.5" />
        <line x1="1320" y1="0" x2="1320" y2="900" stroke="#A78BFA" strokeWidth="0.8" opacity="0.5" />

        {/* Diagonal connectors */}
        <line x1="240" y1="180" x2="480" y2="360" stroke="#F0ABFC" strokeWidth="1.5" opacity="0.4" />
        <line x1="720" y1="360" x2="960" y2="540" stroke="#F0ABFC" strokeWidth="1.5" opacity="0.4" />
        <line x1="480" y1="540" x2="720" y2="720" stroke="#F0ABFC" strokeWidth="1.2" opacity="0.35" />
        <line x1="960" y1="180" x2="1200" y2="360" stroke="#F0ABFC" strokeWidth="1.2" opacity="0.35" />

        {/* Intersection nodes */}
        {[
          [240, 180], [480, 180], [720, 180], [960, 180], [1200, 180],
          [240, 360], [480, 360], [720, 360], [960, 360], [1200, 360],
          [240, 540], [480, 540], [720, 540], [960, 540], [1200, 540],
          [240, 720], [480, 720], [720, 720], [960, 720], [1200, 720],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#E879F9"
            opacity="0.6"
            filter="url(#glow)"
          />
        ))}

        {/* Alert zone circle — center */}
        <circle cx="720" cy="450" r="80" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="8 4" opacity="0.5" />
        <circle cx="720" cy="450" r="40" fill="rgba(239,68,68,0.06)" stroke="#EF4444" strokeWidth="0.8" opacity="0.4" />

        {/* Density hotspot */}
        <circle cx="480" cy="360" r="60" fill="rgba(249,115,22,0.08)" stroke="#F97316" strokeWidth="1" strokeDasharray="6 3" opacity="0.45" />

        {/* Scan ring animation hint */}
        <circle cx="720" cy="450" r="120" fill="none" stroke="#E879F9" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.25" />
      </svg>

      {/* Radial vignette from corners */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #1A171A 100%)",
        }}
      />

      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-72 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(232,121,249,0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
