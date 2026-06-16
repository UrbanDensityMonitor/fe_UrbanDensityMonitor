"use client";

// src/application/use-cases/useTrafficData.ts

import { useState, useEffect } from "react";
import type { DashboardData, TrafficMetric, AlertStatus } from "@/domain/entities/TrafficMetric";
import { trafficWebSocketService, FrameUpdateMessage } from "@/infrastructure/services/trafficWebSocketService";

interface UseTrafficDataResult {
  data: DashboardData | null;
  frameBase64: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  lastFetchedAt: Date | null;
}

export function useTrafficData(streamId: string): UseTrafficDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [frameBase64, setFrameBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Initial connection
    trafficWebSocketService.connect(streamId).catch(err => {
      setError(err.message || "Failed to connect to stream");
      setIsLoading(false);
    });

    const unsubscribe = trafficWebSocketService.subscribe((msg: FrameUpdateMessage) => {
      setIsLoading(false);
      setFrameBase64(msg.frame);
      setLastFetchedAt(new Date(msg.timestamp));
      
      const metrics: TrafficMetric[] = [
        {
          id: "metric-car",
          label: "Mobil",
          value: msg.counts.car,
          unit: "vehicles",
          iconName: "Car",
          category: "vehicle",
          status: "normal",
          colorAccent: "#E879F9",
        },
        {
          id: "metric-motor",
          label: "Motor",
          value: msg.counts.motorcycle,
          unit: "vehicles",
          iconName: "Bike",
          category: "vehicle",
          status: "normal",
          colorAccent: "#E879F9",
        },
        {
          id: "metric-truck",
          label: "Truk",
          value: msg.counts.truck,
          unit: "vehicles",
          iconName: "Truck",
          category: "vehicle",
          status: "normal",
          colorAccent: "#A78BFA",
        },
        {
          id: "metric-bus",
          label: "Bus",
          value: msg.counts.bus,
          unit: "vehicles",
          iconName: "Bus",
          category: "vehicle",
          status: "normal",
          colorAccent: "#A78BFA",
        },
        {
          id: "metric-person",
          label: "Pejalan Kaki",
          value: msg.counts.person,
          unit: "people",
          iconName: "User",
          category: "person",
          status: msg.counts.person > 50 ? "warning" : "normal",
          colorAccent: "#F0ABFC",
        },
        {
          id: "metric-density",
          label: msg.density_status,
          value: msg.person_vehicle_ratio.toFixed(2),
          unit: "ratio",
          iconName: "BarChart2",
          category: "density",
          status: msg.density_status.includes("High") ? "critical" : msg.density_status.includes("Medium") ? "warning" : "normal",
          colorAccent: "#F97316",
        }
      ];

      setData((prev) => {
        let updatedAlerts = prev?.alerts || [];
        if (msg.alert && msg.alert.triggered) {
          const newAlert: AlertStatus = {
            id: `alert-${Date.now()}`,
            type: msg.alert.type.includes("Anomaly") ? "anomaly" : "high_density",
            message: msg.alert.message,
            severity: "critical",
            timestamp: msg.timestamp,
            isActive: true,
            locationZone: `Stream ${streamId}`,
          };
          updatedAlerts = [newAlert, ...updatedAlerts].slice(0, 5);
        }

        return {
          metrics,
          alerts: updatedAlerts,
          lastUpdated: msg.timestamp,
          activeCamera: 1,
          totalCameras: 1,
          locationName: `Stream ${streamId}`,
          coordinates: { lat: -6.2088, lng: 106.8456 },
        };
      });
    });

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
      trafficWebSocketService.disconnect();
      trafficWebSocketService.connect(streamId);
    },
    lastFetchedAt,
  };
}
