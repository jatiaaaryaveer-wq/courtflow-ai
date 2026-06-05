import List "mo:core/List";
import Common "../types/common";
import P "../types/player";
import PlayerLib "../lib/player";
import Nat "mo:core/Nat";

mixin (
  players : List.List<P.Player>,
) {
  // List all players
  public query func listPlayers() : async [P.PlayerView] {
    let views = List.empty<P.PlayerView>();
    for (p in players.values()) {
      views.add(PlayerLib.playerToView(p));
    };
    views.toArray();
  };

  // Get a specific player
  public query func getPlayer(playerId : Common.PlayerId) : async ?P.PlayerView {
    switch (PlayerLib.findPlayer(players, playerId)) {
      case (?p) ?(PlayerLib.playerToView(p));
      case null null;
    };
  };

  // Add a new player
  public func addPlayer(
    name : Text,
    categories : [Common.CategoryId],
    seedNumber : ?Nat,
  ) : async P.PlayerView {
    let newPlayer : P.Player = {
      id = name # "-" # players.size().toText();
      name;
      var categories;
      var seedNumber;
      var status = #waiting;
      var lastMatchEndTime = null;
      var totalWaitingMinutes = 0;
      var matchesPlayedToday = 0;
      var currentMatchId = null;
      var restRequiredUntil = null;
    };
    players.add(newPlayer);
    PlayerLib.playerToView(newPlayer);
  };

  // Update a player
  public func updatePlayer(
    playerId : Common.PlayerId,
    name : Text,
    categories : [Common.CategoryId],
    seedNumber : ?Nat,
  ) : async ?P.PlayerView {
    switch (PlayerLib.findPlayer(players, playerId)) {
      case (?p) {
        p.categories := categories;
        p.seedNumber := seedNumber;
        ignore name;
        ?(PlayerLib.playerToView(p));
      };
      case null null;
    };
  };

  // Remove a player
  public func removePlayer(playerId : Common.PlayerId) : async Bool {
    let sizeBefore = players.size();
    let kept = players.filter(func(p : P.Player) : Bool { p.id != playerId });
    if (kept.size() < sizeBefore) {
      players.truncate(0);
      for (p in kept.values()) { players.add(p) };
      true;
    } else {
      false;
    };
  };

  // Get waiting time summary
  public query func getWaitingTimeSummary() : async P.WaitingTimeSummary {
    PlayerLib.waitingTimeSummary(players, 15);
  };
};
