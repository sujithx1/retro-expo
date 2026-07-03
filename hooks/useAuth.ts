import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, register, logout, getProfile, LoginPayload, RegisterPayload, User, AuthResponse } from "../api/auth";

export const authKeys = {
  profile: ["auth", "profile"] as const,
};

/**
 * Hook to retrieve the current user's profile details.
 * Set `enabled` to check if user token is likely present.
 */
export function useProfile() {
  return useQuery<User, Error>({
    queryKey: authKeys.profile,
    queryFn: getProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Mutation hook for logging in.
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
      // Seed profile query cache directly upon successful login
      queryClient.setQueryData(authKeys.profile, data.user);
    },
  });
}

/**
 * Mutation hook for registration.
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: register,
    onSuccess: (data) => {
      // Seed profile query cache directly upon successful registration
      queryClient.setQueryData(authKeys.profile, data.user);
    },
  });
}

/**
 * Mutation hook for logging out.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSuccess: () => {
      // Reset profile query cache upon logging out
      queryClient.setQueryData(authKeys.profile, null);
      queryClient.invalidateQueries({ queryKey: authKeys.profile });
    },
  });
}
