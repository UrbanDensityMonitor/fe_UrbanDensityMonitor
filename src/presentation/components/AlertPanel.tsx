// src/presentation/components/AlertPanel.tsx
"use client";

import { AlertTriangle, Bell, CheckCircle2, Clock } from "lucide-react";
import type { AlertStatus } from "@/domain/entities/TrafficMetric";

interface AlertPanelProps {
  alerts: AlertStatus[];
}

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}

const severityConfig = {
  critical: { dot: "bg-red-500", text: "text-red-400", ring: "ring-red-500/20" },
  high: { dot: "bg-orange-500", text: "text-orange-400", ring: "ring-orange-500/20" },
  medium: { dot: "bg-yellow-500", text: "text-yellow-400", ring: "ring-yellow-500/20" },
  low: { dot: "bg-blue-400", text: "text-blue-400", ring: "ring-blue-400/20" },
};

export function AlertPanel({ alerts }: AlertPanelProps) {
  const activeAlerts = alerts.filter((a) => a.isActive);

  return (
    <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-accent-primary" />
          <h2 className="text-sm font-semibold text-text-primary">Active Alerts</h2>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400">
          {activeAlerts.length}
        </span>
      </div>

      {/* Alert list */}
      <div className="flex flex-col gap-2">
        {alerts.map((alert) => {
          const cfg = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={`
                flex items-start gap-3 p-3 rounded-xl bg-card-bg border border-white/8
                ${alert.isActive ? `ring-1 ${cfg.ring}` : "opacity-50"}
                transition-all duration-200
              `}
            >
              {/* Severity dot */}
              <div className="mt-0.5 flex-shrink-0">
                {alert.isActive ? (
                  <span className={`block w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                ) : (
                  <CheckCircle2 size={14} className="text-text-secondary" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-medium leading-snug ${
                    alert.isActive ? cfg.text : "text-text-secondary"
                  }`}
                >
                  {alert.message}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {alert.locationZone && (
                    <span className="text-xs text-text-secondary truncate">
                      {alert.locationZone}
                    </span>
                  )}
                  <span className="text-text-secondary/40">·</span>
                  <span className="flex items-center gap-0.5 text-xs text-text-secondary">
                    <Clock size={10} />
                    {timeAgo(alert.timestamp)}
                  </span>
                </div>
              </div>

              {/* Alert type icon */}
              {alert.isActive && (
                <AlertTriangle size={12} className={cfg.text} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
