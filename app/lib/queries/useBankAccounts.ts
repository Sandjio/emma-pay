import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bankAccounts as bankApi } from "../api";
import { useAuthToken } from "../auth-context";
import { queryKeys } from "./queryKeys";

export function useBankAccountsQuery() {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.bankAccounts,
    queryFn: () => bankApi.list(token).then((r) => r.bankAccounts),
  });
}

export function useCreateBankAccountMutation() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof bankApi.create>[1]) =>
      bankApi.create(token, input).then((r) => r.bankAccount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bankAccounts });
    },
  });
}

export function useDeleteBankAccountMutation() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bankApi.remove(token, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bankAccounts });
      qc.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
}
