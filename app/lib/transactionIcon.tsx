import { Colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import type { ApiTransaction } from "./api";

export function iconForTransaction(t: ApiTransaction): {
  bg: string;
  color: string;
  node: React.ReactNode;
} {
  switch (t.type) {
    case "TOPUP":
      return {
        bg: Colors.transaction.topUp.bg,
        color: Colors.transaction.topUp.icon,
        node: (
          <Feather
            name="plus"
            size={18}
            color={Colors.transaction.topUp.icon}
          />
        ),
      };
    case "WITHDRAW":
      return {
        bg: Colors.transaction.sent.bg,
        color: Colors.transaction.sent.icon,
        node: (
          <Feather
            name="arrow-up"
            size={16}
            color={Colors.transaction.sent.icon}
          />
        ),
      };
    case "SEND":
      return {
        bg: Colors.transaction.sent.bg,
        color: Colors.transaction.sent.icon,
        node: (
          <Feather
            name="send"
            size={16}
            color={Colors.transaction.sent.icon}
          />
        ),
      };
    case "RECEIVE":
      return {
        bg: Colors.transaction.sent.bg,
        color: Colors.transaction.sent.icon,
        node: (
          <Feather
            name="arrow-down"
            size={16}
            color={Colors.transaction.sent.icon}
          />
        ),
      };
    default:
      return {
        bg: Colors.transaction.sent.bg,
        color: Colors.transaction.sent.icon,
        node: (
          <Feather
            name="circle"
            size={16}
            color={Colors.transaction.sent.icon}
          />
        ),
      };
  }
}
