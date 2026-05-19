import { PaymentCard, ScreenHeader, SettingsRow } from "@/components/ui";
import { Colors, Spacing } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatCurrency } from "./lib/format";
import { useCardQuery, useCardsQuery } from "./lib/queries/useCards";

function variantToProp(v: string) {
  return v.toLowerCase() as "blue" | "purple" | "green" | "obsidian";
}

export default function CardDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const cardsQuery = useCardsQuery();
  const cards = cardsQuery.data ?? [];
  const cardId = params.id ?? cards[0]?.id ?? null;
  const cardQuery = useCardQuery(cardId);
  const card = cardQuery.data;

  const [revealed, setRevealed] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [onlinePayments, setOnlinePayments] = useState(true);
  const [spendingLimit, setSpendingLimit] = useState(false);

  useEffect(() => {
    if (cardsQuery.isSuccess && !cardId) {
      router.back();
    }
  }, [cardsQuery.isSuccess, cardId, router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="Card details"
          onBack={() => router.back()}
          rightIcon="settings"
          onRightPress={() => {}}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PaymentCard
          type={card?.type ?? "VIRTUAL"}
          currency={card?.currency ?? "USD"}
          balance={
            card ? formatCurrency(card.balance, card.currency) : "$0.00"
          }
          lastFour={card?.lastFour}
          variant={variantToProp(card?.variant ?? "BLUE")}
        />

        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>CARD NUMBER</Text>
          <Text style={styles.detailValue}>
            {revealed && card
              ? card.fullNumber
              : `•••• •••• •••• ${card?.lastFour ?? "••••"}`}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <View style={styles.detailHalf}>
            <Text style={styles.detailLabel}>EXPIRY</Text>
            <Text style={styles.detailValue}>
              {revealed && card ? card.expiry : "••/••"}
            </Text>
          </View>
          <View style={styles.detailHalf}>
            <Text style={styles.detailLabel}>CVV</Text>
            <Text style={styles.detailValue}>
              {revealed && card ? card.cvv : "•••"}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.revealRow}
          onPress={() => setRevealed((v) => !v)}
          activeOpacity={0.7}
        >
          <Feather
            name={revealed ? "eye-off" : "eye"}
            size={16}
            color={Colors.brand.blue}
          />
          <Text style={styles.revealText}>
            {revealed ? "Hide card number" : "Show full card number"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>CARD CONTROLS</Text>
        <View style={styles.controlsCard}>
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Feather name="lock" size={18} color={Colors.neutral.body} />
            }
            title="Freeze card"
            subtitle="Pauses all transactions"
            showChevron={false}
            right={
              <Switch
                value={frozen}
                onValueChange={setFrozen}
                trackColor={{ false: "#E5E7EB", true: Colors.brand.blue }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
              />
            }
          />
          <View style={styles.controlDivider} />
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Feather name="globe" size={18} color={Colors.neutral.body} />
            }
            title="Online payments"
            subtitle="Allowed"
            showChevron={false}
            right={
              <Switch
                value={onlinePayments}
                onValueChange={setOnlinePayments}
                trackColor={{ false: "#E5E7EB", true: Colors.brand.blue }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
              />
            }
          />
          <View style={styles.controlDivider} />
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Feather
                name="dollar-sign"
                size={18}
                color={Colors.neutral.body}
              />
            }
            title="Set spending limit"
            showChevron={false}
            right={
              <Switch
                value={spendingLimit}
                onValueChange={setSpendingLimit}
                trackColor={{ false: "#E5E7EB", true: Colors.brand.blue }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
              />
            }
          />
        </View>
      </ScrollView>
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
  },
  detailBlock: {
    marginTop: 24,
    gap: 6,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.neutral.hint,
    letterSpacing: 0.8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.dark,
    letterSpacing: 1,
  },
  detailRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  detailHalf: {
    flex: 1,
    gap: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral.divider,
    marginTop: 20,
  },
  revealRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  revealText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brand.blue,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.neutral.hint,
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 8,
  },
  controlsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Colors.neutral.divider,
  },
  controlDivider: {
    height: 1,
    backgroundColor: Colors.neutral.divider,
    marginLeft: 54,
  },
});
