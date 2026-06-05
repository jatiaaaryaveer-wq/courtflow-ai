import Common "common";

module {
  public type PlayerStatus = { #waiting; #playing; #resting; #completed };

  public type Player = {
    id : Common.PlayerId;   // name-based
    name : Text;
    var categories : [Common.CategoryId];
    var seedNumber : ?Nat;
    var status : PlayerStatus;
    var lastMatchEndTime : ?Text;       // wall-clock "HH:MM"
    var totalWaitingMinutes : Nat;
    var matchesPlayedToday : Nat;
    var currentMatchId : ?Common.MatchId;
    var restRequiredUntil : ?Text;      // wall-clock "HH:MM"
  };

  public type PlayerView = {
    id : Common.PlayerId;
    name : Text;
    categories : [Common.CategoryId];
    seedNumber : ?Nat;
    status : PlayerStatus;
    lastMatchEndTime : ?Text;
    totalWaitingMinutes : Nat;
    matchesPlayedToday : Nat;
    currentMatchId : ?Common.MatchId;
    restRequiredUntil : ?Text;
  };

  public type WaitingTimeSummary = {
    longestWaiting : [WaitingEntry];
    averageWaitMinutes : Nat;
    recentlyPlayed : [RestedEntry];
    warnings : [WaitingWarning];
  };

  public type WaitingEntry = {
    playerId : Common.PlayerId;
    playerName : Text;
    waitingMinutes : Nat;
  };

  public type RestedEntry = {
    playerId : Common.PlayerId;
    playerName : Text;
    lastMatchEndTime : Text;
    restMinutesRemaining : Nat;
  };

  public type WaitingWarning = {
    playerId : Common.PlayerId;
    playerName : Text;
    warningType : WaitingWarningType;
    message : Text;
  };

  public type WaitingWarningType = {
    #waitedTooLong;
    #backToBackRisk;
    #multiCategoryRisk;
  };
};
