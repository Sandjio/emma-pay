import { useQuery } from "@tanstack/react-query";
import { contacts as contactsApi } from "../api";
import { useAuthToken } from "../auth-context";
import { queryKeys } from "./queryKeys";

export function useContactsQuery() {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.contacts,
    queryFn: () => contactsApi.list(token!).then((r) => r.contacts),
    enabled: !!token,
  });
}
