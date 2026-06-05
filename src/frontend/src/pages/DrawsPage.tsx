import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useImportDraw, useOrderOfPlaySuggestion } from "@/hooks/useBackend";
import type { DrawRow } from "@/types";
import {
  AlertCircle,
  ArrowDown,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Info,
  Loader2,
  Shuffle,
  Upload,
  Users,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

// ─── CSV Parsing ─────────────────────────────────────────────────────────────

interface ParsedRow {
  category: string;
  round: string;
  player1: string;
  player2: string;
  estimatedMins: number;
  rawIndex: number;
}

interface ParseError {
  rowIndex: number;
  reason: string;
}

interface ParseResult {
  rows: ParsedRow[];
  errors: ParseError[];
}

function detectDelimiter(header: string): string {
  const commaCount = (header.match(/,/g) || []).length;
  const semicolonCount = (header.match(/;/g) || []).length;
  return semicolonCount > commaCount ? ";" : ",";
}

const REQUIRED_COLUMNS = [
  "category",
  "round",
  "player1",
  "player2",
  "estimated_duration_mins",
] as const;

function parseCSV(text: string): ParseResult | { parseError: string } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2)
    return {
      parseError: "File must have a header row and at least one data row.",
    };

  const delimiter = detectDelimiter(lines[0]);
  const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase());

  const missingCols = REQUIRED_COLUMNS.filter((c) => !headers.includes(c));
  if (missingCols.length > 0)
    return { parseError: `Missing columns: ${missingCols.join(", ")}` };

  const colIdx = (name: string) => headers.indexOf(name);

  const rows: ParsedRow[] = [];
  const errors: ParseError[] = [];

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

    const rowNum = i + 1; // 1-based for display
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
        reason: `Invalid estimated_duration_mins: "${estimatedRaw}"`,
      });
      continue;
    }
    rows.push({
      category,
      round,
      player1,
      player2,
      estimatedMins,
      rawIndex: rowNum,
    });
  }

  // Duplicate check
  const seen = new Set<string>();
  const dupeErrors: ParseError[] = [];
  for (const r of rows) {
    const key = `${r.category}|${r.round}|${r.player1}|${r.player2}`;
    if (seen.has(key)) {
      dupeErrors.push({
        rowIndex: r.rawIndex,
        reason: `Duplicate match: ${r.player1} vs ${r.player2} in ${r.category} ${r.round}`,
      });
    }
    seen.add(key);
  }

  return {
    rows: rows.filter(
      (r) => !dupeErrors.some((e) => e.rowIndex === r.rawIndex),
    ),
    errors: [...errors, ...dupeErrors],
  };
}

// ─── Template download ────────────────────────────────────────────────────────

