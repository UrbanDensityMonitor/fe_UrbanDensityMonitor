// src/presentation/components/LoadingOverlay.tsx
"use client";

import { Radar } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-app-bg/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-accent-primary/40 animate-ping" />
          <span className="absolute inset-2 rounded-full border border-accent-primary/20 animate-ping [animation-delay:0.3s]" />
          <Radar size={28} className="text-accent-primary animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary">Connecting to ML Vision</p>
          <p className="text-xs text-text-secondary mt-1">Fetching real-time CCTV data…</p>
        </div>
      </div>
    </div>
  );
}
