import { create } from 'zustand';

export interface Preset {
  id: string;
  name: string;
  peptideMcg: number;
  diluentML: number;
  targetDoseMcg: number;
  createdAt: number;
}

interface PresetsState {
  presets: Preset[];
  addPreset: (preset: Omit<Preset, 'id' | 'createdAt'>) => void;
  removePreset: (id: string) => void;
  clearPresets: () => void;
}

export const usePresetsStore = create<PresetsState>((set, get) => ({
  presets: [],

  addPreset: (preset) => {
    const newPreset: Preset = {
      ...preset,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
    };
    set({ presets: [newPreset, ...get().presets] });
  },

  removePreset: (id) =>
    set({ presets: get().presets.filter((p) => p.id !== id) }),

  clearPresets: () => set({ presets: [] }),
}));
