import {
  PaymentCard,
  QuickAction,
  SettingsRow,
} from "@/components/ui";
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
import { formatCurrency } from "../lib/format";
import { useCardsQuery } from "../lib/queries/useCards";

function variantToProp(v: string) {
  return v.toLowerCase() as "blue" | "purple" | "green" | "obsidian";
}

export default function CardsScreen() {
  const router = useRouter();
  const { data } = useCardsQuery();
  const cards = data ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const safeIdx = Math.min(activeIdx, Math.max(cards.length - 1, 0));
  const active = cards[safeIdx];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Cards</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/new-virtual-card")}
            hitSlop={8}
          >
            <Feather name="plus" size={22} color={Colors.neutral.dark} />
          </TouchableOpacity>
        </View>

        {cards.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No cards yet</Text>
            <Text style={styles.emptyHint}>
              Tap + above to create your first virtual card.
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const w = e.nativeEvent.layoutMeasurement.width;
                if (w > 0) {
                  setActiveIdx(Math.round(e.nativeEvent.contentOffset.x / w));
                }
              }}
            >
              {cards.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.95}
                  onPress={() =>
                    router.push({ pathname: "/card-details", params: { id: c.id } })
                  }
                  style={styles.cardSlide}
                >
                  <PaymentCard
                    type={c.type}
                    currency={c.currency}
                    balance={formatCurrency(c.balance, c.currency)}
                    lastFour={c.lastFour}
                    variant={variantToProp(c.variant)}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.dotsRow}>
              {cards.map((c, i) => (
                <View
                  key={c.id}
                  style={[styles.dot, i === safeIdx && styles.dotActive]}
                />
              ))}
            </View>

            {active ? (
              <Text style={styles.caption}>
                <Text style={styles.captionLabel}>Online shopping</Text>{" "}
                <Text style={styles.captionAmount}>
                  {formatCurrency(active.balance, active.currency)}
                </Text>{" "}
                <Text style={styles.captionLabel}>available</Text>
              </Text>
            ) : null}
          </>
        )}

        <View style={styles.actionsRow}>
          <QuickAction
            label="Top up"
            iconBg="#F4F5F9"
            onPress={() => router.push("/top-up")}
            icon={
              <Feather name="plus" size={20} color={Colors.neutral.dark} />
            }
          />
          <QuickAction
            label="Freeze"
            iconBg="#F4F5F9"
            icon={
              <Feather name="lock" size={18} color={Colors.neutral.dark} />
            }
          />
          <QuickAction
            label="Details"
            iconBg="#F4F5F9"
            onPress={() =>
              active
                ? router.push({ pathname: "/card-details", params: { id: active.id } })
                : undefined
            }
            icon={
              <Feather name="eye" size={18} color={Colors.neutral.dark} />
            }
          />
          <QuickAction
            label="Settings"
            iconBg="#F4F5F9"
            icon={
              <Feather name="settings" size={18} color={Colors.neutral.dark} />
            }
          />
        </View>

        <Text style={styles.sectionLabel}>ADD NEW</Text>
        <View style={styles.card}>
          <SettingsRow
            iconBg="#DBEAFE"
            icon={
              <Feather name="credit-card" size={18} color="#2563EB" />
            }
            title="Virtual card"
            subtitle="Instant · Free · For online use"
            onPress={() => router.push("/new-virtual-card")}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconBg="#FCE7F3"
            icon={
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={20}
                color="#BE185D"
              />
            }
            title="Physical card"
            subtitle="Ships in 5-7 days · $4.99"
            onPress={() => router.push("/order-physical-card")}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconBg="#DCFCE7"
            icon={
              <MaterialCommunityIcons
                name="bank-outline"
                size={20}
                color="#15803D"
              />
            }
            title="Link a bank account"
            subtitle="Plaid · ACH transfers"
            onPress={() => router.push("/link-bank")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenH,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.neutral.dark,
    letterSpacing: -0.5,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  cardSlide: {
    width: 360 - Spacing.screenH * 2,
    maxWidth: 380,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.neutral.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.brand.deepBlue,
  },
  caption: {
    fontSize: 13,
    color: Colors.neutral.hint,
    textAlign: "left",
    marginTop: 16,
  },
  captionLabel: {
    color: Colors.neutral.hint,
  },
  captionAmount: {
    color: Colors.neutral.dark,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.neutral.hint,
    letterSpacing: 0.8,
    marginTop: 28,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: Colors.neutral.background,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral.divider,
    marginLeft: 54,
  },
  emptyCard: {
    backgroundColor: Colors.neutral.background,
    borderRadius: 14,
    padding: 20,
    gap: 6,
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
});
