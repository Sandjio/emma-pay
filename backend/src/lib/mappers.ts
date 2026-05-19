import type {
  BankAccount,
  Card,
  Contact,
  Transaction,
  User,
} from "@prisma/client";

export function toUserDTO(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toCardDTO(card: Card) {
  return {
    id: card.id,
    type: card.type,
    currency: card.currency,
    balance: card.balance.toString(),
    lastFour: card.lastFour,
    variant: card.variant,
    createdAt: card.createdAt.toISOString(),
  };
}

export function toCardDetailDTO(card: Card) {
  return {
    ...toCardDTO(card),
    fullNumber: card.fullNumber,
    expiry: card.expiry,
    cvv: card.cvv,
  };
}

type TransactionBankAccountSlice = Pick<
  BankAccount,
  "institutionName" | "lastFour" | "logoColor" | "logoLetter"
>;

export function toTransactionDTO(
  txn: Transaction & { bankAccount?: TransactionBankAccountSlice | null },
) {
  return {
    id: txn.id,
    type: txn.type,
    amount: txn.amount.toString(),
    currency: txn.currency,
    counterpartyName: txn.counterpartyName,
    status: txn.status,
    createdAt: txn.createdAt.toISOString(),
    bankAccount: txn.bankAccount
      ? {
          institutionName: txn.bankAccount.institutionName,
          lastFour: txn.bankAccount.lastFour,
          logoColor: txn.bankAccount.logoColor,
          logoLetter: txn.bankAccount.logoLetter,
        }
      : null,
  };
}

export function toContactDTO(contact: Contact) {
  return {
    id: contact.id,
    name: contact.name,
    handle: contact.handle,
    initials: contact.initials,
    accentColor: contact.accentColor,
  };
}

export function toBankAccountDTO(b: BankAccount) {
  return {
    id: b.id,
    institutionId: b.institutionId,
    institutionName: b.institutionName,
    logoColor: b.logoColor,
    logoLetter: b.logoLetter,
    accountType: b.accountType,
    lastFour: b.lastFour,
    isPrimary: b.isPrimary,
    createdAt: b.createdAt.toISOString(),
  };
}
