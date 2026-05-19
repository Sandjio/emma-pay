export const queryKeys = {
  me: ["me"] as const,
  cards: ["cards"] as const,
  card: (id: string) => ["card", id] as const,
  transactions: ["transactions"] as const,
  contacts: ["contacts"] as const,
  bankAccounts: ["bankAccounts"] as const,
};
