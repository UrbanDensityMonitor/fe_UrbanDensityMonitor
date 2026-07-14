// src/presentation/components/LoadingOverlay.tsx
"use client";

import { Radar } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-app-bg/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-accent-primary/30 animate-ping" />
          <span className="absolute inset-2 rounded-full border border-accent-primary/15 animate-ping [animation-delay:0.3s]" />
          <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center shadow-card-glow">
            <Radar size={24} className="text-accent-primary animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary">Connecting to ML Vision</p>
          <p className="text-xs text-text-muted mt-1.5">Fetching real-time CCTV data…</p>
        </div>
        {/* Loading bar */}
        <div className="w-48 h-1 rounded-full bg-surface-3 overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-accent-gradient animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
        </div>
      </div>
    </div>
  );
}
