import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { BrandColors, DarkColors, LightColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { sanitizeNumericInput } from '@/utils/format';

interface CalcInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  unit?: string;
  placeholder?: string;
  error?: string;
  isDark: boolean;
}

export default function CalcInput({
  label,
  value,
  onChangeText,
  unit,
  placeholder = '0',
  error,
  isDark,
}: CalcInputProps) {
  const [focused, setFocused] = useState(false);
  const colors = isDark ? DarkColors : LightColors;

  const handleChange = (text: string) => {
    onChangeText(sanitizeNumericInput(text));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.inputBg,
            borderColor: error
              ? BrandColors.error
              : focused
              ? BrandColors.primary
              : colors.border,
            borderWidth: focused || error ? 1.5 : 1,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
        {unit ? (
          <View style={[styles.unitBadge, { backgroundColor: isDark ? 'rgba(0,212,170,0.12)' : 'rgba(0,212,170,0.08)' }]}>
            <Text style={[styles.unitText, { color: BrandColors.primary }]}>{unit}</Text>
          </View>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.xs,
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    paddingVertical: 0,
  },
  unitBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    marginLeft: Spacing.sm,
  },
  unitText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: BrandColors.error,
    marginTop: Spacing.xs,
    marginLeft: 2,
  },
});
