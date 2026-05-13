import { Colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightPress?: () => void;
};

export function ScreenHeader({ title, onBack, rightIcon, onRightPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} hitSlop={8} style={styles.iconButton}>
            <Feather name="arrow-left" size={22} color={Colors.neutral.dark} />
          </TouchableOpacity>
        ) : null}
      </View>
      {title ? <Text style={styles.title}>{title}</Text> : <View />}
      <View style={[styles.side, styles.rightAlign]}>
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} hitSlop={8} style={styles.iconButton}>
            <Feather name={rightIcon} size={20} color={Colors.neutral.dark} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
  },
  side: {
    width: 40,
  },
  rightAlign: {
    alignItems: "flex-end",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
});
