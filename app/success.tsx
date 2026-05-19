import { PrimaryButton } from "@/components/ui";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  formatCurrency,
  formatRelativeDay,
  formatTime,
  transactionTitle,
} from "./lib/format";
import { useTransactionsQuery } from "./lib/queries/useTransactions";

type ConfettiBit = {
  color: string;
  top: number;
  left: number;
  size: number;
  rotate: number;
  shape: "dot" | "dash";
};

const CONFETTI: ConfettiBit[] = [
  { color: "#3B82F6", top: 6, left: 18, size: 8, rotate: 30, shape: "dash" },
  { color: "#F97316", top: 12, left: 70, size: 6, rotate: -20, shape: "dash" },
  { color: "#10B981", top: 32, left: 5, size: 6, rotate: 60, shape: "dot" },
  { color: "#A855F7", top: 28, left: 90, size: 8, rotate: 10, shape: "dash" },
  { color: "#EF4444", top: 72, left: 12, size: 6, rotate: -45, shape: "dot" },
  { color: "#EAB308", top: 78, left: 80, size: 7, rotate: 25, shape: "dash" },
  { color: "#8B5CF6", top: 90, left: 50, size: 6, rotate: 0, shape: "dot" },
  { color: "#06B6D4", top: 55, left: 95, size: 7, rotate: 70, shape: "dash" },
  { color: "#F472B6", top: 50, left: 0, size: 6, rotate: -15, shape: "dot" },
];

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ txnId?: string }>();
  const { data: txns } = useTransactionsQuery();
  const txn = txns?.find((t) => t.id === params.txnId) ?? null;

  const amountLabel = txn
    ? `${formatCurrency(txn.amount, txn.currency)} ${
        txn.type === "TOPUP"
          ? "added"
          : txn.type === "WITHDRAW"
          ? "withdrawn"
          : txn.type === "SEND"
          ? "sent"
          : "received"
      }`
    : "—";

  const recipientLine = txn
    ? txn.type === "TOPUP" || txn.type === "WITHDRAW"
      ? txn.bankAccount
        ? `${txn.type === "TOPUP" ? "from" : "to"} ${
            txn.bankAccount.institutionName
          } ··${txn.bankAccount.lastFour}`
        : (txn.counterpartyName ?? "")
      : txn.counterpartyName
      ? `${txn.type === "SEND" ? "to" : "from"} ${txn.counterpartyName}`
      : ""
    : "";

  const dateLabel = txn
    ? `${formatRelativeDay(txn.createdAt)} · ${formatTime(txn.createdAt)}`
    : "—";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.closeRow}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.replace("/home")}
          hitSlop={8}
        >
          <Feather name="x" size={22} color={Colors.neutral.dark} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.checkContainer}>
          {CONFETTI.map((c, i) => (
            <View
              key={i}
              style={[
                styles.confetti,
                c.shape === "dash" ? styles.confettiDash : styles.confettiDot,
                {
                  backgroundColor: c.color,
                  top: `${c.top}%`,
                  left: `${c.left}%`,
                  width: c.shape === "dash" ? c.size * 2 : c.size,
                  height: c.size,
                  transform: [{ rotate: `${c.rotate}deg` }],
                },
              ]}
            />
          ))}
          <View style={styles.checkGlow} />
          <View style={styles.checkCircle}>
            <Feather name="check" size={40} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        <Text style={styles.amount}>{amountLabel}</Text>
        {recipientLine ? (
          <Text style={styles.recipient}>{recipientLine}</Text>
        ) : null}

        <View style={styles.receipt}>
          <ReceiptRow
            label="Transaction ID"
            value={txn ? `TX-${txn.id.slice(-6).toUpperCase()}` : "—"}
          />
          <ReceiptRow
            label="Type"
            value={txn ? transactionTitle(txn) : "—"}
          />
          <ReceiptRow label="Date" value={dateLabel} />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Done" onPress={() => router.replace("/home")} />
        <TouchableOpacity
          onPress={() => router.replace("/send")}
          hitSlop={8}
          style={styles.sendAnother}
        >
          <Text style={Typography.link}>Send another</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptLabel}>{label}</Text>
      <Text style={styles.receiptValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.background,
  },
  closeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: Spacing.screenH,
    paddingTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenH,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  checkContainer: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  checkGlow: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.neutral.positive,
    opacity: 0.18,
  },
  checkCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.neutral.positive,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.neutral.positive,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  confetti: {
    position: "absolute",
    borderRadius: 4,
  },
  confettiDash: {
    borderRadius: 2,
  },
  confettiDot: {
    borderRadius: 99,
  },
  amount: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.neutral.dark,
    marginTop: 8,
  },
  recipient: {
    fontSize: 14,
    color: Colors.neutral.hint,
  },
  receipt: {
    width: "100%",
    backgroundColor: "#F8F9FC",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  receiptLabel: {
    fontSize: 13,
    color: Colors.neutral.hint,
  },
  receiptValue: {
    fontSize: 13,
    color: Colors.neutral.dark,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 8,
    gap: 12,
    alignItems: "center",
  },
  sendAnother: {
    paddingVertical: 4,
  },
});
