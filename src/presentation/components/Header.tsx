// src/presentation/components/Header.tsx
"use client";

import { Radar, MapPin, Wifi, RefreshCw } from "lucide-react";

interface HeaderProps {
  locationName: string;
  coordinates: { lat: number; lng: number };
  activeCamera: number;
  totalCameras: number;
  isLoading: boolean;
  onRefetch: () => void;
  lastFetchedAt: Date | null;
}

function formatTime(date: Date | null): string {
  if (!date) return "--:--:--";
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function Header({
  locationName,
  coordinates,
  activeCamera,
  totalCameras,
  isLoading,
  onRefetch,
  lastFetchedAt,
}: HeaderProps) {
  return (
    <header className="fixed top-4 left-20 right-4 z-50">
      <div className="flex items-center justify-between bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3">
        {/* Left — Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center">
              <Radar size={16} className="text-accent-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary leading-none tracking-wide">
                URBAN DENSITY
              </h1>
              <p className="text-xs text-text-secondary mt-0.5 tracking-wider uppercase">
                ML Vision Dashboard
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-white/10 mx-1" />

          {/* System status */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              System Online
            </span>
          </div>
        </div>

        {/* Right — Location & camera info */}
        <div className="flex items-center gap-4">
          {/* Last updated */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-text-secondary">Last sync</span>
            <span className="text-xs font-mono text-text-primary">
              {formatTime(lastFetchedAt)}
            </span>
          </div>

          <div className="w-px h-6 bg-white/10" />

          {/* Camera status */}
          <div className="flex items-center gap-1.5">
            <Wifi size={13} className="text-accent-soft" />
            <span className="text-xs text-text-secondary">
              <span className="text-text-primary font-semibold">{activeCamera}</span>
              /{totalCameras} cams
            </span>
          </div>

          <div className="w-px h-6 bg-white/10" />

          {/* Location */}
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-accent-primary" />
            <div>
              <p className="text-xs font-semibold text-text-primary leading-none">
                {locationName}
              </p>
              <p className="text-xs text-text-secondary font-mono">
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Refetch button */}
          <button
            onClick={onRefetch}
            disabled={isLoading}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-200 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw
              size={13}
              className={`text-text-secondary ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
