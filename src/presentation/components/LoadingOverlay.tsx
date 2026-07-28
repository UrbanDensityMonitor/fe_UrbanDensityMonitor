// src/presentation/components/LoadingOverlay.tsx
"use client";

import { Radar, ArrowLeft } from "lucide-react";

interface LoadingOverlayProps {
  onCancel?: () => void;
  message?: string;
  subMessage?: string;
}

export function LoadingOverlay({
  onCancel,
  message = "Connecting to ML Vision",
  subMessage = "Fetching real-time CCTV data…",
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-app-bg/90 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-5 max-w-sm px-6">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-accent-primary/30 animate-ping" />
          <span className="absolute inset-2 rounded-full border border-accent-primary/15 animate-ping [animation-delay:0.3s]" />
          <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center shadow-card-glow">
            <Radar size={24} className="text-accent-primary animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary">{message}</p>
          <p className="text-xs text-text-muted mt-1.5">{subMessage}</p>
        </div>
        {/* Loading bar */}
        <div className="w-48 h-1 rounded-full bg-surface-3 overflow-hidden">
          <div
            className="h-full w-1/2 rounded-full bg-accent-gradient animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>

        {/* Back / Cancel button */}
        {onCancel && (
          <div className="mt-3">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border-default hover:border-accent-primary/40 text-xs font-semibold text-text-primary hover:text-accent-primary transition-all duration-200 shadow-sm"
            >
              <ArrowLeft size={14} />
              <span>Batal / Kembali ke Dashboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