function downloadTemplate() {
  const csv = [
    "category,round,player1,player2,estimated_duration_mins",
    "U12 Boys,R1,Aarav Shah,Rishon Patel,25",
    "U14 Boys,R1,Kabir Mehta,Aryan Joshi,30",
    "Open Singles,R1,Dev Kumar,Neil Sharma,35",
    "Junior Doubles,R1,Rohan Gupta,Vivaan Nair,40",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "courtflow_draw_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Order of Play Section ────────────────────────────────────────────────────

function OrderOfPlayPanel() {
  const { data: entries, isLoading, error } = useOrderOfPlaySuggestion();

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shuffle className="w-4 h-4 text-primary" />
          Suggested Order of Play
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-ranked order to start categories — minimises court idle time and
          player clashes.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div
            className="flex items-center gap-2 py-6 justify-center text-muted-foreground"
            data-ocid="draws.oop_loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Computing suggestions…</span>
          </div>
        )}
        {error && (
          <div
            className="flex items-center gap-2 py-4 text-sm text-red-600"
            data-ocid="draws.oop_error_state"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Failed to load suggestions. Try refreshing.
          </div>
        )}
        {entries && entries.length === 0 && (
          <div
            className="py-6 text-center text-sm text-muted-foreground"
            data-ocid="draws.oop_empty_state"
          >
            Import a draw first to see order of play suggestions.
          </div>
        )}
        {entries && entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <div
                key={entry.categoryId}
                className="flex items-start gap-3 p-3 rounded-md border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                data-ocid={`draws.oop_entry.${idx + 1}`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {Number(entry.rank)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      {entry.categoryName}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {Number(entry.playerCount)} players
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />~
                      {Number(entry.estimatedTotalMinutes)} min
                    </Badge>
                    {entry.crossCategoryClashCount > 0n && (
                      <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                        {Number(entry.crossCategoryClashCount)} clashes
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {entry.reason}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowDown className="w-3 h-3" />
                    <span>
                      Cumulative if started here:{" "}
                      <strong className="text-foreground">
                        {Number(entry.cumulativeMinutesIfThisOrder)} min
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── DrawsPage ────────────────────────────────────────────────────────────────

export default function DrawsPage() {
  const [parsedRows, setParsedRows] = React.useState<ParsedRow[]>([]);
  const [parseErrors, setParseErrors] = React.useState<ParseError[]>([]);
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const importDraw = useImportDraw();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParsedRows([]);
    setParseErrors([]);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
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
    // reset so same file can be re-selected
    e.target.value = "";
  }

  async function handleImport() {
    if (parsedRows.length === 0 || parseErrors.length > 0) return;
    const drawRows: DrawRow[] = parsedRows.map((r) => ({
      categoryId: r.category,
      round: r.round,
      player1Name: r.player1,
      player2Name: r.player2,
      estimatedMinutes: BigInt(r.estimatedMins),
    }));
    try {
      const result = await importDraw.mutateAsync(drawRows);
      const successCount = Number(result.successCount);
      const skippedCount = Number(result.skippedCount);
      if (result.errors.length > 0) {
        const backendErrors: ParseError[] = result.errors.map((e) => ({
          rowIndex: Number(e.rowIndex),
          reason: e.reason,
        }));
        setParseErrors((prev) => [...prev, ...backendErrors]);
        toast.warning(
          `${successCount} matches imported. ${skippedCount} skipped.`,
          {
            description: `${result.errors.length} rows had errors — see validation panel.`,
          },
        );
      } else {
        toast.success(
          `${successCount} matches imported successfully. ${skippedCount} skipped.`,
        );
        setParsedRows([]);
        setFileName(null);
      }
    } catch (err) {
      toast.error("Import failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  const canImport =
    parsedRows.length > 0 && parseErrors.length === 0 && !importDraw.isPending;
  const validCount = parsedRows.length;
  const errorCount = parseErrors.length;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Draw Upload
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Import match draws from a CSV file and see suggested order of play.
          </p>
        </div>
      </div>

      {/* Example format */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="w-4 h-4 text-primary" />
            CSV Format
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="bg-muted rounded-md px-4 py-3 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">{`category,round,player1,player2,estimated_duration_mins
U12 Boys,R1,Aarav Shah,Rishon Patel,25
U14 Boys,R1,Kabir Mehta,Aryan Joshi,30
Open Singles,R1,Dev Kumar,Neil Sharma,35`}</pre>
          <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Player names must exactly match names in
              your Player database. Both comma (,) and semicolon (;) delimiters
              are supported.
            </span>
          </div>
          <div className="flex">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              className="gap-1.5"
              data-ocid="draws.template_download_button"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload area */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Upload className="w-4 h-4 text-primary" />
            Upload Draw File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            type="button"
            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors w-full"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) =>
              e.key === "Enter" && fileInputRef.current?.click()
            }
            aria-label="Select CSV file to upload"
            data-ocid="draws.csv_dropzone"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            {fileName ? (
              <>
                <p className="font-medium text-sm text-foreground">
                  {fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Click to replace
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-sm text-foreground">
                  Click to choose a CSV file
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports .csv files with comma or semicolon delimiters
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={handleFileChange}
              data-ocid="draws.csv_file_input"
            />
          </button>

          {/* File-level parse error */}
          {parseError && (
            <div
              className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2.5"
              data-ocid="draws.parse_error_state"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Validation summary */}
          {(parsedRows.length > 0 || parseErrors.length > 0) && (
            <div className="flex items-center gap-3 flex-wrap">
              {validCount > 0 && (
                <div
                  className="flex items-center gap-1.5 text-sm text-emerald-700"
                  data-ocid="draws.valid_count_success_state"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    <strong>{validCount}</strong> valid rows ready to import
                  </span>
                </div>
              )}
              {errorCount > 0 && (
                <div
                  className="flex items-center gap-1.5 text-sm text-red-600"
                  data-ocid="draws.error_count_error_state"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    <strong>{errorCount}</strong> rows with errors
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Validation error list */}
          {parseErrors.length > 0 && (
            <div
              className="rounded-md border border-red-200 bg-red-50 p-3 space-y-1.5"
              data-ocid="draws.validation_panel"
            >
              <p className="text-xs font-semibold text-red-700 mb-2">
                Validation Errors — fix these in your CSV and re-upload:
              </p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {parseErrors.map((err) => (
                  <div
                    key={`${err.rowIndex}-${err.reason}`}
                    className="flex items-center gap-2 text-xs text-red-700"
                  >
                    <Badge
                      variant="destructive"
                      className="text-[10px] px-1.5 py-0 shrink-0"
                    >
                      Row {err.rowIndex}
                    </Badge>
                    <span>{err.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSV Preview Table */}
      {parsedRows.length > 0 && (
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Preview — {parsedRows.length} rows
              </span>
              <Button
                type="button"
                onClick={handleImport}
                disabled={!canImport}
                className="gap-1.5"
                size="sm"
                data-ocid="draws.import_button"
              >
                {importDraw.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Importing…
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Import {parsedRows.length} matches
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 text-center">#</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead>Player 1</TableHead>
                    <TableHead>Player 2</TableHead>
                    <TableHead className="text-right">Est. (min)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedRows.map((row, idx) => (
                    <TableRow
                      key={`${row.category}-${row.round}-${row.player1}-${row.player2}`}
                      data-ocid={`draws.preview_row.${idx + 1}`}
                    >
                      <TableCell className="text-center text-muted-foreground text-xs">
                        {row.rawIndex}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {row.category}
                      </TableCell>
                      <TableCell className="text-sm">{row.round}</TableCell>
                      <TableCell className="text-sm">{row.player1}</TableCell>
                      <TableCell className="text-sm">{row.player2}</TableCell>
                      <TableCell className="text-right text-sm tabular-nums">
                        {row.estimatedMins}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import button (standalone when no preview yet but rows exist — duplicate for accessibility) */}
      {parsedRows.length > 0 && parseErrors.length === 0 && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleImport}
            disabled={!canImport}
            size="lg"
            className="gap-2"
            data-ocid="draws.import_primary_button"
          >
            {importDraw.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import {parsedRows.length} Matches
              </>
            )}
          </Button>
        </div>
      )}

      {/* Order of Play Suggestions */}
      <OrderOfPlayPanel />
    </div>
  );
}
