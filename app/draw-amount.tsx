import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import CalcInput from '@/components/CalcInput';
import ResultCard from '@/components/ResultCard';
import { calcDrawVolume } from '@/engine/calculations';
import { formatVolume, formatUnits, parseInput } from '@/utils/format';
import { DarkColors, LightColors, BrandColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

export default function DrawAmountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useAppStore((s) => s.isDarkMode);
  const syringeSize = useAppStore((s) => s.syringeSize);
  const addHistory = useHistoryStore((s) => s.addEntry);
  const colors = isDark ? DarkColors : LightColors;

  const [dose, setDose] = useState('');
  const [concentration, setConcentration] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  const doseVal = parseInput(dose);
  const concVal = parseInput(concentration);

  const result = hasCalculated ? calcDrawVolume(doseVal, concVal, syringeSize) : null;

  const handleCalculate = () => {
    setHasCalculated(true);
    const r = calcDrawVolume(doseVal, concVal, syringeSize);
    if (r.isValid) {
      addHistory({
        type: 'draw-amount',
        label: `${dose} mcg @ ${concentration} mcg/mL`,
        summary: `Draw ${formatVolume(r.volumeML)} = ${formatUnits(r.volumeUnits)}`,
      });
    }
  };

  const handleReset = () => {
    setDose('');
    setConcentration('');
    setHasCalculated(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Text style={[styles.backBtn, { color: BrandColors.primary }]}>‹ Back</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Draw Amount</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Know your concentration? Enter your dose and concentration to get the exact draw volume.
        </Text>

        <CalcInput
          label="Target Dose"
          value={dose}
          onChangeText={setDose}
          unit="mcg"
          placeholder="e.g. 250"
          isDark={isDark}
        />
        <CalcInput
          label="Concentration"
          value={concentration}
          onChangeText={setConcentration}
          unit="mcg/mL"
          placeholder="e.g. 2500"
          isDark={isDark}
        />

        <Text style={[styles.syringeNote, { color: colors.textMuted }]}>
          Using {syringeSize}-unit syringe · Change in Settings
        </Text>

        <Pressable
          onPress={handleCalculate}
          style={({ pressed }) => [styles.calcBtn, { backgroundColor: '#F59E0B', opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.calcBtnText}>Calculate Draw</Text>
        </Pressable>

        {result && result.isValid && (
          <ResultCard
            title="DRAW AMOUNT"
            isDark={isDark}
            rows={[
              { label: 'Volume to Draw', value: formatVolume(result.volumeML), highlight: true },
              { label: 'Syringe Units', value: formatUnits(result.volumeUnits) },
            ]}
          />
        )}

        {result && !result.isValid && (
          <View style={[styles.errorCard, { backgroundColor: `${BrandColors.error}18`, borderColor: `${BrandColors.error}40` }]}>
            <Text style={[styles.errorText, { color: BrandColors.error }]}>⚠ {result.error}</Text>
          </View>
        )}

        {hasCalculated && (
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [styles.resetBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={[styles.resetBtnText, { color: colors.textMuted }]}>Reset</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
  },
  backBtn: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  headerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  scroll: { flex: 1 },
  content: { padding: Spacing.base },
  hint: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  syringeNote: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  calcBtn: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  calcBtnText: {
    color: '#000',
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  errorCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.base,
    marginTop: Spacing.base,
  },
  errorText: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
  resetBtn: { marginTop: Spacing.lg, alignItems: 'center', paddingVertical: Spacing.sm },
  resetBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
});
