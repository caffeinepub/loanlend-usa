# Specification

## Summary
**Goal:** Fix all backend Motoko and frontend TypeScript compilation errors that are blocking successful deployment.

**Planned changes:**
- Fix all Motoko compilation errors in `backend/main.mo` and `backend/migration.mo`, including optional `productId` field handling, admin principal checks, and mismatched type signatures
- Fix all TypeScript compilation errors in the frontend, removing any remaining references to the removed `productId` field and resolving missing or mismatched imports and React Query hook return types

**User-visible outcome:** The canister deploys successfully and the frontend build completes, allowing the app to load in the browser without errors.
