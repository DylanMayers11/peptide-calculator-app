import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { usePresetsStore } from '@/store/usePresetsStore';
import CalcInput from '@/components/CalcInput';
import ResultCard from '@/components/ResultCard';
import PresetCard from '@/components/PresetCard';
import { calcReconstitution } from '@/engine/calculations';
import { formatVolume, formatUnits, formatConcentration, parseInput } from '@/utils/format';
import { DarkColors, LightColors, BrandColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import type { Preset } from '@/store/usePresetsStore';

export default function ReconstitutionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useAppStore((s) => s.isDarkMode);
  const syringeSize = useAppStore((s) => s.syringeSize);
  const addHistory = useHistoryStore((s) => s.addEntry);
  const { presets, addPreset, removePreset } = usePresetsStore();
  const colors = isDark ? DarkColors : LightColors;

  const [peptide, setPeptide] = useState('');
  const [diluent, setDiluent] = useState('');
  const [dose, setDose] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [presetName, setPresetName] = useState('');

  const peptideVal = parseInput(peptide);
  const diluentVal = parseInput(diluent);
  const doseVal = parseInput(dose);

  const result = hasCalculated
    ? calcReconstitution(peptideVal, diluentVal, doseVal, syringeSize)
    : null;

  const handleCalculate = () => {
    setHasCalculated(true);
    const r = calcReconstitution(peptideVal, diluentVal, doseVal, syringeSize);
    if (r.isValid) {
      addHistory({
        type: 'reconstitution',
        label: `${peptide} mcg / ${diluent} mL`,
        summary: `Dose: ${dose} mcg → Draw ${formatUnits(r.unitsToDraw)} (${formatVolume(r.volumeToDrawML)})`,
      });
    }
  };

  const handleReset = () => {
    setPeptide('');
    setDiluent('');
    setDose('');
    setHasCalculated(false);
  };

  const handleLoadPreset = (preset: Preset) => {
    setPeptide(String(preset.peptideMcg));
    setDiluent(String(preset.diluentML));
    setDose(String(preset.targetDoseMcg));
    setShowPresets(false);
    setHasCalculated(false);
  };

  const handleSavePreset = () => {
    const name = presetName.trim();
    if (!name) {
      Alert.alert('Name required', 'Please enter a name for this preset.');
      return;
    }
    addPreset({
      name,
      peptideMcg: peptideVal,
      diluentML: diluentVal,
      targetDoseMcg: doseVal,
    });
    setSaveModalVisible(false);
    setPresetName('');
    Alert.alert('Saved!', `Preset "${name}" saved.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Text style={[styles.backBtn, { color: BrandColors.primary }]}>‹ Back</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Reconstitution</Text>
        <Pressable onPress={() => setShowPresets(!showPresets)} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Text style={[styles.presetsBtn, { color: BrandColors.accent }]}>Presets</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Presets Panel */}
        {showPresets && (
          <View style={[styles.presetsPanel, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <Text style={[styles.presetsPanelTitle, { color: colors.textSecondary }]}>SAVED PRESETS</Text>
            {presets.length === 0 ? (
              <Text style={[styles.noPresets, { color: colors.textMuted }]}>No presets saved yet</Text>
            ) : (
              presets.map((p) => (
                <PresetCard
                  key={p.id}
                  preset={p}
                  onLoad={handleLoadPreset}
                  onDelete={removePreset}
                  isDark={isDark}
                />
              ))
            )}
          </View>
        )}

        {/* Inputs */}
        <CalcInput
          label="Peptide Amount"
          value={peptide}
          onChangeText={setPeptide}
          unit="mcg"
          placeholder="e.g. 5000"
          isDark={isDark}
        />
        <CalcInput
          label="Diluent Added"
          value={diluent}
          onChangeText={setDiluent}
          unit="mL"
          placeholder="e.g. 2"
          isDark={isDark}
        />
        <CalcInput
          label="Target Dose"
          value={dose}
          onChangeText={setDose}
          unit="mcg"
          placeholder="e.g. 250"
          isDark={isDark}
        />

        {/* Syringe Info */}
        <Text style={[styles.syringeNote, { color: colors.textMuted }]}>
          Using {syringeSize}-unit syringe · Change in Settings
        </Text>

        {/* Buttons */}
        <Pressable
          onPress={handleCalculate}
          style={({ pressed }) => [styles.calcBtn, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.calcBtnText}>Calculate</Text>
        </Pressable>

        {/* Results */}
        {result && result.isValid && (
          <>
            <ResultCard
              title="RESULTS"
              isDark={isDark}
              rows={[
                { label: 'Concentration', value: formatConcentration(result.concentrationPerML) },
                { label: 'Draw Volume', value: formatVolume(result.volumeToDrawML) },
                { label: 'Draw Units', value: formatUnits(result.unitsToDraw), highlight: true },
              ]}
            />
            <Pressable
              onPress={() => setSaveModalVisible(true)}
              style={({ pressed }) => [
                styles.saveBtn,
                { borderColor: BrandColors.accent, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.saveBtnText, { color: BrandColors.accent }]}>＋ Save as Preset</Text>
            </Pressable>
          </>
        )}

        {result && !result.isValid && (
          <View style={[styles.errorCard, { backgroundColor: `${BrandColors.error}18`, borderColor: `${BrandColors.error}40` }]}>
            <Text style={[styles.errorCardText, { color: BrandColors.error }]}>⚠ {result.error}</Text>
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

      {/* Save Preset Modal */}
      <Modal visible={saveModalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setSaveModalVisible(false)}>
          <Pressable style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Save Preset</Text>
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Preset name</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: BrandColors.primary }]}
              value={presetName}
              onChangeText={setPresetName}
              placeholder="e.g. BPC-157 5mg"
              placeholderTextColor={colors.textMuted}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSavePreset}
            />
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => { setSaveModalVisible(false); setPresetName(''); }}
                style={({ pressed }) => [styles.modalCancelBtn, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSavePreset}
                style={({ pressed }) => [styles.modalSaveBtn, { opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={styles.modalSaveBtnText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  presetsBtn: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  scroll: { flex: 1 },
  content: { padding: Spacing.base },
  presetsPanel: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  presetsPanelTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  noPresets: { fontSize: FontSize.sm, textAlign: 'center', paddingVertical: Spacing.base },
  syringeNote: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  calcBtn: {
    backgroundColor: BrandColors.primary,
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
  saveBtn: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  errorCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.base,
    marginTop: Spacing.base,
  },
  errorCardText: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
  resetBtn: { marginTop: Spacing.lg, alignItems: 'center', paddingVertical: Spacing.sm },
  resetBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalBox: {
    width: '100%',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.base },
  modalLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, marginBottom: Spacing.xs },
  modalInput: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.base,
    height: 50,
    fontSize: FontSize.base,
    marginBottom: Spacing.base,
  },
  modalButtons: { flexDirection: 'row', gap: Spacing.sm },
  modalCancelBtn: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: BrandColors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  modalSaveBtnText: { color: '#000', fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
