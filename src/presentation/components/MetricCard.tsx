// src/presentation/components/MetricCard.tsx
"use client";

import {
  Car,
  Bike,
  Truck,
  Bus,
  User,
  BarChart2,
  AlertTriangle,
  Megaphone,
  LucideIcon,
} from "lucide-react";
import type { TrafficMetric } from "@/domain/entities/TrafficMetric";

const iconMap: Record<string, LucideIcon> = {
  Car,
  Bike,
  Truck,
  Bus,
  User,
  BarChart2,
  AlertTriangle,
  Megaphone,
};

interface MetricCardProps {
  metric: TrafficMetric;
}

function formatValue(value: number | string): string {
  if (typeof value === "string") return value;
  if (value >= 1000) return value.toLocaleString("id-ID");
  return value.toString();
}

function getTrendColor(trend?: number): string {
  if (trend === undefined) return "";
  if (trend > 0) return "text-emerald-400";
  if (trend < 0) return "text-red-400";
  return "text-text-secondary";
}

export function MetricCard({ metric }: MetricCardProps) {
  const IconComponent = iconMap[metric.iconName] ?? Car;
  const isAlert = metric.category === "alert" || metric.category === "anomaly";
  const isAnomaly = metric.status === "critical";

  return (
    <div
      className={`
        group relative bg-card-bg rounded-xl border border-white/10
        p-4 transition-all duration-300 cursor-default
        hover:-translate-y-1 hover:shadow-card-hover hover:border-white/20
        ${isAnomaly ? "ring-1 ring-red-500/30" : ""}
      `}
    >
      {/* Subtle glow for critical items */}
      {isAnomaly && (
        <div className="absolute inset-0 rounded-xl bg-red-500/5 pointer-events-none" />
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Top-left: Icon + Label */}
        <div className="flex items-center gap-2">
          <div
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${metric.colorAccent}18` }}
          >
            <IconComponent
              size={15}
              style={{ color: metric.colorAccent }}
              strokeWidth={isAlert ? 2.5 : 2}
            />
          </div>
          <span className="text-xs font-medium text-text-secondary leading-tight truncate">
            {metric.label}
          </span>
        </div>

        {/* Top-right: Status badge */}
        <div className="flex items-center justify-end">
          {metric.status === "critical" && (
            <span className="flex items-center gap-1 text-xs font-semibold text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              LIVE
            </span>
          )}
          {metric.status === "warning" && (
            <span className="flex items-center gap-1 text-xs font-semibold text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse-slow" />
              HIGH
            </span>
          )}
        </div>

        {/* Bottom-left: Big value */}
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-2xl font-bold leading-none tracking-tight ${
              isAnomaly ? "text-red-300" : "text-text-primary"
            }`}
          >
            {formatValue(metric.value)}
          </span>
        </div>

        {/* Bottom-right: Unit + trend */}
        <div className="flex flex-col items-end justify-end gap-0.5">
          <span className="text-xs text-text-secondary">{metric.unit}</span>
          {metric.trend !== undefined && (
            <span className={`text-xs font-medium ${getTrendColor(metric.trend)}`}>
              {metric.trend > 0 ? "↑" : "↓"} {Math.abs(metric.trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
