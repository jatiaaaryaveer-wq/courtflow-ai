import Common "common";
import Debug "mo:core/Debug";

module {
  // A single row from an uploaded draw sheet
  public type DrawRow = {
    categoryId : Common.CategoryId;
    round : Text;
    player1Name : Text;
    player2Name : Text;
    estimatedMinutes : Nat;
  };

  // Result of processing an imported draw
  public type ImportResult = {
    successCount : Nat;
    skippedCount : Nat;
    errors : [ImportError];
  };

  public type ImportError = {
    rowIndex : Nat;
    reason : Text;
  };

  // Ranked entry in the suggested order of play
  public type OrderOfPlayEntry = {
    categoryId : Common.CategoryId;
    categoryName : Text;
    rank : Nat;
    playerCount : Nat;
    totalMatches : Nat;
    avgMatchDuration : Nat;
    crossCategoryClashCount : Nat;
    estimatedTotalMinutes : Nat;
    cumulativeMinutesIfThisOrder : Nat;
    reason : Text;
  };
};
