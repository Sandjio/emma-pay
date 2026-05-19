import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactions as txApi } from "../api";
import { useAuthToken } from "../auth-context";
import { notifyTransaction } from "../notifications";
import { queryKeys } from "./queryKeys";

export function useTransactionsQuery() {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => txApi.list(token!).then((r) => r.transactions),
    enabled: !!token,
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
    mutationFn: (input: Parameters<typeof txApi.send>[1]) => {
      if (!token) throw new Error("Not authenticated");
      return txApi.send(token, input).then((r) => r.transaction);
    },
    onSuccess: (txn) => {
      invalidateTxAndCards(qc);
      notifyTransaction(txn);
    },
  });
}

export function useTopUpMutation() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof txApi.topUp>[1]) => {
      if (!token) throw new Error("Not authenticated");
      return txApi.topUp(token, input).then((r) => r.transaction);
    },
    onSuccess: (txn) => {
      invalidateTxAndCards(qc);
      notifyTransaction(txn);
    },
  });
}

export function useWithdrawMutation() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof txApi.withdraw>[1]) => {
      if (!token) throw new Error("Not authenticated");
      return txApi.withdraw(token, input).then((r) => r.transaction);
    },
    onSuccess: (txn) => {
      invalidateTxAndCards(qc);
      notifyTransaction(txn);
    },
  });
}
