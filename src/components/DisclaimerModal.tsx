import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors, DarkColors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

interface DisclaimerModalProps {
  visible: boolean;
  onAccept: () => void;
}

export default function DisclaimerModal({ visible, onAccept }: DisclaimerModalProps) {
  const insets = useSafeAreaInsets();
  const colors = DarkColors;

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.lg, paddingTop: insets.top + Spacing.lg }]}>
          <View style={styles.iconRow}>
            <Text style={styles.icon}>⚗️</Text>
          </View>
          <Text style={styles.heading}>Peptide Calculator</Text>
          <Text style={styles.subheading}>Important Disclaimer</Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.body}>
              This app is a <Text style={styles.bold}>mathematical calculation tool</Text> designed to
              assist with peptide reconstitution and dosing math. It is intended for{' '}
              <Text style={styles.bold}>educational and research purposes only</Text>.
            </Text>
            <Text style={styles.body}>
              This app does <Text style={[styles.bold, { color: BrandColors.error }]}>not</Text>:
            </Text>
            {[
              'Provide medical advice of any kind',
              'Recommend or endorse any substance, compound, or protocol',
              'Replace the guidance of a licensed healthcare professional',
              'Guarantee the accuracy of inputs provided by the user',
            ].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
            <Text style={styles.body}>
              Always consult a qualified medical professional before administering any substance.
              The developers of this app assume <Text style={styles.bold}>no liability</Text> for
              any decisions made based on the results shown.
            </Text>
            <Text style={[styles.body, { color: colors.textMuted, fontSize: FontSize.xs }]}>
              By tapping "I Understand" you acknowledge that you have read and agree to these terms,
              and that you are using this tool for lawful, personal research purposes only.
            </Text>
          </ScrollView>

          <Pressable
            onPress={onAccept}
            style={({ pressed }) => [styles.button, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={styles.buttonText}>I Understand — Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  iconRow: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  icon: {
    fontSize: 48,
  },
  heading: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: '#fff',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subheading: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: BrandColors.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  scroll: {
    flex: 1,
    marginBottom: Spacing.lg,
  },
  body: {
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 24,
    marginBottom: Spacing.base,
  },
  bold: {
    fontWeight: FontWeight.semibold,
    color: '#fff',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  bullet: {
    color: BrandColors.primary,
    marginRight: Spacing.sm,
    fontSize: FontSize.base,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 24,
  },
  button: {
    backgroundColor: BrandColors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.base + 2,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: '#000',
    letterSpacing: 0.3,
  },
});
