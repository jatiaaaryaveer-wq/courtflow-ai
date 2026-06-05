import List "mo:core/List";
import T "types/tournament";
import B "types/bracket";
import P "types/player";
import TournamentLib "lib/tournament";
import BracketLib "lib/bracket";
import PlayerLib "lib/player";
import TournamentApi "mixins/tournament-api";
import PlayerApi "mixins/player-api";
import BracketApi "mixins/bracket-api";
import ImportApi "mixins/import-api";



actor {
  // ---- app state ----
  let config : T.TournamentConfig = TournamentLib.defaultConfig();
  let categories : List.List<T.Category> = TournamentLib.defaultCategories();
  let courts : List.List<T.Court> = TournamentLib.defaultCourts();
  let state = { var nextMatchId : Nat = 0 };
  let players : List.List<P.Player> = PlayerLib.samplePlayers();
  let matches : List.List<B.Match> = BracketLib.sampleMatches(state);

  // ---- mixin composition ----
  include TournamentApi(config, categories, courts, state);
  include PlayerApi(players);
  include BracketApi(matches, courts, players, categories, config, state);
  include ImportApi(matches, players, categories, state);
};
