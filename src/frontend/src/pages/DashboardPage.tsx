import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Flame,
  MessageCircle,
  Pause,
  Play,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useActivatePanicMode,
  useAssignMatchToCourt,
  useCompleteMatch,
  useCourtFlowData,
  useFreeCourtManually,
  useTournamentStats,
  useWaitingTimeSummary,
} from "../hooks/useBackend";
import {
  formatDate,
  formatDuration,
  formatTime,
  generateWhatsAppMessage,
  getConflictBadgeInfo,
  getPriorityColor,
  getStatusColor,
} from "../lib/utils";
import type { CourtFlowCourtView, MatchView, PlayerId } from "../types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useNowString() {
  const [now, setNow] = useState(() => new Date().toISOString());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date().toISOString()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function elapsedMinutes(startIso: string | undefined, nowIso: string): number {
  if (!startIso) return 0;
  const diff = new Date(nowIso).getTime() - new Date(startIso).getTime();
  return Math.max(0, Math.floor(diff / 60000));
}

function progressPercent(
  startIso: string | undefined,
  durationMin: bigint,
  nowIso: string,
): number {
  if (!startIso) return 0;
  const elapsed = elapsedMinutes(startIso, nowIso);
  const total =
    typeof durationMin === "bigint" ? Number(durationMin) : durationMin;
  if (total <= 0) return 0;
  return Math.min(100, Math.round((elapsed / total) * 100));
}

// ─── WhatsApp Export ─────────────────────────────────────────────────────────

