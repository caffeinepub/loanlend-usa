import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";

import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";



actor {
  include MixinStorage();

  // Loan Product Type
  public type LoanProduct = {
    id : Text;
    name : Text;
    minAmount : Nat;
    maxAmount : Nat;
    interestRate : Float;
    termMonths : Nat;
    description : Text;
  };

  // Borrower Profile Type
  public type BorrowerProfile = {
    id : Text;
    principal : Principal;
    fullName : Text;
    email : Text;
    ssn : Text;
    annualIncome : Nat;
    creditScore : Nat;
    createdAt : Time.Time;
  };

  // Loan Application Type
  public type ApplicationStatus = {
    #pending;
    #under_review;
    #approved;
    #rejected;
    #disbursed;
  };

  public type LoanApplication = {
    id : Text;
    borrowerId : Text;
    productId : ?Text; // Now optional
    requestedAmount : Nat;
    termMonths : Nat;
    purpose : Text;
    status : ApplicationStatus;
    submittedAt : Time.Time;
    reviewedAt : ?Time.Time;
    adminNotes : ?Text;
  };

  // User Profile Type (required by frontend/instructions)
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  module BorrowerProfile {
    public func compareByTime(a : BorrowerProfile, b : BorrowerProfile) : Order.Order {
      switch (Text.compare(a.fullName, b.fullName)) {
        case (#equal) {
          Int.compare(b.createdAt, a.createdAt);
        };
        case (order) { order };
      };
    };
  };

  let loanProducts = Map.empty<Text, LoanProduct>();
  let borrowerProfiles = Map.empty<Text, BorrowerProfile>();
  let applications = Map.empty<Text, LoanApplication>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // ── User Profile Methods (required by instructions) ──────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Loan Product Methods ────────────────────────────────────────────────

  // Loan products are publicly readable; no auth required
  public query func getLoanProducts() : async [LoanProduct] {
    loanProducts.values().toArray();
  };

  // ── Borrower Profile Methods ────────────────────────────────────────────

  public shared ({ caller }) func registerBorrower(id : Text, profile : BorrowerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register a borrower profile");
    };
    // Ensure the profile being registered belongs to the caller
    if (profile.principal != caller) {
      Runtime.trap("Unauthorized: Cannot register a borrower profile for another principal");
    };
    if (borrowerProfiles.containsKey(id)) {
      Runtime.trap("Borrower profile already exists");
    };
    borrowerProfiles.add(id, profile);
  };

  public query ({ caller }) func getBorrowerByPrincipal(principal : Principal) : async ?BorrowerProfile {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own borrower profile");
    };
    let iter = borrowerProfiles.values();
    iter.find(func(p) { p.principal == principal });
  };

  // ── Loan Application Methods ────────────────────────────────────────────

  public shared ({ caller }) func submitApplication(application : LoanApplication) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit applications");
    };
    // Verify the caller owns the borrower profile referenced in the application
    let callerProfile = borrowerProfiles.values().find(func(p) { p.principal == caller });
    switch (callerProfile) {
      case (null) {
        Runtime.trap("Unauthorized: No borrower profile found for caller");
      };
      case (?profile) {
        if (profile.id != application.borrowerId) {
          Runtime.trap("Unauthorized: Cannot submit application for another borrower");
        };
      };
    };
    applications.add(application.id, application);
  };

  public shared ({ caller }) func updateApplicationStatus(appId : Text, status : ApplicationStatus, adminNotes : ?Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update application status");
    };
    let app = switch (applications.get(appId)) {
      case (null) {
        Runtime.trap("Application not found");
      };
      case (?app) { app };
    };

    let updatedApp : LoanApplication = {
      id = app.id;
      borrowerId = app.borrowerId;
      productId = app.productId;
      requestedAmount = app.requestedAmount;
      termMonths = app.termMonths;
      purpose = app.purpose;
      status;
      submittedAt = app.submittedAt;
      reviewedAt = ?Time.now();
      adminNotes;
    };

    applications.add(appId, updatedApp);
  };

  public query ({ caller }) func getApplicationsByBorrower(borrowerId : Text) : async [LoanApplication] {
    let profileOpt = borrowerProfiles.get(borrowerId);
    switch (profileOpt) {
      case (null) {
        // If profile not found, only admins may query
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Borrower profile not found or access denied");
        };
      };
      case (?profile) {
        // Only the owning borrower or an admin may view applications
        if (caller != profile.principal and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own applications");
        };
      };
    };

    let iter = applications.values();
    let borrowerApps = List.empty<LoanApplication>();

    iter.forEach(
      func(app) {
        if (app.borrowerId == borrowerId) {
          borrowerApps.add(app);
        };
      }
    );

    borrowerApps.toArray();
  };

  public query ({ caller }) func getAllApplications() : async [LoanApplication] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all applications");
    };
    applications.values().toArray();
  };
};
