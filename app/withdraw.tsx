import { PrimaryButton, ScreenHeader } from "@/components/ui";
import { Colors, Spacing } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "./lib/api";
import { formatCurrency as fmtCurrency } from "./lib/format";
import { useBankAccountsQuery } from "./lib/queries/useBankAccounts";
import { useCardsQuery } from "./lib/queries/useCards";
import { useWithdrawMutation } from "./lib/queries/useTransactions";
import { sumCardBalances } from "./lib/summarize";

export default function WithdrawScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(500);
  const [bankId, setBankId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const cardsQuery = useCardsQuery();
  const banksQuery = useBankAccountsQuery();
  const withdraw = useWithdrawMutation();

  const cards = cardsQuery.data ?? [];
  const banks = banksQuery.data ?? [];
  const primaryCard = cards[0];
  const available = useMemo(() => sumCardBalances(cards), [cards]);
  const selectedBank = banks.find((b) => b.id === bankId);

  useEffect(() => {
    if (!bankId && banks.length > 0) {
      const primary = banks.find((b) => b.isPrimary) ?? banks[0];
      setBankId(primary.id);
    }
  }, [banks, bankId]);

  useEffect(() => {
    if (amount > available && available > 0) {
      setAmount(Math.floor(available));
    }
  }, [available, amount]);

  const integer = Math.floor(amount).toString();
  const decimals = (amount % 1).toFixed(2).slice(2);
  const fixed = `${integer}.${decimals}`;

  async function handleWithdraw() {
    setError("");
    if (!primaryCard) {
      setError("You need a card to withdraw from");
      return;
    }
    if (!bankId) {
      setError("Link a bank to receive your withdrawal");
      return;
    }
    if (amount > available) {
      setError("Amount exceeds available balance");
      return;
    }
    try {
      const txn = await withdraw.mutateAsync({
        amount: fixed,
        currency: primaryCard.currency,
        cardId: primaryCard.id,
        bankAccountId: bankId,
      });
      router.replace({ pathname: "/success", params: { txnId: txn.id } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not withdraw");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.headerWrap}>
        <ScreenHeader title="Withdraw" onBack={() => router.back()} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>Withdraw to bank</Text>

        <View style={styles.amountRow}>
          <Text style={styles.amountCurrency}>$</Text>
          <Text style={styles.amountInteger}>{integer}</Text>
          <Text style={styles.amountDecimals}>.{decimals}</Text>
        </View>

        <TouchableOpacity
          style={styles.availablePill}
          onPress={() => setAmount(available)}
          activeOpacity={0.85}
        >
          <Text style={styles.availableText}>
            Available {fmtCurrency(available)} ·{" "}
            <Text style={styles.availableAction}>Withdraw all</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Send to</Text>

        {banks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No bank linked</Text>
            <Text style={styles.emptyHint}>
              Link a bank account to receive withdrawals.
            </Text>
            <TouchableOpacity
              style={styles.emptyCta}
              onPress={() => router.push("/link-bank")}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyCtaText}>Link a bank</Text>
            </TouchableOpacity>
          </View>
        ) : selectedBank ? (
          <TouchableOpacity style={styles.bankCard} activeOpacity={0.85}>
            <View style={[styles.bankIcon, { backgroundColor: selectedBank.logoColor }]}>
              <Text style={styles.bankIconText}>{selectedBank.logoLetter}</Text>
            </View>
            <View style={styles.bankBody}>
              <Text style={styles.bankName}>{selectedBank.institutionName}</Text>
              <Text style={styles.bankDetail}>
                {selectedBank.accountType === "SAVINGS" ? "Savings" : "Checking"} ·
                **{selectedBank.lastFour}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.neutral.hint} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.summary}>
          <SummaryRow label="Amount" value={fmtCurrency(amount)} />
          <SummaryRow label="Fee" value="Free" />
          <SummaryRow label="Arrives" value="Tomorrow by 5pm" />
          <View style={styles.divider} />
          <SummaryRow
            label="You'll receive"
            value={fmtCurrency(amount)}
            emphasized
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={withdraw.isPending ? "Withdrawing…" : "Withdraw to bank"}
          onPress={handleWithdraw}
          disabled={withdraw.isPending || banks.length === 0 || !primaryCard}
        />
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  emphasized,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, emphasized && styles.summaryEmphLabel]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, emphasized && styles.summaryEmphValue]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.background,
  },
  headerWrap: {
    paddingHorizontal: Spacing.screenH,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenH,
    paddingBottom: 24,
    alignItems: "center",
  },
  kicker: {
    fontSize: 14,
    color: Colors.neutral.body,
    marginTop: 12,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
  },
  amountCurrency: {
    fontSize: 32,
    fontWeight: "600",
    color: Colors.neutral.placeholder,
    marginTop: 8,
    marginRight: 4,
  },
  amountInteger: {
    fontSize: 64,
    fontWeight: "800",
    color: Colors.neutral.dark,
    letterSpacing: -1.5,
    lineHeight: 70,
  },
  amountDecimals: {
    fontSize: 32,
    fontWeight: "600",
    color: Colors.neutral.placeholder,
    marginTop: 12,
  },
  availablePill: {
    backgroundColor: "#EEF1FB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  availableText: {
    fontSize: 12,
    color: Colors.brand.deepBlue,
    fontWeight: "500",
  },
  availableAction: {
    fontWeight: "700",
    color: Colors.brand.blue,
  },
  sectionLabel: {
    alignSelf: "flex-start",
    fontSize: 13,
    color: Colors.neutral.hint,
    fontWeight: "500",
    marginTop: 28,
    marginBottom: 10,
  },
  bankCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.neutral.divider,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bankIconText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bankBody: {
    flex: 1,
    gap: 2,
  },
  bankName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  bankDetail: {
    fontSize: 12,
    color: Colors.neutral.hint,
  },
  emptyCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.neutral.divider,
    padding: 16,
    gap: 8,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  emptyHint: {
    fontSize: 13,
    color: Colors.neutral.hint,
    textAlign: "center",
  },
  emptyCta: {
    marginTop: 6,
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.brand.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCtaText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summary: {
    width: "100%",
    backgroundColor: "#F8F9FC",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.neutral.hint,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.neutral.dark,
    fontWeight: "500",
  },
  summaryEmphLabel: {
    fontSize: 15,
    color: Colors.neutral.dark,
    fontWeight: "700",
  },
  summaryEmphValue: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.neutral.dark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral.divider,
  },
  errorText: {
    fontSize: 13,
    color: Colors.neutral.errorText,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  footer: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 8,
  },
});
