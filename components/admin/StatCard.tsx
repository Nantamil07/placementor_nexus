import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "blue" | "green" | "purple" | "amber" | "rose";
}

const ACCENTS: Record<NonNullable<StatCardProps["accent"]>, string> = {
  blue: "bg-blue-500/10 text-blue-400",
  green: "bg-emerald-500/10 text-emerald-400",
  purple: "bg-violet-500/10 text-violet-400",
  amber: "bg-amber-500/10 text-amber-400",
  rose: "bg-rose-500/10 text-rose-400",
};

export default function StatCard({ label, value, icon: Icon, accent = "blue" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-400">{label}</p>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", ACCENTS[accent])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
