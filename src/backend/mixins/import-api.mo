import List "mo:core/List";
import Array "mo:core/Array";
import Common "../types/common";
import B "../types/bracket";
import T "../types/tournament";
import P "../types/player";
import I "../types/import";

mixin (
  matches : List.List<B.Match>,
  players : List.List<P.Player>,
  categories : List.List<T.Category>,
  state : { var nextMatchId : Nat },
) {
  // Import a draw: validate rows, detect duplicates, create or update matches.
  public func importDraw(rows : [I.DrawRow]) : async I.ImportResult {
    var successCount : Nat = 0;
    var errors : List.List<I.ImportError> = List.empty<I.ImportError>();

    var rowIndex : Nat = 0;
    for (row in rows.vals()) {
      let catFound = categories.find(func(c : T.Category) : Bool {
        c.id == row.categoryId
      });
      switch (catFound) {
        case null {
          errors.add({ rowIndex; reason = "Category not found: " # row.categoryId });
          rowIndex += 1;
        };
        case (?_cat) {
          let p1Found = players.find(func(p : P.Player) : Bool {
            p.name == row.player1Name
          });
          let p2Found = players.find(func(p : P.Player) : Bool {
            p.name == row.player2Name
          });
          let p1Valid = switch (p1Found) { case (?_) true; case null false };
          let p2Valid = switch (p2Found) { case (?_) true; case null false };
          if (not p1Valid) {
            errors.add({ rowIndex; reason = "Player not found: " # row.player1Name });
            rowIndex += 1;
          } else if (not p2Valid) {
            errors.add({ rowIndex; reason = "Player not found: " # row.player2Name });
            rowIndex += 1;
          } else {
            let roundNat : Nat = switch (textToNat(row.round)) {
              case (?n) n;
              case null 0;
            };
            let isDuplicate = matches.find(func(m : B.Match) : Bool {
              m.categoryId == row.categoryId and
              m.round == roundNat and
              m.player1Name == row.player1Name and
              m.player2Name == row.player2Name
            });
            switch (isDuplicate) {
              case (?_) {
                errors.add({ rowIndex; reason = "Duplicate match" });
                rowIndex += 1;
              };
              case null {
                let newId = matches.size() + rowIndex + 1;
                let newMatch : B.Match = {
                  id = newId;
                  categoryId = row.categoryId;
                  categoryName = switch (catFound) { case (?c) c.name; case null row.categoryId };
                  round = roundNat;
                  roundName = "Round " # row.round;
                  var player1Id = switch (p1Found) { case (?p) ?p.id; case null null };
                  var player2Id = switch (p2Found) { case (?p) ?p.id; case null null };
                  player1Name = row.player1Name;
                  player2Name = row.player2Name;
                  estimatedDurationMinutes = row.estimatedMinutes;
                  var status = #ready;
                  var courtId = null;
                  var courtName = null;
                  var startTime = null;
                  var endTime = null;
                  var winnerId = null;
                  var winnerName = null;
                  var priorityScore = 0;
                  var scoreReason = "";
                  var conflicts = [];
                  dependsOnMatchIds = [];
                };
                matches.add(newMatch);
                switch (catFound) {
                  case (?cat) { cat.matchesPending += 1 };
                  case null {};
                };
                successCount += 1;
                rowIndex += 1;
              };
            };
          };
        };
      };
    };

    let errorsArray = errors.toArray();
    {
      successCount;
      skippedCount = errorsArray.size();
      errors = errorsArray;
    };
  };

  // Return a ranked suggestion for the order of play across all categories.
  public query func getOrderOfPlaySuggestion() : async [I.OrderOfPlayEntry] {
    var scored : List.List<(Nat, T.Category, Nat, Nat, Nat, Nat)> = List.empty();

    for (cat in categories.values()) {
      let catPlayerCount = cat.numPlayers;
      let catMatchCount = cat.matchesPending + cat.matchesCompleted;
      let pendingMatches = cat.matchesPending;
      var clashCount : Nat = 0;
      for (player in players.values()) {
        if (arrayContains(player.categories, cat.id)) {
          var inOtherCat = false;
          for (otherCatId in player.categories.vals()) {
            if (otherCatId != cat.id) { inOtherCat := true };
          };
          if (inOtherCat) { clashCount += 1 };
        };
      };
      let baseScore : Int = catPlayerCount * 3;
      let matchBonus : Int = catMatchCount * 2;
      let durationPenalty : Int = cat.avgDurationMinutes / 10;
      let clashPenalty : Int = clashCount * 5;
      let rawScore : Int = baseScore + matchBonus - durationPenalty - clashPenalty;
      let score : Nat = if (rawScore > 0) rawScore.toNat() else 0;
      let estimatedTotalMinutes = pendingMatches * cat.avgDurationMinutes;
      scored.add((score, cat, pendingMatches, clashCount, estimatedTotalMinutes, catPlayerCount));
    };

    let sorted = sortDescByScore(scored.toArray());
    var result : List.List<I.OrderOfPlayEntry> = List.empty();
    var rank : Nat = 1;
    var cumulative : Nat = 0;

    for (entry in sorted.values()) {
      let (_score, cat, pendingMatches, clashCount, estMinutes, pCount) = entry;
      cumulative += estMinutes;
      result.add({
        categoryId = cat.id;
        categoryName = cat.name;
        rank;
        playerCount = pCount;
        totalMatches = pendingMatches + cat.matchesCompleted;
        avgMatchDuration = cat.avgDurationMinutes;
        crossCategoryClashCount = clashCount;
        estimatedTotalMinutes = estMinutes;
        cumulativeMinutesIfThisOrder = cumulative;
        reason = buildReason(rank, pCount, pendingMatches, cat.avgDurationMinutes, clashCount);
      });
      rank += 1;
    };

    result.toArray();
  };
  private func textToNat(t : Text) : ?Nat {
    if (t.size() == 0) return null;
    var n : Nat = 0;
    for (c in t.chars()) {
      let digit = switch (c) {
        case '0' 0; case '1' 1; case '2' 2; case '3' 3;
        case '4' 4; case '5' 5; case '6' 6; case '7' 7;
        case '8' 8; case '9' 9;
        case _ return null;
      };
      n := n * 10 + digit;
    };
    ?n;
  };

  private func arrayContains(arr : [Common.CategoryId], target : Common.CategoryId) : Bool {
    for (item in arr.vals()) {
      if (item == target) return true;
    };
    false;
  };

  private func sortDescByScore(
    arr : [(Nat, T.Category, Nat, Nat, Nat, Nat)]
  ) : [(Nat, T.Category, Nat, Nat, Nat, Nat)] {
    let n = arr.size();
    if (n <= 1) return arr;
    let buf = arr.toVarArray<(Nat, T.Category, Nat, Nat, Nat, Nat)>();
    var j = 1;
    while (j < n) {
      let key = buf[j];
      let (keyScore, _, _, _, _, _) = key;
      var k = j;
      var stop = false;
      while (k > 0 and not stop) {
        let prev = if (k > 0) k - 1 else 0;
        let (prevScore, _, _, _, _, _) = buf[prev];
        if (prevScore < keyScore) {
          buf[k] := buf[prev];
          k := prev;
        } else {
          stop := true;
        };
      };
      buf[k] := key;
      j += 1;
    };
    Array.tabulate<(Nat, T.Category, Nat, Nat, Nat, Nat)>(n, func i = buf[i]);
  };

  private func buildReason(rank : Nat, playerCount : Nat, matchCount : Nat, avgDuration : Nat, clashCount : Nat) : Text {
    let prefix = if (rank == 1) "Schedule first" else if (rank == 2) "Schedule second" else "Schedule " # debug_show(rank) # "th";
    prefix # ": " # debug_show(playerCount) # " players, " # debug_show(matchCount) # " matches, " # debug_show(avgDuration) # " min avg duration, " # debug_show(clashCount) # " cross-category players";
  };
};
