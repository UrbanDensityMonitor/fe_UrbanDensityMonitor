// src/infrastructure/services/streamService.ts
// Aligned with api_documentation.md

import { apiService } from "./apiService";
import type { Stream } from "@/domain/entities/TrafficMetric";

export interface CreateStreamPayload {
  location_name: string;
  stream_url: string;
  stream_type: "youtube" | "rtsp" | "cctv" | "hls";
}

export const streamService = {
  /** GET /api/v1/streams — returns { data: Stream[], total: number } */
  async getStreams(): Promise<Stream[]> {
    const res = await apiService.get("/api/v1/streams");
    // Backend wraps in { data: [...], total: N }
    if (Array.isArray(res)) return res;
    return res.data ?? res.streams ?? [];
  },

  /** POST /api/v1/streams */
  async createStream(payload: CreateStreamPayload): Promise<Stream> {
    return apiService.post("/api/v1/streams", payload);
  },

  /** DELETE /api/v1/streams/{id} */
  async deleteStream(id: string): Promise<void> {
    return apiService.delete(`/api/v1/streams/${id}`);
  },

  /**
   * Auto-detect stream type from URL.
   * Covers youtube, rtsp, and HLS (.m3u8).
   */
  detectStreamType(url: string): "youtube" | "rtsp" | "hls" | "cctv" {
    if (url.startsWith("rtsp://")) return "rtsp";
    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("youtube")
    )
      return "youtube";
    if (url.includes(".m3u8")) return "hls";
    return "cctv";
  },
};
