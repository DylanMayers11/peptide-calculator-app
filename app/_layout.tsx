import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import DisclaimerModal from '@/components/DisclaimerModal';

export default function RootLayout() {
  const isDark = useAppStore((s) => s.isDarkMode);
  const disclaimerAccepted = useAppStore((s) => s.disclaimerAccepted);
  const acceptDisclaimer = useAppStore((s) => s.acceptDisclaimer);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <DisclaimerModal
          visible={!disclaimerAccepted}
          onAccept={acceptDisclaimer}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
