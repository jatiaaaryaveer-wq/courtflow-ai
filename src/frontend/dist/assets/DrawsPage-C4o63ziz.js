import { c as createLucideIcon, R as React, j as jsxRuntimeExports, B as Button, U as Users, C as Clock } from "./index-C3hV2zjr.js";
import { B as Badge } from "./badge-tipg9WSN.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CnFOoifO.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cmj_Mon1.js";
import { s as useImportDraw, p as useOrderOfPlaySuggestion } from "./useBackend-BjhPvZ15.js";
import { u as ue } from "./index-CI_7dGKN.js";
import { I as Info } from "./info-DEodOFAV.js";
import { C as CircleCheck } from "./circle-check-wWwtH2ww.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
  ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
  ["path", { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22", key: "1ailkh" }],
  ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
  ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" }]
];
const Shuffle = createLucideIcon("shuffle", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function detectDelimiter(header) {
  const commaCount = (header.match(/,/g) || []).length;
  const semicolonCount = (header.match(/;/g) || []).length;
  return semicolonCount > commaCount ? ";" : ",";
}
const REQUIRED_COLUMNS = [
  "category",
  "round",
  "player1",
  "player2",
  "estimated_duration_mins"
];
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2)
    return {
      parseError: "File must have a header row and at least one data row."
    };
  const delimiter = detectDelimiter(lines[0]);
  const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase());
  const missingCols = REQUIRED_COLUMNS.filter((c) => !headers.includes(c));
  if (missingCols.length > 0)
    return { parseError: `Missing columns: ${missingCols.join(", ")}` };
  const colIdx = (name) => headers.indexOf(name);
  const rows = [];
  const errors = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = line.split(delimiter).map((c) => c.trim());
    const category = cells[colIdx("category")] ?? "";
    const round = cells[colIdx("round")] ?? "";
    const player1 = cells[colIdx("player1")] ?? "";
    const player2 = cells[colIdx("player2")] ?? "";
    const estimatedRaw = cells[colIdx("estimated_duration_mins")] ?? "";
    const estimatedMins = Number(estimatedRaw);
    const rowNum = i + 1;
    if (!category) {
      errors.push({ rowIndex: rowNum, reason: "Missing category" });
      continue;
    }
    if (!round) {
      errors.push({ rowIndex: rowNum, reason: "Missing round" });
      continue;
    }
    if (!player1) {
      errors.push({ rowIndex: rowNum, reason: "Missing player1" });
      continue;
    }
    if (!player2) {
      errors.push({ rowIndex: rowNum, reason: "Missing player2" });
      continue;
    }
    if (!estimatedRaw || Number.isNaN(estimatedMins) || estimatedMins <= 0) {
      errors.push({
        rowIndex: rowNum,
        reason: `Invalid estimated_duration_mins: "${estimatedRaw}"`
      });
      continue;
    }
    rows.push({
      category,
      round,
      player1,
      player2,
      estimatedMins,
      rawIndex: rowNum
    });
  }
  const seen = /* @__PURE__ */ new Set();
  const dupeErrors = [];
  for (const r of rows) {
    const key = `${r.category}|${r.round}|${r.player1}|${r.player2}`;
    if (seen.has(key)) {
      dupeErrors.push({
        rowIndex: r.rawIndex,
        reason: `Duplicate match: ${r.player1} vs ${r.player2} in ${r.category} ${r.round}`
      });
    }
    seen.add(key);
  }
  return {
    rows: rows.filter(
      (r) => !dupeErrors.some((e) => e.rowIndex === r.rawIndex)
    ),
    errors: [...errors, ...dupeErrors]
  };
}
function downloadTemplate() {
  const csv = [
    "category,round,player1,player2,estimated_duration_mins",
    "U12 Boys,R1,Aarav Shah,Rishon Patel,25",
    "U14 Boys,R1,Kabir Mehta,Aryan Joshi,30",
    "Open Singles,R1,Dev Kumar,Neil Sharma,35",
    "Junior Doubles,R1,Rohan Gupta,Vivaan Nair,40"
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "courtflow_draw_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}
function OrderOfPlayPanel() {
  const { data: entries, isLoading, error } = useOrderOfPlaySuggestion();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "w-4 h-4 text-primary" }),
        "Suggested Order of Play"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "AI-ranked order to start categories — minimises court idle time and player clashes." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 py-6 justify-center text-muted-foreground",
          "data-ocid": "draws.oop_loading_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Computing suggestions…" })
          ]
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 py-4 text-sm text-red-600",
          "data-ocid": "draws.oop_error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 flex-shrink-0" }),
            "Failed to load suggestions. Try refreshing."
          ]
        }
      ),
      entries && entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "py-6 text-center text-sm text-muted-foreground",
          "data-ocid": "draws.oop_empty_state",
          children: "Import a draw first to see order of play suggestions."
        }
      ),
      entries && entries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: entries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-3 p-3 rounded-md border border-border bg-muted/20 hover:bg-muted/40 transition-colors",
          "data-ocid": `draws.oop_entry.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary", children: Number(entry.rank) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: entry.categoryName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 mr-1" }),
                  Number(entry.playerCount),
                  " players"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
                  "~",
                  Number(entry.estimatedTotalMinutes),
                  " min"
                ] }),
                entry.crossCategoryClashCount > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs bg-amber-100 text-amber-800 border-amber-200", children: [
                  Number(entry.crossCategoryClashCount),
                  " clashes"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: entry.reason }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Cumulative if started here:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
                    Number(entry.cumulativeMinutesIfThisOrder),
                    " min"
                  ] })
                ] })
              ] })
            ] })
          ]
        },
        entry.categoryId
      )) })
    ] })
  ] });
}
function DrawsPage() {
  const [parsedRows, setParsedRows] = React.useState([]);
  const [parseErrors, setParseErrors] = React.useState([]);
  const [parseError, setParseError] = React.useState(null);
  const [fileName, setFileName] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const importDraw = useImportDraw();
  function handleFileChange(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setFileName(file.name);
    setParsedRows([]);
    setParseErrors([]);
    setParseError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
      if (typeof text !== "string") {
        setParseError("Could not read file.");
        return;
      }
      const result = parseCSV(text);
      if ("parseError" in result) {
        setParseError(result.parseError);
      } else {
        setParsedRows(result.rows);
        setParseErrors(result.errors);
      }
    };
    reader.onerror = () => setParseError("File read failed. Please try again.");
    reader.readAsText(file);
    e.target.value = "";
  }
  async function handleImport() {
    if (parsedRows.length === 0 || parseErrors.length > 0) return;
    const drawRows = parsedRows.map((r) => ({
      categoryId: r.category,
      round: r.round,
      player1Name: r.player1,
      player2Name: r.player2,
      estimatedMinutes: BigInt(r.estimatedMins)
    }));
    try {
      const result = await importDraw.mutateAsync(drawRows);
      const successCount = Number(result.successCount);
      const skippedCount = Number(result.skippedCount);
      if (result.errors.length > 0) {
        const backendErrors = result.errors.map((e) => ({
          rowIndex: Number(e.rowIndex),
          reason: e.reason
        }));
        setParseErrors((prev) => [...prev, ...backendErrors]);
        ue.warning(
          `${successCount} matches imported. ${skippedCount} skipped.`,
          {
            description: `${result.errors.length} rows had errors — see validation panel.`
          }
        );
      } else {
        ue.success(
          `${successCount} matches imported successfully. ${skippedCount} skipped.`
        );
        setParsedRows([]);
        setFileName(null);
      }
    } catch (err) {
      ue.error("Import failed", {
        description: err instanceof Error ? err.message : "Unknown error"
      });
    }
  }
  const canImport = parsedRows.length > 0 && parseErrors.length === 0 && !importDraw.isPending;
  const validCount = parsedRows.length;
  const errorCount = parseErrors.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground tracking-tight", children: "Draw Upload" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Import match draws from a CSV file and see suggested order of play." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-primary" }),
        "CSV Format"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-muted rounded-md px-4 py-3 text-xs font-mono text-foreground overflow-x-auto leading-relaxed", children: `category,round,player1,player2,estimated_duration_mins
