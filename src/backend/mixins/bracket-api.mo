import List "mo:core/List";
import Common "../types/common";
import B "../types/bracket";
import T "../types/tournament";
import P "../types/player";
import BracketLib "../lib/bracket";
import TournamentLib "../lib/tournament";

mixin (
  matches : List.List<B.Match>,
  courts : List.List<T.Court>,
  players : List.List<P.Player>,
  categories : List.List<T.Category>,
  config : T.TournamentConfig,
  state : { var nextMatchId : Nat },
) {
  // Get all matches
  public query func listMatches() : async [B.MatchView] {
    let views = List.empty<B.MatchView>();
    for (m in matches.values()) {
      views.add(BracketLib.matchToView(m));
    };
    views.toArray();
  };

  // Get a single match by id
  public query func getMatch(matchId : Common.MatchId) : async ?B.MatchView {
    switch (matches.find(func(m : B.Match) : Bool { m.id == matchId })) {
      case (?m) ?(BracketLib.matchToView(m));
      case null null;
    };
  };

  // Get full court dashboard data
  public query func getCourtFlowData() : async B.CourtFlowData {
    var completed : Nat = 0;
    var pending : Nat = 0;
    for (m in matches.values()) {
      switch (m.status) {
        case (#completed) { completed += 1 };
        case (#notReady or #ready or #onCourt or #delayed or #bye) { pending += 1 };
      };
    };
    let stats = TournamentLib.computeStats(config, courts, completed, pending);
    let cfgStats : B.CourtFlowStats = {
      currentTime = stats.currentTime;
      tournamentEndTime = stats.tournamentEndTime;
      courtTimeRemainingMinutes = stats.courtTimeRemainingMinutes;
      estimatedFinishTime = stats.estimatedFinishTime;
      matchesPending = stats.matchesPending;
      matchesCompleted = stats.matchesCompleted;
      courtUtilisationPct = stats.courtUtilisationPct;
      isRunningLate = stats.isRunningLate;
      suggestions = stats.suggestions;
    };
    BracketLib.buildCourtFlowData(courts, matches, players, categories, config, cfgStats);
  };

  // Get ranked AI match queue
  public query func getMatchQueue() : async [B.QueueEntry] {
    BracketLib.buildQueue(matches, players, categories, config);
  };

  // Assign a ready match to a free court
  public func assignMatchToCourt(
    matchId : Common.MatchId,
    courtId : Common.CourtId,
  ) : async Common.Result<B.MatchView> {
    let matchOpt = matches.find(func(m : B.Match) : Bool { m.id == matchId });
    let courtOpt = courts.find(func(c : T.Court) : Bool { c.id == courtId });
    switch (matchOpt, courtOpt) {
      case (?m, ?c) {
        if (not c.isAvailable) {
          return #err("Court is not available");
        };
        if (m.status != #ready and m.status != #delayed) {
          return #err("Match is not in a ready state");
        };
        BracketLib.assignToCourt(m, c, players);
        #ok(BracketLib.matchToView(m));
      };
      case (null, _) #err("Match not found");
      case (_, null) #err("Court not found");
    };
  };

  // Start a match on a court
  public func startMatch(
    matchId : Common.MatchId,
    courtId : Common.CourtId,
  ) : async Common.Result<B.MatchView> {
    let matchOpt = matches.find(func(m : B.Match) : Bool { m.id == matchId });
    let courtOpt = courts.find(func(c : T.Court) : Bool { c.id == courtId });
    switch (matchOpt, courtOpt) {
      case (?m, ?c) {
        if (not c.isAvailable) {
          return #err("Court is not available");
        };
        if (m.status != #ready and m.status != #delayed) {
          return #err("Match is not ready to start");
        };
        BracketLib.assignToCourt(m, c, players);
        #ok(BracketLib.matchToView(m));
      };
      case (null, _) #err("Match not found");
      case (_, null) #err("Court not found");
    };
  };

  // Complete a match with winner
  public func completeMatch(
    matchId : Common.MatchId,
    winnerId : Common.PlayerId,
  ) : async Common.Result<B.MatchView> {
    let matchOpt = matches.find(func(m : B.Match) : Bool { m.id == matchId });
    switch (matchOpt) {
      case (?m) {
        if (m.status != #onCourt) {
          return #err("Match is not on court");
        };
        // Find winner name
        let winnerName = switch (players.find(func(p : P.Player) : Bool { p.id == winnerId })) {
          case (?p) p.name;
          case null winnerId;
        };
        // Find the court
        let courtOpt = switch (m.courtId) {
          case (?cid) courts.find(func(c : T.Court) : Bool { c.id == cid });
          case null null;
        };
        switch (courtOpt) {
          case (?court) {
            BracketLib.completeMatch(m, winnerId, winnerName, court, players, matches, config);
            TournamentLib.updateCategoryAfterMatch(categories, m.categoryId);
            TournamentLib.recalcCategoryStatus(categories, config);
          };
          case null {
            // Court not found but still complete
            m.status := #completed;
            m.winnerId := ?(winnerId);
            m.winnerName := ?(winnerName);
            BracketLib.unlockDependents(m.id, winnerId, winnerName, matches);
          };
        };
        #ok(BracketLib.matchToView(m));
      };
      case null #err("Match not found");
    };
  };

  // Free a court manually without completing its match
  public func freeCourtManually(courtId : Common.CourtId) : async Common.Result<B.CourtFlowCourtView> {
    let courtOpt = courts.find(func(c : T.Court) : Bool { c.id == courtId });
    switch (courtOpt) {
      case (?court) {
        // Move the match back to ready if onCourt
        switch (court.currentMatchId) {
          case (?mid) {
            switch (matches.find(func(m : B.Match) : Bool { m.id == mid })) {
              case (?m) {
                if (m.status == #onCourt) {
                  m.status := #ready;
                  m.courtId := null;
                  m.courtName := null;
                  m.startTime := null;
                  // Free players back to waiting
                  switch (m.player1Id) {
                    case (?pid) { for (p in players.values()) { if (p.id == pid) { p.status := #waiting; p.currentMatchId := null } } };
                    case null {};
                  };
                  switch (m.player2Id) {
                    case (?pid) { for (p in players.values()) { if (p.id == pid) { p.status := #waiting; p.currentMatchId := null } } };
                    case null {};
                  };
                };
              };
              case null {};
            };
          };
          case null {};
        };
        court.currentMatchId := null;
        court.isAvailable := true;
        let queue = BracketLib.buildQueue(matches, players, categories, config);
        let recommended : ?B.QueueEntry = if (queue.size() > 0) ?(queue[0]) else null;
        #ok({
          courtId = court.id;
          courtName = court.name;
          isAvailable = true;
          currentMatch = null;
          recommendedNext = recommended;
        });
      };
      case null #err("Court not found");
    };
  };

  // Delay a match
  public func delayMatch(matchId : Common.MatchId) : async Common.Result<B.MatchView> {
    let matchOpt = matches.find(func(m : B.Match) : Bool { m.id == matchId });
    switch (matchOpt) {
      case (?m) {
        if (m.status == #ready or m.status == #onCourt) {
          m.status := #delayed;
          #ok(BracketLib.matchToView(m));
        } else {
          #err("Match cannot be delayed in current state");
        };
      };
      case null #err("Match not found");
    };
  };

  // Reset a delayed/in-progress match back to Ready
  public func resetMatch(matchId : Common.MatchId) : async Common.Result<B.MatchView> {
    let matchOpt = matches.find(func(m : B.Match) : Bool { m.id == matchId });
    switch (matchOpt) {
      case (?m) {
        if (m.status == #delayed or m.status == #onCourt) {
          // If on court, free the court
          switch (m.courtId) {
            case (?cid) {
              switch (courts.find(func(c : T.Court) : Bool { c.id == cid })) {
                case (?court) {
                  court.currentMatchId := null;
                  court.isAvailable := true;
                };
                case null {};
              };
            };
            case null {};
          };
          m.status := #ready;
          m.courtId := null;
          m.courtName := null;
          m.startTime := null;
          #ok(BracketLib.matchToView(m));
        } else {
          #err("Match cannot be reset in current state");
        };
      };
      case null #err("Match not found");
    };
  };

  // Manual override: assign any ready match to any free court
  public func overrideMatch(
    matchId : Common.MatchId,
    courtId : Common.CourtId,
  ) : async Common.Result<B.MatchView> {
    let matchOpt = matches.find(func(m : B.Match) : Bool { m.id == matchId });
    let courtOpt = courts.find(func(c : T.Court) : Bool { c.id == courtId });
    switch (matchOpt, courtOpt) {
      case (?m, ?c) {
        if (not c.isAvailable) {
          return #err("Court is not available for override");
        };
        if (m.status != #ready and m.status != #delayed) {
          return #err("Match is not in a ready or delayed state");
        };
        BracketLib.assignToCourt(m, c, players);
        #ok(BracketLib.matchToView(m));
      };
      case (null, _) #err("Match not found");
      case (_, null) #err("Court not found");
    };
  };
};
