// src/domain/entities/TrafficMetric.ts

export type MetricCategory =
  | "vehicle"
  | "person"
  | "density"
  | "alert"
  | "anomaly";

export type MetricStatus = "normal" | "warning" | "critical" | "active";

export interface TrafficMetric {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  iconName: string;
  category: MetricCategory;
  status: MetricStatus;
  colorAccent: string; // tailwind color class or hex
  trend?: number; // percentage change, optional
}

export interface AlertStatus {
  id: string;
  type: "emergency" | "anomaly" | "high_density" | "info";
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  isActive: boolean;
  locationZone?: string;
}

export interface DashboardData {
  metrics: TrafficMetric[];
  alerts: AlertStatus[];
  lastUpdated: string;
  activeCamera: number;
  totalCameras: number;
  locationName: string;
  coordinates: { lat: number; lng: number };
}
