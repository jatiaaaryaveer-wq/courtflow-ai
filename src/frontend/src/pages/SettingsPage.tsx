import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useActivatePanicMode,
  useCategories,
  useDeactivatePanicMode,
  useTournamentConfig,
  useUpdateTournamentConfig,
} from "@/hooks/useBackend";
import { formatDuration } from "@/lib/utils";
import {
  AlertTriangle,
  Clock,
  Info,
  MapPin,
  RotateCcw,
  Save,
  Settings,
  Trophy,
  Zap,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

function timeFromIso(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function isoFromDateTime(dateStr: string, timeStr: string): string {
  if (!dateStr || !timeStr) return "";
  return new Date(`${dateStr}T${timeStr}`).toISOString();
}

function dateFromIso(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function SettingsPage() {
  const { data: config, isLoading: configLoading } = useTournamentConfig();
  const { data: categories, isLoading: catsLoading } = useCategories();
  const updateConfig = useUpdateTournamentConfig();
  const activatePanic = useActivatePanicMode();
  const deactivatePanic = useDeactivatePanicMode();

  const [name, setName] = React.useState("");
  const [venue, setVenue] = React.useState("");
  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [courtNames, setCourtNames] = React.useState<string[]>([]);
  const [matchFormat, setMatchFormat] = React.useState("");
  const [avgDuration, setAvgDuration] = React.useState<number>(30);
  const [minRest, setMinRest] = React.useState<number>(15);
  const [showResetModal, setShowResetModal] = React.useState(false);

  React.useEffect(() => {
    if (config) {
      setName(config.name);
      setVenue(config.venue);
      setDate(dateFromIso(config.date));
      setStartTime(timeFromIso(config.startTime));
      setEndTime(timeFromIso(config.endTime));
      setCourtNames(config.courts.length ? [...config.courts] : ["Court 1"]);
      setMatchFormat(config.matchFormat);
      setAvgDuration(Number(config.avgMatchDurationMinutes));
      setMinRest(Number(config.minRestMinutes));
    }
  }, [config]);

  async function handleSave() {
    if (!config) return;
    const payload = {
      name: name.trim() || config.name,
      venue: venue.trim() || config.venue,
      date: isoFromDateTime(date, startTime) || config.date,
      startTime: isoFromDateTime(date, startTime) || config.startTime,
      endTime: isoFromDateTime(date, endTime) || config.endTime,
      courtNames: courtNames.filter((c) => c.trim() !== ""),
      matchFormat: matchFormat.trim() || config.matchFormat,
      avgMatchDurationMinutes: BigInt(avgDuration),
      minRestMinutes: BigInt(minRest),
    };
    try {
      await updateConfig.mutateAsync(payload);
      toast.success("Tournament settings saved successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save settings");
    }
  }

  async function handlePanicToggle() {
    try {
      if (config?.panicModeActive) {
        await deactivatePanic.mutateAsync();
        toast.success("Panic mode deactivated");
      } else {
        await activatePanic.mutateAsync();
        toast.success("Panic mode activated");
      }
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to toggle panic mode",
      );
    }
  }

  const updateCourtName = (index: number, value: string) => {
    setCourtNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addCourt = () => {
    if (courtNames.length >= 8) return;
    setCourtNames((prev) => [...prev, `Court ${prev.length + 1}`]);
  };

  const removeCourt = (index: number) => {
    if (courtNames.length <= 1) return;
    setCourtNames((prev) => prev.filter((_, i) => i !== index));
  };

  const isLoading = configLoading || catsLoading;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-2/3" />
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6"
      data-ocid="settings.page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
            Tournament Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure your tournament details, courts, and match rules
          </p>
        </div>
      </div>

      {/* Panic Mode */}
      <Card
        className={`shadow-subtle ${config?.panicModeActive ? "border-destructive" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-sm flex items-center justify-center ${config?.panicModeActive ? "bg-destructive/10" : "bg-muted"}`}
              >
                <AlertTriangle
                  className={`w-5 h-5 ${config?.panicModeActive ? "text-destructive" : "text-muted-foreground"}`}
                />
              </div>
              <div>
                <p className="text-sm font-medium">Panic Mode</p>
                <p className="text-xs text-muted-foreground">
                  {config?.panicModeActive
                    ? "Emergency scheduling active"
                    : "Activate when tournament is running late"}
                </p>
              </div>
            </div>
            <Button
              variant={config?.panicModeActive ? "destructive" : "outline"}
              size="sm"
              onClick={handlePanicToggle}
              disabled={activatePanic.isPending || deactivatePanic.isPending}
              data-ocid="settings.panic_mode_button"
            >
              <Zap className="w-3.5 h-3.5 mr-1" />
              {config?.panicModeActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
          {config?.panicModeActive && config.panicSuggestions.length > 0 && (
            <div className="mt-3 p-3 bg-destructive/5 rounded-sm">
              <p className="text-xs font-medium text-destructive mb-1">
                Suggestions:
              </p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {config.panicSuggestions.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tournament Setup Form */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Tournament Setup
          </CardTitle>
          <CardDescription>
            Edit the core tournament configuration. Changes apply immediately
            after saving.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="tournament-name">Tournament Name</Label>
              <Input
                id="tournament-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AJ Tennis Summer Open"
                data-ocid="settings.tournament_name_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Matunga Gymkhana"
                data-ocid="settings.venue_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="settings.date_input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label
                  htmlFor="start-time"
                  className="flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  data-ocid="settings.start_time_input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time" className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  End Time
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  data-ocid="settings.end_time_input"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Court Names
            </h3>
            <div className="space-y-2">
              {courtNames.map((court, idx) => (
                <div key={court} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-6">
                    {idx + 1}.
                  </span>
                  <Input
                    value={court}
                    onChange={(e) => updateCourtName(idx, e.target.value)}
                    placeholder={`Court ${idx + 1}`}
                    className="flex-1"
                    data-ocid={`settings.court_name_input.${idx + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCourt(idx)}
                    disabled={courtNames.length <= 1}
                    className="text-muted-foreground hover:text-destructive"
                    data-ocid={`settings.remove_court_button.${idx + 1}`}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCourt}
                disabled={courtNames.length >= 8}
                className="mt-1"
                data-ocid="settings.add_court_button"
              >
                + Add Court
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="match-format">Match Format</Label>
              <Input
                id="match-format"
                value={matchFormat}
                onChange={(e) => setMatchFormat(e.target.value)}
                placeholder="e.g. First to 4 games, tiebreak at 3-3"
                data-ocid="settings.match_format_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avg-duration">Avg Match Duration (min)</Label>
              <Input
                id="avg-duration"
                type="number"
                min={10}
                max={180}
                value={avgDuration}
                onChange={(e) => setAvgDuration(Number(e.target.value))}
                data-ocid="settings.avg_duration_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-rest">Minimum Rest (min)</Label>
              <Input
                id="min-rest"
                type="number"
                min={0}
                max={60}
                value={minRest}
                onChange={(e) => setMinRest(Number(e.target.value))}
                data-ocid="settings.min_rest_input"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={handleSave}
              disabled={updateConfig.isPending}
              className="gap-2"
              data-ocid="settings.save_button"
            >
              <Save className="w-4 h-4" />
              {updateConfig.isPending ? "Saving…" : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Configuration */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Category Configuration
          </CardTitle>
          <CardDescription>
            Overview of tournament categories and their average match durations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 px-3 font-medium">Category</th>
                  <th className="text-left py-2 px-3 font-medium">Players</th>
                  <th className="text-left py-2 px-3 font-medium">
                    Avg Duration
                  </th>
                  <th className="text-left py-2 px-3 font-medium">
                    Matches Done
                  </th>
                  <th className="text-left py-2 px-3 font-medium">Pending</th>
                  <th className="text-left py-2 px-3 font-medium">Round</th>
                </tr>
              </thead>
              <tbody>
                {(categories ?? []).map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {cat.name}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {String(cat.numPlayers)}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {formatDuration(cat.avgDurationMinutes)}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {String(cat.matchesCompleted)}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {String(cat.matchesPending)}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {String(cat.currentRound)}
                    </td>
                  </tr>
                ))}
                {(!categories || categories.length === 0) && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No categories configured
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="shadow-subtle bg-muted/30 border-muted">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                CourtFlow AI
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered tennis tournament scheduling. Reduce waiting time,
                prevent player clashes, and finish on schedule.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                Version 1.0 · Built for tournament organisers who want fairness,
                speed, and organisation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="shadow-subtle border-destructive/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Destructive actions that cannot be undone. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={() => setShowResetModal(true)}
            data-ocid="settings.reset_sample_button"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Sample Data
          </Button>
        </CardContent>
      </Card>

      {/* Reset confirmation modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-sm border border-border shadow-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Reset Not Available
                </h3>
                <p className="text-sm text-muted-foreground">
                  Resetting sample data is disabled in live mode.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              In a production environment, this would clear all matches,
              players, and categories and restore the default sample dataset.
              During live tournament operation, this action is blocked to
              prevent accidental data loss.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowResetModal(false)}
                data-ocid="settings.reset_cancel_button"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
