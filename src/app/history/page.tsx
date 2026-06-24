"use client";
// src/app/history/page.tsx

import { useState, useEffect, useCallback } from "react";
import { PageLayout } from "@/presentation/components/PageLayout";
import { historyService } from "@/infrastructure/services/historyService";
import { streamService } from "@/infrastructure/services/streamService";
import type { HistoryRecord, Stream, DensityStatus } from "@/domain/entities/TrafficMetric";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Inbox,
} from "lucide-react";


const densityBadge: Record<DensityStatus, { bg: string; text: string; border: string }> = {
  "Low Density": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  "Medium Density": {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
  },
  "High Density": {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  Anomaly: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
};

const PAGE_SIZE = 50;

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [streams, setStreams] = useState<Stream[]>([]);
  const [filterStreamId, setFilterStreamId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchHistory = useCallback(
    async (newOffset = offset) => {
      setIsLoading(true);
      setError(null);
      try {
        const params: Parameters<typeof historyService.getHistory>[0] = {
          limit: PAGE_SIZE,
          offset: newOffset,
        };
        if (filterStreamId) params.stream_id = filterStreamId;
        if (filterStatus) params.density_status = filterStatus;
        if (dateFrom) params.date_from = new Date(dateFrom).toISOString();
        if (dateTo) {
          const d = new Date(dateTo);
          d.setHours(23, 59, 59, 999);
          params.date_to = d.toISOString();
        }

        const res = await historyService.getHistory(params);
        setHistory(res.data);
        setTotal(res.total);
      } catch (err: any) {
        setError(err.message || "Failed to load history.");
      } finally {
        setIsLoading(false);
      }
    },
    [filterStreamId, filterStatus, dateFrom, dateTo, offset]
  );

  useEffect(() => {
    streamService.getStreams().then(setStreams).catch(() => {});
  }, []);

  useEffect(() => {
    setOffset(0);
    fetchHistory(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStreamId, filterStatus, dateFrom, dateTo]);

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    fetchHistory(newOffset);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Monitoring History
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Detailed traffic records from all monitoring sessions.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {(["Low Density", "Medium Density", "High Density", "Anomaly"] as DensityStatus[]).map(
            (status) => {
              const cfg = densityBadge[status];
              const count = history.filter((h) => h.density_status === status).length;
              return (
                <div
                  key={status}
                  className={`p-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}
                >
                  <p className={`text-xs font-semibold ${cfg.text} uppercase tracking-wider`}>
                    {status}
                  </p>
                  <p className={`text-2xl font-bold ${cfg.text} mt-1`}>{count}</p>
                  <p className="text-xs text-text-secondary/60 mt-0.5">on this page</p>
                </div>
              );
            }
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5 p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Filter size={13} />
            <span>Filter:</span>
          </div>

          <select
            value={filterStreamId}
            onChange={(e) => setFilterStreamId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50"
          >
            <option value="">All Streams</option>
            {streams.map((s) => (
              <option key={s.id} value={s.id}>
                {s.location_name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50"
          >
            <option value="">All Status</option>
            <option value="Low Density">Low Density</option>
            <option value="Medium Density">Medium Density</option>
            <option value="High Density">High Density</option>
            <option value="Anomaly">Anomaly</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50"
            />
            <span className="text-text-secondary/50 text-xs">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50"
            />
          </div>

          {(filterStreamId || filterStatus || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setFilterStreamId("");
                setFilterStatus("");
                setDateFrom("");
                setDateTo("");
              }}
              className="text-xs text-text-secondary/60 hover:text-text-secondary transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-accent-primary" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && history.length === 0 && !error && (
          <div className="text-center py-20 bg-black/30 border border-white/8 rounded-2xl">
            <Inbox size={36} className="text-text-secondary/30 mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No records found</p>
            <p className="text-sm text-text-secondary/60 mt-1">
              History records appear once a stream starts processing.
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && history.length > 0 && (
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    {[
                      "Timestamp",
                      "Person",
                      "Motorcycle",
                      "Car",
                      "Bus",
                      "Truck",
                      "Total Vehicles",
                      "Ratio",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((record) => {
                    const cfg = densityBadge[record.density_status] ?? densityBadge["Low Density"];
                    return (
                      <tr
                        key={record.id}
                        className="hover:bg-white/3 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-xs font-mono text-text-secondary">
                            {new Date(record.recorded_at).toLocaleString("id-ID")}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-text-primary">
                          {record.person_count}
                        </td>
                        <td className="px-4 py-3 text-center text-text-secondary">
                          {record.motorcycle_count}
                        </td>
                        <td className="px-4 py-3 text-center text-text-secondary">
                          {record.car_count}
                        </td>
                        <td className="px-4 py-3 text-center text-text-secondary">
                          {record.bus_count}
                        </td>
                        <td className="px-4 py-3 text-center text-text-secondary">
                          {record.truck_count}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-text-primary">
                          {record.total_vehicle_count}
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-accent-soft">
                          {Number(record.person_vehicle_ratio).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-xs font-medium ${cfg.bg} ${cfg.border} ${cfg.text} whitespace-nowrap`}
                          >
                            {record.density_status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/8">
              <span className="text-xs text-text-secondary">
                Page {currentPage} of {totalPages || 1} · {total} total records
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, offset - PAGE_SIZE))}
                  disabled={offset === 0 || isLoading}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-text-secondary hover:bg-white/5 transition-all disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => handlePageChange(offset + PAGE_SIZE)}
                  disabled={offset + PAGE_SIZE >= total || isLoading}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-text-secondary hover:bg-white/5 transition-all disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
