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
  const vehicleMetrics = metrics.filter((m) => m.category === "vehicle");

  return (
    <div className="flex flex-col gap-4">
      {/* Section: Traffic Flow */}
      <div className="bg-surface-1 border border-border-default rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center">
              <Activity size={15} className="text-accent-primary" />
            </div>
            <h2 className="text-sm font-semibold text-text-primary">Traffic Flow</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Total</p>
            <p className="text-lg font-bold text-gradient">
              {totalVehicles.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {vehicleMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </div>
  );
}
