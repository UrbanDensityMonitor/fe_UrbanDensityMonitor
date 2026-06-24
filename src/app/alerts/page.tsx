"use client";
// src/app/alerts/page.tsx

import { useState, useEffect, useCallback, useRef } from "react";
import { PageLayout } from "@/presentation/components/PageLayout";
import { alertService } from "@/infrastructure/services/alertService";
import { streamService } from "@/infrastructure/services/streamService";
import type { AlertRecord, Stream } from "@/domain/entities/TrafficMetric";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Filter,
  RefreshCw,
  Loader2,
  BellOff,
  Check,
} from "lucide-react";

const alertTypeBadge: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  "High Density": {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
    icon: "🚨",
  },
  "Human Anomaly": {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
    icon: "🚨",
  },
};

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
  return `${Math.floor(diffMin / 1440)}d ago`;
}

const PAGE_SIZE = 20;

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);

  // Filters
  const [streams, setStreams] = useState<Stream[]>([]);
  const [filterStreamId, setFilterStreamId] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterRead, setFilterRead] = useState<string>(""); // "" | "false" | "true"

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAlerts = useCallback(
    async (resetOffset = false) => {
      const newOffset = resetOffset ? 0 : offset;
      if (resetOffset) setOffset(0);

      setIsLoading(true);
      setError(null);
      try {
        const params: Parameters<typeof alertService.getAlerts>[0] = {
          limit: PAGE_SIZE,
          offset: newOffset,
        };
        if (filterStreamId) params.stream_id = filterStreamId;
        if (filterRead !== "") params.is_read = filterRead === "true";

        const res = await alertService.getAlerts(params);
        let data = res.data;
        if (filterType) {
          data = data.filter((a) => a.alert_type === filterType);
        }
        setAlerts(data);
        setTotal(res.total);
      } catch (err: any) {
        setError(err.message || "Failed to load alerts.");
      } finally {
        setIsLoading(false);
      }
    },
    [filterStreamId, filterType, filterRead, offset]
  );

  // Load streams for filter
  useEffect(() => {
    streamService.getStreams().then(setStreams).catch(() => {});
  }, []);

  // Initial load + polling every 30s
  useEffect(() => {
    fetchAlerts(true);
    pollingRef.current = setInterval(() => fetchAlerts(true), 30000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStreamId, filterType, filterRead]);

  const handleMarkRead = async (id: string) => {
    setMarkingId(id);
    try {
      await alertService.markAsRead(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_read: true } : a))
      );
    } catch {
      /* ignore */
    } finally {
      setMarkingId(null);
    }
  };

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto pt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                Alert Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary mt-1">
              Real-time alerts from ML density detection. Auto-refreshes every 30s.
            </p>
          </div>
          <button
            onClick={() => fetchAlerts(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm text-text-secondary transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Filter size={13} />
            <span>Filter:</span>
          </div>

          {/* Alert type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all"
          >
            <option value="">All Types</option>
            <option value="High Density">High Density</option>
            <option value="Human Anomaly">Human Anomaly</option>
          </select>

          {/* Stream */}
          <select
            value={filterStreamId}
            onChange={(e) => setFilterStreamId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all"
          >
            <option value="">All Streams</option>
            {streams.map((s) => (
              <option key={s.id} value={s.id}>
                {s.location_name}
              </option>
            ))}
          </select>

          {/* Read status */}
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all"
          >
            <option value="">All Status</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && alerts.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-accent-primary" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && alerts.length === 0 && !error && (
          <div className="text-center py-20 bg-black/30 border border-white/8 rounded-2xl">
            <BellOff size={36} className="text-text-secondary/30 mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No alerts</p>
            <p className="text-sm text-text-secondary/60 mt-1">
              Alerts will appear here when High Density or Anomaly is detected.
            </p>
          </div>
        )}

        {/* Alert cards */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const cfg =
                alertTypeBadge[alert.alert_type] ?? alertTypeBadge["High Density"];
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                    alert.is_read
                      ? "bg-black/30 border-white/8 opacity-60"
                      : `${cfg.bg} ${cfg.border} border`
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${cfg.bg} border ${cfg.border}`}
                  >
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${cfg.text}`}
                      >
                        {alert.alert_type}
                      </span>
                      {alert.is_read ? (
                        <span className="text-xs text-text-secondary/50 flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          Read
                        </span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-text-primary mt-1 leading-snug">
                      {alert.alert_message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                      {alert.stream_location && (
                        <span>📍 {alert.stream_location}</span>
                      )}
                      <span>{timeAgo(alert.created_at)}</span>
                      <span className="font-mono text-text-secondary/50">
                        {new Date(alert.created_at).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  {!alert.is_read && (
                    <button
                      onClick={() => handleMarkRead(alert.id)}
                      disabled={markingId === alert.id}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all disabled:opacity-50"
                      title="Mark as read"
                    >
                      {markingId === alert.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Check size={12} />
                      )}
                      Mark read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-text-secondary">
              Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of{" "}
              {total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setOffset((o) => Math.max(0, o - PAGE_SIZE));
                  fetchAlerts();
                }}
                disabled={offset === 0 || isLoading}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs text-text-secondary hover:bg-white/5 transition-all disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  setOffset((o) => o + PAGE_SIZE);
                  fetchAlerts();
                }}
                disabled={offset + PAGE_SIZE >= total || isLoading}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs text-text-secondary hover:bg-white/5 transition-all disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
