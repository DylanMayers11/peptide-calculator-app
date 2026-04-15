import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import CalculatorCard from '@/components/CalculatorCard';
import { DarkColors, LightColors, BrandColors, Spacing, FontSize, FontWeight } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useAppStore((s) => s.isDarkMode);
  const colors = isDark ? DarkColors : LightColors;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.badge}>⚗️ PEPTIDE CALC</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Calculators</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Precise peptide math, every time
        </Text>
      </View>

      {/* Card Grid */}
      <View style={styles.grid}>
        <View style={styles.row}>
          <CalculatorCard
            title="Reconstitution"
            subtitle="Vial + diluent → concentration"
            emoji="🧪"
            onPress={() => router.push('/reconstitution')}
            isDark={isDark}
            accentColor={BrandColors.primary}
          />
          <View style={styles.gap} />
          <CalculatorCard
            title="Unit Converter"
            subtitle="mcg ↔ mg ↔ mL ↔ units"
            emoji="🔄"
            onPress={() => router.push('/converter')}
            isDark={isDark}
            accentColor={BrandColors.accent}
          />
        </View>
        <View style={[styles.row, { marginTop: Spacing.md }]}>
          <CalculatorCard
            title="Draw Amount"
            subtitle="Dose + concentration → volume"
            emoji="💉"
            onPress={() => router.push('/draw-amount')}
            isDark={isDark}
            accentColor="#F59E0B"
          />
          <View style={styles.gap} />
          <CalculatorCard
            title="Syringe Units"
            subtitle="Dose → syringe units"
            emoji="📏"
            onPress={() => router.push('/syringe-units')}
            isDark={isDark}
            accentColor="#22C55E"
          />
        </View>
      </View>

      {/* Disclaimer Footer */}
      <View style={[styles.disclaimer, { borderColor: colors.border }]}>
        <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>
          ⚠️  For educational & research use only. Not medical advice.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  badge: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: BrandColors.primary,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
  },
  grid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  gap: {
    width: Spacing.md,
  },
  disclaimer: {
    marginTop: Spacing.xl,
    borderTopWidth: 1,
    paddingTop: Spacing.base,
  },
  disclaimerText: {
    fontSize: FontSize.xs,
    lineHeight: 18,
    textAlign: 'center',
  },
});
