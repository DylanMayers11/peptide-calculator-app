import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { BrandColors, DarkColors, LightColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

interface ResultRow {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ResultCardProps {
  title: string;
  rows: ResultRow[];
  isDark: boolean;
  delay?: number;
}

export default function ResultCard({ title, rows, isDark, delay = 0 }: ResultCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const colors = isDark ? DarkColors : LightColors;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(16);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [rows]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      {rows.map((row, i) => (
        <View
          key={i}
          style={[
            styles.row,
            i < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
          ]}
        >
          <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{row.label}</Text>
          <Text
            style={[
              styles.rowValue,
              { color: row.highlight ? BrandColors.primary : colors.textPrimary },
            ]}
          >
            {row.value}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    marginTop: Spacing.base,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  rowLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
  },
  rowValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
});
