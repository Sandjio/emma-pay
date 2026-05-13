import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Radius, Typography } from '@/constants/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  hint?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: TextInputProps['autoComplete'];
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  onBlur?: () => void;
  inputRef?: React.RefObject<TextInput>;
};

export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  hint,
  keyboardType,
  autoCapitalize,
  autoComplete,
  returnKeyType,
  onSubmitEditing,
  onBlur,
  inputRef,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const borderColor = error ? Colors.neutral.borderError : Colors.neutral.border;
  const isSecure = secureTextEntry && !isVisible;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, { borderColor }]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral.placeholder}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? (secureTextEntry ? 'none' : undefined)}
          autoComplete={autoComplete}
          autoCorrect={false}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onBlur={onBlur}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsVisible(v => !v)} style={styles.eyeButton} hitSlop={8}>
            <Feather name={isVisible ? 'eye-off' : 'eye'} size={18} color={Colors.neutral.hint} />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    ...Typography.label,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.input,
    paddingHorizontal: 14,
    backgroundColor: Colors.neutral.background,
    minHeight: 50,
  },
  input: {
    flex: 1,
    ...Typography.inputText,
    paddingVertical: 12,
  },
  eyeButton: {
    paddingLeft: 8,
  },
  errorText: {
    ...Typography.error,
  },
  hintText: {
    ...Typography.hint,
  },
});
