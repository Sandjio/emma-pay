import { Colors, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <Ionicons name="scan-outline" size={72} color={Colors.brand.blue} />
        <Text style={styles.heading}>Scan to pay</Text>
        <Text style={styles.subheading}>
          Point your camera at a QR code to send or receive money instantly.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.surface,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  heading: {
    ...Typography.heading,
    textAlign: "center",
  },
  subheading: {
    ...Typography.subheading,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
