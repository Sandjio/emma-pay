import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  amount: string;
  positive?: boolean;
};

export function TransactionItem({
  icon,
  iconBg,
  title,
  subtitle,
  amount,
  positive = false,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Text style={[styles.amount, positive && styles.amountPositive]}>
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.neutral.hint,
  },
  amount: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
  amountPositive: {
    color: Colors.neutral.positive,
  },
});
