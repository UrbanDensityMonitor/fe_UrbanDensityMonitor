// src/infrastructure/services/trafficMockService.ts

import type { DashboardData, TrafficMetric, AlertStatus } from "@/domain/entities/TrafficMetric";

const mockMetrics: TrafficMetric[] = [
  {
    id: "metric-car",
    label: "Mobil",
    value: 12540,
    unit: "vehicles",
    iconName: "Car",
    category: "vehicle",
    status: "normal",
    colorAccent: "#E879F9",
    trend: +3.2,
  },
  {
    id: "metric-motor",
    label: "Motor",
    value: 8320,
    unit: "vehicles",
    iconName: "Bike",
    category: "vehicle",
    status: "normal",
    colorAccent: "#E879F9",
    trend: +1.1,
  },
  {
    id: "metric-truck",
    label: "Truk",
    value: 1234,
    unit: "vehicles",
    iconName: "Truck",
    category: "vehicle",
    status: "normal",
    colorAccent: "#A78BFA",
    trend: -0.8,
  },
  {
    id: "metric-bus",
    label: "Bus",
    value: 450,
    unit: "vehicles",
    iconName: "Bus",
    category: "vehicle",
    status: "normal",
    colorAccent: "#A78BFA",
    trend: +0.4,
  },
  {
    id: "metric-person",
    label: "Pejalan Kaki",
    value: 7850,
    unit: "people",
    iconName: "User",
    category: "person",
    status: "normal",
    colorAccent: "#F0ABFC",
    trend: +5.6,
  },
  {
    id: "metric-density",
    label: "Kepadatan Tinggi",
    value: 85,
    unit: "% level",
    iconName: "BarChart2",
    category: "density",
    status: "warning",
    colorAccent: "#F97316",
    trend: +12.3,
  },
  {
    id: "metric-emergency",
    label: "Darurat",
    value: 320,
    unit: "vehicles",
    iconName: "AlertTriangle",
    category: "alert",
    status: "critical",
    colorAccent: "#EF4444",
    trend: +8.0,
  },
  {
    id: "metric-demo",
    label: "Crowd Anomaly",
    value: "Active",
    unit: "status",
    iconName: "Megaphone",
    category: "anomaly",
    status: "critical",
    colorAccent: "#EF4444",
    trend: undefined,
  },
];

const mockAlerts: AlertStatus[] = [
  {
    id: "alert-001",
    type: "anomaly",
    message: "Crowd anomaly detected at Zone C-7",
    severity: "critical",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isActive: true,
    locationZone: "Zone C-7",
  },
  {
    id: "alert-002",
    type: "high_density",
    message: "High vehicle density on Corridor 3",
    severity: "high",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    isActive: true,
    locationZone: "Corridor 3",
  },
  {
    id: "alert-003",
    type: "emergency",
    message: "Emergency vehicle dispatch — Route 12 cleared",
    severity: "medium",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isActive: false,
    locationZone: "Route 12",
  },
];

// Simulate async ML inference response
export async function fetchDashboardData(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    metrics: mockMetrics,
    alerts: mockAlerts,
    lastUpdated: new Date().toISOString(),
    activeCamera: 47,
    totalCameras: 52,
    locationName: "Jakarta Pusat",
    coordinates: { lat: -6.2088, lng: 106.8456 },
  };
}

export async function fetchMetricById(id: string): Promise<TrafficMetric | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockMetrics.find((m) => m.id === id) ?? null;
}
