import { Colors, Radius } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  variant: "large" | "small";
  textColor?: string;
};

export function AppLogo({ variant, textColor = Colors.brand.white }: Props) {
  const isLarge = variant === "large";

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.iconBox,
          isLarge ? styles.iconBoxLarge : styles.iconBoxSmall,
        ]}
      >
        <Text
          style={[
            styles.iconLetter,
            isLarge ? styles.iconLetterLarge : styles.iconLetterSmall,
          ]}
        >
          M
        </Text>
      </View>
      <Text
        style={[
          styles.wordmark,
          isLarge ? styles.wordmarkLarge : styles.wordmarkSmall,
          { color: textColor },
        ]}
      >
        <Text style={{ fontWeight: "700" }}>Emma</Text>
        <Text style={{ fontWeight: "700" }}>Pay</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBox: {
    backgroundColor: Colors.brand.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBoxLarge: {
    width: 56,
    height: 56,
    borderRadius: Radius.logo,
  },
  iconBoxSmall: {
    width: 38,
    height: 38,
    borderRadius: Radius.logoSmall,
  },
  iconLetter: {
    color: Colors.brand.deepBlue,
    fontWeight: "800",
  },
  iconLetterLarge: {
    fontSize: 28,
  },
  iconLetterSmall: {
    fontSize: 19,
  },
  wordmark: {
    letterSpacing: 0.2,
  },
  wordmarkLarge: {
    fontSize: 42,
  },
  wordmarkSmall: {
    fontSize: 20,
  },
});
