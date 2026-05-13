import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Radius, Typography } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export function OutlineButton({ label, onPress, icon, disabled = false }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderColor: Colors.neutral.border,
    borderRadius: Radius.button,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.buttonLabel,
    color: Colors.neutral.dark,
  },
});
