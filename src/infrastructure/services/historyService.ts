// src/infrastructure/services/historyService.ts
// Aligned with api_documentation.md

import { apiService } from "./apiService";
import type { HistoryRecord } from "@/domain/entities/TrafficMetric";

export interface GetHistoryParams {
  stream_id?: string;
  limit?: number;
  offset?: number;
  // Extended filters — may not be supported by current backend version
  date_from?: string;
  date_to?: string;
  density_status?: string;
}

export interface HistoryResponse {
  data: HistoryRecord[];
  total: number;
  limit: number;
  offset: number;
}

export const historyService = {
  /** GET /api/history/ with optional filters */
  async getHistory(params: GetHistoryParams = {}): Promise<HistoryResponse> {
    const query = new URLSearchParams();
    if (params.stream_id) query.set("stream_id", params.stream_id);
    if (params.limit !== undefined) query.set("limit", String(params.limit));
    if (params.offset !== undefined) query.set("offset", String(params.offset));
    // Extended params — sent only if backend supports them
    if (params.date_from) query.set("date_from", params.date_from);
    if (params.date_to) query.set("date_to", params.date_to);
    if (params.density_status) query.set("density_status", params.density_status);

    const qs = query.toString();
    const res = await apiService.get(`/api/history${qs ? `?${qs}` : ""}`);

    if (Array.isArray(res)) {
      return {
        data: res,
        total: res.length,
        limit: params.limit ?? 50,
        offset: params.offset ?? 0,
      };
    }
    return {
      data: res.data ?? res.history ?? [],
      total: res.total ?? 0,
      limit: res.limit ?? params.limit ?? 50,
      offset: res.offset ?? params.offset ?? 0,
    };
  },
};
