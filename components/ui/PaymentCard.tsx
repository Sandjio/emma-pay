import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type CardVariant = "blue" | "purple" | "green" | "obsidian";

type Props = {
  type?: "VIRTUAL" | "PHYSICAL";
  currency?: string;
  balance: string;
  lastFour?: string;
  variant?: CardVariant;
};

const GRADIENTS: Record<CardVariant, [string, string, string]> = {
  blue: ["#2B4DC9", "#1B3A8C", "#0F1F5C"],
  purple: ["#9333EA", "#6B21A8", "#3B0764"],
  green: ["#10B981", "#047857", "#022C22"],
  obsidian: ["#1F2937", "#0F172A", "#020617"],
};

export function PaymentCard({
  type = "VIRTUAL",
  currency = "USD",
  balance,
  lastFour,
  variant = "blue",
}: Props) {
  return (
    <LinearGradient
      colors={GRADIENTS[variant]}
      locations={[0, 0.55, 1]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.card}
    >
      <View style={[styles.circle, styles.circleLeft]} />
      <View style={[styles.circle, styles.circleRight]} />

      <View style={styles.topRow}>
        <View>
          <Text style={styles.kicker}>
            {type} · {currency}
          </Text>
          <Text style={styles.brand}>EmmaPay</Text>
        </View>
        <View style={styles.logo} />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.balanceCol}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>{balance}</Text>
          {lastFour ? (
            <Text style={styles.lastFour}>•••• {lastFour}</Text>
          ) : (
            <Text style={styles.lastFour}>•••• ••••</Text>
          )}
        </View>
        <View style={styles.mastercard}>
          <View style={[styles.mcCircle, styles.mcRed]} />
          <View style={[styles.mcCircle, styles.mcOrange]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    padding: 20,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    borderRadius: 200,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  circleLeft: {
    width: 180,
    height: 180,
    top: 40,
    left: 60,
  },
  circleRight: {
    width: 130,
    height: 130,
    top: 50,
    right: -30,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  kicker: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  brand: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  logo: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  balanceCol: {
    gap: 2,
  },
  balanceLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.70)",
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  lastFour: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    letterSpacing: 2,
    marginTop: 6,
  },
  mastercard: {
    flexDirection: "row",
    alignItems: "center",
  },
  mcCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  mcRed: {
    backgroundColor: "#EB001B",
  },
  mcOrange: {
    backgroundColor: "#F79E1B",
    marginLeft: -10,
    opacity: 0.92,
  },
});
