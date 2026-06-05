import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, f as formatDate, a as formatTime, T as TriangleAlert, Z as Zap, B as Button, F as Flame, b as formatDuration, g as getStatusColor, d as getPriorityColor, L as Link, C as Clock, D as Dialog, e as DialogContent, h as DialogHeader, i as DialogTitle, k as Trophy, l as DialogDescription, U as Users, m as DialogFooter, n as generateWhatsAppMessage, o as getConflictBadgeInfo } from "./index-C3hV2zjr.js";
import { B as Badge } from "./badge-tipg9WSN.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CnFOoifO.js";
import { P as Progress } from "./progress-DPuonMgN.js";
import { u as ue } from "./index-CI_7dGKN.js";
import { u as useCourtFlowData, a as useTournamentStats, b as useWaitingTimeSummary, c as useAssignMatchToCourt, d as useCompleteMatch, e as useFreeCourtManually, f as useActivatePanicMode } from "./useBackend-BjhPvZ15.js";
import { C as ChevronRight, P as Pause } from "./pause-DSxINpcq.js";
import { P as Play } from "./play-DgQ6q2Ij.js";
import { C as CircleCheck } from "./circle-check-wWwtH2ww.js";
import "./index-DrI_w4bL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode);
function useNowString() {
  const [now, setNow] = reactExports.useState(() => (/* @__PURE__ */ new Date()).toISOString());
  reactExports.useEffect(() => {
    const id = setInterval(() => setNow((/* @__PURE__ */ new Date()).toISOString()), 3e4);
    return () => clearInterval(id);
  }, []);
  return now;
}
function elapsedMinutes(startIso, nowIso) {
  if (!startIso) return 0;
  const diff = new Date(nowIso).getTime() - new Date(startIso).getTime();
  return Math.max(0, Math.floor(diff / 6e4));
}
function progressPercent(startIso, durationMin, nowIso) {
  if (!startIso) return 0;
  const elapsed = elapsedMinutes(startIso, nowIso);
  const total = typeof durationMin === "bigint" ? Number(durationMin) : durationMin;
  if (total <= 0) return 0;
  return Math.min(100, Math.round(elapsed / total * 100));
}
function WhatsAppExportButton({
  config,
  courts,
  queue
}) {
  const handleCopy = () => {
    const msg = generateWhatsAppMessage(
      config,
      courts.map((c) => ({
        courtName: c.courtName,
        currentMatch: c.currentMatch ? {
          categoryName: c.currentMatch.categoryName,
          roundName: c.currentMatch.roundName,
          player1Name: c.currentMatch.player1Name,
          player2Name: c.currentMatch.player2Name
        } : null
      })),
      queue
    );
    navigator.clipboard.writeText(msg).then(() => {
      ue.success("WhatsApp message copied to clipboard");
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      variant: "outline",
      size: "sm",
      onClick: handleCopy,
      "data-ocid": "dashboard.whatsapp_export_button",
      className: "gap-2",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "WhatsApp" })
      ]
    }
  );
}
function WinnerDialog({
  match,
  open,
  onOpenChange,
  onConfirm,
  isPending
}) {
  const [selected, setSelected] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5 text-amber-500" }),
        "Select Winner"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Who won the match? This will free the court and advance the draw." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 py-2", children: match && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setSelected(match.player1Id ?? null),
          className: `flex items-center gap-3 p-3 rounded-lg border text-left transition-smooth ${selected === match.player1Id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`,
          "data-ocid": "dashboard.winner_dialog.player1_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: match.player1Name }),
            selected === match.player1Id && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary ml-auto" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setSelected(match.player2Id ?? null),
          className: `flex items-center gap-3 p-3 rounded-lg border text-left transition-smooth ${selected === match.player2Id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`,
          "data-ocid": "dashboard.winner_dialog.player2_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: match.player2Name }),
            selected === match.player2Id && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary ml-auto" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: () => onOpenChange(false),
          "data-ocid": "dashboard.winner_dialog.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          disabled: !selected || isPending,
          onClick: () => selected && onConfirm(selected),
          "data-ocid": "dashboard.winner_dialog.confirm_button",
          children: isPending ? "Saving…" : "Confirm Winner"
        }
      )
    ] })
  ] }) });
}
function PanicModeDialog({
  open,
  onOpenChange,
  onActivate,
  isPending,
  suggestions
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-red-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-5 h-5" }),
        "Panic Mode"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Emergency actions to get the tournament back on schedule." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/40 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-red-700 dark:text-red-400 mb-1", children: "Emergency Suggestions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: suggestions.length > 0 ? suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "flex items-start gap-2 text-sm text-red-700 dark:text-red-400",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 mt-0.5 flex-shrink-0" }),
            s
          ]
        },
        s
      )) : /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-sm text-red-700 dark:text-red-400", children: "Shorten remaining matches, prioritise finals, pause optional formats, move doubles to end, use sudden-death deuce, reduce warm-up time." }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: () => onOpenChange(false),
          "data-ocid": "dashboard.panic_dialog.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "destructive",
          disabled: isPending,
          onClick: () => {
            onActivate();
            onOpenChange(false);
          },
          "data-ocid": "dashboard.panic_dialog.activate_button",
          children: isPending ? "Activating…" : "Activate Panic Mode"
        }
      )
    ] })
  ] }) });
}
function OccupiedCourtCard({
  court,
  nowIso,
  onMarkComplete,
  onFreeCourt,
  isFreeing
}) {
  const match = court.currentMatch;
  const pct = progressPercent(
    match.startTime,
    match.estimatedDurationMinutes,
    nowIso
  );
  const elapsed = elapsedMinutes(match.startTime, nowIso);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "border-border shadow-subtle overflow-hidden",
      "data-ocid": `dashboard.court_card.${court.courtId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: court.courtName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: getStatusColor("onCourt"), children: "On Court" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs font-medium", children: match.categoryName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: match.roundName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: match.player1Name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "vs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-right", children: match.player2Name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3" }),
              formatTime(match.startTime)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
              "Est. ",
              formatTime(match.endTime)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Elapsed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatDuration(elapsed) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "h-1.5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "flex-1 gap-1",
                onClick: () => onMarkComplete(match),
                "data-ocid": `dashboard.court_card.${court.courtId}.mark_complete_button`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                  "Mark Completed"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "flex-1 gap-1",
                disabled: isFreeing,
                onClick: () => onFreeCourt(court.courtId),
                "data-ocid": `dashboard.court_card.${court.courtId}.free_court_button`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-3.5 h-3.5" }),
                  "Free Court"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function AvailableCourtCard({
  court,
  onAssign,
  isAssigning
}) {
  const rec = court.recommendedNext;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "border-border shadow-subtle overflow-hidden border-dashed",
      "data-ocid": `dashboard.court_card.${court.courtId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: court.courtName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2.5 w-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: getStatusColor("ready"), children: "Available" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          rec ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Recommended" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: `text-xs font-bold ${getPriorityColor(rec.match.priorityScore)}`,
                  children: Number(rec.match.priorityScore)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs font-medium", children: rec.match.categoryName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: rec.match.roundName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: rec.match.player1Name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "vs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-right", children: rec.match.player2Name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: rec.match.scoreReason }),
            rec.match.conflicts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: rec.match.conflicts.map((c) => {
              const info = getConflictBadgeInfo(c);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: `text-[10px] ${info.className}`,
                  children: info.label
                },
                c
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "flex-1 gap-1",
                disabled: isAssigning,
                onClick: () => onAssign(rec.match.id, court.courtId),
                "data-ocid": `dashboard.court_card.${court.courtId}.assign_recommended_button`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5" }),
                  "Assign Recommended"
                ]
              }
            ) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No recommended match available" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/matches",
              className: "flex items-center justify-center gap-1 text-xs text-primary hover:underline",
              "data-ocid": `dashboard.court_card.${court.courtId}.choose_different_link`,
              children: [
                "Choose Different Match",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function TimePanel({ stats }) {
  if (!stats) return null;
  const completed = Number(stats.matchesCompleted);
  const pending = Number(stats.matchesPending);
  const total = completed + pending;
  const progress = total > 0 ? Math.round(completed / total * 100) : 0;
  const util = Number(stats.courtUtilisationPct);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 md:p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground font-medium", children: "Current Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-semibold", children: formatTime(stats.currentTime) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground font-medium", children: "End Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-semibold", children: formatTime(stats.tournamentEndTime) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground font-medium", children: "Time Remaining" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-semibold", children: formatDuration(stats.courtTimeRemainingMinutes) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground font-medium", children: "Est. Finish" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-semibold", children: formatTime(stats.estimatedFinishTime) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground font-medium", children: "Matches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 font-semibold", children: completed }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            " ",
            "/ ",
            total,
            " completed"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-1.5 mt-1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground font-medium", children: "Pending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
          pending,
          " matches"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground font-medium", children: "Court Utilisation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
          util,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: util, className: "h-1.5 mt-1" })
      ] })
    ] })
  ] }) });
}
function WaitingPanel({
  summary
}) {
  if (!summary) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-muted-foreground" }),
      "Waiting Time"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-display font-semibold", children: [
            Number(summary.averageWaitMinutes),
            "m"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-0.5", children: "Average" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-semibold", children: summary.longestWaiting.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-0.5", children: "Waiting" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-semibold", children: summary.recentlyPlayed.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-0.5", children: "Resting" })
        ] })
      ] }),
      summary.longestWaiting.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2", children: "Longest Waiting" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: summary.longestWaiting.slice(0, 3).map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between text-sm",
            "data-ocid": `dashboard.waiting.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: entry.playerName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[10px]", children: [
                Number(entry.waitingMinutes),
                "m"
              ] })
            ]
          },
          entry.playerId
        )) })
      ] }),
      summary.recentlyPlayed.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2", children: "Need Rest" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: summary.recentlyPlayed.slice(0, 3).map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between text-sm",
            "data-ocid": `dashboard.resting.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: entry.playerName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  children: [
                    Number(entry.restMinutesRemaining),
                    "m left"
                  ]
                }
              )
            ]
          },
          `${entry.playerId}-rest`
        )) })
      ] }),
      summary.warnings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/40 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] uppercase tracking-wide text-amber-700 dark:text-amber-400 font-medium mb-1.5 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5" }),
          "Warnings"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: summary.warnings.slice(0, 3).map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "text-xs text-amber-700 dark:text-amber-400",
            "data-ocid": `dashboard.warning.item.${i + 1}`,
            children: [
              w.playerName,
              ": ",
              w.message
            ]
          },
          `${w.playerId}-${w.warningType}`
        )) })
      ] })
    ] })
  ] });
}
function DashboardPage() {
  const { data: courtFlowData, isLoading: isLoadingData } = useCourtFlowData();
  const { data: stats } = useTournamentStats();
  const { data: waitingSummary } = useWaitingTimeSummary();
  const assignMutation = useAssignMatchToCourt();
  const completeMutation = useCompleteMatch();
  const freeMutation = useFreeCourtManually();
  const panicMutation = useActivatePanicMode();
  const [winnerDialogOpen, setWinnerDialogOpen] = reactExports.useState(false);
  const [panicDialogOpen, setPanicDialogOpen] = reactExports.useState(false);
  const [selectedMatch, setSelectedMatch] = reactExports.useState(null);
  const nowIso = useNowString();
  const handleAssignRecommended = (matchId, courtId) => {
    assignMutation.mutate(
      { matchId, courtId },
      {
        onSuccess: (res) => {
          if ("__kind__" in res && res.__kind__ === "ok") {
            ue.success("Match assigned to court");
          } else if ("__kind__" in res && res.__kind__ === "err") {
            ue.error(res.err);
          }
        },
        onError: (err) => ue.error(err.message)
      }
    );
  };
  const handleMarkComplete = (match) => {
    setSelectedMatch(match);
    setWinnerDialogOpen(true);
  };
  const handleConfirmWinner = (winnerId) => {
    if (!selectedMatch) return;
    completeMutation.mutate(
      { matchId: selectedMatch.id, winnerId },
      {
        onSuccess: (res) => {
          if ("__kind__" in res && res.__kind__ === "ok") {
            ue.success("Match completed");
            setWinnerDialogOpen(false);
            setSelectedMatch(null);
          } else if ("__kind__" in res && res.__kind__ === "err") {
            ue.error(res.err);
          }
        },
        onError: (err) => ue.error(err.message)
      }
    );
  };
  const handleFreeCourt = (courtId) => {
    freeMutation.mutate(courtId, {
      onSuccess: (res) => {
        if ("__kind__" in res && res.__kind__ === "ok") {
          ue.success("Court freed");
        } else if ("__kind__" in res && res.__kind__ === "err") {
          ue.error(res.err);
        }
      },
      onError: (err) => ue.error(err.message)
    });
  };
  const handlePanicMode = () => {
    panicMutation.mutate(void 0, {
      onSuccess: () => {
        ue.success("Panic mode activated");
      },
      onError: (err) => ue.error(err.message)
    });
  };
  const config = courtFlowData == null ? void 0 : courtFlowData.config;
  const courts = (courtFlowData == null ? void 0 : courtFlowData.courts) ?? [];
  const queue = (courtFlowData == null ? void 0 : courtFlowData.matchQueue) ?? [];
  const isRunningLate = (stats == null ? void 0 : stats.isRunningLate) ?? false;
  if (isLoadingData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-64 bg-muted rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 bg-muted rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 bg-muted rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 bg-muted rounded-lg" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-display font-bold text-foreground", children: (config == null ? void 0 : config.name) ?? "AJ Tennis Summer Open" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: (config == null ? void 0 : config.venue) ?? "Matunga Gymkhana" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(config == null ? void 0 : config.date) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            formatTime(config == null ? void 0 : config.startTime),
            " — ",
            formatTime(config == null ? void 0 : config.endTime)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "secondary",
            className: isRunningLate ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            children: isRunningLate ? "Running Late" : "On Track"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          WhatsAppExportButton,
          {
            config: config ? { name: config.name, venue: config.venue } : void 0,
            courts,
            queue
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TimePanel, { stats }),
    isRunningLate && (stats == null ? void 0 : stats.suggestions) && stats.suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-amber-800 dark:text-amber-400", children: "Tournament is running late" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1.5 space-y-1", children: stats.suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 mt-0.5 flex-shrink-0" }),
              s
            ]
          },
          s
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "destructive",
          className: "gap-1.5 flex-shrink-0",
          onClick: () => setPanicDialogOpen(true),
          "data-ocid": "dashboard.panic_mode_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5" }),
            "Panic Mode"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-display font-semibold uppercase tracking-wide text-muted-foreground mb-3", children: "Live Courts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: courts.map(
        (court) => court.isAvailable || !court.currentMatch ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvailableCourtCard,
          {
            court,
            onAssign: handleAssignRecommended,
            isAssigning: assignMutation.isPending
          },
          Number(court.courtId)
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          OccupiedCourtCard,
          {
            court,
            nowIso,
            onMarkComplete: handleMarkComplete,
            onFreeCourt: handleFreeCourt,
            isFreeing: freeMutation.isPending
          },
          Number(court.courtId)
        )
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WaitingPanel, { summary: waitingSummary }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WinnerDialog,
      {
        match: selectedMatch,
        open: winnerDialogOpen,
        onOpenChange: setWinnerDialogOpen,
        onConfirm: handleConfirmWinner,
        isPending: completeMutation.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanicModeDialog,
      {
        open: panicDialogOpen,
        onOpenChange: setPanicDialogOpen,
        onActivate: handlePanicMode,
        isPending: panicMutation.isPending,
        suggestions: (stats == null ? void 0 : stats.suggestions) ?? []
      }
    )
  ] });
}
export {
  DashboardPage as default
};
