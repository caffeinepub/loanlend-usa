import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface BorrowerProfile {
    id: string;
    ssn: string;
    principal: Principal;
    createdAt: Time;
    annualIncome: bigint;
    fullName: string;
    email: string;
    creditScore: bigint;
}
export interface LoanApplication {
    id: string;
    status: ApplicationStatus;
    borrowerId: string;
    submittedAt: Time;
    productId?: string;
    reviewedAt?: Time;
    termMonths: bigint;
    requestedAmount: bigint;
    adminNotes?: string;
    purpose: string;
}
export interface LoanProduct {
    id: string;
    maxAmount: bigint;
    minAmount: bigint;
    name: string;
    description: string;
    termMonths: bigint;
    interestRate: number;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum ApplicationStatus {
    pending = "pending",
    disbursed = "disbursed",
    approved = "approved",
    rejected = "rejected",
    under_review = "under_review"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllApplications(): Promise<Array<LoanApplication>>;
    getApplicationsByBorrower(borrowerId: string): Promise<Array<LoanApplication>>;
    getBorrowerByPrincipal(principal: Principal): Promise<BorrowerProfile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLoanProducts(): Promise<Array<LoanProduct>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerBorrower(id: string, profile: BorrowerProfile): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitApplication(application: LoanApplication): Promise<void>;
    updateApplicationStatus(appId: string, status: ApplicationStatus, adminNotes: string | null): Promise<void>;
}
