"use client";

import { useState, useCallback, useEffect } from "react";
import type { PriceAlert, AlertStatus } from "@/types/alert";
import { mockAlerts } from "@/mock/alerts";
import { useLocalStorageState } from "./useLocalStorageState";

const CHECK_INTERVAL = 15 * 60 * 1000; // 15 min

export function useAlerts() {
  const [alerts, setAlerts] = useLocalStorageState<PriceAlert[]>("cv:alerts", mockAlerts);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const checkPrices = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/alerts/check");
      if (!res.ok) return;
      const data = await res.json() as { alerts: PriceAlert[]; checkedAt: string };
      // Mescla: preserva alertas criados pelo usuário nesta sessão
      setAlerts((prev) => {
        const apiIds = new Set(data.alerts.map((a) => a.id));
        const userAdded = prev.filter((a) => !apiIds.has(a.id));
        return [...userAdded, ...data.alerts];
      });
      setLastChecked(data.checkedAt ?? new Date().toISOString());
    } catch {
      // silencia — mantém dados anteriores
    } finally {
      setChecking(false);
    }
  }, [setAlerts]);

  // Checa ao montar e a cada 15 min
  useEffect(() => {
    void checkPrices();
    const interval = setInterval(() => void checkPrices(), CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkPrices]);

  const addAlert = useCallback((alert: PriceAlert) => {
    setAlerts((prev) => [alert, ...prev]);
  }, [setAlerts]);

  const updateStatus = useCallback((id: string, status: AlertStatus) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, [setAlerts]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, [setAlerts]);

  return {
    alerts,
    activeAlerts: alerts.filter((a) => a.status === "active"),
    triggeredAlerts: alerts.filter((a) => a.status === "triggered"),
    checking,
    lastChecked,
    addAlert,
    updateStatus,
    removeAlert,
    refresh: checkPrices,
  };
}
