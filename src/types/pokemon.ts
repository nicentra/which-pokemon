export type Pokemon = {
  id: number;
  name: string;
  types: string[];
  baseStats: BaseStats;
  sprites: PokemonSprites;
  moves?: Move[];
  abilities?: Ability[];
  isShiny?: boolean;
};

export type Ability = {
  name: string;
  isHidden: boolean;
};

export type Move = {
  name: string;
  learnMethod: string;
};

export type BaseStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
};

export type BaseStat = keyof BaseStats;

export type PokemonSprites = {
  front_default: string;
  front_shiny: string;
};

// Define the Pokémon generation ranges
export const POKEMON_GENERATIONS = {
  gen1: { start: 1, end: 151, name: 'Generation I' }, // Red, Blue, Yellow
  gen2: { start: 152, end: 251, name: 'Generation II' }, // Gold, Silver, Crystal
  gen3: { start: 252, end: 386, name: 'Generation III' }, // Ruby, Sapphire, Emerald, FireRed, LeafGreen
  gen4: { start: 387, end: 493, name: 'Generation IV' }, // Diamond, Pearl, Platinum, HeartGold, SoulSilver
  gen5: { start: 494, end: 649, name: 'Generation V' }, // Black, White, Black 2, White 2
  gen6: { start: 650, end: 721, name: 'Generation VI' }, // X, Y, Omega Ruby, Alpha Sapphire
  gen7: { start: 722, end: 809, name: 'Generation VII' }, // Sun, Moon, Ultra Sun, Ultra Moon, Let's Go
  gen8: { start: 810, end: 905, name: 'Generation VIII' }, // Sword, Shield, Brilliant Diamond, Shining Pearl, Legends: Arceus
  gen9: { start: 906, end: 1025, name: 'Generation IX' }, // Scarlet, Violet, DLC
};

export const DIFFICULTY_BOUNDS = {
  easy: {
    lower: 30,
    upper: 200,
  },
  medium: {
    lower: 10,
    upper: 30,
  },
  hard: {
    lower: 1,
    upper: 10,
  },
};

// Type for the generation keys
export type PokemonGeneration = keyof typeof POKEMON_GENERATIONS;

// Type for the difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';
