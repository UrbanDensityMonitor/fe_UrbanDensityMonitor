// src/app/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";

// Application layer
import { useTrafficData } from "@/application/use-cases/useTrafficData";
import { streamService } from "@/infrastructure/services/streamService";
import type { Stream } from "@/domain/entities/TrafficMetric";

// Presentation layer — UI components
import { MapBackground } from "@/presentation/components/MapBackground";
import { Sidebar } from "@/presentation/components/Sidebar";
import { Header } from "@/presentation/components/Header";
import { StatsPanel } from "@/presentation/components/StatsPanel";
import { AlertPanel } from "@/presentation/components/AlertPanel";
import { LoadingOverlay } from "@/presentation/components/LoadingOverlay";

import { Video, MapPin, Wifi, Zap, Clock } from "lucide-react";

export default function Page() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null);
  const [isStreamsLoading, setIsStreamsLoading] = useState(true);

  useEffect(() => {
    streamService
      .getStreams()
      .then((data) => {
        setStreams(data);
        // Removed auto-select so user can see the grid menu
      })
      .catch((err) => console.error("Failed to load streams:", err))
      .finally(() => setIsStreamsLoading(false));
  }, []);

  // Application layer: inject data via use-case hook (calls infrastructure service)
  const { data, frameBase64, isLoading, error, refetch, lastFetchedAt } =
    useTrafficData(activeStreamId);

  const totalVehicles = useMemo(() => {
    if (!data) return 0;
    return data.metrics
      .filter((m) => m.category === "vehicle")
      .reduce((sum, m) => sum + (typeof m.value === "number" ? m.value : 0), 0);
  }, [data]);

  // Resolve selected stream's location name
  const selectedStream = streams.find((s) => s.id === activeStreamId);

  return (
    <div className="flex min-h-screen bg-app-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        {/* Header */}
        <Header
          locationName={selectedStream?.location_name ?? data?.locationName ?? "Dashboard Overview"}
          coordinates={data?.coordinates ?? { lat: -6.2088, lng: 106.8456 }}
          activeCamera={data?.activeCamera ?? (activeStreamId ? 1 : 0)}
          totalCameras={streams.filter((s) => s.status === "active").length || data?.totalCameras || 0}
          isLoading={isLoading || isStreamsLoading}
          onRefetch={refetch}
          lastFetchedAt={lastFetchedAt}
          streams={streams}
          selectedStreamId={activeStreamId}
          onStreamChange={(id) => setActiveStreamId(id)}
        />

        {/* Loading state */}
        {(isStreamsLoading || (isLoading && !data && activeStreamId)) && <LoadingOverlay />}

        {/* Error fallback */}
        {error && !data && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-status-danger/10 border border-status-danger/20 rounded-2xl p-6 text-center max-w-sm animate-fade-in">
              <div className="w-12 h-12 rounded-xl bg-status-danger/10 flex items-center justify-center mx-auto mb-3">
                <Zap size={20} className="text-status-danger" />
              </div>
              <p className="text-status-danger font-semibold mb-2">Connection Error</p>
              <p className="text-sm text-text-muted mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-5 py-2.5 bg-accent-muted border border-accent-primary/30 rounded-xl text-sm font-medium text-accent-primary hover:bg-accent-primary/20 transition-all"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* When a stream is active — show dashboard grid */}
          {data && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Left column — Live Feed (takes 2 cols) */}
              <div className="lg:col-span-2">
                <div className="h-[420px]">
                  <MapBackground frameBase64={frameBase64} />
                </div>

                {/* Scanning indicator */}
                <div className="flex items-center gap-4 mt-4 px-1">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse-dot" />
                    <span className="font-medium">Scanning Zone A–G</span>
                  </div>
                  <span className="text-text-muted/20">·</span>
                  <span className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Clock size={11} />
                    {new Date().toLocaleDateString("id-ID", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="text-text-muted/20">·</span>
                  <span className="text-[11px] text-text-muted font-mono">
                    ML Model: YOLOv8n · Python FastAPI
                  </span>
                </div>
              </div>

              {/* Right column — Stats + Alerts */}
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
                <StatsPanel metrics={data.metrics} totalVehicles={totalVehicles} />
                <AlertPanel alerts={data.alerts} />
              </div>
            </div>
          )}

          {/* CCTV Selection Menu Grid — when no stream selected */}
          {!activeStreamId && !isStreamsLoading && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  Select a CCTV Stream
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Choose a camera feed from the database to begin monitoring
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-surface-1 border border-border-default rounded-xl p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-1">Total Cameras</p>
                  <p className="text-2xl font-bold text-text-primary">{streams.length}</p>
                </div>
                <div className="bg-surface-1 border border-border-default rounded-xl p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-1">Active</p>
                  <p className="text-2xl font-bold text-status-success">{streams.filter(s => s.status === "active").length}</p>
                </div>
                <div className="bg-surface-1 border border-border-default rounded-xl p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-1">Inactive</p>
                  <p className="text-2xl font-bold text-text-muted">{streams.filter(s => s.status !== "active").length}</p>
                </div>
              </div>

              {/* Stream Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {streams.map((stream) => (
                  <div
                    key={stream.id}
                    onClick={() => setActiveStreamId(stream.id)}
                    className="group bg-surface-1 border border-border-default rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-accent-primary/30 hover:bg-surface-2 card-interactive card-accent-stripe"
                  >
                    {/* Camera icon */}
                    <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center mb-3 group-hover:shadow-card-glow transition-all">
                      <Video size={18} className="text-accent-primary" />
                    </div>

                    <h3 className="text-sm font-semibold text-text-primary mb-1 leading-tight truncate" title={stream.location_name}>
                      {stream.location_name}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-text-muted capitalize font-medium">
                        {stream.stream_type}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        stream.status === "active"
                          ? "bg-status-success/10 text-status-success"
                          : "bg-surface-3 text-text-muted"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          stream.status === "active" ? "bg-status-success" : "bg-text-muted"
                        }`} />
                        {stream.status === "active" ? "AI Ready" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {streams.length === 0 && (
                <div className="text-center p-12 bg-surface-1 rounded-2xl border border-border-default mt-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-3 flex items-center justify-center mx-auto mb-4">
                    <Video size={28} className="text-text-muted" strokeWidth={1.5} />
                  </div>
                  <p className="text-text-secondary font-medium">No cameras available</p>
                  <p className="text-sm text-text-muted mt-1">
                    Add a CCTV stream in the Streams page to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
