"use client";

import { useConciergeContext } from "@/context/ConciergeContext";

export function useConcierge() {
  return useConciergeContext();
}
