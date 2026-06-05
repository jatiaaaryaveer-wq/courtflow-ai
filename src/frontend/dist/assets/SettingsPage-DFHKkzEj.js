import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, p as cn, R as React, k as Trophy, T as TriangleAlert, B as Button, Z as Zap, C as Clock, b as formatDuration } from "./index-C3hV2zjr.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./card-CnFOoifO.js";
import { I as Input } from "./input-QN6If4YR.js";
import { P as Primitive } from "./index-DrI_w4bL.js";
import { S as Skeleton } from "./skeleton-0ZCoo6jW.js";
import { o as useTournamentConfig, n as useCategories, q as useUpdateTournamentConfig, f as useActivatePanicMode, r as useDeactivatePanicMode } from "./useBackend-BjhPvZ15.js";
import { u as ue } from "./index-CI_7dGKN.js";
import { I as Info } from "./info-DEodOFAV.js";
import { R as RotateCcw } from "./rotate-ccw-BeDllXoP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function timeFromIso(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
function isoFromDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return "";
  return (/* @__PURE__ */ new Date(`${dateStr}T${timeStr}`)).toISOString();
}
function dateFromIso(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function SettingsPage() {
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
  const [courtNames, setCourtNames] = React.useState([]);
  const [matchFormat, setMatchFormat] = React.useState("");
  const [avgDuration, setAvgDuration] = React.useState(30);
  const [minRest, setMinRest] = React.useState(15);
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
      minRestMinutes: BigInt(minRest)
    };
    try {
      await updateConfig.mutateAsync(payload);
      ue.success("Tournament settings saved successfully");
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to save settings");
    }
  }
  async function handlePanicToggle() {
    try {
      if (config == null ? void 0 : config.panicModeActive) {
        await deactivatePanic.mutateAsync();
        ue.success("Panic mode deactivated");
      } else {
        await activatePanic.mutateAsync();
        ue.success("Panic mode activated");
      }
    } catch (e) {
      ue.error(
        e instanceof Error ? e.message : "Failed to toggle panic mode"
      );
    }
  }
  const updateCourtName = (index, value) => {
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
  const removeCourt = (index) => {
    if (courtNames.length <= 1) return;
    setCourtNames((prev) => prev.filter((_, i) => i !== index));
  };
  const isLoading = configLoading || catsLoading;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-2/3" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6",
      "data-ocid": "settings.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-display font-bold text-foreground", children: "Tournament Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configure your tournament details, courts, and match rules" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: `shadow-subtle ${(config == null ? void 0 : config.panicModeActive) ? "border-destructive" : ""}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `w-10 h-10 rounded-sm flex items-center justify-center ${(config == null ? void 0 : config.panicModeActive) ? "bg-destructive/10" : "bg-muted"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TriangleAlert,
                        {
                          className: `w-5 h-5 ${(config == null ? void 0 : config.panicModeActive) ? "text-destructive" : "text-muted-foreground"}`
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Panic Mode" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: (config == null ? void 0 : config.panicModeActive) ? "Emergency scheduling active" : "Activate when tournament is running late" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: (config == null ? void 0 : config.panicModeActive) ? "destructive" : "outline",
                    size: "sm",
                    onClick: handlePanicToggle,
                    disabled: activatePanic.isPending || deactivatePanic.isPending,
                    "data-ocid": "settings.panic_mode_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 mr-1" }),
                      (config == null ? void 0 : config.panicModeActive) ? "Deactivate" : "Activate"
                    ]
                  }
                )
              ] }),
              (config == null ? void 0 : config.panicModeActive) && config.panicSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 p-3 bg-destructive/5 rounded-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-destructive mb-1", children: "Suggestions:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-xs text-muted-foreground space-y-0.5", children: config.panicSuggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "• ",
                  s
                ] }, s)) })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
              "Tournament Setup"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Edit the core tournament configuration. Changes apply immediately after saving." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tournament-name", children: "Tournament Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "tournament-name",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    placeholder: "e.g. AJ Tennis Summer Open",
                    "data-ocid": "settings.tournament_name_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "venue", children: "Venue" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "venue",
                    value: venue,
                    onChange: (e) => setVenue(e.target.value),
                    placeholder: "e.g. Matunga Gymkhana",
                    "data-ocid": "settings.venue_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "date", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "date",
                    type: "date",
                    value: date,
                    onChange: (e) => setDate(e.target.value),
                    "data-ocid": "settings.date_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "start-time",
                      className: "flex items-center gap-1.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                        "Start Time"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "start-time",
                      type: "time",
                      value: startTime,
                      onChange: (e) => setStartTime(e.target.value),
                      "data-ocid": "settings.start_time_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "end-time", className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                    "End Time"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "end-time",
                      type: "time",
                      value: endTime,
                      onChange: (e) => setEndTime(e.target.value),
                      "data-ocid": "settings.end_time_input"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-3", children: "Court Names" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                courtNames.map((court, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground w-6", children: [
                    idx + 1,
                    "."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: court,
                      onChange: (e) => updateCourtName(idx, e.target.value),
                      placeholder: `Court ${idx + 1}`,
                      className: "flex-1",
                      "data-ocid": `settings.court_name_input.${idx + 1}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onClick: () => removeCourt(idx),
                      disabled: courtNames.length <= 1,
                      className: "text-muted-foreground hover:text-destructive",
                      "data-ocid": `settings.remove_court_button.${idx + 1}`,
                      children: "Remove"
                    }
                  )
                ] }, court)),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: addCourt,
                    disabled: courtNames.length >= 8,
                    className: "mt-1",
                    "data-ocid": "settings.add_court_button",
                    children: "+ Add Court"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-5 grid grid-cols-1 md:grid-cols-3 gap-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "match-format", children: "Match Format" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "match-format",
                    value: matchFormat,
                    onChange: (e) => setMatchFormat(e.target.value),
                    placeholder: "e.g. First to 4 games, tiebreak at 3-3",
                    "data-ocid": "settings.match_format_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "avg-duration", children: "Avg Match Duration (min)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "avg-duration",
                    type: "number",
                    min: 10,
                    max: 180,
                    value: avgDuration,
                    onChange: (e) => setAvgDuration(Number(e.target.value)),
                    "data-ocid": "settings.avg_duration_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "min-rest", children: "Minimum Rest (min)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "min-rest",
                    type: "number",
                    min: 0,
                    max: 60,
                    value: minRest,
                    onChange: (e) => setMinRest(Number(e.target.value)),
                    "data-ocid": "settings.min_rest_input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: handleSave,
                disabled: updateConfig.isPending,
                className: "gap-2",
                "data-ocid": "settings.save_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
                  updateConfig.isPending ? "Saving…" : "Save Settings"
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4 text-primary" }),
              "Category Configuration"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Overview of tournament categories and their average match durations." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 font-medium", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 font-medium", children: "Players" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 font-medium", children: "Avg Duration" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 font-medium", children: "Matches Done" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 font-medium", children: "Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 font-medium", children: "Round" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              (categories ?? []).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "border-b border-border/50 hover:bg-muted/30 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 font-medium text-foreground", children: cat.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-muted-foreground", children: String(cat.numPlayers) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-muted-foreground", children: formatDuration(cat.avgDurationMinutes) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-muted-foreground", children: String(cat.matchesCompleted) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-muted-foreground", children: String(cat.matchesPending) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-muted-foreground", children: String(cat.currentRound) })
                  ]
                },
                cat.id
              )),
              (!categories || categories.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  colSpan: 6,
                  className: "py-6 text-center text-muted-foreground",
                  children: "No categories configured"
                }
              ) })
            ] })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-subtle bg-muted/30 border-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "CourtFlow AI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "AI-powered tennis tournament scheduling. Reduce waiting time, prevent player clashes, and finish on schedule." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-2", children: "Version 1.0 · Built for tournament organisers who want fairness, speed, and organisation." })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle border-destructive/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold text-destructive flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }),
              "Danger Zone"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Destructive actions that cannot be undone. Proceed with caution." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "gap-2 border-destructive/30 text-destructive hover:bg-destructive/10",
              onClick: () => setShowResetModal(true),
              "data-ocid": "settings.reset_sample_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
                "Reset Sample Data"
              ]
            }
          ) })
        ] }),
        showResetModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-sm border border-border shadow-lg max-w-md w-full p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-sm bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground", children: "Reset Not Available" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Resetting sample data is disabled in live mode." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "In a production environment, this would clear all matches, players, and categories and restore the default sample dataset. During live tournament operation, this action is blocked to prevent accidental data loss." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => setShowResetModal(false),
              "data-ocid": "settings.reset_cancel_button",
              children: "Close"
            }
          ) })
        ] }) })
      ]
    }
  );
}
export {
  SettingsPage as default
};
