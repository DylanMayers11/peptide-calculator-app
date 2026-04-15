import { create } from 'zustand';

export type CalculatorType = 'reconstitution' | 'draw-amount' | 'syringe-units' | 'converter';

export interface HistoryEntry {
  id: string;
  type: CalculatorType;
  label: string;
  summary: string;
  timestamp: number;
}

interface HistoryState {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  entries: [],

  addEntry: (entry) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
    };
    const current = get().entries;
    // Keep latest 50 entries
    const updated = [newEntry, ...current].slice(0, 50);
    set({ entries: updated });
  },

  removeEntry: (id) =>
    set({ entries: get().entries.filter((e) => e.id !== id) }),

  clearHistory: () => set({ entries: [] }),
}));
