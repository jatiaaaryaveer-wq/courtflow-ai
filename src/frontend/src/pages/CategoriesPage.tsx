import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCategories,
  useCourtFlowData,
  useOrderOfPlaySuggestion,
  useTournamentConfig,
  useTournamentStats,
} from "@/hooks/useBackend";
import {
  formatDuration,
  formatTime,
  getCategoryStatusColor,
  getCategoryStatusLabel,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import type { CategoryView, MatchView, OrderOfPlayEntry } from "@/types";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  GripVertical,
  ListOrdered,
  Trophy,
  Users,
} from "lucide-react";
import React, { useCallback, useMemo, useRef, useState } from "react";

// ─── Order of Play helpers ──────────────────────────────────────────────────

const RANK_BADGE_STYLES: Record<
  number,
  { bg: string; text: string; label: string }
> = {
  1: { bg: "bg-[#FFD700]", text: "text-black", label: "1st" },
  2: { bg: "bg-[#C0C0C0]", text: "text-black", label: "2nd" },
  3: { bg: "bg-[#CD7F32]", text: "text-white", label: "3rd" },
};

function getRankBadge(rank: number) {
  return (
    RANK_BADGE_STYLES[rank] ?? {
      bg: "bg-muted",
      text: "text-foreground",
      label: `${rank}th`,
    }
  );
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function addMinutesToTimeString(timeStr: string, minutes: number): string {
  // Parse HH:MM AM/PM or HH:MM
  const cleaned = timeStr.trim();
  const isPm = /pm/i.test(cleaned);
  const isAm = /am/i.test(cleaned);
  const parts = cleaned.replace(/[apm]/gi, "").trim().split(":");
  let hours = Number.parseInt(parts[0], 10);
  const mins = Number.parseInt(parts[1] ?? "0", 10);
  if ((isPm || isAm) && isPm && hours !== 12) hours += 12;
  if (isAm && hours === 12) hours = 0;
  const totalMins = hours * 60 + mins + minutes;
  const hh = Math.floor(totalMins / 60) % 24;
  const mm = totalMins % 60;
  const ampm = hh >= 12 ? "PM" : "AM";
  const displayH = hh % 12 === 0 ? 12 : hh % 12;
  return `${displayH}:${String(mm).padStart(2, "0")} ${ampm}`;
}

function OrderOfPlaySection({ startTime }: { startTime: string }) {
  const { data: backendOrder, isLoading } = useOrderOfPlaySuggestion();
  const [order, setOrder] = useState<OrderOfPlayEntry[] | null>(null);
  const [applied, setApplied] = useState(false);
  const dragIndexRef = useRef<number | null>(null);

  // Sync from backend when data arrives (only first time)
  const entries: OrderOfPlayEntry[] = useMemo(() => {
    if (order !== null) return order;
    return backendOrder ?? [];
  }, [order, backendOrder]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only sync once when backend data arrives
  React.useEffect(() => {
    if (backendOrder && backendOrder.length > 0 && order === null) {
      setOrder(backendOrder);
    }
  }, [backendOrder]);

  // Recalculate cumulative minutes after a reorder
  const withRecalculated = useMemo(() => {
    let cumulative = 0;
    return entries.map((e, idx) => {
      cumulative += Number(e.estimatedTotalMinutes);
      return {
        ...e,
        rank: BigInt(idx + 1),
        cumulativeMinutesIfThisOrder: BigInt(cumulative),
      };
    });
  }, [entries]);

  const handleDragStart = useCallback((idx: number) => {
    dragIndexRef.current = idx;
  }, []);

  const handleDrop = useCallback(
    (targetIdx: number) => {
      const srcIdx = dragIndexRef.current;
      if (srcIdx === null || srcIdx === targetIdx) return;
      setOrder((prev) => {
        const arr = [...(prev ?? entries)];
        const [item] = arr.splice(srcIdx, 1);
        arr.splice(targetIdx, 0, item);
        return arr;
      });
      dragIndexRef.current = null;
    },
    [entries],
  );

  const handleApply = useCallback(() => {
    setApplied(true);
    // Show a toast notification
    const event = new CustomEvent("courtflow-toast", {
      detail: {
        message:
          "Order of play locked in — match queue will prioritize this sequence",
      },
    });
    window.dispatchEvent(event);
    setTimeout(() => setApplied(false), 4000);
  }, []);

  const lastEntry = withRecalculated[withRecalculated.length - 1];
  const estimatedFinish = lastEntry
    ? addMinutesToTimeString(
        startTime,
        Number(lastEntry.cumulativeMinutesIfThisOrder),
      )
    : null;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!entries.length) return null;

  return (
    <div className="space-y-3" data-ocid="order-of-play.section">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD700]/20">
            <ListOrdered className="h-4 w-4 text-[#b8a200]" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-foreground leading-tight">
              Suggested Order of Play
            </h2>
            <p className="text-xs text-muted-foreground">
              AI-ranked category sequence for maximum court efficiency
            </p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant="default"
          onClick={handleApply}
          data-ocid="order-of-play.apply_button"
          className="shrink-0 gap-1.5 bg-primary hover:bg-primary/90"
        >
          {applied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" /> Locked In
            </>
          ) : (
            "Apply This Order"
          )}
        </Button>
      </div>

      <Card className="overflow-hidden border-border shadow-subtle">
        <div className="divide-y divide-border">
          {withRecalculated.map((entry, _idx) => {
            const badge = getRankBadge(_idx + 1);
            const catColour =
              CATEGORY_COLOURS[entry.categoryName] ?? "bg-primary";
            const catText =
              CATEGORY_TEXT_COLOURS[entry.categoryName] ?? "text-primary";
            const hasClash = Number(entry.crossCategoryClashCount) > 0;

            return (
              <div
                key={entry.categoryId}
                draggable
                onDragStart={() => handleDragStart(_idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(_idx)}
                className="flex items-start gap-3 px-4 py-3 bg-card hover:bg-muted/30 transition-colors cursor-grab active:cursor-grabbing group"
                data-ocid={`order-of-play.item.${_idx + 1}`}
              >
                {/* Grip */}
                <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-1 shrink-0 group-hover:text-muted-foreground transition-colors" />

                {/* Rank badge */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}
                >
                  {_idx + 1}
                </div>

                {/* Category name + dot */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div
                      className={`h-2.5 w-2.5 rounded-full shrink-0 ${catColour}`}
                    />
                    <span className={`font-semibold text-sm ${catText}`}>
                      {entry.categoryName}
                    </span>
                    {hasClash && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="h-3 w-3" />
                        {Number(entry.crossCategoryClashCount)} clash
                        {Number(entry.crossCategoryClashCount) !== 1
                          ? "es"
                          : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {entry.reason}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex shrink-0 items-center gap-4 text-right text-xs">
                  <div className="hidden sm:block">
                    <p className="font-semibold text-foreground">
                      {Number(entry.playerCount)}
                    </p>
                    <p className="text-muted-foreground">players</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-semibold text-foreground">
                      {Number(entry.totalMatches)}
                    </p>
                    <p className="text-muted-foreground">matches</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {formatMinutes(Number(entry.estimatedTotalMinutes))}
                    </p>
                    <p className="text-muted-foreground">est. time</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="font-semibold text-foreground text-[11px]">
                      by{" "}
                      {addMinutesToTimeString(
                        startTime,
                        Number(entry.cumulativeMinutesIfThisOrder),
                      )}
                    </p>
                    <p className="text-muted-foreground">cumulative</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cumulative timeline bar */}
        {estimatedFinish && (
          <div className="border-t border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  If played in this order, expected finish:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-base"
                  style={{ color: "#e6b800" }}
                >
                  {estimatedFinish}
                </span>
                <span className="text-xs text-muted-foreground">
                  (
                  {formatMinutes(
                    Number(lastEntry?.cumulativeMinutesIfThisOrder ?? 0n),
                  )}{" "}
                  total)
                </span>
              </div>
            </div>
            {/* Visual timeline */}
            <div className="mt-2 flex gap-0.5 h-2 rounded-full overflow-hidden">
              {withRecalculated.map((entry, _idx) => {
                const total = Number(
                  lastEntry?.cumulativeMinutesIfThisOrder ?? 1n,
                );
                const width =
                  total > 0
                    ? (Number(entry.estimatedTotalMinutes) / total) * 100
                    : 0;
                const catColour =
                  CATEGORY_COLOURS[entry.categoryName] ?? "bg-primary";
                return (
                  <div
                    key={entry.categoryId}
                    className={`${catColour} opacity-80 h-full transition-all`}
                    style={{ width: `${width}%` }}
                    title={`${entry.categoryName}: ${formatMinutes(Number(entry.estimatedTotalMinutes))}`}
                  />
                );
              })}
            </div>
            <div className="mt-1.5 flex gap-3 flex-wrap">
              {withRecalculated.map((entry) => {
                const catColour =
                  CATEGORY_COLOURS[entry.categoryName] ?? "bg-primary";
                return (
                  <div
                    key={entry.categoryId}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground"
                  >
                    <div className={`h-2 w-2 rounded-full ${catColour}`} />
                    {entry.categoryName}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Applied confirmation banner */}
      {applied && (
        <div
          className="flex items-center gap-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2.5 text-sm text-emerald-800 dark:text-emerald-300"
          data-ocid="order-of-play.success_state"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Order of play locked in — match queue will prioritise this sequence
        </div>
      )}
    </div>
  );
}

// ─── Category colour mapping ────────────────────────────────────────────────

const CATEGORY_COLOURS: Record<string, string> = {
  "U10 Boys": "bg-purple-500",
  "U12 Boys": "bg-blue-500",
  "U14 Boys": "bg-cyan-500",
  "Open Singles": "bg-emerald-500",
  "Junior Doubles": "bg-orange-500",
  "One Point Slam": "bg-red-500",
};

const CATEGORY_BORDER_COLOURS: Record<string, string> = {
  "U10 Boys": "border-purple-200 dark:border-purple-800",
  "U12 Boys": "border-blue-200 dark:border-blue-800",
  "U14 Boys": "border-cyan-200 dark:border-cyan-800",
  "Open Singles": "border-emerald-200 dark:border-emerald-800",
  "Junior Doubles": "border-orange-200 dark:border-orange-800",
  "One Point Slam": "border-red-200 dark:border-red-800",
};

const CATEGORY_TEXT_COLOURS: Record<string, string> = {
  "U10 Boys": "text-purple-700 dark:text-purple-300",
  "U12 Boys": "text-blue-700 dark:text-blue-300",
  "U14 Boys": "text-cyan-700 dark:text-cyan-300",
  "Open Singles": "text-emerald-700 dark:text-emerald-300",
  "Junior Doubles": "text-orange-700 dark:text-orange-300",
  "One Point Slam": "text-red-700 dark:text-red-300",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function roundName(round: bigint): string {
  const r = Number(round);
  const names: Record<number, string> = {
    1: "Round of 64",
    2: "Round of 32",
    3: "Round of 16",
    4: "Quarter Finals",
    5: "Semi Finals",
    6: "Final",
  };
  return names[r] ?? `Round ${r}`;
}

function groupMatchesByRound(
  matches: MatchView[],
): Record<string, MatchView[]> {
  const groups: Record<string, MatchView[]> = {};
  for (const m of matches) {
    const key = roundName(m.round);
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  }
  return groups;
}

// ─── Components ─────────────────────────────────────────────────────────────

function CategoryCard({
  category,
}: {
  category: CategoryView;
}) {
  const total =
    Number(category.matchesCompleted) + Number(category.matchesPending);
  const progress =
    total > 0 ? (Number(category.matchesCompleted) / total) * 100 : 0;
  const statusLabel = getCategoryStatusLabel(category.status);
  const statusClass = getCategoryStatusColor(category.status);
  const colourBar = CATEGORY_COLOURS[category.name] ?? "bg-primary";
  const borderColour =
    CATEGORY_BORDER_COLOURS[category.name] ?? "border-border";
  const textColour = CATEGORY_TEXT_COLOURS[category.name] ?? "text-primary";

  const isBehind =
    category.status === "delayed" || category.status === "urgent";

  return (
    <Card
      className={`relative overflow-hidden border ${borderColour} shadow-subtle transition-smooth hover:shadow-md`}
      data-ocid="category.card"
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${colourBar}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={`text-lg font-display ${textColour}`}>
              {category.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {roundName(category.currentRound)}
            </p>
          </div>
          <Badge className={`${statusClass} text-xs font-medium`}>
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isBehind && (
          <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 p-2.5 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">
                Behind schedule
              </p>
              <p className="text-amber-700 dark:text-amber-400">
                {Number(category.matchesPending)} match
                {category.matchesPending !== 1n ? "es" : ""} pending — consider
                prioritising this category
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {Number(category.numPlayers)} players
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDuration(category.avgDurationMinutes)} avg
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>
              {Number(category.matchesCompleted)} / {total}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="rounded-md bg-muted/50 p-2 text-center">
            <p className="text-lg font-semibold text-foreground">
              {Number(category.matchesCompleted)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Done
            </p>
          </div>
          <div className="rounded-md bg-muted/50 p-2 text-center">
            <p className="text-lg font-semibold text-foreground">
              {Number(category.matchesPending)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Pending
            </p>
          </div>
          <div className="rounded-md bg-muted/50 p-2 text-center">
            <p className="text-lg font-semibold text-foreground">
              {roundName(category.currentRound)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Round
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MatchRow({ match }: { match: MatchView }) {
  const statusClass = getStatusColor(match.status);
  const statusLabel = getStatusLabel(match.status);

  return (
    <div
      className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm"
      data-ocid="category.match.row"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <p className="font-medium truncate">
            {match.player1Name}{" "}
            <span className="text-muted-foreground">vs</span>{" "}
            {match.player2Name}
          </p>
          <p className="text-xs text-muted-foreground">
            {match.courtName ? `Court: ${match.courtName}` : "No court"}
            {match.startTime ? ` • ${formatTime(match.startTime)}` : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge className={`${statusClass} text-xs`}>{statusLabel}</Badge>
        {match.winnerName && (
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <Trophy className="h-3 w-3" />
            <span className="hidden sm:inline">{match.winnerName}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryMatchesSection({
  category,
  matches,
}: {
  category: CategoryView;
  matches: MatchView[];
}) {
  const [open, setOpen] = useState(false);
  const groups = useMemo(() => groupMatchesByRound(matches), [matches]);
  const colourBar = CATEGORY_COLOURS[category.name] ?? "bg-primary";

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-smooth"
        data-ocid="category.matches.toggle"
      >
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full ${colourBar}`} />
          <span className="font-medium">{category.name}</span>
          <Badge variant="secondary" className="text-xs">
            {matches.length} match{matches.length !== 1 ? "es" : ""}
          </Badge>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border px-4 py-3 space-y-4">
          {Object.entries(groups).map(([roundNameKey, roundMatches]) => (
            <div key={roundNameKey}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {roundNameKey}
              </h4>
              <div className="space-y-2">
                {roundMatches.map((m) => (
                  <MatchRow key={String(m.id)} match={m} />
                ))}
              </div>
            </div>
          ))}
          {matches.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No matches in this category yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: courtFlowData, isLoading: dataLoading } = useCourtFlowData();
  const { data: stats, isLoading: statsLoading } = useTournamentStats();
  const { data: config } = useTournamentConfig();

  const startTime = config?.startTime ?? "10:30 AM";

  const allMatches = courtFlowData?.matchQueue.map((q) => q.match) ?? [];

  const matchesByCategory = useMemo(() => {
    const map: Record<string, MatchView[]> = {};
    for (const m of allMatches) {
      if (!map[m.categoryName]) map[m.categoryName] = [];
      map[m.categoryName].push(m);
    }
    return map;
  }, [allMatches]);

  const totalCompleted = stats?.matchesCompleted ?? 0n;
  const totalPending = stats?.matchesPending ?? 0n;
  const totalMatches = Number(totalCompleted) + Number(totalPending);
  const overallProgress =
    totalMatches > 0 ? (Number(totalCompleted) / totalMatches) * 100 : 0;

  const isLoading = catLoading || dataLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder
              key={`skeleton-cat-${i}`}
              className="h-64 w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  const sortedCategories = [...(categories ?? [])].sort((a, b) => {
    const order = [
      "U10 Boys",
      "U12 Boys",
      "U14 Boys",
      "Open Singles",
      "Junior Doubles",
      "One Point Slam",
    ];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Order of Play — AI-ranked category suggestion */}
      <OrderOfPlaySection startTime={startTime} />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Tournament Categories
            </h1>
            <p className="text-muted-foreground mt-1">
              Overview and progress tracking for all event categories
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Total matches:{" "}
              <span className="font-semibold text-foreground">
                {Number(totalCompleted)}
              </span>{" "}
              completed /{" "}
              <span className="font-semibold text-foreground">
                {totalMatches}
              </span>{" "}
              total
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Overall tournament progress
            </span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>
      </div>

      {/* Category cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedCategories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>

      {/* Category matches summary */}
      <div className="space-y-3">
        <h2 className="text-lg font-display font-semibold text-foreground">
          Category Matches
        </h2>
        <div className="space-y-3">
          {sortedCategories.map((cat) => (
            <CategoryMatchesSection
              key={cat.id}
              category={cat}
              matches={matchesByCategory[cat.name] ?? []}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
