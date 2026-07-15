import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: "teal" | "orange" | "blue" | "purple" | "green" | "red";
  trend?: { value: number; label: string };
}

const colorMap = {
  teal: {
    bg: "bg-aned-teal/10",
    icon: "bg-aned-teal",
    value: "text-aned-teal",
  },
  orange: {
    bg: "bg-aned-orange/10",
    icon: "bg-aned-orange",
    value: "text-aned-orange",
  },
  blue: {
    bg: "bg-aned-blue/10",
    icon: "bg-aned-blue",
    value: "text-aned-blue",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-400",
    value: "text-purple-500",
  },
  green: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-400",
    value: "text-emerald-600",
  },
  red: {
    bg: "bg-red-50",
    icon: "bg-red-400",
    value: "text-red-500",
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}: StatsCardProps) {
  const c = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
          <p className={`text-2xl font-bold mt-1 font-display ${c.value}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs font-medium mt-2 ${trend.value >= 0 ? "text-emerald-500" : "text-red-400"}`}>
              {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${c.icon} flex items-center justify-center shrink-0 ml-3`}>
          <Icon size={22} className="text-white" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
