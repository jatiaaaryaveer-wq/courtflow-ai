import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DrawRow, ImportResult } from "../types";
import type {
  CategoryView,
  CourtFlowData,
  CourtId,
  MatchId,
  MatchView,
  OrderOfPlayEntry,
  PlayerId,
  PlayerView,
  QueueEntry,
  Result,
  Result_1,
  TournamentConfigView,
  TournamentStats,
  UpdateTournamentConfigArgs,
  WaitingTimeSummary,
} from "../types";

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useCourtFlowData(options?: {
  refetchInterval?: number | false;
}) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CourtFlowData>({
    queryKey: ["courtFlowData"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getCourtFlowData();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: options?.refetchInterval ?? 5000,
  });
}

export function useMatchQueue(options?: { refetchInterval?: number | false }) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<QueueEntry[]>({
    queryKey: ["matchQueue"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getMatchQueue();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: options?.refetchInterval ?? 5000,
  });
}

export function useOrderOfPlaySuggestion() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<OrderOfPlayEntry[]>({
    queryKey: ["orderOfPlay"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getOrderOfPlaySuggestion();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCategories() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CategoryView[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlayers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PlayerView[]>({
    queryKey: ["players"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.listPlayers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTournamentConfig() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TournamentConfigView>({
    queryKey: ["tournamentConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getTournamentConfig();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTournamentStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TournamentStats>({
    queryKey: ["tournamentStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getTournamentStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWaitingTimeSummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<WaitingTimeSummary>({
    queryKey: ["waitingTimeSummary"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getWaitingTimeSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMatch(matchId: MatchId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MatchView | null>({
    queryKey: ["match", matchId],
    queryFn: async () => {
      if (!actor || matchId === undefined) return null;
      return actor.getMatch(matchId);
    },
    enabled: !!actor && !isFetching && matchId !== undefined,
  });
}

export function usePlayer(playerId: PlayerId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PlayerView | null>({
    queryKey: ["player", playerId],
    queryFn: async () => {
      if (!actor || !playerId) return null;
      return actor.getPlayer(playerId);
    },
    enabled: !!actor && !isFetching && !!playerId,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["courtFlowData"] });
  qc.invalidateQueries({ queryKey: ["matchQueue"] });
  qc.invalidateQueries({ queryKey: ["categories"] });
  qc.invalidateQueries({ queryKey: ["players"] });
  qc.invalidateQueries({ queryKey: ["tournamentConfig"] });
  qc.invalidateQueries({ queryKey: ["tournamentStats"] });
  qc.invalidateQueries({ queryKey: ["waitingTimeSummary"] });
}

export function useAssignMatchToCourt() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Result, Error, { matchId: MatchId; courtId: CourtId }>({
    mutationFn: async ({ matchId, courtId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.assignMatchToCourt(matchId, courtId);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useStartMatch() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Result, Error, { matchId: MatchId; courtId: CourtId }>({
    mutationFn: async ({ matchId, courtId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.startMatch(matchId, courtId);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useCompleteMatch() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Result, Error, { matchId: MatchId; winnerId: PlayerId }>({
    mutationFn: async ({ matchId, winnerId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.completeMatch(matchId, winnerId);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useFreeCourtManually() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Result_1, Error, CourtId>({
    mutationFn: async (courtId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.freeCourtManually(courtId);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useDelayMatch() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Result, Error, MatchId>({
    mutationFn: async (matchId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.delayMatch(matchId);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useResetMatch() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Result, Error, MatchId>({
    mutationFn: async (matchId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.resetMatch(matchId);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useOverrideMatch() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Result, Error, { matchId: MatchId; courtId: CourtId }>({
    mutationFn: async ({ matchId, courtId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.overrideMatch(matchId, courtId);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useUpdateTournamentConfig() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<TournamentConfigView, Error, UpdateTournamentConfigArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateTournamentConfig(args);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useActivatePanicMode() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<TournamentConfigView, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.activatePanicMode();
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useAllMatches() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MatchView[]>({
    queryKey: ["allMatches"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.listMatches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeactivatePanicMode() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<TournamentConfigView, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deactivatePanicMode();
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useImportDraw() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<ImportResult, Error, DrawRow[]>({
    mutationFn: async (rows) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.importDraw(rows);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useAddPlayer() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<
    PlayerView,
    Error,
    { name: string; categories: string[]; seedNumber: bigint | null }
  >({
    mutationFn: async ({ name, categories, seedNumber }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addPlayer(name, categories, seedNumber);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useUpdatePlayer() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<
    PlayerView | null,
    Error,
    {
      playerId: PlayerId;
      name: string;
      categories: string[];
      seedNumber: bigint | null;
    }
  >({
    mutationFn: async ({ playerId, name, categories, seedNumber }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePlayer(playerId, name, categories, seedNumber);
    },
    onSuccess: () => invalidateAll(qc),
  });
}

export function useRemovePlayer() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, PlayerId>({
    mutationFn: async (playerId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removePlayer(playerId);
    },
    onSuccess: () => invalidateAll(qc),
  });
}
