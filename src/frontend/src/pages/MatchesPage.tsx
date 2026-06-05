import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAllMatches,
  useAssignMatchToCourt,
  useCompleteMatch,
  useCourtFlowData,
  useDelayMatch,
  useMatchQueue,
  useOverrideMatch,
  useResetMatch,
  useStartMatch,
} from "@/hooks/useBackend";
import {
  cn,
  formatDuration,
  getConflictBadgeInfo,
  getPriorityBarColor,
  getPriorityColor,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import type { MatchId, MatchView, PlayerId } from "@/types";
import {
  Check,
  Clock,
  Play,
  RotateCcw,
  ShieldAlert,
  Trophy,
  Users,
} from "lucide-react";
import React from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRankStyle(rank: number) {
  if (rank === 1)
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 ring-1 ring-amber-300";
  if (rank === 2)
    return "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400 ring-1 ring-slate-300";
  if (rank === 3)
    return "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 ring-1 ring-orange-300";
  return "bg-muted text-muted-foreground";
}

function getCategoryColor(name: string): string {
  const map: Record<string, string> = {
    "U10 Boys":
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "U12 Boys":
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "U14 Boys":
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    "Open Singles":
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Junior Doubles":
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    "One Point Slam":
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return map[name] || "bg-muted text-muted-foreground";
}

function getMatchStatusDot(status: string): string {
  switch (status) {
    case "ready":
      return "bg-blue-500";
    case "onCourt":
      return "bg-emerald-500 animate-pulse";
    case "completed":
      return "bg-emerald-700";
    case "delayed":
      return "bg-amber-500";
    case "notReady":
      return "bg-muted-foreground";
    default:
      return "bg-muted-foreground";
  }
}

// ─── Components ──────────────────────────────────────────────────────────────

function PriorityBadge({ score }: { score: bigint | number }) {
  const s = typeof score === "bigint" ? Number(score) : score;
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "px-2 py-0.5 rounded-sm text-xs font-bold tabular-nums",
          getPriorityColor(s),
        )}
      >
        {s}
      </div>
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            getPriorityBarColor(s),
          )}
          style={{ width: `${s}%` }}
        />
      </div>
    </div>
  );
}

function ConflictBadges({ conflicts }: { conflicts: string[] }) {
  if (!conflicts.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {conflicts.map((c) => {
        const info = getConflictBadgeInfo(c);
        return (
          <Badge
            key={c}
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0", info.className)}
          >
            {info.label}
          </Badge>
        );
      })}
    </div>
  );
}

