import { Button } from "@/components/ui/button";
import {
  useAssignMatchToCourt,
  useCompleteMatch,
  useCourtFlowData,
  useDelayMatch,
  useFreeCourtManually,
  useMatchQueue,
} from "@/hooks/useBackend";
import {
  cn,
  formatDuration,
  formatTime,
  getConflictBadgeInfo,
  getPriorityColor,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Grid3x3,
  Pause,
  Play,
  RotateCcw,
  Trophy,
  Users,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import type { CourtFlowCourtView, MatchView, QueueEntry } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function elapsedMinutes(startIso: string | undefined): number {
  if (!startIso) return 0;
  const start = new Date(startIso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / 60000));
}

function progressPct(match: MatchView): number {
  if (!match.startTime) return 0;
  const elapsed = elapsedMinutes(match.startTime);
  const total = Number(match.estimatedDurationMinutes);
  if (total <= 0) return 0;
  return Math.min(100, Math.round((elapsed / total) * 100));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CourtHeader({
  court,
  index,
}: {
  court: CourtFlowCourtView;
  index: number;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            court.isAvailable
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          )}
        >
          <Grid3x3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            {court.courtName}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-block w-2 h-2 rounded-full",
                court.isAvailable ? "bg-emerald-500" : "bg-amber-500",
                court.isAvailable && "animate-pulse",
              )}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {court.isAvailable ? "Available" : "In Progress"}
            </span>
          </div>
        </div>
      </div>
      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
        #{String(index + 1)}
      </span>
    </div>
  );
}

