import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import CalcInput from '@/components/CalcInput';
import UnitToggle from '@/components/UnitToggle';
import ResultCard from '@/components/ResultCard';
import { mcgToMg, mgToMcg, mlToUnits, unitsToMl } from '@/engine/calculations';
import { parseInput } from '@/utils/format';
import { DarkColors, LightColors, BrandColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

type MassUnit = 'mcg' | 'mg';
type VolumeUnit = 'mL' | 'units';

export default function ConverterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useAppStore((s) => s.isDarkMode);
  const syringeSize = useAppStore((s) => s.syringeSize);
  const addHistory = useHistoryStore((s) => s.addEntry);
  const colors = isDark ? DarkColors : LightColors;

  // Mass converter
  const [massValue, setMassValue] = useState('');
  const [massUnit, setMassUnit] = useState<MassUnit>('mcg');

  // Volume converter
  const [volValue, setVolValue] = useState('');
  const [volUnit, setVolUnit] = useState<VolumeUnit>('mL');

  const massNum = parseInput(massValue);
  const volNum = parseInput(volValue);

  const massResult = massValue
    ? massUnit === 'mcg'
      ? { converted: mcgToMg(massNum), label: 'mg', from: `${massNum} mcg` }
      : { converted: mgToMcg(massNum), label: 'mcg', from: `${massNum} mg` }
    : null;

  const volResult = volValue
    ? volUnit === 'mL'
      ? { converted: mlToUnits(volNum, syringeSize), label: `units (${syringeSize}U syringe)`, from: `${volNum} mL` }
      : { converted: unitsToMl(volNum, syringeSize), label: `mL (${syringeSize}U syringe)`, from: `${volNum} units` }
    : null;

  const handleMassBlur = () => {
    if (massResult) {
      addHistory({
        type: 'converter',
        label: `Mass: ${massResult.from}`,
        summary: `= ${massResult.converted} ${massResult.label}`,
      });
    }
  };

  const handleVolBlur = () => {
    if (volResult) {
      addHistory({
        type: 'converter',
        label: `Volume: ${volResult.from}`,
        summary: `= ${volResult.converted} ${volResult.label}`,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Text style={[styles.backBtn, { color: BrandColors.primary }]}>‹ Back</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Unit Converter</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Mass section */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>MASS CONVERSION</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>Convert between micrograms and milligrams</Text>

          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>From:</Text>
            <UnitToggle
              options={[{ label: 'mcg', value: 'mcg' }, { label: 'mg', value: 'mg' }]}
              selected={massUnit}
              onSelect={(v) => { setMassUnit(v); setMassValue(''); }}
              isDark={isDark}
            />
          </View>

          <CalcInput
            label={`Enter value in ${massUnit}`}
            value={massValue}
            onChangeText={setMassValue}
            unit={massUnit}
            placeholder="0"
            isDark={isDark}
          />

          {massResult && massNum > 0 && (
            <View style={[styles.liveResult, { backgroundColor: `${BrandColors.primary}12`, borderColor: `${BrandColors.primary}30` }]}>
              <Text style={[styles.liveLabel, { color: colors.textSecondary }]}>{massResult.from} =</Text>
              <Text style={[styles.liveValue, { color: BrandColors.primary }]}>
                {massResult.converted} {massResult.label}
              </Text>
            </View>
          )}
        </View>

        {/* Volume section */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: Spacing.base }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>VOLUME CONVERSION</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>Convert between mL and syringe units</Text>

          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>From:</Text>
            <UnitToggle
              options={[{ label: 'mL', value: 'mL' }, { label: 'units', value: 'units' }]}
              selected={volUnit}
              onSelect={(v) => { setVolUnit(v); setVolValue(''); }}
              isDark={isDark}
            />
          </View>

          <CalcInput
            label={`Enter value in ${volUnit}`}
            value={volValue}
            onChangeText={setVolValue}
            unit={volUnit}
            placeholder="0"
            isDark={isDark}
          />

          {volResult && volNum > 0 && (
            <View style={[styles.liveResult, { backgroundColor: `${BrandColors.accent}12`, borderColor: `${BrandColors.accent}30` }]}>
              <Text style={[styles.liveLabel, { color: colors.textSecondary }]}>{volResult.from} =</Text>
              <Text style={[styles.liveValue, { color: BrandColors.accent }]}>
                {volResult.converted} {volResult.label}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.note, { color: colors.textMuted }]}>
          Syringe unit conversions use your {syringeSize}-unit syringe setting.{'\n'}
          Change syringe type in Settings.
        </Text>
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
  section: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.base,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.base,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  toggleLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    width: 40,
  },
  liveResult: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  liveLabel: { fontSize: FontSize.sm, marginBottom: 3 },
  liveValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  note: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    lineHeight: 18,
    marginTop: Spacing.lg,
  },
});
