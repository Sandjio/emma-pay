import { ScreenHeader, TransactionItem } from "@/components/ui";
import { Colors, Spacing } from "@/constants/theme";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterId = "all" | "sent" | "received" | "topup" | "cards";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sent", label: "Sent" },
  { id: "received", label: "Received" },
  { id: "topup", label: "Top up" },
  { id: "cards", label: "Cards" },
];

type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  positive?: boolean;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  filters: FilterId[];
};

type DateGroup = { label: string; items: ActivityItem[] };

const ACTIVITY: DateGroup[] = [
  {
    label: "TODAY",
    items: [
      {
        id: "spotify",
        title: "Spotify Premium",
        subtitle: "9:22 AM · Card",
        amount: "-$10.99",
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
        icon: <Feather name="headphones" size={18} color="#16A34A" />,
        filters: ["all", "cards"],
      },
      {
        id: "daniel",
        title: "Daniel Mensah",
        subtitle: "9:41 AM · Sent",
        amount: "-$45.00",
        iconBg: "#DBEAFE",
        iconColor: "#2563EB",
        icon: <Feather name="send" size={16} color="#2563EB" />,
        filters: ["all", "sent"],
      },
    ],
  },
  {
    label: "YESTERDAY",
    items: [
      {
        id: "topup-chase",
        title: "Top up · Chase",
        subtitle: "4:13 PM · Debit",
        amount: "+$200.00",
        positive: true,
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
        icon: <Feather name="plus" size={18} color="#16A34A" />,
        filters: ["all", "topup"],
      },
      {
        id: "whole-foods",
        title: "Whole Foods",
        subtitle: "1:08 PM · Card",
        amount: "-$84.20",
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
        icon: (
          <MaterialCommunityIcons name="leaf" size={18} color="#16A34A" />
        ),
        filters: ["all", "cards"],
      },
      {
        id: "sofia",
        title: "Sofia Reyes",
        subtitle: "11:51 AM · Received",
        amount: "+$60.00",
        positive: true,
        iconBg: "#DBEAFE",
        iconColor: "#2563EB",
        icon: <Feather name="arrow-down" size={16} color="#2563EB" />,
        filters: ["all", "received"],
      },
    ],
  },
  {
    label: "MAY 9",
    items: [
      {
        id: "uber",
        title: "Uber",
        subtitle: "Refund",
        amount: "+$14.50",
        positive: true,
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
        icon: <Feather name="truck" size={16} color="#DC2626" />,
        filters: ["all", "received"],
      },
      {
        id: "withdraw-boa",
        title: "Withdraw to BoA",
        subtitle: "Bank · ••8847",
        amount: "-$300.00",
        iconBg: "#DBEAFE",
        iconColor: "#2563EB",
        icon: <Feather name="arrow-up" size={16} color="#2563EB" />,
        filters: ["all", "sent"],
      },
    ],
  },
];

export default function ActivityScreen() {
  const [filter, setFilter] = useState<FilterId>("all");

  const groups = ACTIVITY.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.filters.includes(filter)),
  })).filter((g) => g.items.length > 0);

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
        {groups.map((group) => (
          <View key={group.label} style={styles.section}>
            <Text style={styles.sectionLabel}>{group.label}</Text>
            <View style={styles.card}>
              {group.items.map((item, idx) => (
                <View key={item.id}>
                  <TransactionItem
                    icon={item.icon}
                    iconBg={item.iconBg}
                    title={item.title}
                    subtitle={item.subtitle}
                    amount={item.amount}
                    positive={item.positive}
                  />
                  {idx < group.items.length - 1 ? (
                    <View style={styles.itemDivider} />
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ))}
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
});