function MatchInProgressCard({
  match,
  court,
  onComplete,
  onFreeCourt,
  onDelay,
}: {
  match: MatchView;
  court: CourtFlowCourtView;
  onComplete: (matchId: bigint, winnerId: string) => void;
  onFreeCourt: (courtId: bigint) => void;
  onDelay: (matchId: bigint) => void;
}) {
  const [selectingWinner, setSelectingWinner] = React.useState(false);
  const pct = progressPct(match);
  const elapsed = elapsedMinutes(match.startTime);

  return (
    <div className="space-y-4">
      {/* Match meta */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              M{String(match.id)}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {match.categoryName}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-medium text-foreground">
              {match.roundName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Users className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="truncate">
              {match.player1Name}
              {match.player1Id && (
                <span className="text-muted-foreground font-normal ml-0.5">
                  ({String(match.player1Id).slice(0, 4)})
                </span>
              )}
            </span>
            <span className="text-muted-foreground font-normal">vs</span>
            <span className="truncate">
              {match.player2Name}
              {match.player2Id && (
                <span className="text-muted-foreground font-normal ml-0.5">
                  ({String(match.player2Id).slice(0, 4)})
                </span>
              )}
            </span>
          </div>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0",
            getStatusColor("onCourt"),
          )}
        >
          {getStatusLabel("onCourt")}
        </span>
      </div>

      {/* Time row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-muted/50 rounded-md p-2">
          <div className="text-muted-foreground mb-0.5">Started</div>
          <div className="font-semibold text-foreground">
            {formatTime(match.startTime)}
          </div>
        </div>
        <div className="bg-muted/50 rounded-md p-2">
          <div className="text-muted-foreground mb-0.5">Est. End</div>
          <div className="font-semibold text-foreground">
            {formatTime(match.endTime)}
          </div>
        </div>
        <div className="bg-muted/50 rounded-md p-2">
          <div className="text-muted-foreground mb-0.5">Duration</div>
          <div className="font-semibold text-foreground">
            {formatDuration(match.estimatedDurationMinutes)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Elapsed</span>
          <span className="font-medium text-foreground">
            {elapsed}m / {formatDuration(match.estimatedDurationMinutes)}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      {!selectingWinner ? (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setSelectingWinner(true)}
            data-ocid="court.mark_completed_button"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Mark Completed
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelay(match.id)}
            data-ocid="court.delay_match_button"
          >
            <Pause className="w-3.5 h-3.5 mr-1.5" />
            Delay Match
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onFreeCourt(court.courtId)}
            data-ocid="court.free_court_button"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Free Court
          </Button>
        </div>
      ) : (
        <div className="bg-muted/40 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Select winner:
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => {
                if (match.player1Id) {
                  onComplete(match.id, match.player1Id);
                  setSelectingWinner(false);
                }
              }}
              data-ocid="court.winner_p1_button"
            >
              <Trophy className="w-3.5 h-3.5 mr-1.5" />
              {match.player1Name} Won
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => {
                if (match.player2Id) {
                  onComplete(match.id, match.player2Id);
                  setSelectingWinner(false);
                }
              }}
              data-ocid="court.winner_p2_button"
            >
              <Trophy className="w-3.5 h-3.5 mr-1.5" />
              {match.player2Name} Won
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => setSelectingWinner(false)}
            data-ocid="court.cancel_winner_button"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

function RecommendedMatchRow({
  entry,
  courtId,
  onAssign,
}: {
  entry: QueueEntry;
  courtId: bigint;
  onAssign: (matchId: bigint, courtId: bigint) => void;
}) {
  const m = entry.match;
  const score = Number(m.priorityScore);

  return (
    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                getPriorityColor(score),
              )}
            >
              {score}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {m.categoryName}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-foreground">{m.roundName}</span>
          </div>
          <div className="text-sm font-medium text-foreground truncate">
            {m.player1Name} vs {m.player2Name}
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(m.estimatedDurationMinutes)}
            </span>
            <span>Rank #{String(entry.rank)}</span>
          </div>
        </div>
        <Button
          size="sm"
          className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => onAssign(m.id, courtId)}
          data-ocid="court.assign_recommended_button"
        >
          <Play className="w-3.5 h-3.5 mr-1" />
          Assign
        </Button>
      </div>

      {/* Conflicts */}
      {m.conflicts.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {m.conflicts.map((c) => {
            const info = getConflictBadgeInfo(c);
            return (
              <span
                key={c}
                className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded",
                  info.className,
                )}
              >
                {info.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Reason */}
      {m.scoreReason && (
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {m.scoreReason}
        </p>
      )}
    </div>
  );
}

function AvailableCourtCard({
  court,
  index,
  queue,
  onAssign,
}: {
  court: CourtFlowCourtView;
  index: number;
  queue: QueueEntry[];
  onAssign: (matchId: bigint, courtId: bigint) => void;
}) {
  const top3 = queue.slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-subtle">
      <CourtHeader court={court} index={index} />

      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Available
        </span>
      </div>

      {top3.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Recommended Matches
          </p>
          {top3.map((entry) => (
            <RecommendedMatchRow
              key={String(entry.match.id)}
              entry={entry}
              courtId={court.courtId}
              onAssign={onAssign}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            No ready matches in queue
          </p>
          <Link
            to="/matches"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            data-ocid="court.all_matches_link"
          >
            View all matches <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}

function OccupiedCourtCard({
  court,
  index,
  onComplete,
  onFreeCourt,
  onDelay,
}: {
  court: CourtFlowCourtView;
  index: number;
  onComplete: (matchId: bigint, winnerId: string) => void;
  onFreeCourt: (courtId: bigint) => void;
  onDelay: (matchId: bigint) => void;
}) {
  if (!court.currentMatch) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-subtle">
      <CourtHeader court={court} index={index} />
      <MatchInProgressCard
        match={court.currentMatch}
        court={court}
        onComplete={onComplete}
        onFreeCourt={onFreeCourt}
        onDelay={onDelay}
      />
    </div>
  );
}

function ManualAssignmentSection({
  courts,
  queue,
  onAssign,
}: {
  courts: CourtFlowCourtView[];
  queue: QueueEntry[];
  onAssign: (matchId: bigint, courtId: bigint) => void;
}) {
  const freeCourts = courts.filter((c) => c.isAvailable);
  const readyMatches = queue.map((q) => q.match);

  const [selectedCourt, setSelectedCourt] = React.useState<string>("");
  const [selectedMatch, setSelectedMatch] = React.useState<string>("");
  const [confirming, setConfirming] = React.useState(false);

  const selectedMatchObj = readyMatches.find(
    (m) => String(m.id) === selectedMatch,
  );

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-subtle">
      <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <RotateCcw className="w-4 h-4 text-muted-foreground" />
        Manual Assignment
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label
            htmlFor="manual-court-select"
            className="text-xs font-medium text-muted-foreground mb-1.5 block"
          >
            Select Court
          </label>
          <select
            id="manual-court-select"
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={selectedCourt}
            onChange={(e) => {
              setSelectedCourt(e.target.value);
              setConfirming(false);
            }}
            data-ocid="court.manual_court_select"
          >
            <option value="">Choose a court…</option>
            {freeCourts.map((c) => (
              <option key={String(c.courtId)} value={String(c.courtId)}>
                {c.courtName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="manual-match-select"
            className="text-xs font-medium text-muted-foreground mb-1.5 block"
          >
            Select Match
          </label>
          <select
            id="manual-match-select"
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={selectedMatch}
            onChange={(e) => {
              setSelectedMatch(e.target.value);
              setConfirming(false);
            }}
            data-ocid="court.manual_match_select"
          >
            <option value="">Choose a match…</option>
            {readyMatches.map((m) => (
              <option key={String(m.id)} value={String(m.id)}>
                M{String(m.id)} — {m.player1Name} vs {m.player2Name} (
                {m.categoryName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedMatchObj && (
        <div className="bg-muted/40 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                getPriorityColor(Number(selectedMatchObj.priorityScore)),
              )}
            >
              {String(selectedMatchObj.priorityScore)}
            </span>
            <span className="text-xs font-medium text-foreground">
              {selectedMatchObj.categoryName} · {selectedMatchObj.roundName}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {selectedMatchObj.scoreReason}
          </p>
          {selectedMatchObj.conflicts.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {selectedMatchObj.conflicts.map((c) => {
                const info = getConflictBadgeInfo(c);
                return (
                  <span
                    key={c}
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded",
                      info.className,
                    )}
                  >
                    {info.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!confirming ? (
        <Button
          disabled={!selectedCourt || !selectedMatch}
          onClick={() => setConfirming(true)}
          data-ocid="court.manual_assign_button"
        >
          Assign Now
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            onClick={() => {
              onAssign(BigInt(selectedMatch), BigInt(selectedCourt));
              setConfirming(false);
              setSelectedCourt("");
              setSelectedMatch("");
            }}
            data-ocid="court.manual_confirm_button"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Confirm Assignment
          </Button>
          <Button
            variant="ghost"
            onClick={() => setConfirming(false)}
            data-ocid="court.manual_cancel_button"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CourtsPage() {
  const { data, isLoading } = useCourtFlowData();
  const { data: queueData, isLoading: queueLoading } = useMatchQueue();

  const assignMutation = useAssignMatchToCourt();
  const completeMutation = useCompleteMatch();
  const freeCourtMutation = useFreeCourtManually();
  const delayMutation = useDelayMatch();

  const courts = data?.courts ?? [];
  const queue = queueData ?? [];

  const activeCourts = courts.filter((c) => !c.isAvailable).length;
  const availableCourts = courts.filter((c) => c.isAvailable).length;

  // Next match to complete = the one with highest progress
  const matchesOnCourt = courts
    .map((c) => c.currentMatch)
    .filter(Boolean) as MatchView[];
  const nextToComplete = matchesOnCourt.reduce<MatchView | null>((best, m) => {
    if (!best) return m;
    return progressPct(m) > progressPct(best) ? m : best;
  }, null);

  const handleAssign = (matchId: bigint, courtId: bigint) => {
    assignMutation.mutate(
      { matchId, courtId },
      {
        onSuccess: (res) => {
          if ("__kind__" in res && res.__kind__ === "ok") {
            toast.success("Match assigned to court");
          } else if ("__kind__" in res && res.__kind__ === "err") {
            toast.error(res.err);
          }
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleComplete = (matchId: bigint, winnerId: string) => {
    completeMutation.mutate(
      { matchId, winnerId },
      {
        onSuccess: (res) => {
          if ("__kind__" in res && res.__kind__ === "ok") {
            toast.success("Match completed");
          } else if ("__kind__" in res && res.__kind__ === "err") {
            toast.error(res.err);
          }
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleFreeCourt = (courtId: bigint) => {
    freeCourtMutation.mutate(courtId, {
      onSuccess: (res) => {
        if ("__kind__" in res && res.__kind__ === "ok") {
          toast.success("Court freed");
        } else if ("__kind__" in res && res.__kind__ === "err") {
          toast.error(res.err);
        }
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDelay = (matchId: bigint) => {
    delayMutation.mutate(matchId, {
      onSuccess: (res) => {
        if ("__kind__" in res && res.__kind__ === "ok") {
          toast.success("Match delayed");
        } else if ("__kind__" in res && res.__kind__ === "err") {
          toast.error(res.err);
        }
      },
      onError: (err) => toast.error(err.message),
    });
  };

  if (isLoading || queueLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder
              key={`skeleton-court-${i}`}
              className="h-64 bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Live Courts
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeCourts} of {courts.length} courts active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
            <Play className="w-3 h-3" />
            {matchesOnCourt.length} on court
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            {availableCourts} available
          </span>
          {nextToComplete && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1.5 rounded-full">
              <Clock className="w-3 h-3" />
              Next: M{String(nextToComplete.id)}
            </span>
          )}
        </div>
      </div>

      {/* Court cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courts.map((court, idx) =>
          court.isAvailable ? (
            <AvailableCourtCard
              key={String(court.courtId)}
              court={court}
              index={idx}
              queue={queue}
              onAssign={handleAssign}
            />
          ) : (
            <OccupiedCourtCard
              key={String(court.courtId)}
              court={court}
              index={idx}
              onComplete={handleComplete}
              onFreeCourt={handleFreeCourt}
              onDelay={handleDelay}
            />
          ),
        )}
      </div>

      {/* Manual assignment */}
      <ManualAssignmentSection
        courts={courts}
        queue={queue}
        onAssign={handleAssign}
      />

      {/* Conflict summary */}
      {queue.some((q) => q.match.conflicts.length > 0) && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">
              Conflicts Detected
            </h4>
          </div>
          <p className="text-xs text-red-700 dark:text-red-400">
            {queue.filter((q) => q.match.conflicts.length > 0).length} ready
            match(es) have scheduling conflicts. Review before assigning.
          </p>
        </div>
      )}
    </div>
  );
}
