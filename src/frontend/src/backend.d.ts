import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TournamentConfigView {
    startTime: string;
    status: TournamentStatus;
    panicModeActive: boolean;
    endTime: string;
    venue: string;
    date: string;
    panicSuggestions: Array<string>;
    name: string;
    matchFormat: string;
    avgMatchDurationMinutes: bigint;
    minRestMinutes: bigint;
    courts: Array<string>;
}
export type CourtId = bigint;
export interface CourtFlowConfigView {
    startTime: string;
    status: Variant_panicMode_completed_setup_inProgress;
    panicModeActive: boolean;
    endTime: string;
    venue: string;
    date: string;
    panicSuggestions: Array<string>;
    name: string;
    matchFormat: string;
    avgMatchDurationMinutes: bigint;
    minRestMinutes: bigint;
    courts: Array<string>;
}
export interface ImportResult {
    errors: Array<ImportError>;
    successCount: bigint;
    skippedCount: bigint;
}
export interface MatchView {
    id: MatchId;
    player1Id?: PlayerId;
    player2Id?: PlayerId;
    categoryId: CategoryId;
    startTime?: string;
    status: MatchStatus;
    categoryName: string;
    courtId?: CourtId;
    estimatedDurationMinutes: bigint;
    endTime?: string;
    winnerId?: PlayerId;
    player2Name: string;
    conflicts: Array<ConflictType>;
    roundName: string;
    winnerName?: string;
    priorityScore: bigint;
    scoreReason: string;
    dependsOnMatchIds: Array<MatchId>;
    player1Name: string;
    round: bigint;
    courtName?: string;
}
export type Result_1 = {
    __kind__: "ok";
    ok: CourtFlowCourtView;
} | {
    __kind__: "err";
    err: string;
};
export type MatchId = bigint;
export interface RestedEntry {
    lastMatchEndTime: string;
    restMinutesRemaining: bigint;
    playerId: PlayerId;
    playerName: string;
}
export interface UpdateTournamentConfigArgs {
    startTime: string;
    courtNames: Array<string>;
    endTime: string;
    venue: string;
    date: string;
    name: string;
    matchFormat: string;
    avgMatchDurationMinutes: bigint;
    minRestMinutes: bigint;
}
export type PlayerId = string;
export interface CourtFlowStats {
    isRunningLate: boolean;
    suggestions: Array<string>;
    estimatedFinishTime: string;
    matchesCompleted: bigint;
    currentTime: string;
    tournamentEndTime: string;
    courtTimeRemainingMinutes: bigint;
    courtUtilisationPct: bigint;
    matchesPending: bigint;
}
export interface DrawRow {
    categoryId: CategoryId;
    player2Name: string;
    player1Name: string;
    round: string;
    estimatedMinutes: bigint;
}
export interface PlayerView {
    id: PlayerId;
    categories: Array<CategoryId>;
    status: PlayerStatus;
    lastMatchEndTime?: string;
    seedNumber?: bigint;
    name: string;
    totalWaitingMinutes: bigint;
    currentMatchId?: MatchId;
    restRequiredUntil?: string;
    matchesPlayedToday: bigint;
}
export interface WaitingWarning {
    playerId: PlayerId;
    message: string;
    playerName: string;
    warningType: WaitingWarningType;
}
export interface WaitingTimeSummary {
    averageWaitMinutes: bigint;
    warnings: Array<WaitingWarning>;
    longestWaiting: Array<WaitingEntry>;
    recentlyPlayed: Array<RestedEntry>;
}
export interface CourtFlowData {
    matchQueue: Array<QueueEntry>;
    stats: CourtFlowStats;
    config: CourtFlowConfigView;
    courts: Array<CourtFlowCourtView>;
}
export interface OrderOfPlayEntry {
    categoryId: CategoryId;
    categoryName: string;
    crossCategoryClashCount: bigint;
    totalMatches: bigint;
    rank: bigint;
    playerCount: bigint;
    cumulativeMinutesIfThisOrder: bigint;
    avgMatchDuration: bigint;
    estimatedTotalMinutes: bigint;
    reason: string;
}
export interface ImportError {
    rowIndex: bigint;
    reason: string;
}
export interface TournamentStats {
    isRunningLate: boolean;
    suggestions: Array<string>;
    estimatedFinishTime: string;
    matchesCompleted: bigint;
    currentTime: string;
    tournamentEndTime: string;
    courtTimeRemainingMinutes: bigint;
    courtUtilisationPct: bigint;
    matchesPending: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: MatchView;
} | {
    __kind__: "err";
    err: string;
};
export interface CourtFlowCourtView {
    courtId: CourtId;
    currentMatch?: MatchView;
    isAvailable: boolean;
    recommendedNext?: QueueEntry;
    courtName: string;
}
export interface QueueEntry {
    match: MatchView;
    rank: bigint;
}
export type CategoryId = string;
export interface WaitingEntry {
    playerId: PlayerId;
    playerName: string;
    waitingMinutes: bigint;
}
export interface CategoryView {
    id: CategoryId;
    status: CategoryStatus;
    currentRound: bigint;
    name: string;
    matchesCompleted: bigint;
    avgDurationMinutes: bigint;
    numPlayers: bigint;
    matchesPending: bigint;
}
export enum CategoryStatus {
    delayed = "delayed",
    onTrack = "onTrack",
    urgent = "urgent"
}
export enum ConflictType {
    playerOnCourt = "playerOnCourt",
    notReady = "notReady",
    categoryClash = "categoryClash",
    backToBack = "backToBack",
    timeRisk = "timeRisk",
    restNeeded = "restNeeded"
}
export enum MatchStatus {
    bye = "bye",
    delayed = "delayed",
    completed = "completed",
    notReady = "notReady",
    onCourt = "onCourt",
    ready = "ready"
}
export enum PlayerStatus {
    completed = "completed",
    resting = "resting",
    playing = "playing",
    waiting = "waiting"
}
export enum Variant_panicMode_completed_setup_inProgress {
    panicMode = "panicMode",
    completed = "completed",
    setup = "setup",
    inProgress = "inProgress"
}
export enum WaitingWarningType {
    waitedTooLong = "waitedTooLong",
    multiCategoryRisk = "multiCategoryRisk",
    backToBackRisk = "backToBackRisk"
}
export interface backendInterface {
    activatePanicMode(): Promise<TournamentConfigView>;
    addPlayer(name: string, categories: Array<CategoryId>, seedNumber: bigint | null): Promise<PlayerView>;
    assignMatchToCourt(matchId: MatchId, courtId: CourtId): Promise<Result>;
    completeMatch(matchId: MatchId, winnerId: PlayerId): Promise<Result>;
    deactivatePanicMode(): Promise<TournamentConfigView>;
    delayMatch(matchId: MatchId): Promise<Result>;
    freeCourtManually(courtId: CourtId): Promise<Result_1>;
    getCourtFlowData(): Promise<CourtFlowData>;
    getMatch(matchId: MatchId): Promise<MatchView | null>;
    getMatchQueue(): Promise<Array<QueueEntry>>;
    getOrderOfPlaySuggestion(): Promise<Array<OrderOfPlayEntry>>;
    getPlayer(playerId: PlayerId): Promise<PlayerView | null>;
    getTournamentConfig(): Promise<TournamentConfigView>;
    getTournamentStats(): Promise<TournamentStats>;
    getWaitingTimeSummary(): Promise<WaitingTimeSummary>;
    importDraw(rows: Array<DrawRow>): Promise<ImportResult>;
    listCategories(): Promise<Array<CategoryView>>;
    listMatches(): Promise<Array<MatchView>>;
    listPlayers(): Promise<Array<PlayerView>>;
    overrideMatch(matchId: MatchId, courtId: CourtId): Promise<Result>;
    removePlayer(playerId: PlayerId): Promise<boolean>;
    resetMatch(matchId: MatchId): Promise<Result>;
    startMatch(matchId: MatchId, courtId: CourtId): Promise<Result>;
    updatePlayer(playerId: PlayerId, name: string, categories: Array<CategoryId>, seedNumber: bigint | null): Promise<PlayerView | null>;
    updateTournamentConfig(args: UpdateTournamentConfigArgs): Promise<TournamentConfigView>;
}
