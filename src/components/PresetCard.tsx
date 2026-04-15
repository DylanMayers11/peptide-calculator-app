import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BrandColors, DarkColors, LightColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import type { Preset } from '@/store/usePresetsStore';

interface PresetCardProps {
  preset: Preset;
  onLoad: (preset: Preset) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
}

export default function PresetCard({ preset, onLoad, onDelete, isDark }: PresetCardProps) {
  const colors = isDark ? DarkColors : LightColors;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable
        style={({ pressed }) => [styles.main, { opacity: pressed ? 0.7 : 1 }]}
        onPress={() => onLoad(preset)}
      >
        <Text style={[styles.name, { color: colors.textPrimary }]}>{preset.name}</Text>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>
          {preset.peptideMcg >= 1000
            ? `${(preset.peptideMcg / 1000).toFixed(1)} mg`
            : `${preset.peptideMcg} mcg`}{' '}
          · {preset.diluentML} mL · {preset.targetDoseMcg} mcg dose
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onDelete(preset.id)}
        style={({ pressed }) => [styles.deleteBtn, { opacity: pressed ? 0.5 : 1 }]}
        hitSlop={8}
      >
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  main: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    marginBottom: 3,
  },
  detail: {
    fontSize: FontSize.sm,
  },
  deleteBtn: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  deleteText: {
    color: BrandColors.error,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
});
