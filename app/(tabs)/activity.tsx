import { ScreenHeader, TransactionItem } from "@/components/ui";
import { Colors, Spacing } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ApiTransaction } from "../lib/api";
import {
  formatRelativeDay,
  formatTime,
  isPositive,
  signedAmount,
  transactionTitle,
} from "../lib/format";
import { useTransactionsQuery } from "../lib/queries/useTransactions";
import { iconForTransaction } from "../lib/transactionIcon";

type FilterId = "all" | "sent" | "received" | "topup" | "cards";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sent", label: "Sent" },
  { id: "received", label: "Received" },
  { id: "topup", label: "Top up" },
  { id: "cards", label: "Cards" },
];

function matchesFilter(t: ApiTransaction, filter: FilterId): boolean {
  if (filter === "all") return true;
  if (filter === "sent") return t.type === "SEND" || t.type === "WITHDRAW";
  if (filter === "received") return t.type === "RECEIVE";
  if (filter === "topup") return t.type === "TOPUP";
  if (filter === "cards") return t.type === "SEND" || t.type === "WITHDRAW";
  return true;
}

function subtitleForActivity(t: ApiTransaction): string {
  const time = formatTime(t.createdAt);
  switch (t.type) {
    case "SEND":
      return `${time} · Sent`;
    case "RECEIVE":
      return `${time} · Received`;
    case "TOPUP":
      return t.bankAccount
        ? `${time} · ${t.bankAccount.institutionName}`
        : `${time} · Top up`;
    case "WITHDRAW":
      return t.bankAccount
        ? `${time} · Bank · ••${t.bankAccount.lastFour}`
        : `${time} · Withdraw`;
    default:
      return time;
  }
}

function groupByDay(txns: ApiTransaction[]): { label: string; items: ApiTransaction[] }[] {
  const groups: Record<string, ApiTransaction[]> = {};
  const order: string[] = [];
  for (const t of txns) {
    const label = formatRelativeDay(t.createdAt).toUpperCase();
    if (!groups[label]) {
      groups[label] = [];
      order.push(label);
    }
    groups[label].push(t);
  }
  return order.map((label) => ({ label, items: groups[label] }));
}

export default function ActivityScreen() {
  const [filter, setFilter] = useState<FilterId>("all");
  const { data, isLoading } = useTransactionsQuery();
  const txns = data ?? [];

  const groups = useMemo(() => {
    const filtered = txns.filter((t) => matchesFilter(t, filter));
    return groupByDay(filtered);
  }, [txns, filter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="Activity"
          rightIcon="search"
          onRightPress={() => {}}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => {
          const active = f.id === filter;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(f.id)}
              activeOpacity={0.85}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>
              {isLoading ? "Loading…" : "No activity yet"}
            </Text>
            {!isLoading ? (
              <Text style={styles.emptyHint}>
                Your transactions will appear here.
              </Text>
            ) : null}
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.label} style={styles.section}>
              <Text style={styles.sectionLabel}>{group.label}</Text>
              <View style={styles.card}>
                {group.items.map((t, idx) => {
                  const icon = iconForTransaction(t);
                  return (
                    <View key={t.id}>
                      <TransactionItem
                        icon={icon.node}
                        iconBg={icon.bg}
                        title={transactionTitle(t)}
                        subtitle={subtitleForActivity(t)}
                        amount={signedAmount(t, t.currency)}
                        positive={isPositive(t)}
                      />
                      {idx < group.items.length - 1 ? (
                        <View style={styles.itemDivider} />
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.surface,
  },
  headerWrap: {
    paddingHorizontal: Spacing.screenH,
    backgroundColor: Colors.neutral.background,
  },
  filterRow: {
    paddingHorizontal: Spacing.screenH,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: Colors.neutral.background,
  },
  chip: {
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: Colors.neutral.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: Colors.brand.blue,
    borderColor: Colors.brand.blue,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.neutral.body,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 8,
    paddingBottom: 24,
  },
  section: {
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.neutral.hint,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.neutral.background,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  itemDivider: {
    height: 1,
    backgroundColor: Colors.neutral.divider,
    marginLeft: 52,
  },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 80,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  emptyHint: {
    fontSize: 13,
    color: Colors.neutral.hint,
  },
});
