// src/app/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";

// Application layer
import { useTrafficData } from "@/application/use-cases/useTrafficData";
import { apiService } from "@/infrastructure/services/apiService";

// Presentation layer — UI components
import { MapBackground } from "@/presentation/components/MapBackground";
import { Sidebar } from "@/presentation/components/Sidebar";
import { Header } from "@/presentation/components/Header";
import { StatsPanel } from "@/presentation/components/StatsPanel";
import { AlertPanel } from "@/presentation/components/AlertPanel";
import { LoadingOverlay } from "@/presentation/components/LoadingOverlay";

export default function Page() {
  const [activeNav, setActiveNav] = useState<string>("home");
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null);

  useEffect(() => {
    apiService.get("/api/streams")
      .then((res) => {
        // Backend Python biasanya me-return list atau object dengan streams
        const streams = Array.isArray(res) ? res : res.data || res.streams || [];
        if (streams.length > 0) {
          // Ambil ID dari CCTV pertama (berdasarkan struktur cctv.id atau id)
          setActiveStreamId(streams[0].id || streams[0].stream_id || streams[0].name || "default-stream");
        }
      })
      .catch((err) => console.error("Gagal menarik daftar CCTV:", err));
  }, []);

  // Application layer: inject data via use-case hook (calls infrastructure service)
  const { data, frameBase64, isLoading, error, refetch, lastFetchedAt } = useTrafficData(
    activeStreamId
  );

  const totalVehicles = useMemo(() => {
    if (!data) return 0;
    return data.metrics
      .filter((m) => m.category === "vehicle")
      .reduce((sum, m) => sum + (typeof m.value === "number" ? m.value : 0), 0);
  }, [data]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-app-bg">
      {/* Layer 0: Full-screen map background or Live Feed */}
      <MapBackground frameBase64={frameBase64} />

      {/* Loading state */}
      {isLoading && !data && <LoadingOverlay />}

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
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      {/* Layer 2: Header */}
      {data && (
        <Header
          locationName={data.locationName}
          coordinates={data.coordinates}
          activeCamera={data.activeCamera}
          totalCameras={data.totalCameras}
          isLoading={isLoading}
          onRefetch={refetch}
          lastFetchedAt={lastFetchedAt}
        />
      )}

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
              ML Model: YOLOv9-Urban · Inference: ~12ms
            </p>
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
