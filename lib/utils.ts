import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Minimal relative-time formatter ("3 minutes ago") — avoids pulling in a
 * date library just for the admin activity timeline.
 */
export function formatDistanceToNow(date: Date): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 5) return "just now";

  const steps: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Infinity, "year"],
  ];

  let value = seconds;
  for (const [size, name] of steps) {
    if (value < size) {
      return `${value} ${name}${value === 1 ? "" : "s"} ago`;
    }
    value = Math.floor(value / size);
  }
  return `${value} years ago`;
}
