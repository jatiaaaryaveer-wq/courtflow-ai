import Common "common";

module {
  public type TournamentStatus = {
    #setup;
    #inProgress;
    #completed;
    #panicMode;
  };

  public type CategoryStatus = { #onTrack; #delayed; #urgent };

  public type Court = {
    id : Common.CourtId;
    name : Text;
    var currentMatchId : ?Common.MatchId;
    var isAvailable : Bool;
  };

  public type CourtView = {
    id : Common.CourtId;
    name : Text;
    currentMatchId : ?Common.MatchId;
    isAvailable : Bool;
  };

  public type Category = {
    id : Common.CategoryId;
    name : Text;
    var numPlayers : Nat;
    var avgDurationMinutes : Nat;
    var matchesCompleted : Nat;
    var matchesPending : Nat;
    var currentRound : Nat;
    var status : CategoryStatus;
  };

  public type CategoryView = {
    id : Common.CategoryId;
    name : Text;
    numPlayers : Nat;
    avgDurationMinutes : Nat;
    matchesCompleted : Nat;
    matchesPending : Nat;
    currentRound : Nat;
    status : CategoryStatus;
  };

  public type TournamentConfig = {
    var name : Text;
    var venue : Text;
    var date : Text;
    var startTime : Text;  // "10:30"
    var endTime : Text;    // "16:30"
    var courts : [Text];
    var matchFormat : Text;
    var avgMatchDurationMinutes : Nat;
    var minRestMinutes : Nat;
    var status : TournamentStatus;
    var panicModeActive : Bool;
    var panicSuggestions : [Text];
  };

  public type TournamentConfigView = {
    name : Text;
    venue : Text;
    date : Text;
    startTime : Text;
    endTime : Text;
    courts : [Text];
    matchFormat : Text;
    avgMatchDurationMinutes : Nat;
    minRestMinutes : Nat;
    status : TournamentStatus;
    panicModeActive : Bool;
    panicSuggestions : [Text];
  };

  public type TournamentStats = {
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

  public type UpdateTournamentConfigArgs = {
    name : Text;
    venue : Text;
    date : Text;
    startTime : Text;
    endTime : Text;
    courtNames : [Text];
    matchFormat : Text;
    avgMatchDurationMinutes : Nat;
    minRestMinutes : Nat;
  };
};