function WhatsAppExportButton({
  config,
  courts,
  queue,
}: {
  config?: { name: string; venue: string };
  courts: CourtFlowCourtView[];
  queue: { match: MatchView }[];
}) {
  const handleCopy = () => {
    const msg = generateWhatsAppMessage(
      config,
      courts.map((c) => ({
        courtName: c.courtName,
        currentMatch: c.currentMatch
          ? {
              categoryName: c.currentMatch.categoryName,
              roundName: c.currentMatch.roundName,
              player1Name: c.currentMatch.player1Name,
              player2Name: c.currentMatch.player2Name,
            }
          : null,
      })),
      queue,
    );
    navigator.clipboard.writeText(msg).then(() => {
      toast.success("WhatsApp message copied to clipboard");
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      data-ocid="dashboard.whatsapp_export_button"
      className="gap-2"
    >
      <MessageCircle className="w-4 h-4" />
      <span className="hidden sm:inline">WhatsApp</span>
    </Button>
  );
}

// ─── Winner Dialog ───────────────────────────────────────────────────────────

function WinnerDialog({
  match,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  match: MatchView | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (winnerId: PlayerId) => void;
  isPending: boolean;
}) {
  const [selected, setSelected] = useState<PlayerId | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Select Winner
          </DialogTitle>
          <DialogDescription>
            Who won the match? This will free the court and advance the draw.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          {match && (
            <>
              <button
                type="button"
                onClick={() => setSelected(match.player1Id ?? null)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-smooth ${
                  selected === match.player1Id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
                data-ocid="dashboard.winner_dialog.player1_button"
              >
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{match.player1Name}</span>
                {selected === match.player1Id && (
                  <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelected(match.player2Id ?? null)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-smooth ${
                  selected === match.player2Id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
                data-ocid="dashboard.winner_dialog.player2_button"
              >
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{match.player2Name}</span>
                {selected === match.player2Id && (
                  <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                )}
              </button>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            data-ocid="dashboard.winner_dialog.cancel_button"
          >
            Cancel
          </Button>
          <Button
            disabled={!selected || isPending}
            onClick={() => selected && onConfirm(selected)}
            data-ocid="dashboard.winner_dialog.confirm_button"
          >
            {isPending ? "Saving…" : "Confirm Winner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Panic Mode Dialog ───────────────────────────────────────────────────────

function PanicModeDialog({
  open,
  onOpenChange,
  onActivate,
  isPending,
  suggestions,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onActivate: () => void;
  isPending: boolean;
  suggestions: string[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Flame className="w-5 h-5" />
            Panic Mode
          </DialogTitle>
          <DialogDescription>
            Emergency actions to get the tournament back on schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/40 p-3">
            <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
              Emergency Suggestions
            </p>
            <ul className="space-y-1.5">
              {suggestions.length > 0 ? (
                suggestions.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400"
                  >
                    <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))
              ) : (
                <li className="text-sm text-red-700 dark:text-red-400">
                  Shorten remaining matches, prioritise finals, pause optional
                  formats, move doubles to end, use sudden-death deuce, reduce
                  warm-up time.
                </li>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            data-ocid="dashboard.panic_dialog.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              onActivate();
              onOpenChange(false);
            }}
            data-ocid="dashboard.panic_dialog.activate_button"
          >
            {isPending ? "Activating…" : "Activate Panic Mode"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Court Card (Occupied) ───────────────────────────────────────────────────

function OccupiedCourtCard({
  court,
  nowIso,
  onMarkComplete,
  onFreeCourt,
  isFreeing,
}: {
  court: CourtFlowCourtView;
  nowIso: string;
  onMarkComplete: (match: MatchView) => void;
  onFreeCourt: (courtId: bigint) => void;
  isFreeing: boolean;
}) {
  const match = court.currentMatch!;
  const pct = progressPercent(
    match.startTime,
    match.estimatedDurationMinutes,
    nowIso,
  );
  const elapsed = elapsedMinutes(match.startTime, nowIso);

  return (
    <Card
      className="border-border shadow-subtle overflow-hidden"
      data-ocid={`dashboard.court_card.${court.courtId}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display">
            {court.courtName}
          </CardTitle>
          <Badge variant="secondary" className={getStatusColor("onCourt")}>
            On Court
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-medium">
            {match.categoryName}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {match.roundName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{match.player1Name}</div>
          <span className="text-xs text-muted-foreground">vs</span>
          <div className="text-sm font-medium text-right">
            {match.player2Name}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Play className="w-3 h-3" />
            {formatTime(match.startTime)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Est. {formatTime(match.endTime)}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Elapsed</span>
            <span className="font-medium">{formatDuration(elapsed)}</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 gap-1"
            onClick={() => onMarkComplete(match)}
            data-ocid={`dashboard.court_card.${court.courtId}.mark_complete_button`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark Completed
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1"
            disabled={isFreeing}
            onClick={() => onFreeCourt(court.courtId)}
            data-ocid={`dashboard.court_card.${court.courtId}.free_court_button`}
          >
            <Pause className="w-3.5 h-3.5" />
            Free Court
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Court Card (Available) ──────────────────────────────────────────────────

function AvailableCourtCard({
  court,
  onAssign,
  isAssigning,
}: {
  court: CourtFlowCourtView;
  onAssign: (matchId: bigint, courtId: bigint) => void;
  isAssigning: boolean;
}) {
  const rec = court.recommendedNext;

  return (
    <Card
      className="border-border shadow-subtle overflow-hidden border-dashed"
      data-ocid={`dashboard.court_card.${court.courtId}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display">
            {court.courtName}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <Badge variant="secondary" className={getStatusColor("ready")}>
              Available
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rec ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recommended
              </span>
              <Badge
                className={`text-xs font-bold ${getPriorityColor(rec.match.priorityScore)}`}
              >
                {Number(rec.match.priorityScore)}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium">
                {rec.match.categoryName}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {rec.match.roundName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{rec.match.player1Name}</div>
              <span className="text-xs text-muted-foreground">vs</span>
              <div className="text-sm font-medium text-right">
                {rec.match.player2Name}
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {rec.match.scoreReason}
            </p>

            {rec.match.conflicts.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {rec.match.conflicts.map((c) => {
                  const info = getConflictBadgeInfo(c);
                  return (
                    <Badge
                      key={c}
                      variant="secondary"
                      className={`text-[10px] ${info.className}`}
                    >
                      {info.label}
                    </Badge>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                className="flex-1 gap-1"
                disabled={isAssigning}
                onClick={() => onAssign(rec.match.id, court.courtId)}
                data-ocid={`dashboard.court_card.${court.courtId}.assign_recommended_button`}
              >
                <Zap className="w-3.5 h-3.5" />
                Assign Recommended
              </Button>
            </div>
          </>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              No recommended match available
            </p>
          </div>
        )}

        <Link
          to="/matches"
          className="flex items-center justify-center gap-1 text-xs text-primary hover:underline"
          data-ocid={`dashboard.court_card.${court.courtId}.choose_different_link`}
        >
          Choose Different Match
          <ChevronRight className="w-3 h-3" />
        </Link>
      </CardContent>
    </Card>
  );
}

// ─── Time Panel ──────────────────────────────────────────────────────────────

function TimePanel({ stats }: { stats?: import("../types").TournamentStats }) {
  if (!stats) return null;

  const completed = Number(stats.matchesCompleted);
  const pending = Number(stats.matchesPending);
  const total = completed + pending;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const util = Number(stats.courtUtilisationPct);

  return (
    <Card className="border-border shadow-subtle">
      <CardContent className="p-4 md:p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
              Current Time
            </p>
            <p className="text-lg font-display font-semibold">
              {formatTime(stats.currentTime)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
              End Time
            </p>
            <p className="text-lg font-display font-semibold">
              {formatTime(stats.tournamentEndTime)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
              Time Remaining
            </p>
            <p className="text-lg font-display font-semibold">
              {formatDuration(stats.courtTimeRemainingMinutes)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
              Est. Finish
            </p>
            <p className="text-lg font-display font-semibold">
              {formatTime(stats.estimatedFinishTime)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
              Matches
            </p>
            <p className="text-sm font-medium">
              <span className="text-emerald-600 font-semibold">
                {completed}
              </span>
              <span className="text-muted-foreground">
                {" "}
                / {total} completed
              </span>
            </p>
            <Progress value={progress} className="h-1.5 mt-1" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
              Pending
            </p>
            <p className="text-sm font-medium">{pending} matches</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
              Court Utilisation
            </p>
            <p className="text-sm font-medium">{util}%</p>
            <Progress value={util} className="h-1.5 mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Waiting Panel ───────────────────────────────────────────────────────────

function WaitingPanel({
  summary,
}: { summary?: import("../types").WaitingTimeSummary }) {
  if (!summary) return null;

  return (
    <Card className="border-border shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Waiting Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/40 p-3 text-center">
            <p className="text-lg font-display font-semibold">
              {Number(summary.averageWaitMinutes)}m
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-0.5">
              Average
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3 text-center">
            <p className="text-lg font-display font-semibold">
              {summary.longestWaiting.length}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-0.5">
              Waiting
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3 text-center">
            <p className="text-lg font-display font-semibold">
              {summary.recentlyPlayed.length}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-0.5">
              Resting
            </p>
          </div>
        </div>

        {summary.longestWaiting.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2">
              Longest Waiting
            </p>
            <div className="space-y-1.5">
              {summary.longestWaiting.slice(0, 3).map((entry, i) => (
                <div
                  key={entry.playerId}
                  className="flex items-center justify-between text-sm"
                  data-ocid={`dashboard.waiting.item.${i + 1}`}
                >
                  <span className="font-medium">{entry.playerName}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {Number(entry.waitingMinutes)}m
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {summary.recentlyPlayed.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2">
              Need Rest
            </p>
            <div className="space-y-1.5">
              {summary.recentlyPlayed.slice(0, 3).map((entry, i) => (
                <div
                  key={`${entry.playerId}-rest`}
                  className="flex items-center justify-between text-sm"
                  data-ocid={`dashboard.resting.item.${i + 1}`}
                >
                  <span className="font-medium">{entry.playerName}</span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {Number(entry.restMinutesRemaining)}m left
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {summary.warnings.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/40 p-3">
            <p className="text-[11px] uppercase tracking-wide text-amber-700 dark:text-amber-400 font-medium mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Warnings
            </p>
            <div className="space-y-1">
              {summary.warnings.slice(0, 3).map((w, i) => (
                <p
                  key={`${w.playerId}-${w.warningType}`}
                  className="text-xs text-amber-700 dark:text-amber-400"
                  data-ocid={`dashboard.warning.item.${i + 1}`}
                >
                  {w.playerName}: {w.message}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard Page ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: courtFlowData, isLoading: isLoadingData } = useCourtFlowData();
  const { data: stats } = useTournamentStats();
  const { data: waitingSummary } = useWaitingTimeSummary();

  const assignMutation = useAssignMatchToCourt();
  const completeMutation = useCompleteMatch();
  const freeMutation = useFreeCourtManually();
  const panicMutation = useActivatePanicMode();

  const [winnerDialogOpen, setWinnerDialogOpen] = useState(false);
  const [panicDialogOpen, setPanicDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchView | null>(null);

  const nowIso = useNowString();

  const handleAssignRecommended = (matchId: bigint, courtId: bigint) => {
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

  const handleMarkComplete = (match: MatchView) => {
    setSelectedMatch(match);
    setWinnerDialogOpen(true);
  };

  const handleConfirmWinner = (winnerId: PlayerId) => {
    if (!selectedMatch) return;
    completeMutation.mutate(
      { matchId: selectedMatch.id, winnerId },
      {
        onSuccess: (res) => {
          if ("__kind__" in res && res.__kind__ === "ok") {
            toast.success("Match completed");
            setWinnerDialogOpen(false);
            setSelectedMatch(null);
          } else if ("__kind__" in res && res.__kind__ === "err") {
            toast.error(res.err);
          }
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleFreeCourt = (courtId: bigint) => {
    freeMutation.mutate(courtId, {
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

  const handlePanicMode = () => {
    panicMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Panic mode activated");
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const config = courtFlowData?.config;
  const courts = courtFlowData?.courts ?? [];
  const queue = courtFlowData?.matchQueue ?? [];

  const isRunningLate = stats?.isRunningLate ?? false;

  if (isLoadingData) {
    return (
      <div className="p-4 md:p-6 space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="h-32 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Section 1 — Tournament Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
            {config?.name ?? "AJ Tennis Summer Open"}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>{config?.venue ?? "Matunga Gymkhana"}</span>
            <span>·</span>
            <span>{formatDate(config?.date)}</span>
            <span>·</span>
            <span>
              {formatTime(config?.startTime)} — {formatTime(config?.endTime)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className={
              isRunningLate
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            }
          >
            {isRunningLate ? "Running Late" : "On Track"}
          </Badge>
          <WhatsAppExportButton
            config={
              config ? { name: config.name, venue: config.venue } : undefined
            }
            courts={courts}
            queue={queue}
          />
        </div>
      </div>

      {/* Section 2 — Time Panel */}
      <TimePanel stats={stats} />

      {/* Late warning bar */}
      {isRunningLate && stats?.suggestions && stats.suggestions.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/40 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                Tournament is running late
              </p>
              <ul className="mt-1.5 space-y-1">
                {stats.suggestions.map((s) => (
                  <li
                    key={s}
                    className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5"
                  >
                    <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="gap-1.5 flex-shrink-0"
              onClick={() => setPanicDialogOpen(true)}
              data-ocid="dashboard.panic_mode_button"
            >
              <Flame className="w-3.5 h-3.5" />
              Panic Mode
            </Button>
          </div>
        </div>
      )}

      {/* Section 3 — Live Court Cards */}
      <div>
        <h2 className="text-sm font-display font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Live Courts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courts.map((court) =>
            court.isAvailable || !court.currentMatch ? (
              <AvailableCourtCard
                key={Number(court.courtId)}
                court={court}
                onAssign={handleAssignRecommended}
                isAssigning={assignMutation.isPending}
              />
            ) : (
              <OccupiedCourtCard
                key={Number(court.courtId)}
                court={court}
                nowIso={nowIso}
                onMarkComplete={handleMarkComplete}
                onFreeCourt={handleFreeCourt}
                isFreeing={freeMutation.isPending}
              />
            ),
          )}
        </div>
      </div>

      {/* Section 4 — Waiting Time */}
      <WaitingPanel summary={waitingSummary} />

      {/* Dialogs */}
      <WinnerDialog
        match={selectedMatch}
        open={winnerDialogOpen}
        onOpenChange={setWinnerDialogOpen}
        onConfirm={handleConfirmWinner}
        isPending={completeMutation.isPending}
      />

      <PanicModeDialog
        open={panicDialogOpen}
        onOpenChange={setPanicDialogOpen}
        onActivate={handlePanicMode}
        isPending={panicMutation.isPending}
        suggestions={stats?.suggestions ?? []}
      />
    </div>
  );
}
