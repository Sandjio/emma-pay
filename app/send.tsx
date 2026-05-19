import { ScreenHeader } from "@/components/ui";
import { Colors, Spacing } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError, ApiContact } from "./lib/api";
import { useContactsQuery } from "./lib/queries/useContacts";
import { useSendMutation } from "./lib/queries/useTransactions";

const ACCENT_TEXT: Record<string, string> = {
  "#DBEAFE": "#1D4ED8",
  "#FCE7F3": "#BE185D",
  "#FEF3C7": "#A16207",
  "#E0E7FF": "#4338CA",
  "#DCFCE7": "#15803D",
  "#FFE4E6": "#BE123C",
};

function textColorFor(accent: string): string {
  return ACCENT_TEXT[accent] ?? Colors.brand.blue;
}

export default function SendMoneyScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("10");
  const [error, setError] = useState("");

  const contactsQuery = useContactsQuery();
  const sendMutation = useSendMutation();
  const contacts = contactsQuery.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q),
    );
  }, [contacts, query]);

  const recents = filtered.slice(0, 3);

  async function handleSend(contact: ApiContact) {
    setError("");
    const trimmed = amount.trim();
    if (!/^\d+(\.\d{1,2})?$/.test(trimmed) || Number(trimmed) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    try {
      const txn = await sendMutation.mutateAsync({
        amount: trimmed,
        currency: "USD",
        counterpartyName: contact.name,
        contactId: contact.id,
      });
      router.replace({ pathname: "/success", params: { txnId: txn.id } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send payment");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="Send money"
          onBack={() => router.back()}
          rightIcon="grid"
          onRightPress={() => {}}
        />
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Amount</Text>
        <View style={styles.amountField}>
          <Text style={styles.currencyPrefix}>$</Text>
          <TextInput
            style={styles.amountInput}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={Colors.neutral.hint}
          />
        </View>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={Colors.neutral.hint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, @username or email"
            placeholderTextColor={Colors.neutral.hint}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {contacts.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No contacts yet</Text>
            <Text style={styles.emptyHint}>
              Tap “New” to add someone you’ve paid.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>RECENT</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentRow}
            >
              <View style={styles.recentItem}>
                <View style={[styles.recentAvatar, styles.recentNew]}>
                  <Feather name="plus" size={22} color={Colors.brand.blue} />
                </View>
                <Text style={styles.recentName}>New</Text>
              </View>
              {recents.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.recentItem}
                  onPress={() => handleSend(c)}
                  disabled={sendMutation.isPending}
                  activeOpacity={0.85}
                >
                  <View
                    style={[styles.recentAvatar, { backgroundColor: c.accentColor }]}
                  >
                    <Text
                      style={[
                        styles.recentInitials,
                        { color: textColorFor(c.accentColor) },
                      ]}
                    >
                      {c.initials}
                    </Text>
                  </View>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {c.name.split(" ")[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.sectionLabel, styles.allContactsLabel]}>
              ALL CONTACTS
            </Text>

            <View style={styles.contactList}>
              {filtered.map((c) => (
                <View key={c.id} style={styles.contactRow}>
                  <View
                    style={[styles.contactAvatar, { backgroundColor: c.accentColor }]}
                  >
                    <Text
                      style={[
                        styles.contactInitials,
                        { color: textColorFor(c.accentColor) },
                      ]}
                    >
                      {c.initials}
                    </Text>
                  </View>
                  <View style={styles.contactBody}>
                    <Text style={styles.contactName}>{c.name}</Text>
                    <Text style={styles.contactHandle}>{c.handle}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.sendPill}
                    onPress={() => handleSend(c)}
                    disabled={sendMutation.isPending}
                    activeOpacity={0.85}
                    hitSlop={4}
                  >
                    <Text style={styles.sendPillText}>
                      {sendMutation.isPending ? "…" : "Send"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
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
  amountRow: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 4,
    gap: 6,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.neutral.hint,
    letterSpacing: 0.6,
  },
  amountField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.neutral.dark,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral.dark,
    padding: 0,
  },
  searchWrap: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 12,
    paddingBottom: 12,
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
  errorText: {
    fontSize: 13,
    color: Colors.neutral.errorText,
    paddingHorizontal: Spacing.screenH,
    paddingBottom: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    color: Colors.neutral.hint,
    fontWeight: "700",
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.screenH,
  },
  allContactsLabel: {
    marginTop: 20,
    marginBottom: 4,
  },
  recentRow: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 12,
    gap: 20,
  },
  recentItem: {
    alignItems: "center",
    gap: 6,
    width: 60,
  },
  recentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  recentNew: {
    backgroundColor: "#EEF1FB",
    borderWidth: 1.5,
    borderColor: "#DBE3F7",
    borderStyle: "dashed",
  },
  recentInitials: {
    fontSize: 14,
    fontWeight: "700",
  },
  recentName: {
    fontSize: 12,
    color: Colors.neutral.body,
  },
  contactList: {
    paddingHorizontal: Spacing.screenH,
    marginTop: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInitials: {
    fontSize: 13,
    fontWeight: "700",
  },
  contactBody: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  contactHandle: {
    fontSize: 13,
    color: Colors.neutral.hint,
  },
  sendPill: {
    paddingHorizontal: 18,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF1FB",
    alignItems: "center",
    justifyContent: "center",
  },
  sendPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.brand.blue,
  },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 60,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  emptyHint: {
    fontSize: 13,
    color: Colors.neutral.hint,
  },
});
