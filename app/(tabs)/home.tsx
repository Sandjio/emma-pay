import {
  Avatar,
  QuickAction,
  TransactionItem,
} from "@/components/ui";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth-context";
import {
  firstName,
  formatCurrency,
  formatCurrencyParts,
  initialsFromName,
  isPositive,
  signedAmount,
  transactionSubtitle,
  transactionTitle,
} from "../lib/format";
import { useCardsQuery } from "../lib/queries/useCards";
import { useTransactionsQuery } from "../lib/queries/useTransactions";
import { sumCardBalances, summarizeTransactions } from "../lib/summarize";
import { iconForTransaction } from "../lib/transactionIcon";

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HomeScreen() {
  const router = useRouter();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const { user } = useAuth();
  const cardsQuery = useCardsQuery();
  const txnsQuery = useTransactionsQuery();

  const cards = cardsQuery.data ?? [];
  const txns = txnsQuery.data ?? [];

  const totalBalance = useMemo(() => sumCardBalances(cards), [cards]);
  const summary = useMemo(() => summarizeTransactions(txns), [txns]);
  const balanceParts = formatCurrencyParts(totalBalance);

  const monthlyValue = Number(summary.monthlyChange);
  const monthlyLabel = `${monthlyValue >= 0 ? "+" : "-"}${formatCurrency(
    Math.abs(monthlyValue),
  )} this month`;

  const recentTxns = txns.slice(0, 3);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={Colors.brand.splashGradient}
          locations={[0, 0.55, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={["top"]} style={styles.headerInner}>
            <View style={styles.userRow}>
              <Avatar initials={user ? initialsFromName(user.name) : "?"} />
              <View style={styles.greetingGroup}>
                <Text style={styles.greetingSmall}>Good morning</Text>
                <Text style={styles.greetingName}>
                  {user ? firstName(user.name) : ""}
                </Text>
              </View>
              <TouchableOpacity style={styles.bellButton} hitSlop={8}>
                <Feather name="bell" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.balanceGroup}>
              <TouchableOpacity
                style={styles.balanceLabelRow}
                onPress={() => setBalanceVisible((v) => !v)}
                activeOpacity={0.7}
                hitSlop={8}
              >
                <Text style={styles.balanceLabel}>Available balance</Text>
                <Feather
                  name={balanceVisible ? "eye" : "eye-off"}
                  size={14}
                  color="rgba(255,255,255,0.85)"
                />
              </TouchableOpacity>
              <Text style={styles.balanceAmount}>
                {balanceVisible ? (
                  <>
                    {balanceParts.whole}
                    <Text style={styles.balanceDecimal}>
                      {balanceParts.fraction}
                    </Text>
                  </>
                ) : (
                  "••••••"
                )}
              </Text>
              <Text
                style={[
                  styles.balanceChange,
                  monthlyValue < 0 && styles.balanceChangeNegative,
                ]}
              >
                {monthlyLabel}
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.actionsCard}>
          <QuickAction
            label="Top up"
            iconBg={Colors.quickAction.topUp.bg}
            onPress={() => router.push("/top-up")}
            icon={
              <Feather
                name="plus"
                size={22}
                color={Colors.quickAction.topUp.icon}
              />
            }
          />
          <QuickAction
            label="Send"
            iconBg={Colors.quickAction.send.bg}
            onPress={() => router.push("/send")}
            icon={
              <Feather
                name="send"
                size={20}
                color={Colors.quickAction.send.icon}
              />
            }
          />
          <QuickAction
            label="Withdraw"
            iconBg={Colors.quickAction.withdraw.bg}
            onPress={() => router.push("/withdraw")}
            icon={
              <Feather
                name="arrow-up"
                size={22}
                color={Colors.quickAction.withdraw.icon}
              />
            }
          />
          <QuickAction
            label="Request"
            iconBg={Colors.quickAction.request.bg}
            icon={
              <Feather
                name="arrow-down"
                size={22}
                color={Colors.quickAction.request.icon}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This week</Text>
            <Text style={styles.sectionMeta}>
              {formatCurrency(summary.weeklySpent)} spent
            </Text>
          </View>
          <View style={styles.weekRow}>
            {WEEK_DAYS.map((d, i) => (
              <Text key={i} style={styles.weekLabel}>
                {d}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent activity</Text>
            <TouchableOpacity hitSlop={8} onPress={() => router.push("/activity")}>
              <Text style={Typography.link}>See all</Text>
            </TouchableOpacity>
          </View>
          <View>
            {recentTxns.length === 0 ? (
              <Text style={styles.emptyText}>
                Your activity will show up here.
              </Text>
            ) : (
              recentTxns.map((t) => {
                const icon = iconForTransaction(t);
                return (
                  <TransactionItem
                    key={t.id}
                    iconBg={icon.bg}
                    icon={icon.node}
                    title={transactionTitle(t)}
                    subtitle={transactionSubtitle(t)}
                    amount={signedAmount(t, t.currency)}
                    positive={isPositive(t)}
                  />
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.neutral.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerGradient: {
    paddingBottom: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerInner: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 8,
    gap: 28,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  greetingGroup: {
    flex: 1,
    gap: 2,
  },
  greetingSmall: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
  greetingName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceGroup: {
    gap: 6,
  },
  balanceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 38,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  balanceDecimal: {
    color: "rgba(255,255,255,0.55)",
    fontWeight: "700",
  },
  balanceChange: {
    fontSize: 13,
    color: "#86EFAC",
    fontWeight: "500",
    marginTop: 2,
  },
  balanceChangeNegative: {
    color: "#FCA5A5",
  },
  actionsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    marginHorizontal: Spacing.screenH,
    marginTop: -40,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  section: {
    paddingHorizontal: Spacing.screenH,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.neutral.dark,
  },
  sectionMeta: {
    fontSize: 13,
    color: Colors.neutral.hint,
    fontWeight: "500",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  weekLabel: {
    fontSize: 12,
    color: Colors.neutral.hint,
    fontWeight: "500",
    width: 28,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 13,
    color: Colors.neutral.hint,
    paddingVertical: 12,
  },
});
