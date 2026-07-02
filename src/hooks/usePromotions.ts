"use client";

import { useState, useCallback } from "react";
import type { Promotion, PromotionType } from "@/types/promotion";
import { mockPromotions } from "@/mock/promotions";

export function usePromotions() {
  const [promotions] = useState<Promotion[]>(mockPromotions);

  const featured = promotions.filter((p) => p.featured);

  const filterByType = useCallback(
    (type: PromotionType) => promotions.filter((p) => p.type === type),
    [promotions]
  );

  const filterByDestination = useCallback(
    (destination: string) =>
      promotions.filter((p) => p.destination === destination),
    [promotions]
  );

  const isActive = useCallback((promo: Promotion) => {
    const now = new Date();
    return new Date(promo.validFrom) <= now && now <= new Date(promo.validUntil);
  }, []);

  const active = promotions.filter(isActive);

  return { promotions, featured, active, filterByType, filterByDestination };
}
