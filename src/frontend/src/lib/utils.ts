import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Time formatting ─────────────────────────────────────────────────────────

export function formatTime(isoString: string | undefined): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDuration(minutes: bigint | number | undefined): string {
  if (minutes === undefined) return "—";
  const m = typeof minutes === "bigint" ? Number(minutes) : minutes;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

export function formatDate(isoString: string | undefined): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ─── Priority / Status / Conflict colors ─────────────────────────────────────

export function getPriorityColor(score: bigint | number): string {
  const s = typeof score === "bigint" ? Number(score) : score;
  if (s >= 80)
    return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400";
  if (s >= 60)
    return "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400";
  if (s >= 40)
    return "text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400";
  return "text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400";
}

export function getPriorityBarColor(score: bigint | number): string {
  const s = typeof score === "bigint" ? Number(score) : score;
  if (s >= 80) return "bg-emerald-500";
  if (s >= 60) return "bg-amber-500";
  if (s >= 40) return "bg-orange-500";
  return "bg-red-500";
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "ready":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "onCourt":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "completed":
      return "bg-primary/10 text-primary";
    case "delayed":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "notReady":
      return "bg-muted text-muted-foreground";
    case "bye":
      return "bg-secondary/10 text-secondary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "ready":
      return "Ready";
    case "onCourt":
      return "On Court";
    case "completed":
      return "Completed";
    case "delayed":
      return "Delayed";
    case "notReady":
      return "Not Ready";
    case "bye":
      return "Bye";
    default:
      return status;
  }
}

export function getPlayerStatusColor(status: string): string {
  switch (status) {
    case "waiting":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "playing":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "resting":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "completed":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getPlayerStatusLabel(status: string): string {
  switch (status) {
    case "waiting":
      return "Waiting";
    case "playing":
      return "Playing";
    case "resting":
      return "Resting";
    case "completed":
      return "Done";
    default:
      return status;
  }
}

export function getCategoryStatusColor(status: string): string {
  switch (status) {
    case "onTrack":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "delayed":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "urgent":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getCategoryStatusLabel(status: string): string {
  switch (status) {
    case "onTrack":
      return "On Track";
    case "delayed":
      return "Delayed";
    case "urgent":
      return "Urgent";
    default:
      return status;
  }
}

export function getConflictBadgeInfo(conflict: string): {
  label: string;
  className: string;
} {
  switch (conflict) {
    case "playerOnCourt":
      return {
        label: "On Court",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      };
    case "restNeeded":
      return {
        label: "Rest Needed",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      };
    case "timeRisk":
      return {
        label: "Time Risk",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    case "categoryClash":
      return {
        label: "Category Clash",
        className:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      };
    case "backToBack":
      return {
        label: "Back-to-Back",
        className:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      };
    case "notReady":
      return {
        label: "Not Ready",
        className: "bg-muted text-muted-foreground",
      };
    default:
      return { label: conflict, className: "bg-muted text-muted-foreground" };
  }
}

// ─── Candid helpers ──────────────────────────────────────────────────────────

export function variantToString(obj: { __kind__: string } | string): string {
  if (typeof obj === "string") return obj;
  return obj.__kind__;
}

export function optionalToValue<T>(
  opt:
    | { __kind__: "Some"; value: T }
    | { __kind__: "None" }
    | T
    | null
    | undefined,
): T | undefined {
  if (opt === null || opt === undefined) return undefined;
  if (typeof opt === "object" && "__kind__" in opt) {
    if (opt.__kind__ === "Some")
      return (opt as { __kind__: "Some"; value: T }).value;
    return undefined;
  }
  return opt as T;
}

// ─── WhatsApp export ─────────────────────────────────────────────────────────

export function generateWhatsAppMessage(
  config: { name: string; venue: string } | undefined,
  courts: {
    courtName: string;
    currentMatch?: {
      categoryName: string;
      roundName: string;
      player1Name: string;
      player2Name: string;
    } | null;
  }[],
  queue: {
    match: {
      categoryName: string;
      roundName: string;
      player1Name: string;
      player2Name: string;
    };
  }[],
): string {
  const lines: string[] = [];
  if (config) {
    lines.push(`*${config.name}* — ${config.venue}`);
    lines.push("");
  }

  lines.push("*Court Assignments:*");
  for (const court of courts) {
    if (court.currentMatch) {
      lines.push(
        `${court.courtName}: ${court.currentMatch.categoryName} ${court.currentMatch.roundName} — ${court.currentMatch.player1Name} vs ${court.currentMatch.player2Name}`,
      );
    } else {
      lines.push(`${court.courtName}: Available`);
    }
  }

  if (queue.length > 0) {
    lines.push("");
    lines.push("*Next up:*");
    for (const entry of queue.slice(0, 4)) {
      lines.push(
        `• ${entry.match.categoryName} ${entry.match.roundName} — ${entry.match.player1Name} vs ${entry.match.player2Name}`,
      );
    }
  }

  lines.push("");
  lines.push("Players are requested to stay near the tournament desk.");

  return lines.join("\n");
}
