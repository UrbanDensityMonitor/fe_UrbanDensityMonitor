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
    <main className="relative w-screen h-screen overflow-hidden bg-app-bg">
      {/* Layer 0: Full-screen map background or Live Feed */}
      <MapBackground frameBase64={frameBase64} />

      {/* Loading state */}
      {(isStreamsLoading || (isLoading && !data && activeStreamId)) && <LoadingOverlay />}

      {/* Error fallback */}
      {error && !data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-red-950/80 border border-red-500/30 rounded-2xl p-6 text-center max-w-sm backdrop-blur-md">
            <p className="text-red-400 font-semibold mb-2">Connection Error</p>
            <p className="text-sm text-text-secondary mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-accent-primary/20 border border-accent-primary/30 rounded-xl text-sm text-accent-soft hover:bg-accent-primary/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Layer 1: Sidebar */}
      <Sidebar />

      {/* Layer 2: Header */}
      <Header
        locationName={selectedStream?.location_name ?? data?.locationName ?? "No Stream Selected"}
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

      {/* Layer 3: Floating panels */}
      {data && (
        <div className="fixed right-4 top-20 bottom-4 z-40 flex flex-col gap-3 w-[340px] overflow-y-auto">
          {/* Stats grid */}
          <StatsPanel metrics={data.metrics} totalVehicles={totalVehicles} />

          {/* Alerts */}
          <AlertPanel alerts={data.alerts} />

          {/* Footer info */}
          <div className="text-center pb-1">
            <p className="text-xs text-text-secondary/50 font-mono">
              ML Model: YOLOv8n · Python FastAPI Backend
            </p>
          </div>
        </div>
      )}

      {/* CCTV Selection Menu Grid */}
      {!activeStreamId && !isStreamsLoading && (
        <div className="fixed inset-0 z-40 p-6 sm:p-12 md:pl-32 overflow-y-auto pointer-events-auto custom-scrollbar bg-black/40 backdrop-blur-sm">
          <div className="max-w-[1000px] mt-24 pb-20">
            <h2 className="text-[18px] font-bold text-[#ccc] mb-4 flex items-center gap-2">
              <span className="text-xl">🎥</span> Daftar CCTV dari Database
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {streams.map((stream) => (
                <div
                  key={stream.id}
                  onClick={() => setActiveStreamId(stream.id)}
                  className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-3 cursor-pointer transition-colors duration-150 hover:bg-[#333]"
                >
                  <div className="text-[13px] font-bold text-[#eee] mb-1 leading-tight flex items-center justify-between gap-2">
                    <span className="truncate" title={stream.location_name}>{stream.location_name}</span>
                    <span className="inline-block text-[10px] px-1.5 py-[2px] rounded-full bg-[#2ecc71] text-black font-semibold flex-shrink-0">
                      AI
                    </span>
                  </div>
                  <div className="text-[11px] text-[#888] capitalize">
                    {stream.stream_type}
                  </div>
                </div>
              ))}
            </div>
            
            {streams.length === 0 && (
              <div className="text-center p-8 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] mt-4">
                <p className="text-[#888] text-sm">Belum ada CCTV di database.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scanning indicator — bottom left */}
      {data && (
        <div className="fixed bottom-4 left-20 z-40">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
              Scanning Zone A–G
            </span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-xs font-mono text-accent-soft/70">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
