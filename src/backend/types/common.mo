module {
  public type Timestamp = Int; // nanoseconds since epoch (Time.now())
  public type CourtId = Nat;
  public type MatchId = Nat;
  public type PlayerId = Text; // player name as stable identifier
  public type CategoryId = Text; // e.g. "u10boys"

  public type Result<T> = { #ok : T; #err : Text };
};
