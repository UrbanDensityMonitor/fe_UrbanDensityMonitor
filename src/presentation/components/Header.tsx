// src/presentation/components/Header.tsx
"use client";

import { Radar, MapPin, Wifi, RefreshCw, ChevronDown, User } from "lucide-react";
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
  const { user, role } = useAuth();

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

  const activeStreams = streams.filter((s) => s.status === "active");
  const selectedStream = streams.find((s) => s.id === selectedStreamId);

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

          {/* Stream Selector */}
          {streams.length > 0 && onStreamChange && (
            <>
              <div className="w-px h-8 bg-white/10 mx-1" />
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-xs"
                >
                  <Wifi size={12} className="text-accent-primary" />
                  <span className="text-text-primary font-medium max-w-[120px] truncate">
                    {selectedStream?.location_name ?? "Select Stream"}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-text-secondary transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 max-h-64 overflow-y-auto bg-panel-bg/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-50 custom-scrollbar">
                    {streams.map((stream) => (
                      <button
                        key={stream.id}
                        onClick={() => {
                          onStreamChange(stream.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs transition-colors text-left ${
                          stream.id === selectedStreamId
                            ? "bg-accent-primary/20 text-accent-primary"
                            : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            stream.id === selectedStreamId
                              ? "bg-accent-primary"
                              : stream.status === "active"
                              ? "bg-emerald-400"
                              : "bg-red-400"
                          }`}
                        />
                        <span className="truncate">{stream.location_name}</span>
                        <span className="ml-auto text-text-secondary/60 capitalize text-[10px]">
                          {stream.stream_type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right — Info */}
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

          <div className="w-px h-6 bg-white/10" />

          {/* User pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10">
            <User size={12} className="text-text-secondary" />
            <span className="text-xs text-text-secondary max-w-[80px] truncate">
              {user?.email?.split("@")[0] ?? "—"}
            </span>
            {role === "admin" && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                ADMIN
              </span>
            )}
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
