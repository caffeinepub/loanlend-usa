import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  UserProfile,
  BorrowerProfile,
  LoanApplication,
  LoanProduct,
  ApplicationStatus,
} from '@/backend';

// ── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── Loan Products ────────────────────────────────────────────────────────────

export function useGetLoanProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LoanProduct[]>({
    queryKey: ['loanProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLoanProducts();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ── Borrower Profile ─────────────────────────────────────────────────────────

export function useGetBorrowerByPrincipal(principal: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BorrowerProfile | null>({
    queryKey: ['borrowerProfile', principal],
    queryFn: async () => {
      if (!actor || !principal) return null;
      const { Principal } = await import('@dfinity/principal');
      return actor.getBorrowerByPrincipal(Principal.fromText(principal));
    },
    enabled: !!actor && !actorFetching && !!principal,
    retry: false,
  });
}

export function useRegisterBorrower() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profile }: { id: string; profile: BorrowerProfile }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerBorrower(id, profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowerProfile'] });
    },
  });
}

// ── Loan Applications ────────────────────────────────────────────────────────

export function useGetApplicationsByBorrower(borrowerId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LoanApplication[]>({
    queryKey: ['applications', borrowerId],
    queryFn: async () => {
      if (!actor || !borrowerId) return [];
      return actor.getApplicationsByBorrower(borrowerId);
    },
    enabled: !!actor && !actorFetching && !!borrowerId,
  });
}

export function useSubmitApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (application: LoanApplication) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitApplication(application);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useGetAllApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LoanApplication[]>({
    queryKey: ['allApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllApplications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appId,
      status,
      adminNotes,
    }: {
      appId: string;
      status: ApplicationStatus;
      adminNotes: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateApplicationStatus(appId, status, adminNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allApplications'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

// ── Admin Role ───────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
