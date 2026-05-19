import { PrimaryButton, ScreenHeader } from "@/components/ui";
import { Colors, Spacing } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "./lib/api";
import { useBankAccountsQuery } from "./lib/queries/useBankAccounts";
import { useCardsQuery } from "./lib/queries/useCards";
import { useTopUpMutation } from "./lib/queries/useTransactions";

const PRESETS = [50, 100, 250, 500];

export default function TopUpScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(250);
  const [bankId, setBankId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const cardsQuery = useCardsQuery();
  const banksQuery = useBankAccountsQuery();
  const topUp = useTopUpMutation();

  const cards = cardsQuery.data ?? [];
  const banks = banksQuery.data ?? [];
  const primaryCard = cards[0];

  useEffect(() => {
    if (!bankId && banks.length > 0) {
      const primary = banks.find((b) => b.isPrimary) ?? banks[0];
      setBankId(primary.id);
    }
  }, [banks, bankId]);

  const integer = Math.floor(amount).toString();
  const decimals = (amount % 1).toFixed(2).slice(2);
  const fixed = `${integer}.${decimals}`;

  async function handleTopUp() {
    setError("");
    if (!primaryCard) {
      setError("You need a card to top up");
      return;
    }
    if (!bankId) {
      setError("Select a bank to fund this top up");
      return;
    }
    try {
      const txn = await topUp.mutateAsync({
        amount: fixed,
        currency: primaryCard.currency,
        cardId: primaryCard.id,
        bankAccountId: bankId,
      });
      router.replace({ pathname: "/success", params: { txnId: txn.id } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not top up");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="Top up"
          onBack={() => router.back()}
          rightIcon="help-circle"
          onRightPress={() => {}}
        />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.question}>How much to add?</Text>

        <View style={styles.amountRow}>
          <Text style={styles.amountCurrency}>$</Text>
          <Text style={styles.amountInteger}>{integer}</Text>
          <Text style={styles.amountDecimals}>.{decimals}</Text>
        </View>
        <Text style={styles.amountCaption}>USD · No fee on debit cards</Text>

        <View style={styles.chipsRow}>
          {PRESETS.map((value) => {
            const active = value === amount;
            return (
              <TouchableOpacity
                key={value}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setAmount(value)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  ${value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Pay with</Text>

        {banks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No bank linked</Text>
            <Text style={styles.emptyHint}>
              Link a bank account to fund your card.
            </Text>
            <TouchableOpacity
              style={styles.emptyCta}
              onPress={() => router.push("/link-bank")}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyCtaText}>Link a bank</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.methodList}>
            {banks.map((b) => {
              const selected = b.id === bankId;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.methodCard, selected && styles.methodCardActive]}
                  onPress={() => setBankId(b.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.methodIcon, { backgroundColor: b.logoColor }]}>
                    <Text style={styles.methodIconText}>{b.logoLetter}</Text>
                  </View>
                  <View style={styles.methodBody}>
                    <Text style={styles.methodName}>{b.institutionName}</Text>
                    <Text style={styles.methodDetail}>
                      {b.accountType === "SAVINGS" ? "Savings" : "Checking"} · ••{b.lastFour}
                    </Text>
                  </View>
                  <View style={[styles.radio, selected && styles.radioActive]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.infoBanner}>
          <View style={styles.infoIcon}>
            <Feather name="check" size={12} color={Colors.neutral.positive} />
          </View>
          <Text style={styles.infoText}>
            Funds arrive instantly with debit cards. Bank transfers can take 3-5
            business days.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={
            topUp.isPending
              ? "Topping up…"
              : `Top up $${fixed}`
          }
          onPress={handleTopUp}
          disabled={topUp.isPending || banks.length === 0 || !primaryCard}
        />
      </View>
    </SafeAreaView>
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
  question: {
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
  amountCaption: {
    fontSize: 13,
    color: Colors.neutral.hint,
    marginTop: 6,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  chip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF1FB",
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: Colors.brand.blue,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.brand.deepBlue,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  sectionLabel: {
    alignSelf: "flex-start",
    fontSize: 13,
    color: Colors.neutral.hint,
    fontWeight: "500",
    marginTop: 28,
    marginBottom: 12,
  },
  methodList: {
    width: "100%",
    gap: 10,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.neutral.divider,
    backgroundColor: "#FFFFFF",
  },
  methodCardActive: {
    borderColor: Colors.brand.blue,
    backgroundColor: "#F7F9FF",
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  methodIconText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  methodBody: {
    flex: 1,
    gap: 2,
  },
  methodName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  methodDetail: {
    fontSize: 12,
    color: Colors.neutral.hint,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.neutral.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: Colors.brand.blue,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brand.blue,
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
  errorText: {
    fontSize: 13,
    color: Colors.neutral.errorText,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#ECFDF5",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.neutral.positive,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#065F46",
    lineHeight: 17,
  },
  footer: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 8,
  },
});
