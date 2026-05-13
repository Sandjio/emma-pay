import { Colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  trailingText?: string;
  onPress?: () => void;
  showChevron?: boolean;
  right?: React.ReactNode;
};

export function SettingsRow({
  icon,
  iconBg = "#F4F5F9",
  title,
  subtitle,
  trailingText,
  onPress,
  showChevron = true,
  right,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? (
        right
      ) : (
        <>
          {trailingText ? (
            <Text style={styles.trailing}>{trailingText}</Text>
          ) : null}
          {showChevron ? (
            <Feather
              name="chevron-right"
              size={20}
              color={Colors.neutral.hint}
            />
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
    fontSize: 12,
    color: Colors.neutral.hint,
  },
  trailing: {
    fontSize: 13,
    color: Colors.neutral.hint,
    marginRight: 6,
  },
});
