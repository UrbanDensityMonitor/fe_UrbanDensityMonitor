"use client";

// src/application/use-cases/useTrafficData.ts

import { useState, useEffect, useCallback } from "react";
import type { DashboardData } from "@/domain/entities/TrafficMetric";
import { fetchDashboardData } from "@/infrastructure/services/trafficMockService";

interface UseTrafficDataResult {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  lastFetchedAt: Date | null;
}

export function useTrafficData(autoRefreshMs?: number): UseTrafficDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardData();
      setData(result);
      setLastFetchedAt(new Date());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch traffic data from ML service."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefreshMs) return;
    const interval = setInterval(fetchData, autoRefreshMs);
    return () => clearInterval(interval);
  }, [autoRefreshMs, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    lastFetchedAt,
  };
}
