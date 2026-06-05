import { j as jsxRuntimeExports, C as Clock, T as TriangleAlert, L as Link, R as React, p as cn, d as getPriorityColor, B as Button, G as Grid3x3, b as formatDuration, U as Users, q as getStatusLabel, g as getStatusColor, a as formatTime, k as Trophy, o as getConflictBadgeInfo } from "./index-C3hV2zjr.js";
import { u as useCourtFlowData, g as useMatchQueue, c as useAssignMatchToCourt, d as useCompleteMatch, e as useFreeCourtManually, h as useDelayMatch } from "./useBackend-BjhPvZ15.js";
import { u as ue } from "./index-CI_7dGKN.js";
import { P as Play } from "./play-DgQ6q2Ij.js";
import { C as CircleCheck } from "./circle-check-wWwtH2ww.js";
import { C as ChevronRight, P as Pause } from "./pause-DSxINpcq.js";
import { R as RotateCcw } from "./rotate-ccw-BeDllXoP.js";
function elapsedMinutes(startIso) {
  if (!startIso) return 0;
  const start = new Date(startIso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / 6e4));
}
function progressPct(match) {
  if (!match.startTime) return 0;
  const elapsed = elapsedMinutes(match.startTime);
  const total = Number(match.estimatedDurationMinutes);
  if (total <= 0) return 0;
  return Math.min(100, Math.round(elapsed / total * 100));
}
function CourtHeader({
  court,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            court.isAvailable ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold text-foreground", children: court.courtName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "inline-block w-2 h-2 rounded-full",
                court.isAvailable ? "bg-emerald-500" : "bg-amber-500",
                court.isAvailable && "animate-pulse"
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: court.isAvailable ? "Available" : "In Progress" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded", children: [
      "#",
      String(index + 1)
    ] })
  ] });
}
function MatchInProgressCard({
  match,
  court,
  onComplete,
  onFreeCourt,
  onDelay
}) {
  const [selectingWinner, setSelectingWinner] = React.useState(false);
  const pct = progressPct(match);
  const elapsed = elapsedMinutes(match.startTime);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded", children: [
            "M",
            String(match.id)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: match.categoryName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: match.roundName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5 text-muted-foreground flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
            match.player1Name,
            match.player1Id && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal ml-0.5", children: [
              "(",
              String(match.player1Id).slice(0, 4),
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "vs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
            match.player2Name,
            match.player2Id && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal ml-0.5", children: [
              "(",
              String(match.player2Id).slice(0, 4),
              ")"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0",
            getStatusColor("onCourt")
          ),
          children: getStatusLabel("onCourt")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-md p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mb-0.5", children: "Started" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: formatTime(match.startTime) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-md p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mb-0.5", children: "Est. End" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: formatTime(match.endTime) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-md p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mb-0.5", children: "Duration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: formatDuration(match.estimatedDurationMinutes) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mb-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Elapsed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
          elapsed,
          "m / ",
          formatDuration(match.estimatedDurationMinutes)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full bg-emerald-500 rounded-full transition-all duration-1000",
          style: { width: `${pct}%` }
        }
      ) })
    ] }),
    !selectingWinner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "bg-emerald-600 hover:bg-emerald-700 text-white",
          onClick: () => setSelectingWinner(true),
          "data-ocid": "court.mark_completed_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 mr-1.5" }),
            "Mark Completed"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => onDelay(match.id),
          "data-ocid": "court.delay_match_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-3.5 h-3.5 mr-1.5" }),
            "Delay Match"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "text-muted-foreground hover:text-foreground",
          onClick: () => onFreeCourt(court.courtId),
          "data-ocid": "court.free_court_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5 mr-1.5" }),
            "Free Court"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-lg p-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Select winner:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "flex-1 bg-primary hover:bg-primary/90",
            onClick: () => {
              if (match.player1Id) {
                onComplete(match.id, match.player1Id);
                setSelectingWinner(false);
              }
            },
            "data-ocid": "court.winner_p1_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3.5 h-3.5 mr-1.5" }),
              match.player1Name,
              " Won"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "flex-1 bg-primary hover:bg-primary/90",
            onClick: () => {
              if (match.player2Id) {
                onComplete(match.id, match.player2Id);
                setSelectingWinner(false);
              }
            },
            "data-ocid": "court.winner_p2_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3.5 h-3.5 mr-1.5" }),
              match.player2Name,
              " Won"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "w-full text-muted-foreground",
          onClick: () => setSelectingWinner(false),
          "data-ocid": "court.cancel_winner_button",
          children: "Cancel"
        }
      )
    ] })
  ] });
}
function RecommendedMatchRow({
  entry,
  courtId,
  onAssign
}) {
  const m = entry.match;
  const score = Number(m.priorityScore);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-3 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                getPriorityColor(score)
              ),
              children: score
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: m.categoryName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: m.roundName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium text-foreground truncate", children: [
          m.player1Name,
          " vs ",
          m.player2Name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
            formatDuration(m.estimatedDurationMinutes)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Rank #",
            String(entry.rank)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white",
          onClick: () => onAssign(m.id, courtId),
          "data-ocid": "court.assign_recommended_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5 mr-1" }),
            "Assign"
          ]
        }
      )
    ] }),
    m.conflicts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: m.conflicts.map((c) => {
      const info = getConflictBadgeInfo(c);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: cn(
            "text-[10px] font-medium px-1.5 py-0.5 rounded",
            info.className
          ),
          children: info.label
        },
        c
      );
    }) }),
    m.scoreReason && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: m.scoreReason })
  ] });
}
function AvailableCourtCard({
  court,
  index,
  queue,
  onAssign
}) {
  const top3 = queue.slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CourtHeader, { court, index }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
      "Available"
    ] }) }),
    top3.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Recommended Matches" }),
      top3.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        RecommendedMatchRow,
        {
          entry,
          courtId: court.courtId,
          onAssign
        },
        String(entry.match.id)
      ))
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No ready matches in queue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/matches",
          className: "inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2",
          "data-ocid": "court.all_matches_link",
          children: [
            "View all matches ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
          ]
        }
      )
    ] })
  ] });
}
function OccupiedCourtCard({
  court,
  index,
  onComplete,
  onFreeCourt,
  onDelay
}) {
  if (!court.currentMatch) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CourtHeader, { court, index }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MatchInProgressCard,
      {
        match: court.currentMatch,
        court,
        onComplete,
        onFreeCourt,
        onDelay
      }
    )
  ] });
}
function ManualAssignmentSection({
  courts,
  queue,
  onAssign
}) {
  const freeCourts = courts.filter((c) => c.isAvailable);
  const readyMatches = queue.map((q) => q.match);
  const [selectedCourt, setSelectedCourt] = React.useState("");
  const [selectedMatch, setSelectedMatch] = React.useState("");
  const [confirming, setConfirming] = React.useState(false);
  const selectedMatchObj = readyMatches.find(
    (m) => String(m.id) === selectedMatch
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-base font-bold text-foreground mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4 text-muted-foreground" }),
      "Manual Assignment"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "manual-court-select",
            className: "text-xs font-medium text-muted-foreground mb-1.5 block",
            children: "Select Court"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "manual-court-select",
            className: "w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            value: selectedCourt,
            onChange: (e) => {
              setSelectedCourt(e.target.value);
              setConfirming(false);
            },
            "data-ocid": "court.manual_court_select",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Choose a court…" }),
              freeCourts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(c.courtId), children: c.courtName }, String(c.courtId)))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "manual-match-select",
            className: "text-xs font-medium text-muted-foreground mb-1.5 block",
            children: "Select Match"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "manual-match-select",
            className: "w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            value: selectedMatch,
            onChange: (e) => {
              setSelectedMatch(e.target.value);
              setConfirming(false);
            },
            "data-ocid": "court.manual_match_select",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Choose a match…" }),
              readyMatches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: String(m.id), children: [
                "M",
                String(m.id),
                " — ",
                m.player1Name,
                " vs ",
                m.player2Name,
                " (",
                m.categoryName,
                ")"
              ] }, String(m.id)))
            ]
          }
        )
      ] })
    ] }),
    selectedMatchObj && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-lg p-3 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded",
              getPriorityColor(Number(selectedMatchObj.priorityScore))
            ),
            children: String(selectedMatchObj.priorityScore)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-foreground", children: [
          selectedMatchObj.categoryName,
          " · ",
          selectedMatchObj.roundName
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: selectedMatchObj.scoreReason }),
      selectedMatchObj.conflicts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1.5", children: selectedMatchObj.conflicts.map((c) => {
        const info = getConflictBadgeInfo(c);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded",
              info.className
            ),
            children: info.label
          },
          c
        );
      }) })
    ] }),
    !confirming ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        disabled: !selectedCourt || !selectedMatch,
        onClick: () => setConfirming(true),
        "data-ocid": "court.manual_assign_button",
        children: "Assign Now"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "default",
          onClick: () => {
            onAssign(BigInt(selectedMatch), BigInt(selectedCourt));
            setConfirming(false);
            setSelectedCourt("");
            setSelectedMatch("");
          },
          "data-ocid": "court.manual_confirm_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 mr-1.5" }),
            "Confirm Assignment"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: () => setConfirming(false),
          "data-ocid": "court.manual_cancel_button",
          children: "Cancel"
        }
      )
    ] })
  ] });
}
function CourtsPage() {
  const { data, isLoading } = useCourtFlowData();
  const { data: queueData, isLoading: queueLoading } = useMatchQueue();
  const assignMutation = useAssignMatchToCourt();
  const completeMutation = useCompleteMatch();
  const freeCourtMutation = useFreeCourtManually();
  const delayMutation = useDelayMatch();
  const courts = (data == null ? void 0 : data.courts) ?? [];
  const queue = queueData ?? [];
  const activeCourts = courts.filter((c) => !c.isAvailable).length;
  const availableCourts = courts.filter((c) => c.isAvailable).length;
  const matchesOnCourt = courts.map((c) => c.currentMatch).filter(Boolean);
  const nextToComplete = matchesOnCourt.reduce((best, m) => {
    if (!best) return m;
    return progressPct(m) > progressPct(best) ? m : best;
  }, null);
  const handleAssign = (matchId, courtId) => {
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
  const handleComplete = (matchId, winnerId) => {
    completeMutation.mutate(
      { matchId, winnerId },
      {
        onSuccess: (res) => {
          if ("__kind__" in res && res.__kind__ === "ok") {
            ue.success("Match completed");
          } else if ("__kind__" in res && res.__kind__ === "err") {
            ue.error(res.err);
          }
        },
        onError: (err) => ue.error(err.message)
      }
    );
  };
  const handleFreeCourt = (courtId) => {
    freeCourtMutation.mutate(courtId, {
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
  const handleDelay = (matchId) => {
    delayMutation.mutate(matchId, {
      onSuccess: (res) => {
        if ("__kind__" in res && res.__kind__ === "ok") {
          ue.success("Match delayed");
        } else if ("__kind__" in res && res.__kind__ === "err") {
          ue.error(res.err);
        }
      },
      onError: (err) => ue.error(err.message)
    });
  };
  if (isLoading || queueLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-48 bg-muted rounded animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-64 bg-muted rounded-xl animate-pulse"
        },
        `skeleton-court-${i}`
      )) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Live Courts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          activeCourts,
          " of ",
          courts.length,
          " courts active"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-medium bg-muted text-muted-foreground px-3 py-1.5 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3" }),
          matchesOnCourt.length,
          " on court"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1.5 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
          availableCourts,
          " available"
        ] }),
        nextToComplete && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1.5 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
          "Next: M",
          String(nextToComplete.id)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: courts.map(
      (court, idx) => court.isAvailable ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        AvailableCourtCard,
        {
          court,
          index: idx,
          queue,
          onAssign: handleAssign
        },
        String(court.courtId)
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        OccupiedCourtCard,
        {
          court,
          index: idx,
          onComplete: handleComplete,
          onFreeCourt: handleFreeCourt,
          onDelay: handleDelay
        },
        String(court.courtId)
      )
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ManualAssignmentSection,
      {
        courts,
        queue,
        onAssign: handleAssign
      }
    ),
    queue.some((q) => q.match.conflicts.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-red-600 dark:text-red-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-red-800 dark:text-red-300", children: "Conflicts Detected" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-700 dark:text-red-400", children: [
        queue.filter((q) => q.match.conflicts.length > 0).length,
        " ready match(es) have scheduling conflicts. Review before assigning."
      ] })
    ] })
  ] });
}
export {
  CourtsPage as default
};
