import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  deltaPct?: number; // positive = up, negative = down
}

export default function AnalyticsCard({ title, value, subtext, deltaPct }: AnalyticsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-white">{value}</span>
        {typeof deltaPct === "number" && (
          <span
            className={cn(
              "text-xs font-medium",
              deltaPct >= 0 ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {deltaPct >= 0 ? "+" : ""}
            {deltaPct}%
          </span>
        )}
      </div>
      {subtext && <p className="mt-1 text-xs text-zinc-500">{subtext}</p>}
    </div>
  );
}
