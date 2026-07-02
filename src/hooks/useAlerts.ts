"use client";

import { useState, useCallback, useEffect } from "react";
import type { PriceAlert, AlertStatus } from "@/types/alert";
import { mockAlerts } from "@/mock/alerts";

const CHECK_INTERVAL = 15 * 60 * 1000; // 15 min

export function useAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockAlerts);
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
  }, []);

  // Checa ao montar e a cada 15 min
  useEffect(() => {
    void checkPrices();
    const interval = setInterval(() => void checkPrices(), CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkPrices]);

  const addAlert = useCallback((alert: PriceAlert) => {
    setAlerts((prev) => [alert, ...prev]);
  }, []);

  const updateStatus = useCallback((id: string, status: AlertStatus) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

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
