"use client";
// src/app/analytics/page.tsx

import { useState, useEffect, useCallback } from "react";
import { PageLayout } from "@/presentation/components/PageLayout";
import { historyService } from "@/infrastructure/services/historyService";
import { streamService } from "@/infrastructure/services/streamService";
import type { HistoryRecord, Stream } from "@/domain/entities/TrafficMetric";
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { BarChart3, Loader2, AlertTriangle, TrendingUp, Users, Car } from "lucide-react";

// Density status → color
const statusColors: Record<string, string> = {
  "Low Density": "#34d399",     // emerald
  "Medium Density": "#fbbf24",  // yellow
  "High Density": "#f87171",    // red
  Anomaly: "#fb923c",           // orange
};

const CHART_STYLE = {
  background: "transparent",
  fontSize: 11,
};

const tooltipStyle = {
  contentStyle: {
    background: "#18181B",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    fontSize: 12,
    color: "#fff",
  },
  labelStyle: { color: "#a3a3a3" },
};

function KpiCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-xs font-medium text-text-secondary mt-1">{label}</p>
      {sub && <p className="text-xs text-text-secondary/50 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStreamId, setFilterStreamId] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [streamsData, historyRes] = await Promise.all([
        streamService.getStreams(),
        historyService.getHistory({
          limit: 200,
          offset: 0,
          stream_id: filterStreamId || undefined,
        }),
      ]);
      setStreams(streamsData);
      setHistory(historyRes.data);
    } catch (err: any) {
      setError(err.message || "Failed to load analytics data.");
    } finally {
      setIsLoading(false);
    }
  }, [filterStreamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Prepare chart data ---

  // Trend chart: last 100 records, formatted timestamps
  const trendData = history.slice(0, 100).reverse().map((r, i) => ({
    time: new Date(r.recorded_at).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    idx: i,
    vehicle: r.total_vehicle_count,
  }));

  // Distribution pie
  const distCounts: Record<string, number> = {
    "Low Density": 0,
    "Medium Density": 0,
    "High Density": 0,
    Anomaly: 0,
  };
  history.forEach((r) => {
    if (distCounts[r.density_status] !== undefined)
      distCounts[r.density_status]++;
  });
  const pieData = Object.entries(distCounts).map(([name, value]) => ({
    name,
    value,
    color: statusColors[name],
  }));

  // Vehicle type breakdown
  const vehicleTotals = {
    Mobil: 0,
    Motor: 0,
    Bus: 0,
    Truk: 0,
  };
  history.forEach((r) => {
    vehicleTotals.Mobil += r.car_count;
    vehicleTotals.Motor += r.motorcycle_count;
    vehicleTotals.Bus += r.bus_count;
    vehicleTotals.Truk += r.truck_count;
  });
  const vehiclePieData = Object.entries(vehicleTotals).map(([name, value]) => ({
    name,
    value,
    color: name === "Mobil" ? "#60a5fa" : name === "Motor" ? "#34d399" : name === "Bus" ? "#fbbf24" : "#f87171",
  }));

  // Bar chart: avg vehicle by hour
  const byHour: Record<number, { vehicle: number; count: number }> = {};
  history.forEach((r) => {
    const h = new Date(r.recorded_at).getHours();
    if (!byHour[h]) byHour[h] = { vehicle: 0, count: 0 };
    byHour[h].vehicle += r.total_vehicle_count;
    byHour[h].count++;
  });
  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, "0")}:00`,
    avgVehicle: byHour[h] ? Math.round(byHour[h].vehicle / byHour[h].count) : 0,
  }));

  // KPIs
  const avgVehicle =
    history.length > 0
      ? (history.reduce((s, r) => s + r.total_vehicle_count, 0) / history.length).toFixed(1)
      : "—";
  const highCount = distCounts["High Density"] + distCounts["Anomaly"];
  const anomalyPct =
    history.length > 0
      ? ((highCount / history.length) * 100).toFixed(1)
      : "0";

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto pt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Analytics & Clustering
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Trend analysis and cluster distribution from monitoring history.
            </p>
          </div>
          <select
            value={filterStreamId}
            onChange={(e) => setFilterStreamId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all"
          >
            <option value="">All Streams</option>
            {streams.map((s) => (
              <option key={s.id} value={s.id}>
                {s.location_name}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-accent-primary" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <KpiCard
                label="Total Records"
                value={history.length.toLocaleString()}
                sub="in selected range"
                icon={<BarChart3 size={16} />}
                color="#E879F9"
              />
              <KpiCard
                label="Avg. Vehicle Count"
                value={avgVehicle}
                sub="per frame"
                icon={<Car size={16} />}
                color="#60a5fa"
              />
              <KpiCard
                label="High / Anomaly Rate"
                value={`${anomalyPct}%`}
                sub={`${highCount} of ${history.length} records`}
                icon={<TrendingUp size={16} />}
                color="#f87171"
              />
            </div>

            {history.length === 0 ? (
              <div className="text-center py-20 bg-black/30 border border-white/8 rounded-2xl">
                <BarChart3 size={36} className="text-text-secondary/30 mx-auto mb-3" />
                <p className="text-text-secondary font-medium">No data to visualize</p>
                <p className="text-sm text-text-secondary/60 mt-1">
                  Start monitoring a stream to generate analytics data.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <TrendingUp size={14} className="text-accent-primary" />
                    Vehicle Trend (Last 100 Records)
                  </h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={trendData} style={CHART_STYLE}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fill: "#a3a3a3", fontSize: 10 }}
                        interval={Math.floor(trendData.length / 6)}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#a3a3a3", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip {...tooltipStyle} />
                      <Legend
                        wrapperStyle={{ fontSize: 11, color: "#a3a3a3" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="vehicle"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        dot={false}
                        name="Vehicle"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Distribution Pie */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-accent-primary/60" />
                    Cluster Distribution
                  </h2>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={72}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                          ))}
                        </Pie>
                        <Tooltip
                          {...tooltipStyle}
                          formatter={(value, name) => [value, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2.5">
                      {pieData.map(({ name, value, color }) => (
                        <div key={name} className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                            style={{ background: color }}
                          />
                          <div>
                            <p className="text-xs font-medium text-text-primary leading-none">
                              {name}
                            </p>
                            <p className="text-xs text-text-secondary/60 mt-0.5">
                              {value} records
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vehicle Type Distribution */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-accent-primary/60" />
                    Vehicle Type Breakdown
                  </h2>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={vehiclePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={72}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {vehiclePieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                          ))}
                        </Pie>
                        <Tooltip
                          {...tooltipStyle}
                          formatter={(value, name) => [value, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2.5">
                      {vehiclePieData.map(({ name, value, color }) => (
                        <div key={name} className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                            style={{ background: color }}
                          />
                          <div>
                            <p className="text-xs font-medium text-text-primary leading-none">
                              {name}
                            </p>
                            <p className="text-xs text-text-secondary/60 mt-0.5">
                              {value.toLocaleString("id-ID")} units
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hourly Bar Chart */}
                <div className="lg:col-span-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <BarChart3 size={14} className="text-accent-primary" />
                    Average Vehicle Activity by Hour of Day
                  </h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={hourlyData} style={CHART_STYLE} barSize={10}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="hour"
                        tick={{ fill: "#a3a3a3", fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                        interval={1}
                      />
                      <YAxis
                        tick={{ fill: "#a3a3a3", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip {...tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "#a3a3a3" }} />
                      <Bar
                        dataKey="avgVehicle"
                        fill="#60a5fa"
                        fillOpacity={0.8}
                        radius={[4, 4, 0, 0]}
                        name="Avg Vehicle"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
