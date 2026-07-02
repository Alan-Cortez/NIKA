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
    bg: "bg-aned-cream",
    icon: "bg-aned-teal",
    text: "text-aned-teal-dark",
    trend: "text-aned-teal-dark",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "bg-aned-orange",
    text: "text-aned-orange-dark",
    trend: "text-aned-orange-dark",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-aned-blue",
    text: "text-aned-blue-dark",
    trend: "text-aned-blue-dark",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-500",
    text: "text-purple-600",
    trend: "text-purple-600",
  },
  green: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-500",
    text: "text-emerald-600",
    trend: "text-emerald-600",
  },
  red: {
    bg: "bg-red-50",
    icon: "bg-red-500",
    text: "text-red-600",
    trend: "text-red-600",
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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1 font-display">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs font-medium mt-2 ${trend.value >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center shrink-0 ml-3`}>
          <Icon size={20} className="text-white" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
