import { LOCALE, CURRENCY } from "@/lib/constants";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMiles(miles: number): string {
  return new Intl.NumberFormat(LOCALE).format(miles) + " milhas";
}

export function formatDiscount(original: number, promo: number): string {
  const pct = Math.round(((original - promo) / original) * 100);
  return `-${pct}%`;
}

export function mileValueInBRL(cashPrice: number, taxes: number, milesRequired: number): number {
  if (milesRequired === 0) return 0;
  return (cashPrice - taxes) / milesRequired;
}
