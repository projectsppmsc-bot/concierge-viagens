import { Badge } from "@/components/ui/badge";
import { BADGE_LABELS } from "@/lib/constants";
import type { FlightBadge as FlightBadgeType } from "@/types/flight";

interface FlightBadgeProps {
  badge: FlightBadgeType;
}

const badgeVariants: Record<FlightBadgeType, "success" | "info" | "warning" | "default" | "secondary"> = {
  best_price: "success",
  best_time: "info",
  best_value: "warning",
  direct: "secondary",
  promo: "default",
};

export function FlightBadge({ badge }: FlightBadgeProps) {
  return (
    <Badge variant={badgeVariants[badge]} className="text-[10px] font-semibold uppercase tracking-wide">
      {BADGE_LABELS[badge]}
    </Badge>
  );
}
