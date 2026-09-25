import { cn } from "@/lib/utils";

interface DashboardGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4 | 5;
  className?: string;
}

const COLS: Record<NonNullable<DashboardGridProps["cols"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

export default function DashboardGrid({ children, cols = 4, className }: DashboardGridProps) {
  return <div className={cn("grid grid-cols-1 gap-4", COLS[cols], className)}>{children}</div>;
}
