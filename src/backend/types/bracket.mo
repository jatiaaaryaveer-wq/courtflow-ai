import Common "common";

module {
  public type MatchStatus = {
    #notReady;   // depends on earlier match
    #ready;      // both players known, waiting to be assigned
    #onCourt;    // being played
    #completed;  // finished with winner
    #delayed;    // organiser-delayed
    #bye;        // automatic walkover
  };

  public type ConflictType = {
    #playerOnCourt;
    #restNeeded;
    #categoryClash;
    #timeRisk;
    #notReady;
    #backToBack;
  };

  public type Match = {
    id : Common.MatchId;
    categoryId : Common.CategoryId;
    categoryName : Text;
    round : Nat;
    roundName : Text;
    var player1Id : ?Common.PlayerId;
    var player2Id : ?Common.PlayerId;
    player1Name : Text;
    player2Name : Text;
    estimatedDurationMinutes : Nat;
    var status : MatchStatus;
    var courtId : ?Common.CourtId;
    var courtName : ?Text;
    var startTime : ?Text;   // "HH:MM" wall-clock string
    var endTime : ?Text;
    var winnerId : ?Common.PlayerId;
    var winnerName : ?Text;
    var priorityScore : Nat;   // 0..100
    var scoreReason : Text;
    var conflicts : [ConflictType];
    dependsOnMatchIds : [Common.MatchId];
  };

  public type MatchView = {
    id : Common.MatchId;
    categoryId : Common.CategoryId;
    categoryName : Text;
    round : Nat;
    roundName : Text;
    player1Id : ?Common.PlayerId;
    player2Id : ?Common.PlayerId;
    player1Name : Text;
    player2Name : Text;
    estimatedDurationMinutes : Nat;
    status : MatchStatus;
    courtId : ?Common.CourtId;
    courtName : ?Text;
    startTime : ?Text;
    endTime : ?Text;
    winnerId : ?Common.PlayerId;
    winnerName : ?Text;
    priorityScore : Nat;
    scoreReason : Text;
    conflicts : [ConflictType];
    dependsOnMatchIds : [Common.MatchId];
  };

  public type QueueEntry = {
    rank : Nat;
    match : MatchView;
  };

  public type CourtFlowCourtView = {
    courtId : Common.CourtId;
    courtName : Text;
    isAvailable : Bool;
    currentMatch : ?MatchView;
    recommendedNext : ?QueueEntry;
  };

  public type CourtFlowData = {
    courts : [CourtFlowCourtView];
    matchQueue : [QueueEntry];
    config : CourtFlowConfigView;
    stats : CourtFlowStats;
  };

  // Flat shared views used inside CourtFlowData (avoids circular import)
  public type CourtFlowConfigView = {
    name : Text;
    venue : Text;
    date : Text;
    startTime : Text;
    endTime : Text;
    courts : [Text];
    matchFormat : Text;
    avgMatchDurationMinutes : Nat;
    minRestMinutes : Nat;
    status : { #setup; #inProgress; #completed; #panicMode };
    panicModeActive : Bool;
    panicSuggestions : [Text];
  };

  public type CourtFlowStats = {
    currentTime : Text;
    tournamentEndTime : Text;
    courtTimeRemainingMinutes : Nat;
    estimatedFinishTime : Text;
    matchesPending : Nat;
    matchesCompleted : Nat;
    courtUtilisationPct : Nat;
    isRunningLate : Bool;
    suggestions : [Text];
  };
};
