import type { Card, Contact, Transaction, User } from "@prisma/client";

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

export function toTransactionDTO(txn: Transaction) {
  return {
    id: txn.id,
    type: txn.type,
    amount: txn.amount.toString(),
    currency: txn.currency,
    counterpartyName: txn.counterpartyName,
    status: txn.status,
    createdAt: txn.createdAt.toISOString(),
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
