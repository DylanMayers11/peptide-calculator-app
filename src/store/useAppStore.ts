import { create } from 'zustand';

interface AppState {
  isDarkMode: boolean;
  disclaimerAccepted: boolean;
  syringeSize: 50 | 100;
  toggleDarkMode: () => void;
  acceptDisclaimer: () => void;
  setSyringeSize: (size: 50 | 100) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: true,
  disclaimerAccepted: false,
  syringeSize: 100,

  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  acceptDisclaimer: () => set({ disclaimerAccepted: true }),
  setSyringeSize: (size) => set({ syringeSize: size }),
}));
