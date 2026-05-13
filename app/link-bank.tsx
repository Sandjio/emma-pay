import { ScreenHeader } from "@/components/ui";
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

type Bank = {
  id: string;
  name: string;
  letter: string;
  color: string;
};

const POPULAR: Bank[] = [
  { id: "chase", name: "Chase", letter: "C", color: "#117ACA" },
  { id: "bofa", name: "Bank of America", letter: "B", color: "#E31837" },
  { id: "wells", name: "Wells Fargo", letter: "W", color: "#D71E28" },
  { id: "citi", name: "Citi", letter: "C", color: "#056DAE" },
];

const ALL_BANKS: Bank[] = [
  { id: "capital", name: "Capital One", letter: "C", color: "#004977" },
  { id: "usbank", name: "U.S. Bank", letter: "U", color: "#1B488C" },
  { id: "pnc", name: "PNC Bank", letter: "P", color: "#FF8200" },
];

export default function LinkBankScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.headerWrap}>
        <ScreenHeader title="Link your bank" onBack={() => router.back()} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Securely connect via Plaid. We never see or store your login details.
        </Text>

        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={Colors.neutral.hint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your bank"
            placeholderTextColor={Colors.neutral.hint}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
        </View>

        <Text style={styles.sectionLabel}>POPULAR</Text>
        <View style={styles.bankCard}>
          {POPULAR.map((b, idx) => (
            <BankRow
              key={b.id}
              bank={b}
              showDivider={idx < POPULAR.length - 1}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>ALL BANKS</Text>
        <View style={styles.bankCard}>
          {ALL_BANKS.map((b, idx) => (
            <BankRow
              key={b.id}
              bank={b}
              showDivider={idx < ALL_BANKS.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BankRow({ bank, showDivider }: { bank: Bank; showDivider: boolean }) {
  return (
    <>
      <TouchableOpacity style={styles.row} activeOpacity={0.7}>
        <View style={[styles.bankLogo, { backgroundColor: bank.color }]}>
          <Text style={styles.bankLetter}>{bank.letter}</Text>
        </View>
        <Text style={styles.bankName}>{bank.name}</Text>
        <Feather
          name="chevron-right"
          size={20}
          color={Colors.neutral.hint}
        />
      </TouchableOpacity>
      {showDivider ? <View style={styles.divider} /> : null}
    </>
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
  subtitle: {
    fontSize: 14,
    color: Colors.neutral.body,
    lineHeight: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.neutral.dark,
    padding: 0,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.neutral.hint,
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  bankCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Colors.neutral.divider,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  bankLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  bankLetter: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  bankName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral.divider,
    marginLeft: 50,
  },
});
