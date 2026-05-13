import {
  AppLogo,
  BackButton,
  FormInput,
  OutlineButton,
  PrimaryButton,
} from "@/components/ui";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LogInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function validateEmail(value: string) {
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("Enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePassword(value: string) {
    if (value.length === 0) {
      setPasswordError("Password is required");
      return false;
    }
    setPasswordError("");
    return true;
  }

  function handleSubmit() {
    setSubmitted(true);
    const emailOk = validateEmail(email);
    const passwordOk = validatePassword(password);
    if (!emailOk || !passwordOk) return;
    // TODO: call auth API
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackButton onPress={() => router.back()} />

          <View style={styles.logoRow}>
            <AppLogo variant="small" textColor={Colors.neutral.dark} />
          </View>

          <View style={styles.header}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>Log in to manage your money.</Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (submitted) validateEmail(text);
              }}
              onBlur={() => {
                if (submitted) validateEmail(email);
              }}
              error={emailError}
              placeholder="amara@emmapay.io"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />
            <View>
              <FormInput
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (submitted) validatePassword(text);
                }}
                onBlur={() => {
                  if (submitted) validatePassword(password);
                }}
                error={passwordError}
                secureTextEntry
                placeholder="••••••••"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <TouchableOpacity style={styles.forgotPassword} hitSlop={8}>
                <Text style={Typography.link}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <PrimaryButton label="Log in" onPress={handleSubmit} />

          <View style={styles.orRow}>
            <View style={styles.dividerLine} />
            <Text style={Typography.orDivider}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <OutlineButton
            label="Use biometrics"
            onPress={() => {}}
            icon={<Feather name="lock" size={18} color={Colors.neutral.dark} />}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity
              onPress={() => router.replace("/sign-up")}
              hitSlop={8}
            >
              <Text style={Typography.link}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenH,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 24,
  },
  logoRow: {
    marginTop: 8,
  },
  header: {
    gap: 6,
  },
  heading: {
    ...Typography.heading,
  },
  subheading: {
    ...Typography.subheading,
  },
  form: {
    gap: Spacing.inputGap,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral.divider,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: Colors.neutral.hint,
  },
});
