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

// --- Stream Entity ---
export interface Stream {
  id: string;
  location_name: string;
  stream_url: string;
  stream_type: "youtube" | "rtsp" | "cctv" | "hls";
  status: "active" | "inactive";
  added_by: string | null;
  created_at: string;
}

// --- History Entity ---
export type DensityStatus = "Low Density" | "Medium Density" | "High Density" | "Anomaly";

export interface HistoryRecord {
  id: string;
  stream_id: string;
  person_count: number;
  motorcycle_count: number;
  car_count: number;
  bus_count: number;
  truck_count: number;
  total_vehicle_count: number;
  person_vehicle_ratio: number;
  density_status: DensityStatus;
  recorded_at: string;
}

// --- Alert Entity ---
export type AlertType = "High Density" | "Human Anomaly";

export interface AlertRecord {
  id: string;
  traffic_history_id: string;
  stream_id: string;
  alert_type: AlertType;
  alert_message: string;
  is_read: boolean;
  created_at: string;
  // Joined from streams (optional)
  stream_location?: string;
}

// --- User Entity ---
export type UserRole = "user" | "admin";

export interface UserRecord {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}
