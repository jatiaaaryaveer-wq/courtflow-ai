import Debug "mo:core/Debug";
import List "mo:core/List";
import Common "../types/common";
import P "../types/player";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Char "mo:core/Char";
import Nat32 "mo:core/Nat32";

module {
  // Parse "HH:MM" into total minutes
  func parseTimeMins(t : Text) : Nat {
    var h : Nat = 0;
    var m : Nat = 0;
    var i = 0;
    for (c in t.chars()) {
      if (c == ':') { i := 1 }
      else {
        let cv = c.toNat32().toNat();
        let d : Nat = if (cv >= 48) (cv - 48 : Nat) else 0;
        if (i == 0) { h := h * 10 + d }
        else { m := m * 10 + d };
      };
    };
    h * 60 + m;
  };

  // Add N minutes to "HH:MM" string
  func addMinutesToTime(t : Text, mins : Nat) : Text {
    let base = parseTimeMins(t);
    let total = base + mins;
    let h = total / 60;
    let m = total % 60;
    let hStr = h.toText();
    let mStr = if (m < 10) "0" # m.toText() else m.toText();
    hStr # ":" # mStr;
  };

  // Seed a sample roster of 40-60 players, some in multiple categories
  public func samplePlayers() : List.List<P.Player> {
    let ps = List.empty<P.Player>();
    // U10 Boys players
    ps.add({ id = "aarav-shah"; name = "Aarav Shah"; var categories = ["u10boys", "onepointslam"]; var seedNumber = ?(1); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 45; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "arjun-mehta"; name = "Arjun Mehta"; var categories = ["u10boys"]; var seedNumber = ?(2); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 30; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "dev-patel"; name = "Dev Patel"; var categories = ["u10boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 20; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "krish-iyer"; name = "Krish Iyer"; var categories = ["u10boys"]; var seedNumber = (null : ?Nat); var status = (#resting : P.PlayerStatus); var lastMatchEndTime = ?("10:55"); var totalWaitingMinutes = 10; var matchesPlayedToday = 1; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = ?("11:10") });
    ps.add({ id = "rohan-kumar"; name = "Rohan Kumar"; var categories = ["u10boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 55; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "siddharth-nair"; name = "Siddharth Nair"; var categories = ["u10boys"]; var seedNumber = (null : ?Nat); var status = (#playing : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 15; var matchesPlayedToday = 1; var currentMatchId = ?(1); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "vivaan-joshi"; name = "Vivaan Joshi"; var categories = ["u10boys"]; var seedNumber = (null : ?Nat); var status = (#playing : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 5; var matchesPlayedToday = 1; var currentMatchId = ?(1); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "rehan-khan"; name = "Rehan Khan"; var categories = ["u10boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 25; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    // U12 Boys players
    ps.add({ id = "rishon-gupta"; name = "Rishon Gupta"; var categories = ["u12boys"]; var seedNumber = ?(1); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 40; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "kabir-sharma"; name = "Kabir Sharma"; var categories = ["u12boys", "onepointslam"]; var seedNumber = ?(2); var status = (#playing : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 8; var matchesPlayedToday = 1; var currentMatchId = ?(5); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "aryan-joshi"; name = "Aryan Joshi"; var categories = ["u12boys"]; var seedNumber = (null : ?Nat); var status = (#playing : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 12; var matchesPlayedToday = 1; var currentMatchId = ?(5); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "neil-bansal"; name = "Neil Bansal"; var categories = ["u12boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 35; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "ishaan-reddy"; name = "Ishaan Reddy"; var categories = ["u12boys"]; var seedNumber = (null : ?Nat); var status = (#resting : P.PlayerStatus); var lastMatchEndTime = ?("10:50"); var totalWaitingMinutes = 18; var matchesPlayedToday = 1; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = ?("11:05") });
    ps.add({ id = "parth-desai"; name = "Parth Desai"; var categories = ["u12boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 28; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "advait-singh"; name = "Advait Singh"; var categories = ["u12boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 42; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "yash-malhotra"; name = "Yash Malhotra"; var categories = ["u12boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 22; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    // U14 Boys players
    ps.add({ id = "aditya-verma"; name = "Aditya Verma"; var categories = ["u14boys", "opensingles"]; var seedNumber = ?(1); var status = (#playing : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 5; var matchesPlayedToday = 1; var currentMatchId = ?(9); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "vivek-rao"; name = "Vivek Rao"; var categories = ["u14boys"]; var seedNumber = ?(2); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 38; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "tanmay-singh"; name = "Tanmay Singh"; var categories = ["u14boys"]; var seedNumber = (null : ?Nat); var status = (#playing : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 7; var matchesPlayedToday = 1; var currentMatchId = ?(9); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "raj-patel"; name = "Raj Patel"; var categories = ["u14boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 32; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "nikhil-choudhary"; name = "Nikhil Choudhary"; var categories = ["u14boys"]; var seedNumber = (null : ?Nat); var status = (#resting : P.PlayerStatus); var lastMatchEndTime = ?("10:45"); var totalWaitingMinutes = 20; var matchesPlayedToday = 1; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = ?("11:00") });
    ps.add({ id = "dhruv-agarwal"; name = "Dhruv Agarwal"; var categories = ["u14boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 48; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "arpit-saxena"; name = "Arpit Saxena"; var categories = ["u14boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 16; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "manav-tiwari"; name = "Manav Tiwari"; var categories = ["u14boys"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 26; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    // Open Singles players
    ps.add({ id = "karan-kapoor"; name = "Karan Kapoor"; var categories = ["opensingles"]; var seedNumber = ?(1); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 52; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "rahul-deshpande"; name = "Rahul Deshpande"; var categories = ["opensingles"]; var seedNumber = ?(2); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 44; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "akash-nair"; name = "Akash Nair"; var categories = ["opensingles"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 36; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "varun-mehta"; name = "Varun Mehta"; var categories = ["opensingles"]; var seedNumber = (null : ?Nat); var status = (#resting : P.PlayerStatus); var lastMatchEndTime = ?("10:40"); var totalWaitingMinutes = 14; var matchesPlayedToday = 1; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = ?("10:55") });
    ps.add({ id = "sanjay-iyer"; name = "Sanjay Iyer"; var categories = ["opensingles"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 60; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "rohit-bose"; name = "Rohit Bose"; var categories = ["opensingles"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 28; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "suresh-pillai"; name = "Suresh Pillai"; var categories = ["opensingles"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 33; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "anand-krishna"; name = "Anand Krishna"; var categories = ["opensingles"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 19; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    // Junior Doubles players
    ps.add({ id = "priya-sharma"; name = "Priya Sharma"; var categories = ["juniordoubles", "onepointslam"]; var seedNumber = ?(1); var status = (#playing : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 6; var matchesPlayedToday = 1; var currentMatchId = ?(3); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "ananya-patel"; name = "Ananya Patel"; var categories = ["juniordoubles"]; var seedNumber = (null : ?Nat); var status = (#playing : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 9; var matchesPlayedToday = 1; var currentMatchId = ?(3); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "meera-iyer"; name = "Meera Iyer"; var categories = ["juniordoubles"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 41; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "kavya-gupta"; name = "Kavya Gupta"; var categories = ["juniordoubles"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 31; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "shreya-mishra"; name = "Shreya Mishra"; var categories = ["juniordoubles"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 23; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "naina-kapoor"; name = "Naina Kapoor"; var categories = ["juniordoubles"]; var seedNumber = (null : ?Nat); var status = (#resting : P.PlayerStatus); var lastMatchEndTime = ?("10:50"); var totalWaitingMinutes = 11; var matchesPlayedToday = 1; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = ?("11:05") });
    ps.add({ id = "tanvi-desai"; name = "Tanvi Desai"; var categories = ["juniordoubles"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 37; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "riya-verma"; name = "Riya Verma"; var categories = ["juniordoubles"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 29; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    // One Point Slam unique players
    ps.add({ id = "sameer-bajaj"; name = "Sameer Bajaj"; var categories = ["onepointslam"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 47; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "kunal-chopra"; name = "Kunal Chopra"; var categories = ["onepointslam"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 17; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "harsh-trivedi"; name = "Harsh Trivedi"; var categories = ["onepointslam"]; var seedNumber = (null : ?Nat); var status = (#resting : P.PlayerStatus); var lastMatchEndTime = ?("10:48"); var totalWaitingMinutes = 13; var matchesPlayedToday = 1; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = ?("11:03") });
    ps.add({ id = "gaurav-pandey"; name = "Gaurav Pandey"; var categories = ["onepointslam"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 39; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "rohit-srivastava"; name = "Rohit Srivastava"; var categories = ["onepointslam"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 24; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps.add({ id = "amit-chandra"; name = "Amit Chandra"; var categories = ["onepointslam"]; var seedNumber = (null : ?Nat); var status = (#waiting : P.PlayerStatus); var lastMatchEndTime = (null : ?Text); var totalWaitingMinutes = 43; var matchesPlayedToday = 0; var currentMatchId = (null : ?Common.MatchId); var restRequiredUntil = (null : ?Text) });
    ps;
  };

  // Convert mutable Player to shared PlayerView
  public func playerToView(p : P.Player) : P.PlayerView {
    { id = p.id; name = p.name; categories = p.categories; seedNumber = p.seedNumber; status = p.status; lastMatchEndTime = p.lastMatchEndTime; totalWaitingMinutes = p.totalWaitingMinutes; matchesPlayedToday = p.matchesPlayedToday; currentMatchId = p.currentMatchId; restRequiredUntil = p.restRequiredUntil };
  };

  // Look up a player by id; return null if not found
  public func findPlayer(
    players : List.List<P.Player>,
    playerId : Common.PlayerId,
  ) : ?P.Player {
    players.find(func(p : P.Player) : Bool { p.id == playerId });
  };

  // Mark player as currently playing a match
  public func markPlaying(
    players : List.List<P.Player>,
    playerId : Common.PlayerId,
    matchId : Common.MatchId,
  ) {
    for (p in players.values()) {
      if (p.id == playerId) {
        p.status := #playing;
        p.currentMatchId := ?(matchId);
        p.matchesPlayedToday := p.matchesPlayedToday + 1;
      };
    };
  };

  // Mark player as resting after a match with required rest until a calculated time
  public func markResting(
    players : List.List<P.Player>,
    playerId : Common.PlayerId,
    endTime : Text,
    minRestMinutes : Nat,
  ) {
    for (p in players.values()) {
      if (p.id == playerId) {
        p.status := #resting;
        p.currentMatchId := null;
        p.lastMatchEndTime := ?(endTime);
        // Parse HH:MM and add minRestMinutes
        let restUntil = addMinutesToTime(endTime, minRestMinutes);
        p.restRequiredUntil := ?(restUntil);
      };
    };
  };

  // Mark player as waiting (available, no constraint)
  public func markWaiting(
    players : List.List<P.Player>,
    playerId : Common.PlayerId,
  ) {
    for (p in players.values()) {
      if (p.id == playerId) {
        p.status := #waiting;
        p.currentMatchId := null;
        p.restRequiredUntil := null;
      };
    };
  };

  // Check whether a player can be scheduled (not playing, rest period satisfied)
  public func isAvailable(
    player : P.Player,
    minRestMinutes : Nat,
  ) : Bool {
    ignore minRestMinutes;
    switch (player.status) {
      case (#playing) false;
      case (#resting) {
        // Check if rest time has elapsed (demo: compare with 11:00)
        switch (player.restRequiredUntil) {
          case null true;
          case (?restUntil) {
            // Compare restUntil vs current demo time 11:00
            let currentMins = 11 * 60 + 0;
            let restMins = parseTimeMins(restUntil);
            currentMins >= restMins;
          };
        };
      };
      case (#waiting) true;
      case (#completed) false;
    };
  };

  // Build waiting time summary: longest waiting, avg, recently played, warnings
  public func waitingTimeSummary(
    players : List.List<P.Player>,
    minRestMinutes : Nat,
  ) : P.WaitingTimeSummary {
    ignore minRestMinutes;
    var totalWait : Nat = 0;
    var waitingCount : Nat = 0;
    let warnings = List.empty<P.WaitingWarning>();
    let longestWaiting = List.empty<P.WaitingEntry>();
    let recentlyPlayed = List.empty<P.RestedEntry>();

    for (p in players.values()) {
      switch (p.status) {
        case (#waiting) {
          totalWait := totalWait + p.totalWaitingMinutes;
          waitingCount := waitingCount + 1;
          longestWaiting.add({ playerId = p.id; playerName = p.name; waitingMinutes = p.totalWaitingMinutes });
          if (p.totalWaitingMinutes > 45) {
            warnings.add({ playerId = p.id; playerName = p.name; warningType = #waitedTooLong; message = p.name # " has been waiting " # p.totalWaitingMinutes.toText() # " minutes" });
          };
          if (p.categories.size() > 1) {
            warnings.add({ playerId = p.id; playerName = p.name; warningType = #multiCategoryRisk; message = p.name # " is entered in multiple categories" });
          };
        };
        case (#resting) {
          switch (p.lastMatchEndTime) {
            case (?endTime) {
              let endMins = parseTimeMins(endTime);
              let restUntilMins = endMins + minRestMinutes;
              let currentMins = 11 * 60 + 0;
              let remaining : Nat = if (restUntilMins > currentMins) restUntilMins - currentMins else 0;
              recentlyPlayed.add({ playerId = p.id; playerName = p.name; lastMatchEndTime = endTime; restMinutesRemaining = remaining });
              if (remaining == 0) {
                warnings.add({ playerId = p.id; playerName = p.name; warningType = #backToBackRisk; message = p.name # " is available but just finished — risk of back-to-back" });
              };
            };
            case null {};
          };
        };
        case _ {};
      };
    };

    let avgWait : Nat = if (waitingCount == 0) 0 else totalWait / waitingCount;

    // Sort longest waiting descending (simple insertion sort on small list)
    let arr = longestWaiting.toArray();
    let sorted = arr.sort(func(a, b) {
      if (a.waitingMinutes > b.waitingMinutes) #less
      else if (a.waitingMinutes < b.waitingMinutes) #greater
      else #equal
    });

    {
      longestWaiting = sorted;
      averageWaitMinutes = avgWait;
      recentlyPlayed = recentlyPlayed.toArray();
      warnings = warnings.toArray();
    };
  };
};
