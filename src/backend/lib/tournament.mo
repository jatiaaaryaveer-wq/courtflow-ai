import Debug "mo:core/Debug";
import List "mo:core/List";
import Common "../types/common";
import T "../types/tournament";
import Nat "mo:core/Nat";

module {
  // Build the default tournament configuration with sample values
  public func defaultConfig() : T.TournamentConfig {
    {
      var name = "AJ Tennis Summer Open";
      var venue = "Matunga Gymkhana";
      var date = "2026-05-28";
      var startTime = "10:30";
      var endTime = "16:30";
      var courts = ["Court 1", "Court 2", "Court 3", "Court 4"];
      var matchFormat = "First to 4 games, tiebreak at 3-3";
      var avgMatchDurationMinutes = 35;
      var minRestMinutes = 15;
      var status = #inProgress;
      var panicModeActive = false;
      var panicSuggestions = [];
    };
  };

  // Build the 6 default CourtFlow categories with sample data
  public func defaultCategories() : List.List<T.Category> {
    let cats = List.empty<T.Category>();
    cats.add({ id = "u10boys"; name = "U10 Boys"; var numPlayers = 8; var avgDurationMinutes = 25; var matchesCompleted = 2; var matchesPending = 5; var currentRound = 1; var status = (#onTrack : T.CategoryStatus) });
    cats.add({ id = "u12boys"; name = "U12 Boys"; var numPlayers = 8; var avgDurationMinutes = 30; var matchesCompleted = 1; var matchesPending = 6; var currentRound = 1; var status = (#delayed : T.CategoryStatus) });
    cats.add({ id = "u14boys"; name = "U14 Boys"; var numPlayers = 8; var avgDurationMinutes = 35; var matchesCompleted = 3; var matchesPending = 4; var currentRound = 1; var status = (#onTrack : T.CategoryStatus) });
    cats.add({ id = "opensingles"; name = "Open Singles"; var numPlayers = 8; var avgDurationMinutes = 45; var matchesCompleted = 2; var matchesPending = 5; var currentRound = 1; var status = (#urgent : T.CategoryStatus) });
    cats.add({ id = "juniordoubles"; name = "Junior Doubles"; var numPlayers = 8; var avgDurationMinutes = 50; var matchesCompleted = 1; var matchesPending = 2; var currentRound = 2; var status = (#onTrack : T.CategoryStatus) });
    cats.add({ id = "onepointslam"; name = "One Point Slam"; var numPlayers = 8; var avgDurationMinutes = 15; var matchesCompleted = 3; var matchesPending = 5; var currentRound = 1; var status = (#onTrack : T.CategoryStatus) });
    cats;
  };

  // Build the 4 default courts
  public func defaultCourts() : List.List<T.Court> {
    let courts = List.empty<T.Court>();
    courts.add({ id = 1; name = "Court 1"; var currentMatchId = ?(1); var isAvailable = false });
    courts.add({ id = 2; name = "Court 2"; var currentMatchId = ?(5); var isAvailable = false });
    courts.add({ id = 3; name = "Court 3"; var currentMatchId = ?(9); var isAvailable = false });
    courts.add({ id = 4; name = "Court 4"; var currentMatchId = (null : ?Common.MatchId); var isAvailable = true });
    courts;
  };

  // Convert mutable Court to shared CourtView
  public func courtToView(c : T.Court) : T.CourtView {
    { id = c.id; name = c.name; currentMatchId = c.currentMatchId; isAvailable = c.isAvailable };
  };

  // Convert mutable Category to shared CategoryView
  public func categoryToView(cat : T.Category) : T.CategoryView {
    { id = cat.id; name = cat.name; numPlayers = cat.numPlayers; avgDurationMinutes = cat.avgDurationMinutes; matchesCompleted = cat.matchesCompleted; matchesPending = cat.matchesPending; currentRound = cat.currentRound; status = cat.status };
  };

  // Convert mutable TournamentConfig to shared TournamentConfigView
  public func configToView(cfg : T.TournamentConfig) : T.TournamentConfigView {
    { name = cfg.name; venue = cfg.venue; date = cfg.date; startTime = cfg.startTime; endTime = cfg.endTime; courts = cfg.courts; matchFormat = cfg.matchFormat; avgMatchDurationMinutes = cfg.avgMatchDurationMinutes; minRestMinutes = cfg.minRestMinutes; status = cfg.status; panicModeActive = cfg.panicModeActive; panicSuggestions = cfg.panicSuggestions };
  };

  // Compute tournament statistics
  public func computeStats(
    cfg : T.TournamentConfig,
    courts : List.List<T.Court>,
    matchesCompleted : Nat,
    matchesPending : Nat,
  ) : T.TournamentStats {
    // Demo "current time" is 11:00 (30 mins into tournament)
    let currentHour = 11;
    let currentMin = 0;
    let endHour = 16;
    let endMin = 30;
    let courtTimeRemainingMinutes = ((endHour - currentHour) * 60 + endMin - currentMin) : Nat;
    let numCourts = courts.size();
    let occupiedCourts = courts.filter(func(c : T.Court) : Bool { not c.isAvailable }).size();
    let courtUtilisationPct = if (numCourts == 0) 0 else (occupiedCourts * 100) / numCourts;
    // Estimate finish: current + (pendingMatches * avgDuration / numCourts)
    let avgDur = cfg.avgMatchDurationMinutes;
    let minsToFinish = if (numCourts == 0) 0 else (matchesPending * avgDur) / numCourts;
    let estimatedFinishTotalMins = (currentHour * 60 + currentMin + minsToFinish) : Nat;
    let estHour = estimatedFinishTotalMins / 60;
    let estMin = estimatedFinishTotalMins % 60;
    let endTotalMins = (endHour * 60 + endMin) : Nat;
    let isRunningLate = estimatedFinishTotalMins > endTotalMins;
    let estH = estHour.toText();
    let estM = if (estMin < 10) "0" # estMin.toText() else estMin.toText();
    let suggestions : [Text] = if (isRunningLate) [
      "Use shorter match format for remaining matches",
      "Prioritise delayed categories: U12 Boys and Open Singles",
      "Move Junior Doubles to end of schedule",
      "Run finals on first available court immediately",
      "Reduce warm-up time to 2 minutes",
      "Switch One Point Slam to on-the-spot knockout format",
    ] else [];
    {
      currentTime = currentHour.toText() # ":" # (if (currentMin < 10) "0" # currentMin.toText() else currentMin.toText());
      tournamentEndTime = "16:30";
      courtTimeRemainingMinutes;
      estimatedFinishTime = estH # ":" # estM;
      matchesPending;
      matchesCompleted;
      courtUtilisationPct;
      isRunningLate;
      suggestions;
    };
  };

  // Activate panic mode: mark flag and populate emergency suggestions
  public func activatePanic(cfg : T.TournamentConfig) {
    cfg.panicModeActive := true;
    cfg.status := #panicMode;
    cfg.panicSuggestions := [
      "Shorten all remaining matches to first to 3 games",
      "Prioritise all finals and semi-finals immediately",
      "Pause One Point Slam category",
      "Move all doubles matches to end of schedule",
      "Use sudden-death deuce on all remaining matches",
      "Reduce warm-up time to 2 minutes per match",
    ];
  };

  // Deactivate panic mode
  public func deactivatePanic(cfg : T.TournamentConfig) {
    cfg.panicModeActive := false;
    cfg.status := #inProgress;
    cfg.panicSuggestions := [];
  };

  // Increment matchesCompleted / decrement matchesPending for a category
  public func updateCategoryAfterMatch(
    categories : List.List<T.Category>,
    categoryId : Common.CategoryId,
  ) {
    for (cat in categories.values()) {
      if (cat.id == categoryId) {
        if (cat.matchesPending > 0) { cat.matchesPending := cat.matchesPending - 1 };
        cat.matchesCompleted := cat.matchesCompleted + 1;
      };
    };
  };

  // Recompute onTrack / delayed / urgent for each category
  public func recalcCategoryStatus(
    categories : List.List<T.Category>,
    cfg : T.TournamentConfig,
  ) {
    ignore cfg;
    for (cat in categories.values()) {
      let pct : Nat = if (cat.matchesCompleted + cat.matchesPending == 0) 100
        else (cat.matchesCompleted * 100) / (cat.matchesCompleted + cat.matchesPending);
      cat.status := if (pct >= 60) #onTrack
        else if (pct >= 30) #delayed
        else #urgent;
    };
  };

  // Apply organiser's config update
  public func applyConfigUpdate(
    cfg : T.TournamentConfig,
    args : T.UpdateTournamentConfigArgs,
  ) {
    cfg.name := args.name;
    cfg.venue := args.venue;
    cfg.date := args.date;
    cfg.startTime := args.startTime;
    cfg.endTime := args.endTime;
    cfg.courts := args.courtNames;
    cfg.matchFormat := args.matchFormat;
    cfg.avgMatchDurationMinutes := args.avgMatchDurationMinutes;
    cfg.minRestMinutes := args.minRestMinutes;
  };
};
