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

import { Video, MapPin, Wifi, Zap, Clock, Search, X, ArrowLeft } from "lucide-react";

export default function Page() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null);
  const [isStreamsLoading, setIsStreamsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    streamService
      .getStreams()
      .then((data) => {
        setStreams(data);
      })
      .catch((err) => console.error("Failed to load streams:", err))
      .finally(() => setIsStreamsLoading(false));
  }, []);

  // Filter streams by search query (Vercel React best practice: memoized filtering)
  const filteredStreams = useMemo(() => {
    if (!searchQuery.trim()) return streams;
    const q = searchQuery.toLowerCase().trim();
    return streams.filter(
      (s) =>
        s.location_name.toLowerCase().includes(q) ||
        s.stream_type.toLowerCase().includes(q)
    );
  }, [streams, searchQuery]);

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
          locationName={
            selectedStream?.location_name ?? data?.locationName ?? "Dashboard Overview"
          }
          coordinates={data?.coordinates ?? { lat: -6.2088, lng: 106.8456 }}
          activeCamera={data?.activeCamera ?? (activeStreamId ? 1 : 0)}
          totalCameras={
            streams.filter((s) => s.status === "active").length ||
            data?.totalCameras ||
            0
          }
          isLoading={isLoading || isStreamsLoading}
          onRefetch={refetch}
          lastFetchedAt={lastFetchedAt}
          streams={streams}
          selectedStreamId={activeStreamId}
          onStreamChange={(id) => setActiveStreamId(id || null)}
        />

        {/* Loading state with Back / Cancel button */}
        {(isStreamsLoading || (isLoading && !data && activeStreamId)) && (
          <LoadingOverlay
            onCancel={activeStreamId ? () => setActiveStreamId(null) : undefined}
          />
        )}

        {/* Error fallback */}
        {error && !data && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-status-danger/10 border border-status-danger/20 rounded-2xl p-6 text-center max-w-sm animate-fade-in">
              <div className="w-12 h-12 rounded-xl bg-status-danger/10 flex items-center justify-center mx-auto mb-3">
                <Zap size={20} className="text-status-danger" />
              </div>
              <p className="text-status-danger font-semibold mb-2">Connection Error</p>
              <p className="text-sm text-text-muted mb-4">{error}</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setActiveStreamId(null)}
                  className="px-4 py-2 bg-surface-2 border border-border-default rounded-xl text-sm font-medium text-text-primary hover:bg-surface-3 transition-all"
                >
                  Kembali ke Dashboard
                </button>
                <button
                  onClick={refetch}
                  className="px-5 py-2.5 bg-accent-muted border border-accent-primary/30 rounded-xl text-sm font-medium text-accent-primary hover:bg-accent-primary/20 transition-all"
                >
                  Coba Lagi
                </button>
              </div>
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
                {/* Navigation Back Button */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setActiveStreamId(null)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border-default hover:border-accent-primary/30 text-xs font-semibold text-text-secondary hover:text-accent-primary transition-all duration-200 shadow-sm group"
                  >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>Kembali ke Menu CCTV</span>
                  </button>
                </div>

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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-text-primary tracking-tight">
                    Pilih Stream CCTV
                  </h2>
                  <p className="text-sm text-text-muted mt-1">
                    Pilih kamera CCTV kota Semarang untuk memulai pemantauan AI
                  </p>
                </div>

                {/* Search Bar Input */}
                <div className="relative w-full md:w-80">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari jalan / nama CCTV..."
                    className="w-full bg-surface-1 border border-border-default rounded-xl pl-10 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                      title="Hapus pencarian"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Stats & Result Counter */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-surface-1 border border-border-default rounded-xl px-4 py-2.5 flex items-center gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                        Total Kamera
                      </p>
                      <p className="text-lg font-bold text-text-primary">
                        {streams.length}
                      </p>
                    </div>
                    <div className="h-6 w-px bg-border-default" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                        Aktif
                      </p>
                      <p className="text-lg font-bold text-status-success">
                        {streams.filter((s) => s.status === "active").length}
                      </p>
                    </div>
                  </div>

                  {searchQuery && (
                    <div className="text-xs text-text-secondary">
                      Menampilkan{" "}
                      <span className="font-bold text-accent-primary">
                        {filteredStreams.length}
                      </span>{" "}
                      dari {streams.length} kamera
                    </div>
                  )}
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-text-muted hover:text-accent-primary underline transition-colors"
                  >
                    Reset Pencarian
                  </button>
                )}
              </div>

              {/* Stream Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredStreams.map((stream) => (
                  <div
                    key={stream.id}
                    onClick={() => setActiveStreamId(stream.id)}
                    className="group bg-surface-1 border border-border-default rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-accent-primary/30 hover:bg-surface-2 card-interactive card-accent-stripe"
                  >
                    {/* Camera icon */}
                    <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center mb-3 group-hover:shadow-card-glow transition-all">
                      <Video size={18} className="text-accent-primary" />
                    </div>

                    <h3
                      className="text-sm font-semibold text-text-primary mb-1 leading-tight truncate"
                      title={stream.location_name}
                    >
                      {stream.location_name}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-text-muted capitalize font-medium">
                        {stream.stream_type}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          stream.status === "active"
                            ? "bg-status-success/10 text-status-success"
                            : "bg-surface-3 text-text-muted"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            stream.status === "active"
                              ? "bg-status-success"
                              : "bg-text-muted"
                          }`}
                        />
                        {stream.status === "active" ? "AI Ready" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty Search Result State */}
              {filteredStreams.length === 0 && (
                <div className="text-center p-12 bg-surface-1 rounded-2xl border border-border-default mt-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-3 flex items-center justify-center mx-auto mb-4">
                    <Search size={28} className="text-text-muted" strokeWidth={1.5} />
                  </div>
                  <p className="text-text-secondary font-medium">
                    CCTV tidak ditemukan
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    Tidak ada kamera yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 px-4 py-2 bg-surface-2 border border-border-default rounded-xl text-xs font-semibold text-text-primary hover:bg-surface-3 transition-colors"
                    >
                      Tampilkan Semua CCTV
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
