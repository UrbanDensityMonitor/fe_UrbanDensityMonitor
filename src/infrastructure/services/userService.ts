// src/infrastructure/services/userService.ts
// Aligned with api_documentation.md
//
// Per docs, admin creates users via Supabase Auth Admin API on the backend.
// The frontend POST /api/users/ is NOT in the API docs.
// Only GET, PUT, DELETE are documented.

import { apiService } from "./apiService";
import type { UserRecord, UserRole } from "@/domain/entities/TrafficMetric";

export interface UpdateUserPayload {
  full_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export const userService = {
  /** GET /api/users/ — admin only, 403 if not admin */
  async getUsers(): Promise<UserRecord[]> {
    const res = await apiService.get("/api/users");
    return Array.isArray(res) ? res : res.data ?? res.users ?? [];
  },

  /** PUT /api/users/{id} — update full_name, role, is_active */
  async updateUser(id: string, payload: UpdateUserPayload): Promise<UserRecord> {
    return apiService.put(`/api/users/${id}`, payload);
  },

  /** DELETE /api/users/{id} — removes from Supabase Auth + DB */
  async deleteUser(id: string): Promise<void> {
    return apiService.delete(`/api/users/${id}`);
  },
};
