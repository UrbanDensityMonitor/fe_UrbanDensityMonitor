// src/presentation/components/AlertPanel.tsx
"use client";

import { AlertTriangle, Bell, CheckCircle2, Clock, Shield } from "lucide-react";
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
  critical: { dot: "bg-status-danger", text: "text-status-danger", bg: "bg-status-danger/8", ring: "ring-status-danger/20" },
  high: { dot: "bg-orange-500", text: "text-orange-400", bg: "bg-orange-500/8", ring: "ring-orange-500/20" },
  medium: { dot: "bg-status-warning", text: "text-status-warning", bg: "bg-status-warning/8", ring: "ring-status-warning/20" },
  low: { dot: "bg-status-info", text: "text-status-info", bg: "bg-status-info/8", ring: "ring-status-info/20" },
};

export function AlertPanel({ alerts }: AlertPanelProps) {
  const activeAlerts = alerts.filter((a) => a.isActive);

  return (
    <div className="bg-surface-1 border border-border-default rounded-2xl p-5">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center">
            <Bell size={15} className="text-accent-blue" />
          </div>
          <h2 className="text-sm font-semibold text-text-primary">Active Alerts</h2>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-status-danger/10 border border-status-danger/20 text-xs font-bold text-status-danger">
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
                flex items-start gap-3 p-3 rounded-xl border transition-all duration-200
                ${alert.isActive
                  ? `${cfg.bg} border-white/8 ring-1 ${cfg.ring}`
                  : "bg-surface-2/50 border-border-subtle opacity-50"
                }
              `}
            >
              {/* Severity dot */}
              <div className="mt-0.5 flex-shrink-0">
                {alert.isActive ? (
                  <span className={`block w-2 h-2 rounded-full ${cfg.dot} animate-pulse-dot`} />
                ) : (
                  <CheckCircle2 size={14} className="text-text-muted" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-medium leading-snug ${
                    alert.isActive ? cfg.text : "text-text-muted"
                  }`}
                >
                  {alert.message}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {alert.locationZone && (
                    <span className="text-[11px] text-text-muted truncate">
                      {alert.locationZone}
                    </span>
                  )}
                  <span className="text-text-muted/30">·</span>
                  <span className="flex items-center gap-0.5 text-[11px] text-text-muted">
                    <Clock size={10} />
                    {timeAgo(alert.timestamp)}
                  </span>
                </div>
              </div>

              {/* Alert type icon */}
              {alert.isActive && (
                <AlertTriangle size={13} className={cfg.text} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
