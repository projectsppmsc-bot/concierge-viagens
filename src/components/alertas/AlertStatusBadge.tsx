import { Badge } from "@/components/ui/badge";
import type { AlertStatus } from "@/types/alert";

interface AlertStatusBadgeProps {
  status: AlertStatus;
}

const config: Record<AlertStatus, { label: string; variant: "success" | "info" | "warning" | "secondary" }> = {
  active:    { label: "Ativo",     variant: "info" },
  triggered: { label: "Atingido",  variant: "success" },
  paused:    { label: "Pausado",   variant: "warning" },
  expired:   { label: "Expirado",  variant: "secondary" },
};

export function AlertStatusBadge({ status }: AlertStatusBadgeProps) {
  const { label, variant } = config[status];
  return <Badge variant={variant} className="text-[10px]">{label}</Badge>;
}
