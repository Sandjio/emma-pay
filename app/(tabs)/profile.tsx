import { Avatar, SettingsRow } from "@/components/ui";
import { Colors, Spacing } from "@/constants/theme";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Profile</Text>
          <TouchableOpacity hitSlop={8} onPress={() => {}}>
            <Feather
              name="settings"
              size={22}
              color={Colors.neutral.dark}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.userRow}>
          <Avatar initials="AO" size={56} variant="solid" />
          <View style={styles.userBody}>
            <Text style={styles.userName}>Amara Okafor</Text>
            <View style={styles.userMetaRow}>
              <Text style={styles.userMeta}>@amara · Verified</Text>
              <View style={styles.verifiedBadge}>
                <Feather name="check" size={10} color="#FFFFFF" />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editPill} activeOpacity={0.85}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <SectionLabel>ACCOUNT</SectionLabel>
        <View style={styles.card}>
          <SettingsRow
            iconBg="#DBEAFE"
            icon={<Feather name="user" size={18} color="#2563EB" />}
            title="Personal info"
            subtitle="Name, address, ID"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Feather name="credit-card" size={18} color={Colors.neutral.body} />
            }
            title="Payment methods"
            subtitle="3 cards · 1 bank"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Feather name="shield" size={18} color={Colors.neutral.body} />
            }
            title="Security"
            subtitle="Face ID, password, 2FA"
            onPress={() => {}}
          />
        </View>

        <SectionLabel>PREFERENCES</SectionLabel>
        <View style={styles.card}>
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Feather name="bell" size={18} color={Colors.neutral.body} />
            }
            title="Notifications"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Ionicons
                name="moon-outline"
                size={18}
                color={Colors.neutral.body}
              />
            }
            title="Appearance"
            subtitle="System"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconBg="#FEF3C7"
            icon={
              <MaterialCommunityIcons
                name="star-four-points-outline"
                size={20}
                color="#CA8A04"
              />
            }
            title="Refer a friend"
            subtitle="Earn $10"
            onPress={() => {}}
          />
        </View>

        <SectionLabel>SUPPORT</SectionLabel>
        <View style={styles.card}>
          <SettingsRow
            iconBg="#F4F5F9"
            icon={
              <Feather
                name="help-circle"
                size={18}
                color={Colors.neutral.body}
              />
            }
            title="Help center"
            onPress={() => {}}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutRow}
          onPress={() => router.replace("/")}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
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
    paddingBottom: 32,
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
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  userBody: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.neutral.dark,
  },
  userMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userMeta: {
    fontSize: 13,
    color: Colors.neutral.hint,
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.brand.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  editPill: {
    paddingHorizontal: 18,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: Colors.neutral.divider,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.neutral.background,
  },
  editText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.neutral.hint,
    letterSpacing: 0.8,
    marginTop: 20,
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
  logoutRow: {
    marginTop: 28,
    alignItems: "center",
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.neutral.errorText,
  },
});
