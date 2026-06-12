// src/presentation/components/StatsPanel.tsx
"use client";

import { Activity } from "lucide-react";
import { MetricCard } from "./MetricCard";
import type { TrafficMetric } from "@/domain/entities/TrafficMetric";

interface StatsPanelProps {
  metrics: TrafficMetric[];
  totalVehicles: number;
}

export function StatsPanel({ metrics, totalVehicles }: StatsPanelProps) {
  const vehicleMetrics = metrics.filter((m) => m.category === "vehicle" || m.category === "person");
  const alertMetrics = metrics.filter((m) => m.category === "density" || m.category === "alert" || m.category === "anomaly");

  return (
    <div className="flex flex-col gap-3">
      {/* Section: Traffic Flow */}
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-accent-primary" />
            <h2 className="text-sm font-semibold text-text-primary">Traffic Flow</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-secondary">Total</p>
            <p className="text-sm font-bold text-accent-soft">
              {totalVehicles.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {vehicleMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      {/* Section: Alerts & Density */}
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <h2 className="text-sm font-semibold text-text-primary">Anomaly Detection</h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {alertMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </div>
  );
}
