import {
  CardVariant,
  PaymentCard,
  PrimaryButton,
  ScreenHeader,
  SettingsRow,
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "./lib/api";
import { useCreateCardMutation } from "./lib/queries/useCards";

type StyleOption = { id: CardVariant; color: string };

const STYLES: StyleOption[] = [
  { id: "blue", color: "#1B3A8C" },
  { id: "purple", color: "#6B21A8" },
  { id: "green", color: "#047857" },
  { id: "obsidian", color: "#0F172A" },
];

export default function NewVirtualCardScreen() {
  const router = useRouter();
  const [variant, setVariant] = useState<CardVariant>("blue");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const createCard = useCreateCardMutation();

  async function handleCreate() {
    setError("");
    try {
      await createCard.mutateAsync({
        type: "VIRTUAL",
        variant: variant.toUpperCase() as "BLUE" | "PURPLE" | "GREEN" | "OBSIDIAN",
        currency: "USD",
      });
      router.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create card");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.headerWrap}>
        <ScreenHeader title="New virtual card" onBack={() => router.back()} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PaymentCard
          type="VIRTUAL"
          balance="$0.00"
          variant={variant}
        />

        <Text style={styles.label}>Card style</Text>
        <View style={styles.swatchRow}>
          {STYLES.map((s) => {
            const active = s.id === variant;
            return (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.swatch,
                  { backgroundColor: s.color },
                  active && styles.swatchActive,
                ]}
                onPress={() => setVariant(s.id)}
                activeOpacity={0.85}
              >
                {active ? (
                  <Feather name="check" size={16} color="#FFFFFF" />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Card name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Give your card a name"
          placeholderTextColor={Colors.neutral.placeholder}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={[styles.card, styles.cardSpacer]}>
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Feather
                name="dollar-sign"
                size={18}
                color={Colors.neutral.body}
              />
            }
            title="Spending limit"
            trailingText="No limit"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Feather name="shield" size={18} color={Colors.neutral.body} />
            }
            title="Allowed merchants"
            trailingText="All"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Feather
                name="dollar-sign"
                size={18}
                color={Colors.neutral.body}
              />
            }
            title="Currency"
            trailingText="USD"
            onPress={() => {}}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={createCard.isPending ? "Creating…" : "Create card · Free"}
          onPress={handleCreate}
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
  swatchRow: {
    flexDirection: "row",
    gap: 12,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchActive: {
    borderColor: Colors.brand.blue,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: Colors.neutral.divider,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.neutral.dark,
    backgroundColor: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Colors.neutral.divider,
  },
  cardSpacer: {
    marginTop: 16,
  },
  errorText: {
    fontSize: 13,
    color: Colors.neutral.errorText,
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral.divider,
    marginLeft: 54,
  },
  footer: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 8,
  },
});
