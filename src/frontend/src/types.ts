// CourtFlow AI — Shared TypeScript types
// Re-export everything from the generated backend bindings

export type {
  TournamentConfigView,
  CourtFlowData,
  CourtId,
  CourtFlowConfigView,
  MatchView,
  Result_1,
  MatchId,
  RestedEntry,
  UpdateTournamentConfigArgs,
  TournamentStats,
  Result,
  PlayerId,
  CourtFlowCourtView,
  QueueEntry,
  CourtFlowStats,
  WaitingEntry,
  PlayerView,
  WaitingWarning,
  WaitingTimeSummary,
  CategoryView,
  CategoryId,
  OrderOfPlayEntry,
  DrawRow,
  ImportResult,
  ImportError,
} from "./backend";

export {
  CategoryStatus,
  ConflictType,
  MatchStatus,
  PlayerStatus,
  Variant_panicMode_completed_setup_inProgress,
  WaitingWarningType,
} from "./backend";

// UI-friendly re-exports for convenience
export type {
  TournamentConfigView as TournamentConfig,
  CourtFlowCourtView as CourtView,
  CourtFlowStats as TournamentStatsView,
  CourtFlowConfigView as ConfigView,
} from "./backend";
