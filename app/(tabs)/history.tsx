import { View, Text, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { useHistoryStore, HistoryEntry } from '@/store/useHistoryStore';
import { DarkColors, LightColors, BrandColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const TYPE_LABELS: Record<string, string> = {
  reconstitution: '🧪 Reconstitution',
  'draw-amount': '💉 Draw Amount',
  'syringe-units': '📏 Syringe Units',
  converter: '🔄 Converter',
};

function HistoryItem({ entry, isDark, onDelete }: { entry: HistoryEntry; isDark: boolean; onDelete: () => void }) {
  const colors = isDark ? DarkColors : LightColors;
  const date = new Date(entry.timestamp);
  const timeStr = date.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });

  return (
    <View style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.itemMain}>
        <Text style={[styles.itemType, { color: BrandColors.primary }]}>
          {TYPE_LABELS[entry.type] ?? entry.type}
        </Text>
        <Text style={[styles.itemLabel, { color: colors.textPrimary }]}>{entry.label}</Text>
        <Text style={[styles.itemSummary, { color: colors.textSecondary }]}>{entry.summary}</Text>
        <Text style={[styles.itemTime, { color: colors.textMuted }]}>{timeStr}</Text>
      </View>
      <Pressable
        onPress={onDelete}
        hitSlop={8}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useAppStore((s) => s.isDarkMode);
  const { entries, removeEntry, clearHistory } = useHistoryStore();
  const colors = isDark ? DarkColors : LightColors;

  const handleClear = () => {
    Alert.alert('Clear History', 'Remove all calculation history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>History</Text>
        {entries.length > 0 && (
          <Pressable onPress={handleClear} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
            <Text style={[styles.clearBtn, { color: BrandColors.error }]}>Clear</Text>
          </Pressable>
        )}
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No calculations yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Your recent calculations will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryItem
              entry={item}
              isDark={isDark}
              onDelete={() => removeEntry(item.id)}
            />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.lg }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  clearBtn: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  list: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.base,
    gap: Spacing.base,
  },
  itemMain: { flex: 1 },
  itemType: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    marginBottom: 3,
  },
  itemLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  itemSummary: {
    fontSize: FontSize.sm,
    marginBottom: 4,
  },
  itemTime: {
    fontSize: FontSize.xs,
  },
  deleteText: {
    color: BrandColors.error,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.base },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, marginBottom: Spacing.sm },
  emptySubtitle: { fontSize: FontSize.base, textAlign: 'center', lineHeight: 22 },
});