U12 Boys,R1,Aarav Shah,Rishon Patel,25
U14 Boys,R1,Kabir Mehta,Aryan Joshi,30
Open Singles,R1,Dev Kumar,Neil Sharma,35` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Note:" }),
            " Player names must exactly match names in your Player database. Both comma (,) and semicolon (;) delimiters are supported."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: downloadTemplate,
            className: "gap-1.5",
            "data-ocid": "draws.template_download_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
              "Download Template CSV"
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 text-primary" }),
        "Upload Draw File"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors w-full",
            onClick: () => {
              var _a;
              return (_a = fileInputRef.current) == null ? void 0 : _a.click();
            },
            onKeyDown: (e) => {
              var _a;
              return e.key === "Enter" && ((_a = fileInputRef.current) == null ? void 0 : _a.click());
            },
            "aria-label": "Select CSV file to upload",
            "data-ocid": "draws.csv_dropzone",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6 text-primary" }) }),
              fileName ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground", children: fileName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Click to replace" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground", children: "Click to choose a CSV file" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Supports .csv files with comma or semicolon delimiters" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: ".csv,text/csv",
                  className: "sr-only",
                  onChange: handleFileChange,
                  "data-ocid": "draws.csv_file_input"
                }
              )
            ]
          }
        ),
        parseError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2.5",
            "data-ocid": "draws.parse_error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: parseError })
            ]
          }
        ),
        (parsedRows.length > 0 || parseErrors.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
          validCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1.5 text-sm text-emerald-700",
              "data-ocid": "draws.valid_count_success_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: validCount }),
                  " valid rows ready to import"
                ] })
              ]
            }
          ),
          errorCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1.5 text-sm text-red-600",
              "data-ocid": "draws.error_count_error_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: errorCount }),
                  " rows with errors"
                ] })
              ]
            }
          )
        ] }),
        parseErrors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-md border border-red-200 bg-red-50 p-3 space-y-1.5",
            "data-ocid": "draws.validation_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-red-700 mb-2", children: "Validation Errors — fix these in your CSV and re-upload:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 max-h-48 overflow-y-auto", children: parseErrors.map((err) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 text-xs text-red-700",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "destructive",
                        className: "text-[10px] px-1.5 py-0 shrink-0",
                        children: [
                          "Row ",
                          err.rowIndex
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: err.reason })
                  ]
                },
                `${err.rowIndex}-${err.reason}`
              )) })
            ]
          }
        )
      ] })
    ] }),
    parsedRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center justify-between text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-primary" }),
          "Preview — ",
          parsedRows.length,
          " rows"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: handleImport,
            disabled: !canImport,
            className: "gap-1.5",
            size: "sm",
            "data-ocid": "draws.import_button",
            children: importDraw.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
              "Importing…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5" }),
              "Import ",
              parsedRows.length,
              " matches"
            ] })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10 text-center", children: "#" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Round" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Player 1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Player 2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Est. (min)" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: parsedRows.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `draws.preview_row.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center text-muted-foreground text-xs", children: row.rawIndex }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-sm", children: row.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: row.round }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: row.player1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: row.player2 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-sm tabular-nums", children: row.estimatedMins })
            ]
          },
          `${row.category}-${row.round}-${row.player1}-${row.player2}`
        )) })
      ] }) }) })
    ] }),
    parsedRows.length > 0 && parseErrors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        onClick: handleImport,
        disabled: !canImport,
        size: "lg",
        className: "gap-2",
        "data-ocid": "draws.import_primary_button",
        children: importDraw.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          "Importing…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          "Import ",
          parsedRows.length,
          " Matches"
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OrderOfPlayPanel, {})
  ] });
}
export {
  DrawsPage as default
};
