import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactions as txApi } from "../api";
import { useAuthToken } from "../auth-context";
import { queryKeys } from "./queryKeys";

export function useTransactionsQuery() {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => txApi.list(token).then((r) => r.transactions),
  });
}

function invalidateTxAndCards(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: queryKeys.transactions });
  qc.invalidateQueries({ queryKey: queryKeys.cards });
}

export function useSendMutation() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof txApi.send>[1]) =>
      txApi.send(token, input).then((r) => r.transaction),
    onSuccess: () => invalidateTxAndCards(qc),
  });
}

export function useTopUpMutation() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof txApi.topUp>[1]) =>
      txApi.topUp(token, input).then((r) => r.transaction),
    onSuccess: () => invalidateTxAndCards(qc),
  });
}

export function useWithdrawMutation() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof txApi.withdraw>[1]) =>
      txApi.withdraw(token, input).then((r) => r.transaction),
    onSuccess: () => invalidateTxAndCards(qc),
  });
}
