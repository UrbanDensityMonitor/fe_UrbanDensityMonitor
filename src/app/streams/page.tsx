"use client";
// src/app/streams/page.tsx

import { useState, useEffect, useCallback } from "react";
import { PageLayout } from "@/presentation/components/PageLayout";
import { streamService } from "@/infrastructure/services/streamService";
import type { Stream } from "@/domain/entities/TrafficMetric";
import {
  Plus,
  Video,
  Trash2,
  Loader2,
  X,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

// --- Modal form ---
interface StreamFormData {
  location_name: string;
  stream_url: string;
  stream_type: "youtube" | "rtsp" | "cctv" | "hls";
}

const defaultForm: StreamFormData = {
  location_name: "",
  stream_url: "",
  stream_type: "cctv",
};

function StreamModal({
  initial,
  onClose,
  onSave,
  loading,
}: {
  initial?: Stream | null;
  onClose: () => void;
  onSave: (data: StreamFormData) => Promise<void>;
  loading: boolean;
}) {
  const [form, setForm] = useState<StreamFormData>(
    initial
      ? {
          location_name: initial.location_name,
          stream_url: initial.stream_url,
          stream_type: initial.stream_type,
        }
      : defaultForm
  );
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (url: string) => {
    const detected = streamService.detectStreamType(url);
    setForm((f) => ({ ...f, stream_url: url, stream_type: detected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.location_name.trim().length === 0) {
      setError("Location name is required.");
      return;
    }
    if (form.location_name.trim().length > 50) {
      setError("Location name must be at most 50 characters.");
      return;
    }
    if (
      !form.stream_url.startsWith("http://") &&
      !form.stream_url.startsWith("https://") &&
      !form.stream_url.startsWith("rtsp://")
    ) {
      setError("URL must start with http://, https://, or rtsp://");
      return;
    }
    try {
      await onSave(form);
    } catch (err: any) {
      setError(err.message || "Failed to save stream.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-panel-bg border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">
            {initial ? "Edit Stream" : "Add Stream"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
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
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Location Name
            </label>
            <input
              type="text"
              value={form.location_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, location_name: e.target.value }))
              }
              placeholder="e.g. Jalan Sudirman CCTV-01"
              maxLength={50}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-accent-primary/50 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Stream URL
            </label>
            <input
              type="text"
              value={form.stream_url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://youtube.com/... or rtsp://..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-accent-primary/50 transition-all font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Stream Type
            </label>
            <div className="flex gap-2">
              {(["youtube", "rtsp", "hls", "cctv"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, stream_type: t }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${
                    form.stream_type === t
                      ? "bg-accent-primary/20 border-accent-primary/40 text-accent-primary"
                      : "bg-white/5 border-white/10 text-text-secondary hover:bg-white/8"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-secondary/60 mt-1.5">
              Auto-detected from URL — you can override manually.
            </p>
          </div>

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
                (initial ? "Save Changes" : "Add Stream")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Delete confirm modal ---
function DeleteConfirm({
  stream,
  onClose,
  onConfirm,
  loading,
}: {
  stream: Stream;
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
        <h2 className="text-base font-semibold text-text-primary mb-2">
          Delete Stream
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Are you sure you want to delete{" "}
          <span className="text-text-primary font-medium">
            {stream.location_name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-text-secondary hover:bg-white/5 transition-colors"
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

const typeBadge: Record<string, string> = {
  youtube: "bg-red-500/20 text-red-400 border-red-500/30",
  rtsp: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  hls: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  cctv: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

// --- Main Page ---
export default function StreamsPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteStream, setDeleteStream] = useState<Stream | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStreams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await streamService.getStreams();
      setStreams(data);
    } catch (err: any) {
      setError(err.message || "Failed to load streams.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  const handleAdd = async (form: StreamFormData) => {
    setActionLoading(true);
    try {
      await streamService.createStream(form);
      setShowAddModal(false);
      await fetchStreams();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteStream) return;
    setActionLoading(true);
    try {
      await streamService.deleteStream(deleteStream.id);
      setDeleteStream(null);
      await fetchStreams();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Modals */}
      {showAddModal && (
        <StreamModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
          loading={actionLoading}
        />
      )}
      {deleteStream && (
        <DeleteConfirm
          stream={deleteStream}
          onClose={() => setDeleteStream(null)}
          onConfirm={handleDelete}
          loading={actionLoading}
        />
      )}

      <div className="max-w-5xl mx-auto pt-20">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Stream Management
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Add and manage CCTV, RTSP, and YouTube Live streams for monitoring.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent-primary/20 border border-accent-primary/40 hover:bg-accent-primary/30 rounded-xl text-sm font-semibold text-accent-soft transition-all"
          >
            <Plus size={16} />
            Add Stream
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Streams", value: streams.length, color: "text-text-primary" },
            {
              label: "Active",
              value: streams.filter((s) => s.status === "active").length,
              color: "text-emerald-400",
            },
            {
              label: "Inactive",
              value: streams.filter((s) => s.status === "inactive").length,
              color: "text-text-secondary",
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
        {!isLoading && streams.length === 0 && !error && (
          <div className="text-center py-20 bg-black/30 border border-white/8 rounded-2xl">
            <Video size={36} className="text-text-secondary/30 mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No streams yet</p>
            <p className="text-sm text-text-secondary/60 mt-1">
              Click "Add Stream" to connect your first CCTV or YouTube live feed.
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && streams.length > 0 && (
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Location
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      URL
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Added
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {streams.map((stream) => (
                    <tr
                      key={stream.id}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-text-primary">
                          {stream.location_name}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-xs font-medium capitalize ${
                            typeBadge[stream.stream_type] ??
                            "bg-white/10 text-text-secondary border-white/10"
                          }`}
                        >
                          {stream.stream_type}
                        </span>
                      </td>
                      <td className="px-5 py-4 max-w-[220px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-secondary font-mono text-xs truncate">
                            {stream.stream_url}
                          </span>
                          <a
                            href={stream.stream_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary/40 hover:text-accent-soft flex-shrink-0"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-medium ${
                            stream.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-white/5 text-text-secondary border-white/10"
                          }`}
                        >
                          {stream.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-text-secondary">
                          {new Date(stream.created_at).toLocaleDateString("id-ID")}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setDeleteStream(stream)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete stream"
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
