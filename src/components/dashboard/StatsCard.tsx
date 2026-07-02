import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: "blue" | "green" | "amber" | "purple" | "rose";
}

const colorMap = {
  blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   border: "border-blue-100" },
  green:  { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
  amber:  { bg: "bg-amber-50",  icon: "text-amber-600",  border: "border-amber-100" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100" },
  rose:   { bg: "bg-rose-50",   icon: "text-rose-600",   border: "border-rose-100" },
};

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "blue" }: StatsCardProps) {
  const c = colorMap[color];

  return (
    <Card className="hover:shadow-card-hover transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">{title}</p>
            <p className="mt-1.5 text-2xl font-bold text-foreground leading-none">{value}</p>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground truncate">{subtitle}</p>}
            {trend && (
              <p className={cn("mt-2 text-xs font-medium", trend.positive ? "text-emerald-600" : "text-rose-600")}>
                {trend.positive ? "▲" : "▼"} {trend.value}
              </p>
            )}
          </div>
          <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl shrink-0", c.bg, `border ${c.border}`)}>
            <Icon className={cn("w-5 h-5", c.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
