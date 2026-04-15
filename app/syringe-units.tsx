import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import CalcInput from '@/components/CalcInput';
import ResultCard from '@/components/ResultCard';
import { calcSyringeUnits } from '@/engine/calculations';
import { formatUnits, formatVolume, parseInput } from '@/utils/format';
import { DarkColors, LightColors, BrandColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

export default function SyringeUnitsScreen() {
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

  const result = hasCalculated ? calcSyringeUnits(doseVal, concVal, syringeSize) : null;

  const handleCalculate = () => {
    setHasCalculated(true);
    const r = calcSyringeUnits(doseVal, concVal, syringeSize);
    if (r.isValid) {
      addHistory({
        type: 'syringe-units',
        label: `${dose} mcg @ ${concentration} mcg/mL`,
        summary: `Draw to ${formatUnits(r.syringeUnits)} on syringe`,
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Syringe Units</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Enter your dose and solution concentration to see exactly where to draw on your syringe.
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
          style={({ pressed }) => [styles.calcBtn, { backgroundColor: '#22C55E', opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.calcBtnText}>Calculate Units</Text>
        </Pressable>

        {result && result.isValid && (
          <>
            <ResultCard
              title="SYRINGE READING"
              isDark={isDark}
              rows={[
                { label: 'Draw to Unit Mark', value: formatUnits(result.syringeUnits), highlight: true },
                { label: 'Volume', value: formatVolume(result.volumeML) },
              ]}
            />
            {/* Visual syringe scale */}
            <View style={[styles.scaleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.scaleTitle, { color: colors.textSecondary }]}>SYRINGE SCALE</Text>
              <View style={styles.scaleTicks}>
                {[0, 10, 20, 30, 40, 50].map((tick) => {
                  const pct = tick / 50;
                  const targetPct = Math.min(result.syringeUnits / syringeSize, 1);
                  const isTarget = Math.abs(pct - targetPct) < 0.08;
                  return (
                    <View key={tick} style={styles.tickCol}>
                      <View style={[styles.tick, { backgroundColor: isTarget ? BrandColors.primary : colors.border, height: isTarget ? 16 : 8 }]} />
                      <Text style={[styles.tickLabel, { color: isTarget ? BrandColors.primary : colors.textMuted }]}>{tick}</Text>
                    </View>
                  );
                })}
              </View>
              <Text style={[styles.scaleNote, { color: colors.textMuted }]}>
                Draw to approximately {formatUnits(result.syringeUnits)} on the scale
              </Text>
            </View>
          </>
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
  hint: { fontSize: FontSize.sm, lineHeight: 20, marginBottom: Spacing.lg },
  syringeNote: { fontSize: FontSize.xs, textAlign: 'center', marginBottom: Spacing.base },
  calcBtn: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  calcBtnText: { color: '#000', fontSize: FontSize.base, fontWeight: FontWeight.bold, letterSpacing: 0.3 },
  scaleCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    marginTop: Spacing.base,
  },
  scaleTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, letterSpacing: 0.8, marginBottom: Spacing.base },
  scaleTicks: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: Spacing.sm },
  tickCol: { alignItems: 'center', flex: 1 },
  tick: { width: 2, borderRadius: 1, marginBottom: 4 },
  tickLabel: { fontSize: 10, fontWeight: FontWeight.medium },
  scaleNote: { fontSize: FontSize.xs, textAlign: 'center', marginTop: Spacing.xs },
  errorCard: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.base, marginTop: Spacing.base },
  errorText: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
  resetBtn: { marginTop: Spacing.lg, alignItems: 'center', paddingVertical: Spacing.sm },
  resetBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
});
