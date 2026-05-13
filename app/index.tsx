import { AppLogo, PrimaryButton } from "@/components/ui";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={Colors.brand.splashGradient}
      locations={[0, 0.55, 1]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.container}>
        <View style={styles.topSpacer} />

        <View style={styles.centerContent}>
          <AppLogo variant="large" textColor={Colors.brand.white} />
          <View style={styles.taglineGroup}>
            <Text style={styles.tagline}>
              Money that{"\n"}moves at your{"\n"}speed.
            </Text>
            <Text style={styles.subtitle}>
              Send, receive and grow your balance in over 80 currencies — all
              from one account.
            </Text>
          </View>
        </View>

        <View style={styles.bottomActions}>
          <PrimaryButton
            label="Get started"
            onPress={() => router.push("/sign-up")}
          />
          <TouchableOpacity onPress={() => router.push("/log-in")} hitSlop={8}>
            <Text style={styles.alreadyAccount}>I already have an account</Text>
          </TouchableOpacity>
          <Text style={Typography.finePrint}>
            By continuing you agree to our Terms &amp; Privacy Policy
          </Text>
        </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  topSpacer: {
    flex: 0.5,
  },
  centerContent: {
    flex: 3,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: Spacing.screenH,
    gap: 32,
  },
  taglineGroup: {
    alignItems: "flex-start",
    gap: 12,
    width: "100%",
  },
  tagline: {
    ...Typography.splashTagline,
    textAlign: "left",
  },
  subtitle: {
    ...Typography.splashSubtitle,
    textAlign: "left",
    paddingHorizontal: 8,
  },
  bottomActions: {
    paddingHorizontal: Spacing.screenH,
    paddingBottom: 24,
    gap: 16,
    alignItems: "center",
    width: "100%",
  },
  alreadyAccount: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.brand.white,
    textAlign: "center",
  },
});
