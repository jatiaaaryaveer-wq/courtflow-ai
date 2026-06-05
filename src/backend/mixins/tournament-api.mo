import List "mo:core/List";
import T "../types/tournament";
import TournamentLib "../lib/tournament";

mixin (
  config : T.TournamentConfig,
  categories : List.List<T.Category>,
  courts : List.List<T.Court>,
  state : { var nextMatchId : Nat },
) {
  // Get the current tournament configuration
  public query func getTournamentConfig() : async T.TournamentConfigView {
    TournamentLib.configToView(config);
  };

  // Update tournament configuration (organiser)
  public func updateTournamentConfig(
    args : T.UpdateTournamentConfigArgs
  ) : async T.TournamentConfigView {
    TournamentLib.applyConfigUpdate(config, args);
    TournamentLib.configToView(config);
  };

  // List all categories with current status
  public query func listCategories() : async [T.CategoryView] {
    let views = List.empty<T.CategoryView>();
    for (cat in categories.values()) {
      views.add(TournamentLib.categoryToView(cat));
    };
    views.toArray();
  };

  // Get computed tournament stats
  public query func getTournamentStats() : async T.TournamentStats {
    var completed : Nat = 0;
    var pending : Nat = 0;
    for (cat in categories.values()) {
      completed += cat.matchesCompleted;
      pending += cat.matchesPending;
    };
    TournamentLib.computeStats(config, courts, completed, pending);
  };

  // Activate panic mode
  public func activatePanicMode() : async T.TournamentConfigView {
    TournamentLib.activatePanic(config);
    TournamentLib.configToView(config);
  };

  // Deactivate panic mode
  public func deactivatePanicMode() : async T.TournamentConfigView {
    TournamentLib.deactivatePanic(config);
    TournamentLib.configToView(config);
  };
};
