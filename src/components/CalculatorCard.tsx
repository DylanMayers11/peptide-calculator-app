import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { BrandColors, DarkColors, LightColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

interface CalculatorCardProps {
  title: string;
  subtitle: string;
  emoji: string;
  onPress: () => void;
  isDark: boolean;
  accentColor?: string;
}

export default function CalculatorCard({
  title,
  subtitle,
  emoji,
  onPress,
  isDark,
  accentColor = BrandColors.primary,
}: CalculatorCardProps) {
  const colors = isDark ? DarkColors : LightColors;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${accentColor}18` }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emoji: {
    fontSize: 22,
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: 16,
  },
});
