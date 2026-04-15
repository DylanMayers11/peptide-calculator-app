import { View, Text, Pressable, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { usePresetsStore } from '@/store/usePresetsStore';
import { DarkColors, LightColors, BrandColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

function SettingsRow({
  label,
  description,
  right,
  isDark,
  onPress,
}: {
  label: string;
  description?: string;
  right?: React.ReactNode;
  isDark: boolean;
  onPress?: () => void;
}) {
  const colors = isDark ? DarkColors : LightColors;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border, opacity: pressed && onPress ? 0.7 : 1 },
      ]}
    >
      <View style={styles.rowLeft}>
        <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
        {description ? (
          <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{description}</Text>
        ) : null}
      </View>
      {right}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useAppStore((s) => s.isDarkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const syringeSize = useAppStore((s) => s.syringeSize);
  const setSyringeSize = useAppStore((s) => s.setSyringeSize);
  const clearHistory = useHistoryStore((s) => s.clearHistory);
  const clearPresets = usePresetsStore((s) => s.clearPresets);
  const colors = isDark ? DarkColors : LightColors;

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all history and saved presets. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearHistory();
            clearPresets();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
      </View>

      {/* Appearance */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APPEARANCE</Text>
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <SettingsRow
          label="Dark Mode"
          description="Use dark color scheme"
          isDark={isDark}
          right={
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: BrandColors.primary }}
              thumbColor="#fff"
            />
          }
        />
      </View>

      {/* Syringe */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SYRINGE TYPE</Text>
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <SettingsRow
          label="100-Unit Syringe"
          description="Standard insulin syringe (default)"
          isDark={isDark}
          onPress={() => setSyringeSize(100)}
          right={
            syringeSize === 100 ? (
              <Text style={{ color: BrandColors.primary, fontSize: 18 }}>✓</Text>
            ) : null
          }
        />
        <SettingsRow
          label="50-Unit Syringe"
          description="Low-dose insulin syringe"
          isDark={isDark}
          onPress={() => setSyringeSize(50)}
          right={
            syringeSize === 50 ? (
              <Text style={{ color: BrandColors.primary, fontSize: 18 }}>✓</Text>
            ) : null
          }
        />
      </View>

      {/* Data */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>DATA</Text>
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <SettingsRow
          label="Clear All Data"
          description="Delete history and presets"
          isDark={isDark}
          onPress={handleClearAll}
          right={<Text style={{ color: BrandColors.error, fontSize: FontSize.lg }}>›</Text>}
        />
      </View>

      {/* Disclaimer */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>LEGAL</Text>
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.disclaimerBox}>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            This app is for <Text style={{ color: colors.textPrimary, fontWeight: FontWeight.semibold }}>educational and research use only</Text>.
            It does not constitute medical advice and should not replace the guidance of a licensed
            healthcare professional. Always verify calculations independently.
          </Text>
        </View>
      </View>

      <Text style={[styles.version, { color: colors.textMuted }]}>Peptide Calculator v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  section: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  rowLeft: { flex: 1, marginRight: Spacing.base },
  rowLabel: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
  rowDesc: { fontSize: FontSize.sm, marginTop: 2 },
  disclaimerBox: {
    padding: Spacing.base,
  },
  disclaimerText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  version: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    marginTop: Spacing.xl,
  },
});
