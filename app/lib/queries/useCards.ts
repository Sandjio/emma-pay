import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cards as cardsApi } from "../api";
import { useAuthToken } from "../auth-context";
import { queryKeys } from "./queryKeys";

export function useCardsQuery() {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.cards,
    queryFn: () => cardsApi.list(token).then((r) => r.cards),
  });
}

export function useCardQuery(id: string | null | undefined) {
  const token = useAuthToken();
  return useQuery({
    queryKey: id ? queryKeys.card(id) : ["card", "_disabled"],
    queryFn: () => cardsApi.get(token, id as string).then((r) => r.card),
    enabled: !!id,
  });
}

export function useCreateCardMutation() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof cardsApi.create>[1]) =>
      cardsApi.create(token, input).then((r) => r.card),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cards });
    },
  });
}
