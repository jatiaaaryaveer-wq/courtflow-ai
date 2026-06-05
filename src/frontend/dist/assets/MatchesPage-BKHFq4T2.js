import { j as jsxRuntimeExports, R as React, p as cn, b as formatDuration, B as Button, q as getStatusLabel, g as getStatusColor, C as Clock, k as Trophy, d as getPriorityColor, s as getPriorityBarColor, D as Dialog, e as DialogContent, h as DialogHeader, i as DialogTitle, l as DialogDescription, U as Users, m as DialogFooter, o as getConflictBadgeInfo } from "./index-C3hV2zjr.js";
import { B as Badge } from "./badge-tipg9WSN.js";
import { C as Check, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, e as ShieldAlert } from "./select-0yKiWVxm.js";
import { g as useMatchQueue, u as useCourtFlowData, c as useAssignMatchToCourt, i as useStartMatch, j as useAllMatches, d as useCompleteMatch, h as useDelayMatch, k as useResetMatch, l as useOverrideMatch } from "./useBackend-BjhPvZ15.js";
import { P as Play } from "./play-DgQ6q2Ij.js";
import { R as RotateCcw } from "./rotate-ccw-BeDllXoP.js";
import "./chevron-up-BBsHayid.js";
function getRankStyle(rank) {
  if (rank === 1)
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 ring-1 ring-amber-300";
  if (rank === 2)
    return "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400 ring-1 ring-slate-300";
  if (rank === 3)
    return "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 ring-1 ring-orange-300";
  return "bg-muted text-muted-foreground";
}
function getCategoryColor(name) {
  const map = {
    "U10 Boys": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "U12 Boys": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "U14 Boys": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    "Open Singles": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Junior Doubles": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    "One Point Slam": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  };
  return map[name] || "bg-muted text-muted-foreground";
}
function getMatchStatusDot(status) {
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
function PriorityBadge({ score }) {
  const s = typeof score === "bigint" ? Number(score) : score;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "px-2 py-0.5 rounded-sm text-xs font-bold tabular-nums",
          getPriorityColor(s)
        ),
        children: s
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "h-full rounded-full transition-all",
          getPriorityBarColor(s)
        ),
        style: { width: `${s}%` }
      }
    ) })
  ] });
}
function ConflictBadges({ conflicts }) {
  if (!conflicts.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: conflicts.map((c) => {
    const info = getConflictBadgeInfo(c);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        variant: "outline",
        className: cn("text-[10px] px-1.5 py-0", info.className),
        children: info.label
      },
      c
    );
  }) });
}
function CourtSelect({
  courts,
  value,
  onChange,
  placeholder = "Select court"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value, onValueChange: onChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectTrigger,
      {
        className: "w-[140px] h-8 text-xs",
        "data-ocid": "match.court_select",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: courts.map((name, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i), className: "text-xs", children: name }, name)) })
  ] });
}
function WinnerDialog({
  match,
  open,
  onClose,
  onConfirm,
  isPending
}) {
  const [selected, setSelected] = React.useState(null);
  React.useEffect(() => {
    if (open) setSelected(null);
  }, [open]);
  if (!match) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5 text-amber-500" }),
        "Select Winner"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        match.categoryName,
        " ",
        match.roundName,
        " — ",
        match.player1Name,
        " vs",
        " ",
        match.player2Name
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setSelected(match.player1Id ?? null),
          className: cn(
            "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-smooth",
            selected === match.player1Id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
          ),
          "data-ocid": "match.winner.player1_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: match.player1Name })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setSelected(match.player2Id ?? null),
          className: cn(
            "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-smooth",
            selected === match.player2Id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
          ),
          "data-ocid": "match.winner.player2_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: match.player2Name })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: onClose,
          "data-ocid": "match.winner.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          disabled: !selected || isPending,
          onClick: () => selected && onConfirm(selected),
          "data-ocid": "match.winner.confirm_button",
          children: isPending ? "Saving…" : "Confirm Winner"
        }
      )
    ] })
  ] }) });
}
function QueueSection() {
  const { data: queue = [], isLoading } = useMatchQueue();
  const { data: courtFlow } = useCourtFlowData();
  const assignMutation = useAssignMatchToCourt();
  const startMutation = useStartMatch();
  const [selectedCourt, setSelectedCourt] = React.useState({});
  const courts = (courtFlow == null ? void 0 : courtFlow.config.courts) ?? [];
  const handleAssign = (matchId, courtIdx) => {
    assignMutation.mutate({ matchId, courtId: BigInt(courtIdx) });
    setSelectedCourt((prev) => ({ ...prev, [String(matchId)]: "" }));
  };
  const handleStart = (matchId, courtIdx) => {
    startMutation.mutate({ matchId, courtId: BigInt(courtIdx) });
    setSelectedCourt((prev) => ({ ...prev, [String(matchId)]: "" }));
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Match Queue — Ranked by AI Priority" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-20 bg-muted/50 rounded-sm animate-pulse"
        },
        `skeleton-match-${i}`
      )) })
    ] });
  }
  const readyQueue = queue.filter(
    (e) => e.match.status === "ready" || e.match.status === "delayed"
  );
  if (!readyQueue.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Match Queue — Ranked by AI Priority" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center bg-card rounded-sm border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-10 h-10 text-emerald-500 mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "All caught up!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "No ready matches in the queue right now." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Match Queue — Ranked by AI Priority" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: readyQueue.map((entry) => {
      const m = entry.match;
      const rank = Number(entry.rank);
      const courtKey = String(m.id);
      const selected = selectedCourt[courtKey] ?? "";
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-card rounded-sm border border-border p-3 sm:p-4 transition-smooth hover:shadow-subtle",
          "data-ocid": `match.queue.item.${rank}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: cn(
                    "w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold",
                    getRankStyle(rank)
                  ),
                  children: [
                    "#",
                    rank
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityBadge, { score: m.priorityScore })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: cn(
                      "text-[10px] px-1.5 py-0",
                      getCategoryColor(m.categoryName)
                    ),
                    children: m.categoryName
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: m.roundName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tabular-nums", children: formatDuration(m.estimatedDurationMinutes) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground truncate", children: [
                m.player1Name,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "vs" }),
                " ",
                m.player2Name
              ] }),
              m.scoreReason && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic mt-0.5 line-clamp-2", children: m.scoreReason }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConflictBadges, { conflicts: m.conflicts.map(String) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CourtSelect,
                {
                  courts,
                  value: selected,
                  onChange: (v) => setSelectedCourt((prev) => ({ ...prev, [courtKey]: v })),
                  placeholder: "Court…"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "h-8 text-xs",
                  disabled: !selected || assignMutation.isPending,
                  onClick: () => handleAssign(m.id, selected),
                  "data-ocid": `match.queue.assign_button.${rank}`,
                  children: assignMutation.isPending ? "…" : "Assign"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "h-8 text-xs",
                  disabled: !selected || startMutation.isPending,
                  onClick: () => handleStart(m.id, selected),
                  "data-ocid": `match.queue.start_button.${rank}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 mr-1" }),
                    "Start"
                  ]
                }
              )
            ] })
          ] })
        },
        String(m.id)
      );
    }) })
  ] });
}
function AllMatchesSection() {
  const { data: allMatches, isLoading } = useAllMatches();
  const { data: courtFlow } = useCourtFlowData();
  const matches = allMatches ?? [];
  const courts = (courtFlow == null ? void 0 : courtFlow.config.courts) ?? [];
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [winnerMatch, setWinnerMatch] = React.useState(null);
  const completeMutation = useCompleteMatch();
  const delayMutation = useDelayMatch();
  const resetMutation = useResetMatch();
  const startMutation = useStartMatch();
  const overrideMutation = useOverrideMatch();
  const [courtSelections, setCourtSelections] = React.useState({});
  const categories = React.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
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
  const handleStart = (matchId) => {
    const idx = courtSelections[String(matchId)];
    if (idx === void 0) return;
    startMutation.mutate({ matchId, courtId: BigInt(idx) });
    setCourtSelections((prev) => ({ ...prev, [String(matchId)]: "" }));
  };
  const handleOverride = (matchId) => {
    const idx = courtSelections[String(matchId)];
    if (idx === void 0) return;
    overrideMutation.mutate({ matchId, courtId: BigInt(idx) });
    setCourtSelections((prev) => ({ ...prev, [String(matchId)]: "" }));
  };
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "notReady", label: "Not Ready" },
    { value: "ready", label: "Ready" },
    { value: "onCourt", label: "On Court" },
    { value: "completed", label: "Completed" },
    { value: "delayed", label: "Delayed" }
  ];
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "All Matches" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-14 bg-muted/50 rounded-sm animate-pulse"
        },
        `skeleton-match-${i}`
      )) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "All Matches" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "w-[130px] h-8 text-xs",
              "data-ocid": "match.filter.status_select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: statusOptions.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, className: "text-xs", children: o.label }, o.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "w-[150px] h-8 text-xs",
              "data-ocid": "match.filter.category_select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Category" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "text-xs", children: "All Categories" }),
            categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, className: "text-xs", children: c }, c))
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block bg-card rounded-sm border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Match" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Round" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Players" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Duration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Court" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        filtered.map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
            "data-ocid": `match.table.row.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-xs font-mono text-muted-foreground", children: [
                "M",
                String(m.id)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: cn(
                    "text-[10px] px-1.5 py-0",
                    getCategoryColor(m.categoryName)
                  ),
                  children: m.categoryName
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: m.roundName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: m.player1Name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground mx-1", children: "vs" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: m.player2Name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground tabular-nums", children: formatDuration(m.estimatedDurationMinutes) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "w-2 h-2 rounded-full",
                      getMatchStatusDot(m.status)
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: cn(
                      "text-[10px] px-1.5 py-0",
                      getStatusColor(m.status)
                    ),
                    children: getStatusLabel(m.status)
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: m.courtName ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
                m.status === "ready" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CourtSelect,
                    {
                      courts,
                      value: courtSelections[String(m.id)] ?? "",
                      onChange: (v) => setCourtSelections((prev) => ({
                        ...prev,
                        [String(m.id)]: v
                      })),
                      placeholder: "Court"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "h-7 text-[11px] px-2",
                      disabled: !courtSelections[String(m.id)] || startMutation.isPending,
                      onClick: () => handleStart(m.id),
                      "data-ocid": `match.table.start_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 mr-1" }),
                        "Start"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-7 text-[11px] px-2",
                      disabled: delayMutation.isPending,
                      onClick: () => delayMutation.mutate(m.id),
                      "data-ocid": `match.table.delay_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
                        "Delay"
                      ]
                    }
                  )
                ] }),
                m.status === "onCourt" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "h-7 text-[11px] px-2",
                      disabled: completeMutation.isPending,
                      onClick: () => setWinnerMatch(m),
                      "data-ocid": `match.table.complete_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 mr-1" }),
                        "Complete"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-7 text-[11px] px-2",
                      disabled: delayMutation.isPending,
                      onClick: () => delayMutation.mutate(m.id),
                      "data-ocid": `match.table.delay_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
                        "Delay"
                      ]
                    }
                  )
                ] }),
                m.status === "delayed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CourtSelect,
                    {
                      courts,
                      value: courtSelections[String(m.id)] ?? "",
                      onChange: (v) => setCourtSelections((prev) => ({
                        ...prev,
                        [String(m.id)]: v
                      })),
                      placeholder: "Court"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-7 text-[11px] px-2",
                      disabled: resetMutation.isPending,
                      onClick: () => resetMutation.mutate(m.id),
                      "data-ocid": `match.table.reset_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3 mr-1" }),
                        "Reset"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "h-7 text-[11px] px-2",
                      disabled: !courtSelections[String(m.id)] || overrideMutation.isPending,
                      onClick: () => handleOverride(m.id),
                      "data-ocid": `match.table.override_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-3 h-3 mr-1" }),
                        "Assign"
                      ]
                    }
                  )
                ] }),
                m.status === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3.5 h-3.5 text-amber-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.winnerName ?? "—" })
                ] }),
                m.status === "notReady" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "Waiting for prior round" })
              ] }) })
            ]
          },
          String(m.id)
        )),
        !filtered.length && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 8,
            className: "px-4 py-8 text-center text-sm text-muted-foreground",
            children: "No matches match the selected filters."
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden space-y-2", children: [
      filtered.map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card rounded-sm border border-border p-3 space-y-2",
          "data-ocid": `match.card.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: cn(
                      "text-[10px] px-1.5 py-0",
                      getCategoryColor(m.categoryName)
                    ),
                    children: m.categoryName
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: m.roundName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "w-2 h-2 rounded-full",
                      getMatchStatusDot(m.status)
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: cn(
                      "text-[10px] px-1.5 py-0",
                      getStatusColor(m.status)
                    ),
                    children: getStatusLabel(m.status)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
              m.player1Name,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "vs" }),
              " ",
              m.player2Name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatDuration(m.estimatedDurationMinutes) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.courtName ?? "No court" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap pt-1", children: [
              m.status === "ready" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CourtSelect,
                  {
                    courts,
                    value: courtSelections[String(m.id)] ?? "",
                    onChange: (v) => setCourtSelections((prev) => ({
                      ...prev,
                      [String(m.id)]: v
                    })),
                    placeholder: "Court"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "h-8 text-xs",
                    disabled: !courtSelections[String(m.id)] || startMutation.isPending,
                    onClick: () => handleStart(m.id),
                    "data-ocid": `match.card.start_button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 mr-1" }),
                      "Start"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-8 text-xs",
                    disabled: delayMutation.isPending,
                    onClick: () => delayMutation.mutate(m.id),
                    "data-ocid": `match.card.delay_button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
                      "Delay"
                    ]
                  }
                )
              ] }),
              m.status === "onCourt" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "h-8 text-xs",
                    disabled: completeMutation.isPending,
                    onClick: () => setWinnerMatch(m),
                    "data-ocid": `match.card.complete_button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 mr-1" }),
                      "Complete"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-8 text-xs",
                    disabled: delayMutation.isPending,
                    onClick: () => delayMutation.mutate(m.id),
                    "data-ocid": `match.card.delay_button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
                      "Delay"
                    ]
                  }
                )
              ] }),
              m.status === "delayed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CourtSelect,
                  {
                    courts,
                    value: courtSelections[String(m.id)] ?? "",
                    onChange: (v) => setCourtSelections((prev) => ({
                      ...prev,
                      [String(m.id)]: v
                    })),
                    placeholder: "Court"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-8 text-xs",
                    disabled: resetMutation.isPending,
                    onClick: () => resetMutation.mutate(m.id),
                    "data-ocid": `match.card.reset_button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3 mr-1" }),
                      "Reset"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "h-8 text-xs",
                    disabled: !courtSelections[String(m.id)] || overrideMutation.isPending,
                    onClick: () => handleOverride(m.id),
                    "data-ocid": `match.card.override_button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-3 h-3 mr-1" }),
                      "Assign"
                    ]
                  }
                )
              ] }),
              m.status === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3.5 h-3.5 text-amber-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Winner: ",
                  m.winnerName ?? "—"
                ] })
              ] }),
              m.status === "notReady" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "Waiting for prior round" })
            ] })
          ]
        },
        String(m.id)
      )),
      !filtered.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-sm text-muted-foreground", children: "No matches match the selected filters." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WinnerDialog,
      {
        match: winnerMatch,
        open: !!winnerMatch,
        onClose: () => setWinnerMatch(null),
        onConfirm: (winnerId) => {
          if (winnerMatch) {
            completeMutation.mutate({ matchId: winnerMatch.id, winnerId });
            setWinnerMatch(null);
          }
        },
        isPending: completeMutation.isPending
      }
    )
  ] });
}
function MatchesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(QueueSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AllMatchesSection, {})
  ] });
}
export {
  MatchesPage as default
};
