import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePlayers, useWaitingTimeSummary } from "@/hooks/useBackend";
import {
  formatDuration,
  formatTime,
  getPlayerStatusColor,
  getPlayerStatusLabel,
} from "@/lib/utils";
import type {
  PlayerView,
  RestedEntry,
  WaitingEntry,
  WaitingWarning,
} from "@/types";
import { PlayerStatus } from "@/types";
import {
  Activity,
  AlertTriangle,
  Clock,
  Search,
  ShieldAlert,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getWaitBadgeColor(minutes: bigint): string {
  const m = Number(minutes);
  if (m > 30)
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200";
  if (m >= 15)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200";
}

function getWarningIcon(type: string) {
  switch (type) {
    case "waitedTooLong":
      return <Clock className="h-4 w-4 text-red-500" />;
    case "multiCategoryRisk":
      return <ShieldAlert className="h-4 w-4 text-purple-500" />;
    case "backToBackRisk":
      return <Zap className="h-4 w-4 text-orange-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  }
}

function getWarningTitle(type: string): string {
  switch (type) {
    case "waitedTooLong":
      return "Waited Too Long";
    case "multiCategoryRisk":
      return "Multi-Category Clash Risk";
    case "backToBackRisk":
      return "Back-to-Back Risk";
    default:
      return "Warning";
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function WaitingTimePanel({
  summary,
  isLoading,
}: {
  summary: import("@/types").WaitingTimeSummary | undefined;
  isLoading: boolean;
}) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Average wait time hero */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Average Waiting Time
            </p>
            <p className="text-4xl font-display font-bold text-primary mt-1">
              {formatDuration(summary.averageWaitMinutes)}
            </p>
          </div>
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Timer className="h-7 w-7 text-primary" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Longest waiting */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-500" />
              Longest Waiting
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {summary.longestWaiting.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No players currently waiting
              </p>
            ) : (
              <div className="space-y-2">
                {summary.longestWaiting
                  .slice(0, 5)
                  .map((entry: WaitingEntry, idx: number) => (
                    <div
                      key={entry.playerId}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-smooth"
                      data-ocid={`players.waiting.item.${idx + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground w-5">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {entry.playerName}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold ${getWaitBadgeColor(entry.waitingMinutes)}`}
                      >
                        {formatDuration(entry.waitingMinutes)}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rest required */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Rest Required
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {summary.recentlyPlayed.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No players currently resting
              </p>
            ) : (
              <div className="space-y-2">
                {summary.recentlyPlayed.map(
                  (entry: RestedEntry, idx: number) => (
                    <div
                      key={entry.playerId}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-smooth"
                      data-ocid={`players.resting.item.${idx + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground w-5">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-sm font-medium text-foreground block">
                            {entry.playerName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Last: {formatTime(entry.lastMatchEndTime)}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200"
                      >
                        {formatDuration(entry.restMinutesRemaining)} remaining
                      </Badge>
                    </div>
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Warnings */}
      {summary.warnings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {summary.warnings.map((warning: WaitingWarning, idx: number) => (
            <Card
              key={`${warning.playerId}-${idx}`}
              className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
              data-ocid={`players.warning.item.${idx + 1}`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="mt-0.5">
                  {getWarningIcon(warning.warningType)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    {getWarningTitle(warning.warningType)}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                    {warning.playerName}: {warning.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PlayerCard({
  player,
}: {
  player: PlayerView;
}) {
  const isMultiCategory = player.categories.length > 1;
  const statusColor = getPlayerStatusColor(player.status);
  const statusLabel = getPlayerStatusLabel(player.status);

  return (
    <Card className="bg-card border-border hover:shadow-subtle transition-smooth">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {player.name}
                {player.seedNumber !== undefined && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    (Seed {Number(player.seedNumber)})
                  </span>
                )}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {player.categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${
                      isMultiCategory
                        ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cat}
                  </Badge>
                ))}
                {isMultiCategory && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 font-bold"
                  >
                    MULTI
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Badge
            className={`text-xs font-semibold shrink-0 ${statusColor} ${
              player.status === PlayerStatus.playing ? "animate-pulse" : ""
            }`}
          >
            {statusLabel}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/40 rounded-md p-2">
            <p className="text-xs text-muted-foreground">Last Match</p>
            <p className="text-sm font-medium text-foreground">
              {player.lastMatchEndTime
                ? formatTime(player.lastMatchEndTime)
                : "—"}
            </p>
          </div>
          <div className="bg-muted/40 rounded-md p-2">
            <p className="text-xs text-muted-foreground">Waiting</p>
            <p className="text-sm font-medium text-foreground">
              {formatDuration(player.totalWaitingMinutes)}
            </p>
          </div>
          <div className="bg-muted/40 rounded-md p-2">
            <p className="text-xs text-muted-foreground">Matches</p>
            <p className="text-sm font-medium text-foreground">
              {Number(player.matchesPlayedToday)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PlayerTableRow({
  player,
}: {
  player: PlayerView;
}) {
  const isMultiCategory = player.categories.length > 1;
  const statusColor = getPlayerStatusColor(player.status);
  const statusLabel = getPlayerStatusLabel(player.status);

  return (
    <TableRow className="hover:bg-muted/30 transition-smooth">
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {player.name}
          {player.seedNumber !== undefined && (
            <span className="text-xs text-muted-foreground">
              (Seed {Number(player.seedNumber)})
            </span>
          )}
          {isMultiCategory && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 font-bold"
            >
              MULTI
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {player.categories.map((cat) => (
            <Badge
              key={cat}
              variant="outline"
              className={`text-[10px] px-1.5 py-0 ${
                isMultiCategory
                  ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={`text-xs font-semibold ${statusColor} ${
            player.status === PlayerStatus.playing ? "animate-pulse" : ""
          }`}
        >
          {statusLabel}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {player.lastMatchEndTime ? formatTime(player.lastMatchEndTime) : "—"}
      </TableCell>
      <TableCell className="text-sm font-medium">
        {formatDuration(player.totalWaitingMinutes)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {Number(player.matchesPlayedToday)}
      </TableCell>
    </TableRow>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PlayersPage() {
  const { data: players, isLoading: playersLoading } = usePlayers();
  const { data: summary, isLoading: summaryLoading } = useWaitingTimeSummary();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categoryMap = useMemo(() => {
    if (!players) return new Map<string, string>();
    const map = new Map<string, string>();
    for (const p of players) {
      for (const c of p.categories) {
        if (!map.has(c)) {
          map.set(
            c,
            c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          );
        }
      }
    }
    return map;
  }, [players]);

  const allCategories = useMemo(
    () => Array.from(categoryMap.keys()).sort(),
    [categoryMap],
  );

  const filteredPlayers = useMemo(() => {
    if (!players) return [];
    return players.filter((player) => {
      const matchesSearch = player.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || player.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || player.categories.includes(categoryFilter);
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [players, searchQuery, statusFilter, categoryFilter]);

  const isLoading = playersLoading || summaryLoading;

  return (
    <div className="space-y-6 pb-8 p-4 md:p-6" data-ocid="players.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Players
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage players and track waiting times
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{players?.length ?? 0} players</span>
        </div>
      </div>

      {/* Section 1: Waiting Time Summary */}
      <section>
        <h2 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Live Waiting Time Tracker
        </h2>
        <WaitingTimePanel summary={summary} isLoading={summaryLoading} />
      </section>

      {/* Section 2: Player Database */}
      <section>
        <h2 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          All Players
        </h2>

        {/* Filters */}
        <Card className="bg-card border-border mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                  data-ocid="players.search_input"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-full sm:w-[160px] bg-background"
                  data-ocid="players.status_filter"
                >
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={PlayerStatus.waiting}>Waiting</SelectItem>
                  <SelectItem value={PlayerStatus.playing}>Playing</SelectItem>
                  <SelectItem value={PlayerStatus.resting}>Resting</SelectItem>
                  <SelectItem value={PlayerStatus.completed}>
                    Completed
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger
                  className="w-full sm:w-[180px] bg-background"
                  data-ocid="players.category_filter"
                >
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : filteredPlayers.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                No players found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile: Cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredPlayers.map((player, idx) => (
                <div key={player.id} data-ocid={`players.item.${idx + 1}`}>
                  <PlayerCard player={player} />
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block">
              <Card className="bg-card border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs font-semibold">
                          Player
                        </TableHead>
                        <TableHead className="text-xs font-semibold">
                          Categories
                        </TableHead>
                        <TableHead className="text-xs font-semibold">
                          Status
                        </TableHead>
                        <TableHead className="text-xs font-semibold">
                          Last Match
                        </TableHead>
                        <TableHead className="text-xs font-semibold">
                          Waiting
                        </TableHead>
                        <TableHead className="text-xs font-semibold">
                          Matches
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlayers.map((player, idx) => (
                        <div
                          key={player.id}
                          data-ocid={`players.item.${idx + 1}`}
                          className="contents"
                        >
                          <PlayerTableRow player={player} />
                        </div>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
