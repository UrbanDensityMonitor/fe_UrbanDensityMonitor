// src/infrastructure/services/apiService.ts

import { authService } from "./authService";

const API_BASE_URL = ""; // Menggunakan rewrite dari next.config.js untuk bypass CORS

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const session = await authService.getSession();
  const token = session?.access_token;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // WAJIB: bypass peringatan ngrok
  headers.set("ngrok-skip-browser-warning", "69420");
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}: ${response.statusText || "Request Failed"}`;
    try {
      const errorData = await response.json();
      // Backend mengembalikan { success: false, error: { message: "..." } }
      // Fallback ke flat { message: "..." } untuk kompatibilitas API lain
      errorMsg =
        errorData?.error?.message ||
        errorData?.message ||
        errorMsg;
    } catch {
      // Response body bukan JSON — gunakan statusText
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const apiService = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: "GET" }),
  post: (endpoint: string, body: any) => fetchWithAuth(endpoint, { method: "POST", body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any) => fetchWithAuth(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) => fetchWithAuth(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" }),
};
