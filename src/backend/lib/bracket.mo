import List "mo:core/List";
import Common "../types/common";
import B "../types/bracket";
import T "../types/tournament";
import P "../types/player";
import Int "mo:core/Int";

module {
  // Seed the bracket with sample matches for all 6 categories
  public func sampleMatches(
    state : { var nextMatchId : Nat }
  ) : List.List<B.Match> {
    ignore state;
    let ms = List.empty<B.Match>();
    // U10 Boys QF (4 matches, IDs 1-4; 2 completed, 2 ready)
    ms.add({ id = 1; categoryId = "u10boys"; categoryName = "U10 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("siddharth-nair"); var player2Id = ?("vivaan-joshi"); player1Name = "Siddharth Nair"; player2Name = "Vivaan Joshi"; estimatedDurationMinutes = 25; var status : B.MatchStatus = #onCourt; var courtId = ?(1 : Common.CourtId); var courtName = ?("Court 1"); var startTime = ?("10:40"); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 2; categoryId = "u10boys"; categoryName = "U10 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("aarav-shah"); var player2Id = ?("arjun-mehta"); player1Name = "Aarav Shah"; player2Name = "Arjun Mehta"; estimatedDurationMinutes = 25; var status : B.MatchStatus = #completed; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = ?("10:30"); var endTime = ?("10:55"); var winnerId = ?("aarav-shah"); var winnerName = ?("Aarav Shah"); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 3; categoryId = "u10boys"; categoryName = "U10 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("rohan-kumar"); var player2Id = ?("dev-patel"); player1Name = "Rohan Kumar"; player2Name = "Dev Patel"; estimatedDurationMinutes = 25; var status : B.MatchStatus = #ready; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 4; categoryId = "u10boys"; categoryName = "U10 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("krish-iyer"); var player2Id = ?("rehan-khan"); player1Name = "Krish Iyer"; player2Name = "Rehan Khan"; estimatedDurationMinutes = 25; var status : B.MatchStatus = #completed; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = ?("10:30"); var endTime = ?("10:53"); var winnerId = ?("krish-iyer"); var winnerName = ?("Krish Iyer"); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    // U10 Boys SF (IDs 101-102, not ready until QFs done)
    ms.add({ id = 101; categoryId = "u10boys"; categoryName = "U10 Boys"; round = 2; roundName = "Semi Final"; var player1Id = (null : ?Common.PlayerId); var player2Id = (null : ?Common.PlayerId); player1Name = "TBD"; player2Name = "TBD"; estimatedDurationMinutes = 25; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([1, 2] : [Common.MatchId]) });
    ms.add({ id = 102; categoryId = "u10boys"; categoryName = "U10 Boys"; round = 2; roundName = "Semi Final"; var player1Id = (null : ?Common.PlayerId); var player2Id = (null : ?Common.PlayerId); player1Name = "TBD"; player2Name = "TBD"; estimatedDurationMinutes = 25; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([3, 4] : [Common.MatchId]) });
    // U10 Boys Final (ID 201)
    ms.add({ id = 201; categoryId = "u10boys"; categoryName = "U10 Boys"; round = 3; roundName = "Final"; var player1Id = (null : ?Common.PlayerId); var player2Id = (null : ?Common.PlayerId); player1Name = "TBD"; player2Name = "TBD"; estimatedDurationMinutes = 30; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([101, 102] : [Common.MatchId]) });
    // U12 Boys QF (IDs 5-8; 1 onCourt, 2 ready, 1 completed)
    ms.add({ id = 5; categoryId = "u12boys"; categoryName = "U12 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("kabir-sharma"); var player2Id = ?("aryan-joshi"); player1Name = "Kabir Sharma"; player2Name = "Aryan Joshi"; estimatedDurationMinutes = 30; var status : B.MatchStatus = #onCourt; var courtId = ?(2 : Common.CourtId); var courtName = ?("Court 2"); var startTime = ?("10:35"); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 6; categoryId = "u12boys"; categoryName = "U12 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("rishon-gupta"); var player2Id = ?("neil-bansal"); player1Name = "Rishon Gupta"; player2Name = "Neil Bansal"; estimatedDurationMinutes = 30; var status : B.MatchStatus = #ready; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 7; categoryId = "u12boys"; categoryName = "U12 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("ishaan-reddy"); var player2Id = ?("parth-desai"); player1Name = "Ishaan Reddy"; player2Name = "Parth Desai"; estimatedDurationMinutes = 30; var status : B.MatchStatus = #ready; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 8; categoryId = "u12boys"; categoryName = "U12 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("advait-singh"); var player2Id = ?("yash-malhotra"); player1Name = "Advait Singh"; player2Name = "Yash Malhotra"; estimatedDurationMinutes = 30; var status : B.MatchStatus = #completed; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = ?("10:30"); var endTime = ?("10:58"); var winnerId = ?("advait-singh"); var winnerName = ?("Advait Singh"); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 103; categoryId = "u12boys"; categoryName = "U12 Boys"; round = 2; roundName = "Semi Final"; var player1Id = (null : ?Common.PlayerId); var player2Id = (null : ?Common.PlayerId); player1Name = "TBD"; player2Name = "TBD"; estimatedDurationMinutes = 30; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([5, 6] : [Common.MatchId]) });
    ms.add({ id = 104; categoryId = "u12boys"; categoryName = "U12 Boys"; round = 2; roundName = "Semi Final"; var player1Id = ?("advait-singh"); var player2Id = (null : ?Common.PlayerId); player1Name = "Advait Singh"; player2Name = "TBD"; estimatedDurationMinutes = 30; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([7, 8] : [Common.MatchId]) });
    ms.add({ id = 202; categoryId = "u12boys"; categoryName = "U12 Boys"; round = 3; roundName = "Final"; var player1Id = (null : ?Common.PlayerId); var player2Id = (null : ?Common.PlayerId); player1Name = "TBD"; player2Name = "TBD"; estimatedDurationMinutes = 35; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([103, 104] : [Common.MatchId]) });
    // U14 Boys QF (IDs 9-12; 2 completed, 1 onCourt, 1 ready)
    ms.add({ id = 9; categoryId = "u14boys"; categoryName = "U14 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("aditya-verma"); var player2Id = ?("tanmay-singh"); player1Name = "Aditya Verma"; player2Name = "Tanmay Singh"; estimatedDurationMinutes = 35; var status : B.MatchStatus = #onCourt; var courtId = ?(3 : Common.CourtId); var courtName = ?("Court 3"); var startTime = ?("10:40"); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 10; categoryId = "u14boys"; categoryName = "U14 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("vivek-rao"); var player2Id = ?("raj-patel"); player1Name = "Vivek Rao"; player2Name = "Raj Patel"; estimatedDurationMinutes = 35; var status : B.MatchStatus = #ready; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 11; categoryId = "u14boys"; categoryName = "U14 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("nikhil-choudhary"); var player2Id = ?("dhruv-agarwal"); player1Name = "Nikhil Choudhary"; player2Name = "Dhruv Agarwal"; estimatedDurationMinutes = 35; var status : B.MatchStatus = #completed; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = ?("10:30"); var endTime = ?("11:02"); var winnerId = ?("dhruv-agarwal"); var winnerName = ?("Dhruv Agarwal"); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 12; categoryId = "u14boys"; categoryName = "U14 Boys"; round = 1; roundName = "Quarter Final"; var player1Id = ?("arpit-saxena"); var player2Id = ?("manav-tiwari"); player1Name = "Arpit Saxena"; player2Name = "Manav Tiwari"; estimatedDurationMinutes = 35; var status : B.MatchStatus = #completed; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = ?("10:30"); var endTime = ?("10:58"); var winnerId = ?("arpit-saxena"); var winnerName = ?("Arpit Saxena"); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 105; categoryId = "u14boys"; categoryName = "U14 Boys"; round = 2; roundName = "Semi Final"; var player1Id = (null : ?Common.PlayerId); var player2Id = ?("dhruv-agarwal"); player1Name = "TBD"; player2Name = "Dhruv Agarwal"; estimatedDurationMinutes = 35; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([9, 11] : [Common.MatchId]) });
    ms.add({ id = 106; categoryId = "u14boys"; categoryName = "U14 Boys"; round = 2; roundName = "Semi Final"; var player1Id = ?("arpit-saxena"); var player2Id = (null : ?Common.PlayerId); player1Name = "Arpit Saxena"; player2Name = "TBD"; estimatedDurationMinutes = 35; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([10, 12] : [Common.MatchId]) });
    ms.add({ id = 203; categoryId = "u14boys"; categoryName = "U14 Boys"; round = 3; roundName = "Final"; var player1Id = (null : ?Common.PlayerId); var player2Id = (null : ?Common.PlayerId); player1Name = "TBD"; player2Name = "TBD"; estimatedDurationMinutes = 40; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([105, 106] : [Common.MatchId]) });
    // Open Singles R16 (IDs 13-16; 2 completed, 2 ready)
    ms.add({ id = 13; categoryId = "opensingles"; categoryName = "Open Singles"; round = 1; roundName = "Round of 16"; var player1Id = ?("karan-kapoor"); var player2Id = ?("rohit-bose"); player1Name = "Karan Kapoor"; player2Name = "Rohit Bose"; estimatedDurationMinutes = 45; var status : B.MatchStatus = #ready; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 14; categoryId = "opensingles"; categoryName = "Open Singles"; round = 1; roundName = "Round of 16"; var player1Id = ?("rahul-deshpande"); var player2Id = ?("suresh-pillai"); player1Name = "Rahul Deshpande"; player2Name = "Suresh Pillai"; estimatedDurationMinutes = 45; var status : B.MatchStatus = #ready; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 15; categoryId = "opensingles"; categoryName = "Open Singles"; round = 1; roundName = "Round of 16"; var player1Id = ?("akash-nair"); var player2Id = ?("anand-krishna"); player1Name = "Akash Nair"; player2Name = "Anand Krishna"; estimatedDurationMinutes = 45; var status : B.MatchStatus = #completed; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = ?("10:30"); var endTime = ?("11:12"); var winnerId = ?("akash-nair"); var winnerName = ?("Akash Nair"); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 16; categoryId = "opensingles"; categoryName = "Open Singles"; round = 1; roundName = "Round of 16"; var player1Id = ?("varun-mehta"); var player2Id = ?("sanjay-iyer"); player1Name = "Varun Mehta"; player2Name = "Sanjay Iyer"; estimatedDurationMinutes = 45; var status : B.MatchStatus = #completed; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = ?("10:30"); var endTime = ?("11:08"); var winnerId = ?("sanjay-iyer"); var winnerName = ?("Sanjay Iyer"); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 107; categoryId = "opensingles"; categoryName = "Open Singles"; round = 2; roundName = "Quarter Final"; var player1Id = ?("akash-nair"); var player2Id = (null : ?Common.PlayerId); player1Name = "Akash Nair"; player2Name = "TBD"; estimatedDurationMinutes = 45; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([13, 15] : [Common.MatchId]) });
    ms.add({ id = 108; categoryId = "opensingles"; categoryName = "Open Singles"; round = 2; roundName = "Quarter Final"; var player1Id = ?("sanjay-iyer"); var player2Id = (null : ?Common.PlayerId); player1Name = "Sanjay Iyer"; player2Name = "TBD"; estimatedDurationMinutes = 45; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([14, 16] : [Common.MatchId]) });
    // Junior Doubles SF (IDs 17-18; 1 onCourt, 1 ready)
    ms.add({ id = 17; categoryId = "juniordoubles"; categoryName = "Junior Doubles"; round = 2; roundName = "Semi Final"; var player1Id = ?("priya-sharma"); var player2Id = ?("ananya-patel"); player1Name = "Priya Sharma / Ananya Patel"; player2Name = "Meera Iyer / Kavya Gupta"; estimatedDurationMinutes = 50; var status : B.MatchStatus = #onCourt; var courtId = ?(2 : Common.CourtId); var courtName = ?("Court 2"); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 18; categoryId = "juniordoubles"; categoryName = "Junior Doubles"; round = 2; roundName = "Semi Final"; var player1Id = ?("shreya-mishra"); var player2Id = ?("naina-kapoor"); player1Name = "Shreya Mishra / Naina Kapoor"; player2Name = "Tanvi Desai / Riya Verma"; estimatedDurationMinutes = 50; var status : B.MatchStatus = #ready; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 204; categoryId = "juniordoubles"; categoryName = "Junior Doubles"; round = 3; roundName = "Final"; var player1Id = (null : ?Common.PlayerId); var player2Id = (null : ?Common.PlayerId); player1Name = "TBD"; player2Name = "TBD"; estimatedDurationMinutes = 55; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([17, 18] : [Common.MatchId]) });
    // One Point Slam Group Stage (IDs 19-26; varied statuses)
    ms.add({ id = 19; categoryId = "onepointslam"; categoryName = "One Point Slam"; round = 1; roundName = "Group Stage"; var player1Id = ?("aarav-shah"); var player2Id = ?("kabir-sharma"); player1Name = "Aarav Shah"; player2Name = "Kabir Sharma"; estimatedDurationMinutes = 15; var status : B.MatchStatus = #completed; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = ?("10:30"); var endTime = ?("10:45"); var winnerId = ?("aarav-shah"); var winnerName = ?("Aarav Shah"); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 20; categoryId = "onepointslam"; categoryName = "One Point Slam"; round = 1; roundName = "Group Stage"; var player1Id = ?("priya-sharma"); var player2Id = ?("sameer-bajaj"); player1Name = "Priya Sharma"; player2Name = "Sameer Bajaj"; estimatedDurationMinutes = 15; var status : B.MatchStatus = #completed; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = ?("10:30"); var endTime = ?("10:45"); var winnerId = ?("priya-sharma"); var winnerName = ?("Priya Sharma"); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 21; categoryId = "onepointslam"; categoryName = "One Point Slam"; round = 1; roundName = "Group Stage"; var player1Id = ?("kunal-chopra"); var player2Id = ?("harsh-trivedi"); player1Name = "Kunal Chopra"; player2Name = "Harsh Trivedi"; estimatedDurationMinutes = 15; var status : B.MatchStatus = #completed; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = ?("10:45"); var endTime = ?("11:00"); var winnerId = ?("harsh-trivedi"); var winnerName = ?("Harsh Trivedi"); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 22; categoryId = "onepointslam"; categoryName = "One Point Slam"; round = 1; roundName = "Group Stage"; var player1Id = ?("gaurav-pandey"); var player2Id = ?("rohit-srivastava"); player1Name = "Gaurav Pandey"; player2Name = "Rohit Srivastava"; estimatedDurationMinutes = 15; var status : B.MatchStatus = #ready; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 23; categoryId = "onepointslam"; categoryName = "One Point Slam"; round = 1; roundName = "Group Stage"; var player1Id = ?("amit-chandra"); var player2Id = ?("aarav-shah"); player1Name = "Amit Chandra"; player2Name = "Aarav Shah"; estimatedDurationMinutes = 15; var status : B.MatchStatus = #ready; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([] : [Common.MatchId]) });
    ms.add({ id = 24; categoryId = "onepointslam"; categoryName = "One Point Slam"; round = 2; roundName = "Semi Final"; var player1Id = ?("aarav-shah"); var player2Id = (null : ?Common.PlayerId); player1Name = "Aarav Shah"; player2Name = "TBD"; estimatedDurationMinutes = 15; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([19, 23] : [Common.MatchId]) });
    ms.add({ id = 25; categoryId = "onepointslam"; categoryName = "One Point Slam"; round = 2; roundName = "Semi Final"; var player1Id = ?("priya-sharma"); var player2Id = (null : ?Common.PlayerId); player1Name = "Priya Sharma"; player2Name = "TBD"; estimatedDurationMinutes = 15; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([20, 22] : [Common.MatchId]) });
    ms.add({ id = 205; categoryId = "onepointslam"; categoryName = "One Point Slam"; round = 3; roundName = "Final"; var player1Id = (null : ?Common.PlayerId); var player2Id = (null : ?Common.PlayerId); player1Name = "TBD"; player2Name = "TBD"; estimatedDurationMinutes = 15; var status : B.MatchStatus = #notReady; var courtId = (null : ?Common.CourtId); var courtName = (null : ?Text); var startTime = (null : ?Text); var endTime = (null : ?Text); var winnerId = (null : ?Common.PlayerId); var winnerName = (null : ?Text); var priorityScore = 0; var scoreReason = ""; var conflicts = ([] : [B.ConflictType]); dependsOnMatchIds = ([24, 25] : [Common.MatchId]) });
    ms;
  };

  // Convert mutable Match to shared MatchView
  public func matchToView(m : B.Match) : B.MatchView {
    { id = m.id; categoryId = m.categoryId; categoryName = m.categoryName; round = m.round; roundName = m.roundName; player1Id = m.player1Id; player2Id = m.player2Id; player1Name = m.player1Name; player2Name = m.player2Name; estimatedDurationMinutes = m.estimatedDurationMinutes; status = m.status; courtId = m.courtId; courtName = m.courtName; startTime = m.startTime; endTime = m.endTime; winnerId = m.winnerId; winnerName = m.winnerName; priorityScore = m.priorityScore; scoreReason = m.scoreReason; conflicts = m.conflicts; dependsOnMatchIds = m.dependsOnMatchIds };
  };

  // Compute AI priority score (0..100) and human-readable reason for a ready match
  public func scorePriority(
    match : B.Match,
    players : List.List<P.Player>,
    categories : List.List<T.Category>,
    cfg : T.TournamentConfig,
    allMatches : List.List<B.Match>,
  ) : (Nat, Text) {
    var score : Int = 50; // base
    let reasons = List.empty<Text>();

    // Check player statuses
    let p1Opt = switch (match.player1Id) {
      case (?pid) players.find(func(p : P.Player) : Bool { p.id == pid });
      case null null;
    };
    let p2Opt = switch (match.player2Id) {
      case (?pid) players.find(func(p : P.Player) : Bool { p.id == pid });
      case null null;
    };

    // -30 if either player is currently playing
    switch (p1Opt) {
      case (?p) if (p.status == #playing) { score -= 30; reasons.add(p.name # " is currently on court") };
      case null {};
    };
    switch (p2Opt) {
      case (?p) if (p.status == #playing) { score -= 30; reasons.add(p.name # " is currently on court") };
      case null {};
    };

    // +20 if both players waiting > 30 minutes
    var avgWait : Nat = 0;
    switch (p1Opt, p2Opt) {
      case (?p1, ?p2) {
        if (p1.totalWaitingMinutes > 30 and p2.totalWaitingMinutes > 30) {
          score += 20;
          avgWait := (p1.totalWaitingMinutes + p2.totalWaitingMinutes) / 2;
          reasons.add("Both players waiting avg " # avgWait.toText() # " min");
        };
      };
      case _ {};
    };

    // -20 if either player just finished < minRestMinutes ago
    switch (p1Opt) {
      case (?p) {
        if (p.status == #resting) {
          score -= 20;
          reasons.add(p.name # " needs rest");
        };
      };
      case null {};
    };
    switch (p2Opt) {
      case (?p) {
        if (p.status == #resting) {
          score -= 20;
          reasons.add(p.name # " needs rest");
        };
      };
      case null {};
    };

    // +10 if match unlocks a semi/final (has dependents)
    let hasDependents = switch (allMatches.find(func(m2 : B.Match) : Bool {
      var found = false;
      for (depId in m2.dependsOnMatchIds.values()) {
        if (depId == match.id) { found := true };
      };
      found;
    })) {
      case (?_) true;
      case null false;
    };
    if (hasDependents) {
      score += 10;
      reasons.add("Completing this match unlocks the next round");
    };

    // Category status bonuses
    let catOpt = categories.find(func(c : T.Category) : Bool { c.id == match.categoryId });
    switch (catOpt) {
      case (?cat) {
        switch (cat.status) {
          case (#urgent) { score += 15; reasons.add(cat.name # " is Urgent") };
          case (#delayed) { score += 10; reasons.add(cat.name # " is Delayed") };
          case (#onTrack) {};
        };
        // +10 if category has many pending matches
        if (cat.matchesPending > 3) {
          score += 10;
          reasons.add(cat.name # " has " # cat.matchesPending.toText() # " matches pending");
        };
      };
      case null {};
    };

    // +10 if match duration is short
    if (match.estimatedDurationMinutes < cfg.avgMatchDurationMinutes) {
      score += 10;
      reasons.add("Short match (" # match.estimatedDurationMinutes.toText() # " min)");
    };

    // -15 if player is in multiple categories
    switch (p1Opt) {
      case (?p) if (p.categories.size() > 1) { score -= 15; reasons.add(p.name # " is in multiple categories") };
      case null {};
    };
    switch (p2Opt) {
      case (?p) if (p.categories.size() > 1) { score -= 15; reasons.add(p.name # " is in multiple categories") };
      case null {};
    };

    // -20 if match cannot finish before end time (16:30 = 990 mins)
    // 16:30 - 11:00 = 330 minutes remaining (constant, avoids M0155 Nat subtraction warning)
    let timeLeft : Nat = 330;
    if (match.estimatedDurationMinutes > timeLeft) {
      score -= 20;
      reasons.add("Match may not finish before tournament end");
    };

    // Cap score 0-100
    let finalScore : Nat = if (score < 0) 0
      else if (score > 100) 100
      else Int.abs(score);

    // Build reason text
    let allReasons = reasons.toArray();
    let reasonText = if (allReasons.size() == 0) "Standard priority"
      else {
        var t = "Recommended because: ";
        var first = true;
        for (r in allReasons.values()) {
          if (not first) { t := t # "; " };
          t := t # r;
          first := false;
        };
        t;
      };

    (finalScore, reasonText);
  };

  // Detect all active conflicts for a match
  public func detectConflicts(
    match : B.Match,
    players : List.List<P.Player>,
    cfg : T.TournamentConfig,
  ) : [B.ConflictType] {
    let conflicts = List.empty<B.ConflictType>();
    if (match.status == #notReady) { conflicts.add(#notReady) };
    let p1Opt = switch (match.player1Id) {
      case (?pid) players.find(func(p : P.Player) : Bool { p.id == pid });
      case null null;
    };
    let p2Opt = switch (match.player2Id) {
      case (?pid) players.find(func(p : P.Player) : Bool { p.id == pid });
      case null null;
    };
    switch (p1Opt) {
      case (?p) {
        if (p.status == #playing) { conflicts.add(#playerOnCourt) };
        if (p.status == #resting) { conflicts.add(#restNeeded) };
        if (p.categories.size() > 1) { conflicts.add(#categoryClash) };
        if (p.matchesPlayedToday >= 2) { conflicts.add(#backToBack) };
      };
      case null {};
    };
    switch (p2Opt) {
      case (?p) {
        if (p.status == #playing) {
          let already = switch (conflicts.find(func(c : B.ConflictType) : Bool { c == #playerOnCourt })) {
            case (?_) true; case null false;
          };
          if (not already) { conflicts.add(#playerOnCourt) };
        };
        if (p.status == #resting) {
          let already = switch (conflicts.find(func(c : B.ConflictType) : Bool { c == #restNeeded })) {
            case (?_) true; case null false;
          };
          if (not already) { conflicts.add(#restNeeded) };
        };
        if (p.categories.size() > 1) {
          let already = switch (conflicts.find(func(c : B.ConflictType) : Bool { c == #categoryClash })) {
            case (?_) true; case null false;
          };
          if (not already) { conflicts.add(#categoryClash) };
        };
        if (p.matchesPlayedToday >= 2) {
          let already = switch (conflicts.find(func(c : B.ConflictType) : Bool { c == #backToBack })) {
            case (?_) true; case null false;
          };
          if (not already) { conflicts.add(#backToBack) };
        };
      };
      case null {};
    };
    // Time risk check
    // 16:30 - 11:00 = 330 minutes remaining (constant, avoids M0155 Nat subtraction warning)
    let timeLeft : Nat = 330;
    if (match.estimatedDurationMinutes + cfg.minRestMinutes > timeLeft) {
      conflicts.add(#timeRisk);
    };
    conflicts.toArray();
  };

  // Build a ranked queue of Ready matches sorted by descending priority score
  public func buildQueue(
    matches : List.List<B.Match>,
    players : List.List<P.Player>,
    categories : List.List<T.Category>,
    cfg : T.TournamentConfig,
  ) : [B.QueueEntry] {
    // Score all ready matches, sort descending
    let readyMatches = List.empty<B.Match>();
    for (m in matches.values()) {
      if (m.status == #ready or m.status == #delayed) {
        let (score, reason) = scorePriority(m, players, categories, cfg, matches);
        m.priorityScore := score;
        m.scoreReason := reason;
        m.conflicts := detectConflicts(m, players, cfg);
        readyMatches.add(m);
      };
    };
    let arr = readyMatches.toArray();
    let sorted = arr.sort(func(a : B.Match, b : B.Match) : { #less; #equal; #greater } {
      if (a.priorityScore > b.priorityScore) #less
      else if (a.priorityScore < b.priorityScore) #greater
      else #equal;
    });
    var rank = 1;
    let queue = List.empty<B.QueueEntry>();
    for (m in sorted.values()) {
      queue.add({ rank; match = matchToView(m) });
      rank := rank + 1;
    };
    queue.toArray();
  };

  // Assign a match to a court: mutate match + court state, update player statuses
  public func assignToCourt(
    match : B.Match,
    court : T.Court,
    players : List.List<P.Player>,
  ) {
    match.status := #onCourt;
    match.courtId := ?(court.id);
    match.courtName := ?(court.name);
    match.startTime := ?("11:00");
    court.currentMatchId := ?(match.id);
    court.isAvailable := false;
    switch (match.player1Id) {
      case (?pid) {
        for (p in players.values()) {
          if (p.id == pid) {
            p.status := #playing;
            p.currentMatchId := ?(match.id);
            p.matchesPlayedToday := p.matchesPlayedToday + 1;
          };
        };
      };
      case null {};
    };
    switch (match.player2Id) {
      case (?pid) {
        for (p in players.values()) {
          if (p.id == pid) {
            p.status := #playing;
            p.currentMatchId := ?(match.id);
            p.matchesPlayedToday := p.matchesPlayedToday + 1;
          };
        };
      };
      case null {};
    };
  };

  // Complete a match: set winner, free court, mark player resting, unlock dependents
  public func completeMatch(
    match : B.Match,
    winnerId : Common.PlayerId,
    winnerName : Text,
    court : T.Court,
    players : List.List<P.Player>,
    allMatches : List.List<B.Match>,
    cfg : T.TournamentConfig,
  ) {
    match.status := #completed;
    match.winnerId := ?(winnerId);
    match.winnerName := ?(winnerName);
    match.endTime := ?("11:35"); // demo end time
    court.currentMatchId := null;
    court.isAvailable := true;
    // Mark both players as resting
    switch (match.player1Id) {
      case (?pid) {
        for (p in players.values()) {
          if (p.id == pid) {
            p.status := #resting;
            p.currentMatchId := null;
            p.lastMatchEndTime := ?("11:35");
            p.restRequiredUntil := ?("11:50");
          };
        };
      };
      case null {};
    };
    switch (match.player2Id) {
      case (?pid) {
        for (p in players.values()) {
          if (p.id == pid) {
            p.status := #resting;
            p.currentMatchId := null;
            p.lastMatchEndTime := ?("11:35");
            p.restRequiredUntil := ?("11:50");
          };
        };
      };
      case null {};
    };
    ignore cfg;
    unlockDependents(match.id, winnerId, winnerName, allMatches);
  };

  // Unlock matches that depended on completedMatchId; fill in winner player slot
  public func unlockDependents(
    completedMatchId : Common.MatchId,
    winnerId : Common.PlayerId,
    winnerName : Text,
    allMatches : List.List<B.Match>,
  ) {
    ignore winnerName;
    for (m in allMatches.values()) {
      // Check if this match depends on completedMatchId
      var dependsOnCompleted = false;
      var slotIsFirst = false;
      var depIdx = 0;
      for (depId in m.dependsOnMatchIds.values()) {
        if (depId == completedMatchId) {
          dependsOnCompleted := true;
          if (depIdx == 0) { slotIsFirst := true };
        };
        depIdx := depIdx + 1;
      };
      if (dependsOnCompleted) {
        if (slotIsFirst) {
          m.player1Id := ?(winnerId);
        } else {
          m.player2Id := ?(winnerId);
        };
        // Check if all dependencies are completed
        var allDepsComplete = true;
        for (depId in m.dependsOnMatchIds.values()) {
          let depOpt = allMatches.find(func(dm : B.Match) : Bool { dm.id == depId });
          switch (depOpt) {
            case (?dep) if (dep.status != #completed) { allDepsComplete := false };
            case null { allDepsComplete := false };
          };
        };
        if (allDepsComplete and m.status == #notReady) {
          m.status := #ready;
        };
      };
    };
  };

  // Build the complete CourtFlowData dashboard payload
  public func buildCourtFlowData(
    courts : List.List<T.Court>,
    matches : List.List<B.Match>,
    players : List.List<P.Player>,
    categories : List.List<T.Category>,
    cfg : T.TournamentConfig,
    stats : B.CourtFlowStats,
  ) : B.CourtFlowData {
    let queue = buildQueue(matches, players, categories, cfg);
    let courtViews = List.empty<B.CourtFlowCourtView>();
    for (court in courts.values()) {
      let currentMatch : ?B.MatchView = switch (court.currentMatchId) {
        case (?mid) {
          switch (matches.find(func(m : B.Match) : Bool { m.id == mid })) {
            case (?m) ?(matchToView(m));
            case null null;
          };
        };
        case null null;
      };
      // Find best recommended next match for this court
      let recommendedNext : ?B.QueueEntry = if (court.isAvailable and queue.size() > 0) {
        ?(queue[0]);
      } else null;
      courtViews.add({
        courtId = court.id;
        courtName = court.name;
        isAvailable = court.isAvailable;
        currentMatch;
        recommendedNext;
      });
    };
    let cfgView : B.CourtFlowConfigView = {
      name = cfg.name;
      venue = cfg.venue;
      date = cfg.date;
      startTime = cfg.startTime;
      endTime = cfg.endTime;
      courts = cfg.courts;
      matchFormat = cfg.matchFormat;
      avgMatchDurationMinutes = cfg.avgMatchDurationMinutes;
      minRestMinutes = cfg.minRestMinutes;
      status = cfg.status;
      panicModeActive = cfg.panicModeActive;
      panicSuggestions = cfg.panicSuggestions;
    };
    { courts = courtViews.toArray(); matchQueue = queue; config = cfgView; stats };
  };
};
