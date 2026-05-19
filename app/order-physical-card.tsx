import {
  CardVariant,
  PaymentCard,
  PrimaryButton,
  ScreenHeader,
} from "@/components/ui";
import { Colors, Spacing } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
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
import { ApiError } from "./lib/api";
import { useCreateCardMutation } from "./lib/queries/useCards";

type Finish = { id: CardVariant; label: string; color: string };

const FINISHES: Finish[] = [
  { id: "obsidian", label: "Obsidian", color: "#0F172A" },
  { id: "blue", label: "Cobalt", color: "#1B3A8C" },
  { id: "green", label: "Forest", color: "#047857" },
];

export default function OrderPhysicalCardScreen() {
  const router = useRouter();
  const [finish, setFinish] = useState<CardVariant>("obsidian");
  const [error, setError] = useState("");
  const createCard = useCreateCardMutation();

  async function handleOrder() {
    setError("");
    try {
      await createCard.mutateAsync({
        type: "PHYSICAL",
        variant: finish.toUpperCase() as "BLUE" | "PURPLE" | "GREEN" | "OBSIDIAN",
        currency: "USD",
      });
      router.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not order card");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.headerWrap}>
        <ScreenHeader title="Order physical card" onBack={() => router.back()} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PaymentCard type="PHYSICAL" balance="$0.00" variant={finish} />

        <Text style={styles.label}>Pick a finish</Text>
        <View style={styles.finishRow}>
          {FINISHES.map((f) => {
            const active = f.id === finish;
            return (
              <TouchableOpacity
                key={f.id}
                style={styles.finishItem}
                onPress={() => setFinish(f.id)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.finishSwatch,
                    { backgroundColor: f.color },
                    active && styles.finishSwatchActive,
                  ]}
                />
                <Text
                  style={[
                    styles.finishLabel,
                    active && styles.finishLabelActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Ship to</Text>
        <View style={styles.addressCard}>
          <View style={styles.addressIcon}>
            <Feather name="home" size={20} color={Colors.brand.deepBlue} />
          </View>
          <View style={styles.addressBody}>
            <Text style={styles.addressName}>Home</Text>
            <Text style={styles.addressLine}>340 Bryant St, Apt 4B</Text>
            <Text style={styles.addressLine}>San Francisco, CA 94107</Text>
            <TouchableOpacity hitSlop={4}>
              <Text style={styles.changeLink}>Change address</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Card fee</Text>
            <Text style={styles.summaryValue}>$4.99</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Free · 5-7 business days</Text>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={createCard.isPending ? "Ordering…" : "Order card"}
          onPress={handleOrder}
          disabled={createCard.isPending}
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
  },
  label: {
    fontSize: 13,
    color: Colors.neutral.hint,
    fontWeight: "500",
    marginTop: 24,
    marginBottom: 10,
  },
  finishRow: {
    flexDirection: "row",
    gap: 12,
  },
  finishItem: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  finishSwatch: {
    width: "100%",
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  finishSwatchActive: {
    borderColor: Colors.brand.blue,
  },
  finishLabel: {
    fontSize: 13,
    color: Colors.neutral.body,
    fontWeight: "500",
  },
  finishLabelActive: {
    color: Colors.brand.blue,
    fontWeight: "600",
  },
  addressCard: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    backgroundColor: "#F8F9FC",
    borderRadius: 14,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  addressBody: {
    flex: 1,
    gap: 2,
  },
  addressName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  addressLine: {
    fontSize: 13,
    color: Colors.neutral.body,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.brand.blue,
    marginTop: 4,
  },
  summary: {
    backgroundColor: "#F8F9FC",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    gap: 10,
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
  footer: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: Colors.neutral.errorText,
    marginTop: 12,
  },
});
