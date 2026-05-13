import { PrimaryButton, ScreenHeader } from "@/components/ui";
import { Colors, Spacing } from "@/constants/theme";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AVAILABLE_BALANCE = 12480.32;

export default function WithdrawScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(500);

  const integer = Math.floor(amount).toString();
  const decimals = (amount % 1).toFixed(2).slice(2);

  function formatCurrency(value: number) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
          onPress={() => setAmount(AVAILABLE_BALANCE)}
          activeOpacity={0.85}
        >
          <Text style={styles.availableText}>
            Available {formatCurrency(AVAILABLE_BALANCE)} ·{" "}
            <Text style={styles.availableAction}>Withdraw all</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Send to</Text>

        <TouchableOpacity style={styles.bankCard} activeOpacity={0.85}>
          <View style={styles.bankIcon}>
            <MaterialCommunityIcons
              name="bank-outline"
              size={22}
              color={Colors.brand.deepBlue}
            />
          </View>
          <View style={styles.bankBody}>
            <Text style={styles.bankName}>Bank of America</Text>
            <Text style={styles.bankDetail}>Checking · **8847</Text>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.neutral.hint} />
        </TouchableOpacity>

        <View style={styles.summary}>
          <SummaryRow label="Amount" value={formatCurrency(amount)} />
          <SummaryRow label="Fee" value="Free" />
          <SummaryRow label="Arrives" value="Tomorrow by 5pm" />
          <View style={styles.divider} />
          <SummaryRow
            label="You'll receive"
            value={formatCurrency(amount)}
            emphasized
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Withdraw to bank"
          onPress={() => router.back()}
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
    backgroundColor: "#F0F2F8",
    alignItems: "center",
    justifyContent: "center",
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
  footer: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 8,
  },
});