function CourtSelect({
  courts,
  value,
  onChange,
  placeholder = "Select court",
}: {
  courts: string[];
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className="w-[140px] h-8 text-xs"
        data-ocid="match.court_select"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {courts.map((name, i) => (
          <SelectItem key={name} value={String(i)} className="text-xs">
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Winner Dialog ───────────────────────────────────────────────────────────

function WinnerDialog({
  match,
  open,
  onClose,
  onConfirm,
  isPending,
}: {
  match: MatchView | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (winnerId: PlayerId) => void;
  isPending: boolean;
}) {
  const [selected, setSelected] = React.useState<PlayerId | null>(null);
  React.useEffect(() => {
    if (open) setSelected(null);
  }, [open]);

  if (!match) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Select Winner
          </DialogTitle>
          <DialogDescription>
            {match.categoryName} {match.roundName} — {match.player1Name} vs{" "}
            {match.player2Name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          <button
            type="button"
            onClick={() => setSelected(match.player1Id ?? null)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-smooth",
              selected === match.player1Id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40",
            )}
            data-ocid="match.winner.player1_button"
          >
            <Users className="w-6 h-6 text-muted-foreground" />
            <span className="font-medium text-sm">{match.player1Name}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelected(match.player2Id ?? null)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-smooth",
              selected === match.player2Id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40",
            )}
            data-ocid="match.winner.player2_button"
          >
            <Users className="w-6 h-6 text-muted-foreground" />
            <span className="font-medium text-sm">{match.player2Name}</span>
          </button>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid="match.winner.cancel_button"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!selected || isPending}
            onClick={() => selected && onConfirm(selected)}
            data-ocid="match.winner.confirm_button"
          >
            {isPending ? "Saving…" : "Confirm Winner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Queue Section ───────────────────────────────────────────────────────────

function QueueSection() {
  const { data: queue = [], isLoading } = useMatchQueue();
  const { data: courtFlow } = useCourtFlowData();
  const assignMutation = useAssignMatchToCourt();
  const startMutation = useStartMatch();
  const [selectedCourt, setSelectedCourt] = React.useState<
    Record<string, string>
  >({});

  const courts = courtFlow?.config.courts ?? [];

  const handleAssign = (matchId: MatchId, courtIdx: string) => {
    assignMutation.mutate({ matchId, courtId: BigInt(courtIdx) });
    setSelectedCourt((prev) => ({ ...prev, [String(matchId)]: "" }));
  };

  const handleStart = (matchId: MatchId, courtIdx: string) => {
    startMutation.mutate({ matchId, courtId: BigInt(courtIdx) });
    setSelectedCourt((prev) => ({ ...prev, [String(matchId)]: "" }));
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Match Queue — Ranked by AI Priority
        </h2>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder
              key={`skeleton-match-${i}`}
              className="h-20 bg-muted/50 rounded-sm animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  const readyQueue = queue.filter(
    (e) => e.match.status === "ready" || e.match.status === "delayed",
  );

  if (!readyQueue.length) {
    return (
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Match Queue — Ranked by AI Priority
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-sm border border-border">
          <Check className="w-10 h-10 text-emerald-500 mb-3" />
          <p className="text-sm font-medium text-foreground">All caught up!</p>
          <p className="text-xs text-muted-foreground mt-1">
            No ready matches in the queue right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-foreground">
        Match Queue — Ranked by AI Priority
      </h2>
      <div className="space-y-2">
        {readyQueue.map((entry) => {
          const m = entry.match;
          const rank = Number(entry.rank);
          const courtKey = String(m.id);
          const selected = selectedCourt[courtKey] ?? "";

          return (
            <div
              key={String(m.id)}
              className="bg-card rounded-sm border border-border p-3 sm:p-4 transition-smooth hover:shadow-subtle"
              data-ocid={`match.queue.item.${rank}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Rank + Priority */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold",
                      getRankStyle(rank),
                    )}
                  >
                    #{rank}
                  </div>
                  <PriorityBadge score={m.priorityScore} />
                </div>

                {/* Match info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        getCategoryColor(m.categoryName),
                      )}
                    >
                      {m.categoryName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {m.roundName}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatDuration(m.estimatedDurationMinutes)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {m.player1Name}{" "}
                    <span className="text-muted-foreground font-normal">
                      vs
                    </span>{" "}
                    {m.player2Name}
                  </p>
                  {m.scoreReason && (
                    <p className="text-xs text-muted-foreground italic mt-0.5 line-clamp-2">
                      {m.scoreReason}
                    </p>
                  )}
                  <div className="mt-1.5">
                    <ConflictBadges conflicts={m.conflicts.map(String)} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <CourtSelect
                    courts={courts}
                    value={selected}
                    onChange={(v) =>
                      setSelectedCourt((prev) => ({ ...prev, [courtKey]: v }))
                    }
                    placeholder="Court…"
                  />
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    disabled={!selected || assignMutation.isPending}
                    onClick={() => handleAssign(m.id, selected)}
                    data-ocid={`match.queue.assign_button.${rank}`}
                  >
                    {assignMutation.isPending ? "…" : "Assign"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    disabled={!selected || startMutation.isPending}
                    onClick={() => handleStart(m.id, selected)}
                    data-ocid={`match.queue.start_button.${rank}`}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Start
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── All Matches Section ─────────────────────────────────────────────────────

function AllMatchesSection() {
  const { data: allMatches, isLoading } = useAllMatches();
  const { data: courtFlow } = useCourtFlowData();
  const matches = allMatches ?? [];
  const courts = courtFlow?.config.courts ?? [];

  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [winnerMatch, setWinnerMatch] = React.useState<MatchView | null>(null);

  const completeMutation = useCompleteMatch();
  const delayMutation = useDelayMatch();
  const resetMutation = useResetMatch();
  const startMutation = useStartMatch();
  const overrideMutation = useOverrideMatch();
  const [courtSelections, setCourtSelections] = React.useState<
    Record<string, string>
  >({});

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    for (const m of matches) {
      set.add(m.categoryName);
    }
    return Array.from(set);
  }, [matches]);

  const filtered = React.useMemo(() => {
    return matches.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (categoryFilter !== "all" && m.categoryName !== categoryFilter)
        return false;
      return true;
    });
  }, [matches, statusFilter, categoryFilter]);

  const handleStart = (matchId: MatchId) => {
    const idx = courtSelections[String(matchId)];
    if (idx === undefined) return;
    startMutation.mutate({ matchId, courtId: BigInt(idx) });
    setCourtSelections((prev) => ({ ...prev, [String(matchId)]: "" }));
  };

  const handleOverride = (matchId: MatchId) => {
    const idx = courtSelections[String(matchId)];
    if (idx === undefined) return;
    overrideMutation.mutate({ matchId, courtId: BigInt(idx) });
    setCourtSelections((prev) => ({ ...prev, [String(matchId)]: "" }));
  };

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "notReady", label: "Not Ready" },
    { value: "ready", label: "Ready" },
    { value: "onCourt", label: "On Court" },
    { value: "completed", label: "Completed" },
    { value: "delayed", label: "Delayed" },
  ];

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">
          All Matches
        </h2>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder
              key={`skeleton-match-${i}`}
              className="h-14 bg-muted/50 rounded-sm animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h2 className="font-display text-xl font-semibold text-foreground">
          All Matches
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-[130px] h-8 text-xs"
              data-ocid="match.filter.status_select"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger
              className="w-[150px] h-8 text-xs"
              data-ocid="match.filter.category_select"
            >
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Categories
              </SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="text-xs">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                Match
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                Category
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                Round
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                Players
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                Duration
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                Status
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                Court
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, idx) => (
              <tr
                key={String(m.id)}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                data-ocid={`match.table.row.${idx + 1}`}
              >
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                  M{String(m.id)}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      getCategoryColor(m.categoryName),
                    )}
                  >
                    {m.categoryName}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {m.roundName}
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="font-medium text-foreground">
                    {m.player1Name}
                  </span>
                  <span className="text-muted-foreground mx-1">vs</span>
                  <span className="font-medium text-foreground">
                    {m.player2Name}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                  {formatDuration(m.estimatedDurationMinutes)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        getMatchStatusDot(m.status),
                      )}
                    />
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        getStatusColor(m.status),
                      )}
                    >
                      {getStatusLabel(m.status)}
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {m.courtName ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {m.status === "ready" && (
                      <>
                        <CourtSelect
                          courts={courts}
                          value={courtSelections[String(m.id)] ?? ""}
                          onChange={(v) =>
                            setCourtSelections((prev) => ({
                              ...prev,
                              [String(m.id)]: v,
                            }))
                          }
                          placeholder="Court"
                        />
                        <Button
                          size="sm"
                          className="h-7 text-[11px] px-2"
                          disabled={
                            !courtSelections[String(m.id)] ||
                            startMutation.isPending
                          }
                          onClick={() => handleStart(m.id)}
                          data-ocid={`match.table.start_button.${idx + 1}`}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] px-2"
                          disabled={delayMutation.isPending}
                          onClick={() => delayMutation.mutate(m.id)}
                          data-ocid={`match.table.delay_button.${idx + 1}`}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Delay
                        </Button>
                      </>
                    )}
                    {m.status === "onCourt" && (
                      <>
                        <Button
                          size="sm"
                          className="h-7 text-[11px] px-2"
                          disabled={completeMutation.isPending}
                          onClick={() => setWinnerMatch(m)}
                          data-ocid={`match.table.complete_button.${idx + 1}`}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] px-2"
                          disabled={delayMutation.isPending}
                          onClick={() => delayMutation.mutate(m.id)}
                          data-ocid={`match.table.delay_button.${idx + 1}`}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Delay
                        </Button>
                      </>
                    )}
                    {m.status === "delayed" && (
                      <>
                        <CourtSelect
                          courts={courts}
                          value={courtSelections[String(m.id)] ?? ""}
                          onChange={(v) =>
                            setCourtSelections((prev) => ({
                              ...prev,
                              [String(m.id)]: v,
                            }))
                          }
                          placeholder="Court"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] px-2"
                          disabled={resetMutation.isPending}
                          onClick={() => resetMutation.mutate(m.id)}
                          data-ocid={`match.table.reset_button.${idx + 1}`}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 text-[11px] px-2"
                          disabled={
                            !courtSelections[String(m.id)] ||
                            overrideMutation.isPending
                          }
                          onClick={() => handleOverride(m.id)}
                          data-ocid={`match.table.override_button.${idx + 1}`}
                        >
                          <ShieldAlert className="w-3 h-3 mr-1" />
                          Assign
                        </Button>
                      </>
                    )}
                    {m.status === "completed" && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span>{m.winnerName ?? "—"}</span>
                      </div>
                    )}
                    {m.status === "notReady" && (
                      <span className="text-xs text-muted-foreground italic">
                        Waiting for prior round
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No matches match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {filtered.map((m, idx) => (
          <div
            key={String(m.id)}
            className="bg-card rounded-sm border border-border p-3 space-y-2"
            data-ocid={`match.card.${idx + 1}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    getCategoryColor(m.categoryName),
                  )}
                >
                  {m.categoryName}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {m.roundName}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    getMatchStatusDot(m.status),
                  )}
                />
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    getStatusColor(m.status),
                  )}
                >
                  {getStatusLabel(m.status)}
                </Badge>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground">
              {m.player1Name}{" "}
              <span className="text-muted-foreground font-normal">vs</span>{" "}
              {m.player2Name}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="tabular-nums">
                {formatDuration(m.estimatedDurationMinutes)}
              </span>
              <span>·</span>
              <span>{m.courtName ?? "No court"}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {m.status === "ready" && (
                <>
                  <CourtSelect
                    courts={courts}
                    value={courtSelections[String(m.id)] ?? ""}
                    onChange={(v) =>
                      setCourtSelections((prev) => ({
                        ...prev,
                        [String(m.id)]: v,
                      }))
                    }
                    placeholder="Court"
                  />
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    disabled={
                      !courtSelections[String(m.id)] || startMutation.isPending
                    }
                    onClick={() => handleStart(m.id)}
                    data-ocid={`match.card.start_button.${idx + 1}`}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    disabled={delayMutation.isPending}
                    onClick={() => delayMutation.mutate(m.id)}
                    data-ocid={`match.card.delay_button.${idx + 1}`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Delay
                  </Button>
                </>
              )}
              {m.status === "onCourt" && (
                <>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    disabled={completeMutation.isPending}
                    onClick={() => setWinnerMatch(m)}
                    data-ocid={`match.card.complete_button.${idx + 1}`}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    disabled={delayMutation.isPending}
                    onClick={() => delayMutation.mutate(m.id)}
                    data-ocid={`match.card.delay_button.${idx + 1}`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Delay
                  </Button>
                </>
              )}
              {m.status === "delayed" && (
                <>
                  <CourtSelect
                    courts={courts}
                    value={courtSelections[String(m.id)] ?? ""}
                    onChange={(v) =>
                      setCourtSelections((prev) => ({
                        ...prev,
                        [String(m.id)]: v,
                      }))
                    }
                    placeholder="Court"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    disabled={resetMutation.isPending}
                    onClick={() => resetMutation.mutate(m.id)}
                    data-ocid={`match.card.reset_button.${idx + 1}`}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    disabled={
                      !courtSelections[String(m.id)] ||
                      overrideMutation.isPending
                    }
                    onClick={() => handleOverride(m.id)}
                    data-ocid={`match.card.override_button.${idx + 1}`}
                  >
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    Assign
                  </Button>
                </>
              )}
              {m.status === "completed" && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Winner: {m.winnerName ?? "—"}</span>
                </div>
              )}
              {m.status === "notReady" && (
                <span className="text-xs text-muted-foreground italic">
                  Waiting for prior round
                </span>
              )}
            </div>
          </div>
        ))}
        {!filtered.length && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No matches match the selected filters.
          </div>
        )}
      </div>

      <WinnerDialog
        match={winnerMatch}
        open={!!winnerMatch}
        onClose={() => setWinnerMatch(null)}
        onConfirm={(winnerId) => {
          if (winnerMatch) {
            completeMutation.mutate({ matchId: winnerMatch.id, winnerId });
            setWinnerMatch(null);
          }
        }}
        isPending={completeMutation.isPending}
      />
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MatchesPage() {
  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
      <QueueSection />
      <AllMatchesSection />
    </div>
  );
}
