import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Variant = "translucent" | "solid";

type Props = {
  initials: string;
  size?: number;
  variant?: Variant;
};

export function Avatar({ initials, size = 40, variant = "translucent" }: Props) {
  const isSolid = variant === "solid";
  return (
    <View
      style={[
        styles.base,
        isSolid ? styles.solid : styles.translucent,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  translucent: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
  },
  solid: {
    backgroundColor: Colors.brand.deepBlue,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
