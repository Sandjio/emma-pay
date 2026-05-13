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

type Contact = {
  id: string;
  initials: string;
  name: string;
  handle: string;
  accent: string;
};

const RECENTS: Contact[] = [
  { id: "daniel", initials: "DM", name: "Daniel", handle: "@dmensah", accent: "#DBEAFE" },
  { id: "sofia", initials: "SR", name: "Sofia", handle: "@sofia.r", accent: "#FCE7F3" },
  { id: "kwame", initials: "KA", name: "Kwame", handle: "@kwame", accent: "#FEF3C7" },
];

const CONTACTS: Contact[] = [
  { id: "daniel", initials: "DM", name: "Daniel Mensah", handle: "@dmensah", accent: "#DBEAFE" },
  { id: "sofia", initials: "SR", name: "Sofia Reyes", handle: "@sofia.r", accent: "#FCE7F3" },
  { id: "kwame", initials: "KA", name: "Kwame Asante", handle: "@kwame", accent: "#FEF3C7" },
  { id: "jin", initials: "JP", name: "Jin Park", handle: "@jinp", accent: "#E0E7FF" },
  { id: "lola", initials: "LA", name: "Lola Adeyemi", handle: "@lolaade", accent: "#DCFCE7" },
  { id: "marcus", initials: "MC", name: "Marcus Chen", handle: "@marcuschen", accent: "#FFE4E6" },
];

const ACCENT_TEXT: Record<string, string> = {
  "#DBEAFE": "#1D4ED8",
  "#FCE7F3": "#BE185D",
  "#FEF3C7": "#A16207",
  "#E0E7FF": "#4338CA",
  "#DCFCE7": "#15803D",
  "#FFE4E6": "#BE123C",
};

export default function SendMoneyScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
          {RECENTS.map((c) => (
            <View key={c.id} style={styles.recentItem}>
              <View style={[styles.recentAvatar, { backgroundColor: c.accent }]}>
                <Text style={[styles.recentInitials, { color: ACCENT_TEXT[c.accent] }]}>
                  {c.initials}
                </Text>
              </View>
              <Text style={styles.recentName}>{c.name}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={[styles.sectionLabel, styles.allContactsLabel]}>ALL CONTACTS</Text>

        <View style={styles.contactList}>
          {CONTACTS.map((c) => (
            <View key={c.id} style={styles.contactRow}>
              <View style={[styles.contactAvatar, { backgroundColor: c.accent }]}>
                <Text style={[styles.contactInitials, { color: ACCENT_TEXT[c.accent] }]}>
                  {c.initials}
                </Text>
              </View>
              <View style={styles.contactBody}>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactHandle}>{c.handle}</Text>
              </View>
              <TouchableOpacity
                style={styles.sendPill}
                onPress={() => router.push("/success")}
                activeOpacity={0.85}
                hitSlop={4}
              >
                <Text style={styles.sendPillText}>Send</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  searchWrap: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 4,
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
});
