// src/infrastructure/services/trafficWebSocketService.ts
// Aligned with api_documentation.md

import { authService } from "./authService";

/** Exact payload shape from WS /ws/live/{stream_id} per API docs */
export type FrameUpdateMessage = {
  type: "frame_update";
  stream_id: string;
  counts: {
    person: number;
    motorcycle: number;
    car: number;
    bus: number;
    truck: number;
  };
  person_vehicle_ratio: number;
  density_status: string;
  /** base64 string (with or without data URI prefix) */
  frame_base64?: string;
  /** Alias — backend may send as "frame" too */
  frame?: string;
  alert: {
    triggered: boolean;
    type: string;
    message: string;
  } | null;
};

type MessageHandler = (data: FrameUpdateMessage) => void;

class TrafficWebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private isConnecting = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private streamId: string | null = null;

  async connect(streamId: string) {
    // Already connected to the same stream — do nothing
    if (this.ws?.readyState === WebSocket.OPEN && this.streamId === streamId) return;

    // If switching streams, close the old connection first
    if (this.ws && this.streamId !== streamId) {
      this.ws.close();
      this.ws = null;
    }

    this.streamId = streamId;
    this.isConnecting = true;

    try {
      const session = await authService.getSession();
      const token = session?.access_token;

      const wsUrl =
        process.env.NEXT_PUBLIC_WS_API_URL || "ws://localhost:8000";
      // Docs: wss://<host>/ws/live/{stream_id}
      // Token passed as query param since WS can't have custom headers in browsers
      const url = token
        ? `${wsUrl}/ws/live/${streamId}?token=${token}`
        : `${wsUrl}/ws/live/${streamId}`;

      this.ws = new WebSocket(url);

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as FrameUpdateMessage;
          if (data.type === "frame_update") {
            this.handlers.forEach((handler) => handler(data));
          }
        } catch (err) {
          console.error("[WS] Failed to parse message:", err);
        }
      };

      this.ws.onclose = (event) => {
        this.isConnecting = false;
        console.log(`[WS] Closed (code: ${event.code}) — scheduling reconnect…`);
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.error("[WS] Error:", err);
        // onclose will fire after onerror
      };

      this.ws.onopen = () => {
        this.isConnecting = false;
        console.log("[WS] Connected to stream:", streamId);
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };
    } catch (err) {
      this.isConnecting = false;
      console.error("[WS] Connection failed:", err);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (!this.streamId) return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      console.log("[WS] Reconnecting…");
      if (this.streamId) this.connect(this.streamId);
    }, 5000);
  }

  disconnect() {
    this.streamId = null;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }
}

export const trafficWebSocketService = new TrafficWebSocketService();
