// src/infrastructure/services/alertService.ts
// Aligned with api_documentation.md

import { apiService } from "./apiService";
import type { AlertRecord } from "@/domain/entities/TrafficMetric";

export interface GetAlertsParams {
  stream_id?: string;
  is_read?: boolean;
  limit?: number;
  offset?: number; // extra — backend may support even if not documented
}

export interface AlertsResponse {
  data: AlertRecord[];
  total: number;
  limit: number;
  offset: number;
}

export const alertService = {
  /** GET /api/alerts/ with optional query params */
  async getAlerts(params: GetAlertsParams = {}): Promise<AlertsResponse> {
    const query = new URLSearchParams();
    if (params.stream_id) query.set("stream_id", params.stream_id);
    if (params.is_read !== undefined) query.set("is_read", String(params.is_read));
    if (params.limit !== undefined) query.set("limit", String(params.limit));
    if (params.offset !== undefined) query.set("offset", String(params.offset));

    const qs = query.toString();
    const res = await apiService.get(`/api/alerts${qs ? `?${qs}` : ""}`);

    // Normalize: backend may return array or wrapped object
    if (Array.isArray(res)) {
      return {
        data: res,
        total: res.length,
        limit: params.limit ?? 20,
        offset: params.offset ?? 0,
      };
    }
    return {
      data: res.data ?? res.alerts ?? [],
      total: res.total ?? 0,
      limit: res.limit ?? params.limit ?? 20,
      offset: res.offset ?? params.offset ?? 0,
    };
  },

  /** PATCH /api/alerts/{id}/read — mark alert as read */
  async markAsRead(id: string): Promise<void> {
    return apiService.patch(`/api/alerts/${id}/read`, {});
  },
};
