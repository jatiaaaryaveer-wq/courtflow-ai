import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, U as Users, b as formatDuration, C as Clock, a as formatTime, t as getPlayerStatusColor, u as getPlayerStatusLabel, T as TriangleAlert, Z as Zap } from "./index-C3hV2zjr.js";
import { B as Badge } from "./badge-tipg9WSN.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CnFOoifO.js";
import { I as Input } from "./input-QN6If4YR.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, e as ShieldAlert } from "./select-0yKiWVxm.js";
import { S as Skeleton } from "./skeleton-0ZCoo6jW.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cmj_Mon1.js";
import { m as usePlayers, b as useWaitingTimeSummary, P as PlayerStatus } from "./useBackend-BjhPvZ15.js";
import "./chevron-up-BBsHayid.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode);
function getWaitBadgeColor(minutes) {
  const m = Number(minutes);
  if (m > 30)
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200";
  if (m >= 15)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200";
}
function getWarningIcon(type) {
  switch (type) {
    case "waitedTooLong":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-red-500" });
    case "multiCategoryRisk":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-purple-500" });
    case "backToBackRisk":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-orange-500" });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-500" });
  }
}
function getWarningTitle(type) {
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
function WaitingTimePanel({
  summary,
  isLoading
}) {
  if (isLoading || !summary) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" })
    ] }) }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground uppercase tracking-wide", children: "Average Waiting Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-display font-bold text-primary mt-1", children: formatDuration(summary.averageWaitMinutes) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-7 w-7 text-primary" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-red-500" }),
          "Longest Waiting"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: summary.longestWaiting.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No players currently waiting" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: summary.longestWaiting.slice(0, 5).map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-smooth",
            "data-ocid": `players.waiting.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground w-5", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: entry.playerName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs font-semibold ${getWaitBadgeColor(entry.waitingMinutes)}`,
                  children: formatDuration(entry.waitingMinutes)
                }
              )
            ]
          },
          entry.playerId
        )) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-blue-500" }),
          "Rest Required"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: summary.recentlyPlayed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No players currently resting" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: summary.recentlyPlayed.map(
          (entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-smooth",
              "data-ocid": `players.resting.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground w-5", children: idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground block", children: entry.playerName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "Last: ",
                      formatTime(entry.lastMatchEndTime)
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200",
                    children: [
                      formatDuration(entry.restMinutesRemaining),
                      " remaining"
                    ]
                  }
                )
              ]
            },
            entry.playerId
          )
        ) }) })
      ] })
    ] }),
    summary.warnings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: summary.warnings.map((warning, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
        "data-ocid": `players.warning.item.${idx + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: getWarningIcon(warning.warningType) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-amber-800 dark:text-amber-300", children: getWarningTitle(warning.warningType) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-400 mt-0.5", children: [
              warning.playerName,
              ": ",
              warning.message
            ] })
          ] })
        ] })
      },
      `${warning.playerId}-${idx}`
    )) })
  ] });
}
function PlayerCard({
  player
}) {
  const isMultiCategory = player.categories.length > 1;
  const statusColor = getPlayerStatusColor(player.status);
  const statusLabel = getPlayerStatusLabel(player.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border hover:shadow-subtle transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground truncate", children: [
            player.name,
            player.seedNumber !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-xs text-muted-foreground", children: [
              "(Seed ",
              Number(player.seedNumber),
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5 flex-wrap", children: [
            player.categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-[10px] px-1.5 py-0 ${isMultiCategory ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200" : "bg-muted text-muted-foreground"}`,
                children: cat
              },
              cat
            )),
            isMultiCategory && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 font-bold",
                children: "MULTI"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          className: `text-xs font-semibold shrink-0 ${statusColor} ${player.status === PlayerStatus.playing ? "animate-pulse" : ""}`,
          children: statusLabel
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-md p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Last Match" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: player.lastMatchEndTime ? formatTime(player.lastMatchEndTime) : "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-md p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Waiting" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: formatDuration(player.totalWaitingMinutes) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-md p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Matches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: Number(player.matchesPlayedToday) })
      ] })
    ] })
  ] }) });
}
function PlayerTableRow({
  player
}) {
  const isMultiCategory = player.categories.length > 1;
  const statusColor = getPlayerStatusColor(player.status);
  const statusLabel = getPlayerStatusLabel(player.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-muted/30 transition-smooth", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      player.name,
      player.seedNumber !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
        "(Seed ",
        Number(player.seedNumber),
        ")"
      ] }),
      isMultiCategory && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: "text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 font-bold",
          children: "MULTI"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: player.categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        variant: "outline",
        className: `text-[10px] px-1.5 py-0 ${isMultiCategory ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200" : "bg-muted text-muted-foreground"}`,
        children: cat
      },
      cat
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        className: `text-xs font-semibold ${statusColor} ${player.status === PlayerStatus.playing ? "animate-pulse" : ""}`,
        children: statusLabel
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: player.lastMatchEndTime ? formatTime(player.lastMatchEndTime) : "—" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-medium", children: formatDuration(player.totalWaitingMinutes) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: Number(player.matchesPlayedToday) })
  ] });
}
function PlayersPage() {
  const { data: players, isLoading: playersLoading } = usePlayers();
  const { data: summary, isLoading: summaryLoading } = useWaitingTimeSummary();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("all");
  const categoryMap = reactExports.useMemo(() => {
    if (!players) return /* @__PURE__ */ new Map();
    const map = /* @__PURE__ */ new Map();
    for (const p of players) {
      for (const c of p.categories) {
        if (!map.has(c)) {
          map.set(
            c,
            c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          );
        }
      }
    }
    return map;
  }, [players]);
  const allCategories = reactExports.useMemo(
    () => Array.from(categoryMap.keys()).sort(),
    [categoryMap]
  );
  const filteredPlayers = reactExports.useMemo(() => {
    if (!players) return [];
    return players.filter((player) => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || player.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || player.categories.includes(categoryFilter);
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [players, searchQuery, statusFilter, categoryFilter]);
  const isLoading = playersLoading || summaryLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pb-8 p-4 md:p-6", "data-ocid": "players.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Players" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage players and track waiting times" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          (players == null ? void 0 : players.length) ?? 0,
          " players"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-5 w-5 text-primary" }),
        "Live Waiting Time Tracker"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WaitingTimePanel, { summary, isLoading: summaryLoading })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-primary" }),
        "All Players"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search players...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 bg-background",
              "data-ocid": "players.search_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "w-full sm:w-[160px] bg-background",
              "data-ocid": "players.status_filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Statuses" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Statuses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PlayerStatus.waiting, children: "Waiting" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PlayerStatus.playing, children: "Playing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PlayerStatus.resting, children: "Resting" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PlayerStatus.completed, children: "Completed" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "w-full sm:w-[180px] bg-background",
              "data-ocid": "players.category_filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Categories" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Categories" }),
            allCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat))
          ] })
        ] })
      ] }) }) }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }, i)) }) : filteredPlayers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No players found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Try adjusting your search or filters" })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 md:hidden", children: filteredPlayers.map((player, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `players.item.${idx + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerCard, { player }) }, player.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-transparent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold", children: "Player" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold", children: "Categories" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold", children: "Last Match" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold", children: "Waiting" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold", children: "Matches" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredPlayers.map((player, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": `players.item.${idx + 1}`,
              className: "contents",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerTableRow, { player })
            },
            player.id
          )) })
        ] }) }) }) })
      ] })
    ] })
  ] });
}
export {
  PlayersPage as default
};
