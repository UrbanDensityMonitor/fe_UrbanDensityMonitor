"use client";
// src/app/admin/users/page.tsx

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/presentation/components/PageLayout";
import { userService } from "@/infrastructure/services/userService";
import { useAuth } from "@/presentation/components/AuthProvider";
import type { UserRecord, UserRole } from "@/domain/entities/TrafficMetric";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Shield,
  User,
  Loader2,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  Check,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// --- Add/Edit User Modal ---
interface UserFormData {
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
  is_active: boolean;
}

function UserModal({
  initial,
  onClose,
  onSave,
  loading,
  isEdit,
}: {
  initial?: UserRecord | null;
  onClose: () => void;
  onSave: (data: UserFormData) => Promise<void>;
  loading: boolean;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<UserFormData>({
    email: initial?.email ?? "",
    full_name: initial?.full_name ?? "",
    password: "",
    role: initial?.role ?? "user",
    is_active: initial?.is_active ?? true,
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.full_name.trim().length === 0) {
      setError("Full name is required.");
      return;
    }
    if (form.full_name.trim().length > 100) {
      setError("Full name max 100 chars.");
      return;
    }
    if (!isEdit && form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    try {
      await onSave(form);
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-panel-bg border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">
            {isEdit ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              maxLength={100}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all"
              required
            />
          </div>

          {/* Email (read-only in edit mode) */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              readOnly={isEdit}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all ${
                isEdit
                  ? "bg-white/3 border-white/5 text-text-secondary cursor-not-allowed"
                  : "bg-white/5 border-white/10"
              }`}
              required
            />
          </div>

          {/* Password (only for add) */}
          {!isEdit && (
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pr-10 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Role
            </label>
            <div className="flex gap-2">
              {(["user", "admin"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-medium transition-all capitalize ${
                    form.role === r
                      ? r === "admin"
                        ? "bg-accent-primary/20 border-accent-primary/40 text-accent-primary"
                        : "bg-blue-500/20 border-blue-500/40 text-blue-400"
                      : "bg-white/5 border-white/10 text-text-secondary hover:bg-white/8"
                  }`}
                >
                  {r === "admin" ? <Shield size={12} /> : <User size={12} />}
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Is Active toggle (edit only) */}
          {isEdit && (
            <div className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/8">
              <div>
                <p className="text-xs font-medium text-text-primary">Account Status</p>
                <p className="text-xs text-text-secondary/60 mt-0.5">
                  {form.is_active ? "Active — user can log in" : "Inactive — access disabled"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                className={`transition-colors ${
                  form.is_active ? "text-emerald-400" : "text-text-secondary"
                }`}
              >
                {form.is_active ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-text-secondary hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-primary/20 border border-accent-primary/40 text-sm font-semibold text-accent-soft hover:bg-accent-primary/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <Check size={14} />
                  {isEdit ? "Save Changes" : "Create User"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Delete Confirm ---
function DeleteConfirm({
  user,
  onClose,
  onConfirm,
  loading,
}: {
  user: UserRecord;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-panel-bg border border-white/10 rounded-2xl p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-400" />
        </div>
        <h2 className="text-base font-semibold text-text-primary mb-2">Delete User</h2>
        <p className="text-sm text-text-secondary mb-2">
          Are you sure you want to permanently delete{" "}
          <span className="text-text-primary font-medium">{user.full_name}</span>?
        </p>
        <p className="text-xs text-red-400/80 mb-6">
          This will remove them from Supabase Auth and the database. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-text-secondary hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function AdminUsersPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRecord | null>(null);

  // Role guard — redirect non-admins
  useEffect(() => {
    if (!authLoading && role !== null && role !== "admin") {
      router.replace("/");
    }
  }, [role, authLoading, router]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === "admin") fetchUsers();
  }, [role, fetchUsers]);

  const handleEdit = async (form: UserFormData) => {
    if (!editUser) return;
    setActionLoading(true);
    try {
      await userService.updateUser(editUser.id, {
        full_name: form.full_name,
        role: form.role,
        is_active: form.is_active,
      });
      setEditUser(null);
      await fetchUsers();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setActionLoading(true);
    try {
      await userService.deleteUser(deleteUser.id);
      setDeleteUser(null);
      await fetchUsers();
    } finally {
      setActionLoading(false);
    }
  };

  // Show loading while auth resolves
  if (authLoading || role === null) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 size={24} className="animate-spin text-accent-primary" />
        </div>
      </PageLayout>
    );
  }

  if (role !== "admin") return null; // Redirect in progress

  return (
    <PageLayout>
      {editUser && (
        <UserModal
          initial={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleEdit}
          loading={actionLoading}
          isEdit={true}
        />
      )}
      {deleteUser && (
        <DeleteConfirm
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleDelete}
          loading={actionLoading}
        />
      )}

      <div className="max-w-5xl mx-auto pt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                User Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-accent-primary/20 border border-accent-primary/30 text-xs font-bold text-accent-primary">
                ADMIN ONLY
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-1">
              View, edit roles, and delete user accounts. Changes sync to Supabase Auth.
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Users", value: users.length, color: "text-text-primary" },
            {
              label: "Admins",
              value: users.filter((u) => u.role === "admin").length,
              color: "text-accent-primary",
            },
            {
              label: "Active",
              value: users.filter((u) => u.is_active).length,
              color: "text-emerald-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4"
            >
              <p className="text-xs text-text-secondary mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-accent-primary" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && users.length === 0 && !error && (
          <div className="text-center py-20 bg-black/30 border border-white/8 rounded-2xl">
            <Users size={36} className="text-text-secondary/30 mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No users found</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && users.length > 0 && (
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    {["Name", "Email", "Role", "Status", "Joined", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-accent-primary">
                              {u.full_name.charAt(0).toUpperCase() || u.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="font-medium text-text-primary">{u.full_name || "—"}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-text-secondary text-xs font-mono">
                        {u.email}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-semibold capitalize ${
                            u.role === "admin"
                              ? "bg-accent-primary/10 text-accent-primary border-accent-primary/30"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {u.role === "admin" ? <Shield size={11} /> : <User size={11} />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-medium ${
                            u.is_active
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-white/5 text-text-secondary border-white/10"
                          }`}
                        >
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-text-secondary">
                        {new Date(u.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditUser(u)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-soft hover:bg-white/5 transition-all"
                            title="Edit user"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteUser(u)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete user"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
