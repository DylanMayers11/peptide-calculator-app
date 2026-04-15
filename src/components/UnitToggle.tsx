import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BrandColors, DarkColors, LightColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

interface UnitToggleProps<T extends string> {
  options: { label: string; value: T }[];
  selected: T;
  onSelect: (value: T) => void;
  isDark: boolean;
}

export default function UnitToggle<T extends string>({
  options,
  selected,
  onSelect,
  isDark,
}: UnitToggleProps<T>) {
  const colors = isDark ? DarkColors : LightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
      {options.map((opt) => {
        const isActive = opt.value === selected;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={({ pressed }) => [
              styles.option,
              isActive && { backgroundColor: BrandColors.primary },
              pressed && !isActive && { opacity: 0.6 },
            ]}
          >
            <Text
              style={[
                styles.optionText,
                { color: isActive ? '#000' : colors.textSecondary },
                isActive && { fontWeight: FontWeight.bold },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 3,
    gap: 3,
  },
  option: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  optionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});
