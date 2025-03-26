import { useEffect } from 'react';
import { create } from 'zustand';

import { Difficulty, PokemonGeneration } from '@/types/pokemon';

interface GameSettingsStore {
  difficulty: Difficulty;
  selectedGenerations: PokemonGeneration[];
  shinyChance: number;
  isHydrated: boolean;
  setDifficulty: (difficulty: Difficulty) => void;
  setSelectedGenerations: (selectedGenerations: PokemonGeneration[]) => void;
  setShinyChance: (shinyChance: number) => void;
  hydrate: () => void;
}

// Helper function to safely access localStorage
const getStorageValue = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  const stored = localStorage.getItem(key);

  if (!stored) {
    return defaultValue;
  }

  try {
    return (key === 'shinyChance' ? parseInt(stored) : JSON.parse(stored)) as T;
  } catch {
    return defaultValue;
  }
};

export const useGameSettingsStore = create<GameSettingsStore>((set) => ({
  // Start with default values
  difficulty: 'medium',
  selectedGenerations: [
    'gen1',
    'gen2',
    'gen3',
    'gen4',
    'gen5',
    'gen6',
    'gen7',
    'gen8',
    'gen9',
  ],
  shinyChance: 4096,
  isHydrated: false,

  hydrate: () => {
    if (typeof window !== 'undefined') {
      set({
        difficulty: getStorageValue<Difficulty>('difficulty', 'medium'),
        selectedGenerations: getStorageValue<PokemonGeneration[]>(
          'selectedGenerations',
          ['gen1', 'gen2', 'gen3', 'gen4', 'gen5', 'gen6', 'gen7', 'gen8', 'gen9']
        ),
        shinyChance: getStorageValue<number>('shinyChance', 4096),
        isHydrated: true,
      });
    }
  },

  setDifficulty: (difficulty) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('difficulty', difficulty);
    }
    set({ difficulty });
  },

  setSelectedGenerations: (selectedGenerations) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedGenerations', JSON.stringify(selectedGenerations));
    }
    set({ selectedGenerations });
  },

  setShinyChance: (shinyChance) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shinyChance', shinyChance.toString());
    }
    set({ shinyChance });
  },
}));

// Hook to use the store with hydration
export const useHydratedGameSettings = () => {
  const store = useGameSettingsStore();

  useEffect(() => {
    if (!store.isHydrated) {
      store.hydrate();
    }
  }, [store]);

  return store;
};
