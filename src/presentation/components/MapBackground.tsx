// src/presentation/components/MapBackground.tsx
"use client";

import { Video, VideoOff } from "lucide-react";

export function MapBackground({ frameBase64 }: { frameBase64?: string | null }) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface-2 border border-border-default">
      {/* Live Video Feed */}
      {frameBase64 ? (
        <>
          <img
            src={frameBase64.startsWith('data:image') ? frameBase64 : `data:image/jpeg;base64,${frameBase64}`}
            alt="Live Stream Feed"
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
          {/* Live badge */}
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1.5 bg-status-danger/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live</span>
            </div>
          </div>
          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-surface-2/90 to-transparent" />
        </>
      ) : (
        /* Empty state — no stream selected */
        <div className="flex flex-col items-center justify-center h-full gap-3 text-text-muted">
          <div className="w-16 h-16 rounded-2xl bg-surface-3 flex items-center justify-center">
            <VideoOff size={28} strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text-secondary">No Live Feed</p>
            <p className="text-xs text-text-muted mt-0.5">Select a CCTV stream to start monitoring</p>
          </div>
        </div>
      )}
    </div>
  );
}
