import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';

type Props = {
  onPress: () => void;
};

export function BackButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} hitSlop={8}>
      <Feather name="arrow-left" size={22} color={Colors.neutral.dark} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
