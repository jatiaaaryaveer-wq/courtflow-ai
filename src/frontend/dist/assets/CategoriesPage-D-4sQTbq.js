import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, R as React, B as Button, T as TriangleAlert, C as Clock, S as getCategoryStatusLabel, V as getCategoryStatusColor, U as Users, b as formatDuration, g as getStatusColor, q as getStatusLabel, a as formatTime, k as Trophy } from "./index-C3hV2zjr.js";
import { B as Badge } from "./badge-tipg9WSN.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CnFOoifO.js";
import { P as Progress } from "./progress-DPuonMgN.js";
import { S as Skeleton } from "./skeleton-0ZCoo6jW.js";
import { n as useCategories, u as useCourtFlowData, a as useTournamentStats, o as useTournamentConfig, p as useOrderOfPlaySuggestion } from "./useBackend-BjhPvZ15.js";
import { C as CircleCheck } from "./circle-check-wWwtH2ww.js";
import { a as ChevronUp, C as ChevronDown } from "./chevron-up-BBsHayid.js";
import "./index-DrI_w4bL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
const GripVertical = createLucideIcon("grip-vertical", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M10 12h11", key: "6m4ad9" }],
  ["path", { d: "M10 18h11", key: "11hvi2" }],
  ["path", { d: "M10 6h11", key: "c7qv1k" }],
  ["path", { d: "M4 10h2", key: "16xx2s" }],
  ["path", { d: "M4 6h1v4", key: "cnovpq" }],
  ["path", { d: "M6 18H4c0-1 2-2 2-3s-1-1.5-2-1", key: "m9a95d" }]
];
const ListOrdered = createLucideIcon("list-ordered", __iconNode);
const RANK_BADGE_STYLES = {
  1: { bg: "bg-[#FFD700]", text: "text-black", label: "1st" },
  2: { bg: "bg-[#C0C0C0]", text: "text-black", label: "2nd" },
  3: { bg: "bg-[#CD7F32]", text: "text-white", label: "3rd" }
};
function getRankBadge(rank) {
  return RANK_BADGE_STYLES[rank] ?? {
    bg: "bg-muted",
    text: "text-foreground",
    label: `${rank}th`
  };
}
function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
function addMinutesToTimeString(timeStr, minutes) {
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
function OrderOfPlaySection({ startTime }) {
  const { data: backendOrder, isLoading } = useOrderOfPlaySuggestion();
  const [order, setOrder] = reactExports.useState(null);
  const [applied, setApplied] = reactExports.useState(false);
  const dragIndexRef = reactExports.useRef(null);
  const entries = reactExports.useMemo(() => {
    if (order !== null) return order;
    return backendOrder ?? [];
  }, [order, backendOrder]);
  React.useEffect(() => {
    if (backendOrder && backendOrder.length > 0 && order === null) {
      setOrder(backendOrder);
    }
  }, [backendOrder]);
  const withRecalculated = reactExports.useMemo(() => {
    let cumulative = 0;
    return entries.map((e, idx) => {
      cumulative += Number(e.estimatedTotalMinutes);
      return {
        ...e,
        rank: BigInt(idx + 1),
        cumulativeMinutesIfThisOrder: BigInt(cumulative)
      };
    });
  }, [entries]);
  const handleDragStart = reactExports.useCallback((idx) => {
    dragIndexRef.current = idx;
  }, []);
  const handleDrop = reactExports.useCallback(
    (targetIdx) => {
      const srcIdx = dragIndexRef.current;
      if (srcIdx === null || srcIdx === targetIdx) return;
      setOrder((prev) => {
        const arr = [...prev ?? entries];
        const [item] = arr.splice(srcIdx, 1);
        arr.splice(targetIdx, 0, item);
        return arr;
      });
      dragIndexRef.current = null;
    },
    [entries]
  );
  const handleApply = reactExports.useCallback(() => {
    setApplied(true);
    const event = new CustomEvent("courtflow-toast", {
      detail: {
        message: "Order of play locked in — match queue will prioritize this sequence"
      }
    });
    window.dispatchEvent(event);
    setTimeout(() => setApplied(false), 4e3);
  }, []);
  const lastEntry = withRecalculated[withRecalculated.length - 1];
  const estimatedFinish = lastEntry ? addMinutesToTimeString(
    startTime,
    Number(lastEntry.cumulativeMinutesIfThisOrder)
  ) : null;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-56" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-xl" })
    ] });
  }
  if (!entries.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "order-of-play.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD700]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListOrdered, { className: "h-4 w-4 text-[#b8a200]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-bold text-foreground leading-tight", children: "Suggested Order of Play" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "AI-ranked category sequence for maximum court efficiency" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          variant: "default",
          onClick: handleApply,
          "data-ocid": "order-of-play.apply_button",
          className: "shrink-0 gap-1.5 bg-primary hover:bg-primary/90",
          children: applied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
            " Locked In"
          ] }) : "Apply This Order"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden border-border shadow-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: withRecalculated.map((entry, _idx) => {
        const badge = getRankBadge(_idx + 1);
        const catColour = CATEGORY_COLOURS[entry.categoryName] ?? "bg-primary";
        const catText = CATEGORY_TEXT_COLOURS[entry.categoryName] ?? "text-primary";
        const hasClash = Number(entry.crossCategoryClashCount) > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            draggable: true,
            onDragStart: () => handleDragStart(_idx),
            onDragOver: (e) => e.preventDefault(),
            onDrop: () => handleDrop(_idx),
            className: "flex items-start gap-3 px-4 py-3 bg-card hover:bg-muted/30 transition-colors cursor-grab active:cursor-grabbing group",
            "data-ocid": `order-of-play.item.${_idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground/50 mt-1 shrink-0 group-hover:text-muted-foreground transition-colors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badge.bg} ${badge.text}`,
                  children: _idx + 1
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `h-2.5 w-2.5 rounded-full shrink-0 ${catColour}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold text-sm ${catText}`, children: entry.categoryName }),
                  hasClash && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                    Number(entry.crossCategoryClashCount),
                    " clash",
                    Number(entry.crossCategoryClashCount) !== 1 ? "es" : ""
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: entry.reason })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-4 text-right text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: Number(entry.playerCount) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "players" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: Number(entry.totalMatches) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "matches" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: formatMinutes(Number(entry.estimatedTotalMinutes)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "est. time" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-[11px]", children: [
                    "by",
                    " ",
                    addMinutesToTimeString(
                      startTime,
                      Number(entry.cumulativeMinutesIfThisOrder)
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "cumulative" })
                ] })
              ] })
            ]
          },
          entry.categoryId
        );
      }) }),
      estimatedFinish && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border bg-muted/30 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "If played in this order, expected finish:" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-bold text-base",
                style: { color: "#e6b800" },
                children: estimatedFinish
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "(",
              formatMinutes(
                Number((lastEntry == null ? void 0 : lastEntry.cumulativeMinutesIfThisOrder) ?? 0n)
              ),
              " ",
              "total)"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex gap-0.5 h-2 rounded-full overflow-hidden", children: withRecalculated.map((entry, _idx) => {
          const total = Number(
            (lastEntry == null ? void 0 : lastEntry.cumulativeMinutesIfThisOrder) ?? 1n
          );
          const width = total > 0 ? Number(entry.estimatedTotalMinutes) / total * 100 : 0;
          const catColour = CATEGORY_COLOURS[entry.categoryName] ?? "bg-primary";
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `${catColour} opacity-80 h-full transition-all`,
              style: { width: `${width}%` },
              title: `${entry.categoryName}: ${formatMinutes(Number(entry.estimatedTotalMinutes))}`
            },
            entry.categoryId
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 flex gap-3 flex-wrap", children: withRecalculated.map((entry) => {
          const catColour = CATEGORY_COLOURS[entry.categoryName] ?? "bg-primary";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1 text-[10px] text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-2 w-2 rounded-full ${catColour}` }),
                entry.categoryName
              ]
            },
            entry.categoryId
          );
        }) })
      ] })
    ] }),
    applied && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2.5 text-sm text-emerald-800 dark:text-emerald-300",
        "data-ocid": "order-of-play.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0" }),
          "Order of play locked in — match queue will prioritise this sequence"
        ]
      }
    )
  ] });
}
const CATEGORY_COLOURS = {
  "U10 Boys": "bg-purple-500",
  "U12 Boys": "bg-blue-500",
  "U14 Boys": "bg-cyan-500",
  "Open Singles": "bg-emerald-500",
  "Junior Doubles": "bg-orange-500",
  "One Point Slam": "bg-red-500"
};
const CATEGORY_BORDER_COLOURS = {
  "U10 Boys": "border-purple-200 dark:border-purple-800",
  "U12 Boys": "border-blue-200 dark:border-blue-800",
  "U14 Boys": "border-cyan-200 dark:border-cyan-800",
  "Open Singles": "border-emerald-200 dark:border-emerald-800",
  "Junior Doubles": "border-orange-200 dark:border-orange-800",
  "One Point Slam": "border-red-200 dark:border-red-800"
};
const CATEGORY_TEXT_COLOURS = {
  "U10 Boys": "text-purple-700 dark:text-purple-300",
  "U12 Boys": "text-blue-700 dark:text-blue-300",
  "U14 Boys": "text-cyan-700 dark:text-cyan-300",
  "Open Singles": "text-emerald-700 dark:text-emerald-300",
  "Junior Doubles": "text-orange-700 dark:text-orange-300",
  "One Point Slam": "text-red-700 dark:text-red-300"
};
function roundName(round) {
  const r = Number(round);
  const names = {
    1: "Round of 64",
    2: "Round of 32",
    3: "Round of 16",
    4: "Quarter Finals",
    5: "Semi Finals",
    6: "Final"
  };
  return names[r] ?? `Round ${r}`;
}
function groupMatchesByRound(matches) {
  const groups = {};
  for (const m of matches) {
    const key = roundName(m.round);
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  }
  return groups;
}
function CategoryCard({
  category
}) {
  const total = Number(category.matchesCompleted) + Number(category.matchesPending);
  const progress = total > 0 ? Number(category.matchesCompleted) / total * 100 : 0;
  const statusLabel = getCategoryStatusLabel(category.status);
  const statusClass = getCategoryStatusColor(category.status);
  const colourBar = CATEGORY_COLOURS[category.name] ?? "bg-primary";
  const borderColour = CATEGORY_BORDER_COLOURS[category.name] ?? "border-border";
  const textColour = CATEGORY_TEXT_COLOURS[category.name] ?? "text-primary";
  const isBehind = category.status === "delayed" || category.status === "urgent";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: `relative overflow-hidden border ${borderColour} shadow-subtle transition-smooth hover:shadow-md`,
      "data-ocid": "category.card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute left-0 top-0 h-full w-1 ${colourBar}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: `text-lg font-display ${textColour}`, children: category.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: roundName(category.currentRound) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `${statusClass} text-xs font-medium`, children: statusLabel })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          isBehind && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 p-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-amber-800 dark:text-amber-300", children: "Behind schedule" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-amber-700 dark:text-amber-400", children: [
                Number(category.matchesPending),
                " match",
                category.matchesPending !== 1n ? "es" : "",
                " pending — consider prioritising this category"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                Number(category.numPlayers),
                " players"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                formatDuration(category.avgDurationMinutes),
                " avg"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                Number(category.matchesCompleted),
                " / ",
                total
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-2" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-muted/50 p-2 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground", children: Number(category.matchesCompleted) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Done" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-muted/50 p-2 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground", children: Number(category.matchesPending) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Pending" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-muted/50 p-2 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground", children: roundName(category.currentRound) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Round" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function MatchRow({ match }) {
  const statusClass = getStatusColor(match.status);
  const statusLabel = getStatusLabel(match.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm",
      "data-ocid": "category.match.row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium truncate", children: [
            match.player1Name,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "vs" }),
            " ",
            match.player2Name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            match.courtName ? `Court: ${match.courtName}` : "No court",
            match.startTime ? ` • ${formatTime(match.startTime)}` : ""
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `${statusClass} text-xs`, children: statusLabel }),
          match.winnerName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: match.winnerName })
          ] })
        ] })
      ]
    }
  );
}
function CategoryMatchesSection({
  category,
  matches
}) {
  const [open, setOpen] = reactExports.useState(false);
  const groups = reactExports.useMemo(() => groupMatchesByRound(matches), [matches]);
  const colourBar = CATEGORY_COLOURS[category.name] ?? "bg-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        className: "flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-smooth",
        "data-ocid": "category.matches.toggle",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-3 w-3 rounded-full ${colourBar}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: category.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
              matches.length,
              " match",
              matches.length !== 1 ? "es" : ""
            ] })
          ] }),
          open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border px-4 py-3 space-y-4", children: [
      Object.entries(groups).map(([roundNameKey, roundMatches]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2", children: roundNameKey }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: roundMatches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MatchRow, { match: m }, String(m.id))) })
      ] }, roundNameKey)),
      matches.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No matches in this category yet." })
    ] })
  ] });
}
function CategoriesPage() {
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: courtFlowData, isLoading: dataLoading } = useCourtFlowData();
  const { data: stats, isLoading: statsLoading } = useTournamentStats();
  const { data: config } = useTournamentConfig();
  const startTime = (config == null ? void 0 : config.startTime) ?? "10:30 AM";
  const allMatches = (courtFlowData == null ? void 0 : courtFlowData.matchQueue.map((q) => q.match)) ?? [];
  const matchesByCategory = reactExports.useMemo(() => {
    const map = {};
    for (const m of allMatches) {
      if (!map[m.categoryName]) map[m.categoryName] = [];
      map[m.categoryName].push(m);
    }
    return map;
  }, [allMatches]);
  const totalCompleted = (stats == null ? void 0 : stats.matchesCompleted) ?? 0n;
  const totalPending = (stats == null ? void 0 : stats.matchesPending) ?? 0n;
  const totalMatches = Number(totalCompleted) + Number(totalPending);
  const overallProgress = totalMatches > 0 ? Number(totalCompleted) / totalMatches * 100 : 0;
  const isLoading = catLoading || dataLoading || statsLoading;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full max-w-md" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Skeleton,
        {
          className: "h-64 w-full"
        },
        `skeleton-cat-${i}`
      )) })
    ] });
  }
  const sortedCategories = [...categories ?? []].sort((a, b) => {
    const order = [
      "U10 Boys",
      "U12 Boys",
      "U14 Boys",
      "Open Singles",
      "Junior Doubles",
      "One Point Slam"
    ];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 p-4 md:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(OrderOfPlaySection, { startTime }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-display font-bold text-foreground", children: "Tournament Categories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Overview and progress tracking for all event categories" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Total matches:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: Number(totalCompleted) }),
          " ",
          "completed /",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: totalMatches }),
          " ",
          "total"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Overall tournament progress" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
            Math.round(overallProgress),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: overallProgress, className: "h-3" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: sortedCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryCard, { category: cat }, cat.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-semibold text-foreground", children: "Category Matches" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: sortedCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CategoryMatchesSection,
        {
          category: cat,
          matches: matchesByCategory[cat.name] ?? []
        },
        cat.id
      )) })
    ] })
  ] });
}
export {
  CategoriesPage as default
};
