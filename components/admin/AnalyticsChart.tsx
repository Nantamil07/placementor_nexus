"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import type { DailyPoint } from "@/services/admin/get-analytics";

interface AnalyticsChartProps {
  title: string;
  data: DailyPoint[];
  color?: string;
}

export default function AnalyticsChart({ title, data, color = "#3b82f6" }: AnalyticsChartProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="mb-4 text-sm font-medium text-zinc-300">{title}</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#71717a" }}
              tickFormatter={(v: string) => v.slice(5)}
              minTickGap={24}
            />
            <YAxis tick={{ fontSize: 11, fill: "#71717a" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#e4e4e7" }}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
