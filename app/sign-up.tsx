import { BackButton, FormInput, PrimaryButton } from "@/components/ui";
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
import { ApiError, auth } from "./lib/api";
import { useAuth } from "./lib/auth-context";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function validateEmail(value: string) {
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("Enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePassword(value: string) {
    if (value.length < 8 || !/\d/.test(value)) {
      setPasswordError("Must be 8+ characters with a number");
      return false;
    }
    setPasswordError("");
    return true;
  }

  async function handleSubmit() {
    setSubmitted(true);
    setFormError("");
    const emailOk = validateEmail(email);
    const passwordOk = validatePassword(password);
    if (!emailOk || !passwordOk || !termsAccepted || !name.trim()) {
      if (!name.trim()) setFormError("Please enter your full name.");
      return;
    }
    setSubmitting(true);
    try {
      const { token, user } = await auth.signup({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      await signIn(token, user);
      router.replace("/home");
    } catch (err) {
      if (err instanceof ApiError && err.code === "EMAIL_TAKEN") {
        setEmailError("An account with this email already exists");
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
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

          <View style={styles.header}>
            <Text style={styles.heading}>Create your account</Text>
            <Text style={styles.subheading}>It takes less than a minute.</Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="Amara Okafor"
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
            />
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
              hint="8+ characters with a number"
              placeholder="Create a password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setTermsAccepted((v) => !v)}
            activeOpacity={0.8}
          >
            <View
              style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
            >
              {termsAccepted && (
                <Feather name="check" size={13} color={Colors.brand.white} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the{" "}
              <Text style={Typography.link}>Terms of Service</Text> and{" "}
              <Text style={Typography.link}>Privacy Policy</Text>.
            </Text>
          </TouchableOpacity>

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <PrimaryButton
            label={submitting ? "Creating account…" : "Create account"}
            onPress={handleSubmit}
            disabled={!termsAccepted || submitting}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already a member? </Text>
            <TouchableOpacity
              onPress={() => router.replace("/log-in")}
              hitSlop={8}
            >
              <Text style={Typography.link}>Log in</Text>
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
  header: {
    gap: 6,
    marginTop: 8,
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.neutral.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Colors.brand.blue,
    borderColor: Colors.brand.blue,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.neutral.body,
    lineHeight: 20,
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
  formError: {
    fontSize: 13,
    color: "#D14343",
    marginTop: -8,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
