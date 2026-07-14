// src/presentation/components/Header.tsx
"use client";

import { Radar, MapPin, Wifi, RefreshCw, ChevronDown, User, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import type { Stream } from "@/domain/entities/TrafficMetric";

interface HeaderProps {
  locationName: string;
  coordinates: { lat: number; lng: number };
  activeCamera: number;
  totalCameras: number;
  isLoading: boolean;
  onRefetch: () => void;
  lastFetchedAt: Date | null;
  // Stream selector props
  streams?: Stream[];
  selectedStreamId?: string | null;
  onStreamChange?: (id: string) => void;
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
  streams = [],
  selectedStreamId,
  onStreamChange,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedStream = streams.find((s) => s.id === selectedStreamId);

  return (
    <header className="sticky top-0 z-40 bg-surface-1/80 backdrop-blur-xl border-b border-border-default">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left — Page Title & Location */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-text-primary leading-none">
              {locationName}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <MapPin size={11} className="text-accent-primary" />
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </span>
              <span className="text-text-muted/30 text-xs">·</span>
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Wifi size={11} className="text-accent-blue" />
                <span className="text-text-secondary font-medium">{activeCamera}</span>/{totalCameras} cameras
              </span>
            </div>
          </div>
        </div>

        {/* Right — Controls */}
        <div className="flex items-center gap-3">
          {/* Stream Selector */}
          {streams.length > 0 && onStreamChange && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border-default transition-all duration-200 text-xs"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                <span className="text-text-primary font-medium max-w-[140px] truncate">
                  {selectedStream?.location_name ?? "Select Stream"}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-text-muted transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 max-h-72 overflow-y-auto bg-surface-2 border border-border-default rounded-xl shadow-dropdown z-50 animate-scale-in">
                  <div className="p-2 border-b border-border-subtle">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted px-2 py-1">
                      Available Streams
                    </p>
                  </div>
                  <div className="p-1">
                    {streams.map((stream) => (
                      <button
                        key={stream.id}
                        onClick={() => {
                          onStreamChange(stream.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all ${
                          stream.id === selectedStreamId
                            ? "bg-accent-muted text-accent-primary"
                            : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            stream.id === selectedStreamId
                              ? "bg-accent-primary"
                              : stream.status === "active"
                              ? "bg-status-success"
                              : "bg-status-danger"
                          }`}
                        />
                        <span className="truncate font-medium">{stream.location_name}</span>
                        <span className="ml-auto text-text-muted capitalize text-[10px]">
                          {stream.stream_type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="w-px h-7 bg-border-subtle" />

          {/* Last sync */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Last sync</span>
            <span className="text-xs font-mono text-text-secondary mt-0.5">
              {formatTime(lastFetchedAt)}
            </span>
          </div>

          {/* Refetch button */}
          <button
            onClick={onRefetch}
            disabled={isLoading}
            className="w-9 h-9 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border-default flex items-center justify-center transition-all duration-200 disabled:opacity-40"
            title="Refresh data"
          >
            <RefreshCw
              size={14}
              className={`text-text-secondary ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
