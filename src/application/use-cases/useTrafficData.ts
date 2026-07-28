"use client";

// src/application/use-cases/useTrafficData.ts

import { useState, useEffect } from "react";
import type { DashboardData, TrafficMetric, AlertStatus } from "@/domain/entities/TrafficMetric";
import {
  trafficWebSocketService,
  FrameUpdateMessage,
} from "@/infrastructure/services/trafficWebSocketService";

interface UseTrafficDataResult {
  data: DashboardData | null;
  frameBase64: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  lastFetchedAt: Date | null;
}

/** Resolve whichever base64 field the backend sends */
function resolveFrame(msg: FrameUpdateMessage): string | null {
  // Docs show both "frame_base64" and "frame" may be present
  const raw = msg.frame_base64 ?? msg.frame ?? null;
  if (!raw) return null;
  if (raw.startsWith("data:image")) return raw;
  return `data:image/jpeg;base64,${raw}`;
}

export function useTrafficData(streamId: string | null): UseTrafficDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [frameBase64, setFrameBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!streamId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Connect WebSocket
    trafficWebSocketService.connect(streamId).catch((err) => {
      setError(err.message || "Failed to connect to stream");
      setIsLoading(false);
    });

    const unsubscribe = trafficWebSocketService.subscribe(
      (msg: FrameUpdateMessage) => {
        setIsLoading(false);

        // Resolve frame — backend sends frame_base64 OR frame
        const frame = resolveFrame(msg);
        setFrameBase64(frame);
        setLastFetchedAt(new Date());

        // Build metrics from API counts
        const { counts } = msg;
        const totalVehicle =
          (counts.motorcycle ?? 0) +
          (counts.car ?? 0) +
          (counts.bus ?? 0) +
          (counts.truck ?? 0);

        const metrics: TrafficMetric[] = [
          {
            id: "metric-car",
            label: "Mobil",
            value: counts.car ?? 0,
            unit: "vehicles",
            iconName: "Car",
            category: "vehicle",
            status: "normal",
            colorAccent: "#E879F9",
          },
          {
            id: "metric-motor",
            label: "Motor",
            value: counts.motorcycle ?? 0,
            unit: "vehicles",
            iconName: "Bike",
            category: "vehicle",
            status: "normal",
            colorAccent: "#E879F9",
          },
          {
            id: "metric-truck",
            label: "Truk",
            value: counts.truck ?? 0,
            unit: "vehicles",
            iconName: "Truck",
            category: "vehicle",
            status: "normal",
            colorAccent: "#A78BFA",
          },
          {
            id: "metric-bus",
            label: "Bus",
            value: counts.bus ?? 0,
            unit: "vehicles",
            iconName: "Bus",
            category: "vehicle",
            status: "normal",
            colorAccent: "#A78BFA",
          },
          {
            id: "metric-person",
            label: "Pejalan Kaki",
            value: counts.person ?? 0,
            unit: "people",
            iconName: "User",
            category: "person",
            status: (counts.person ?? 0) > 50 ? "warning" : "normal",
            colorAccent: "#F0ABFC",
          },
          {
            id: "metric-density",
            label: msg.density_status,
            value: Number(msg.person_vehicle_ratio).toFixed(2),
            unit: "ratio",
            iconName: "BarChart2",
            category: "density",
            status: msg.density_status.includes("High")
              ? "critical"
              : msg.density_status.includes("Anomaly")
              ? "critical"
              : msg.density_status.includes("Medium")
              ? "warning"
              : "normal",
            colorAccent: "#F97316",
          },
        ];

        setData((prev) => {
          let updatedAlerts = prev?.alerts ?? [];

          // Alert hanya dikirim saat status berubah (state-transition), bukan setiap frame:
          // - 'high_density' / 'anomaly' → kondisi ramai baru mulai
          // - 'cleared' → kondisi sudah kembali normal
          if (msg.alert && msg.alert.triggered) {
            const isCleared = msg.alert.type === "cleared";
            const newAlert: AlertStatus = {
              id: `alert-${Date.now()}`,
              type: isCleared ? "high_density" : msg.alert.type.includes("Anomaly") ? "anomaly" : "high_density",
              message: msg.alert.message,
              severity: isCleared ? "low" : "critical",
              timestamp: new Date().toISOString(),
              isActive: !isCleared,  // alert 'cleared' ditampilkan sebagai resolved
              locationZone: `Stream ${streamId}`,
            };
            // Keep max 5 recent alerts in the panel
            updatedAlerts = [newAlert, ...updatedAlerts].slice(0, 5);
          }

          return {
            metrics,
            alerts: updatedAlerts,
            lastUpdated: new Date().toISOString(),
            activeCamera: 1,
            totalCameras: 1,
            locationName: `Stream ${streamId}`,
            coordinates: { lat: -6.2088, lng: 106.8456 },
          };
        });
      }
    );

    return () => {
      unsubscribe();
      trafficWebSocketService.disconnect();
    };
  }, [streamId]);

  return {
    data,
    frameBase64,
    isLoading,
    error,
    refetch: () => {
      if (streamId) {
        trafficWebSocketService.disconnect();
        trafficWebSocketService.connect(streamId);
      }
    },
    lastFetchedAt,
  };
}
