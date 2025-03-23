import { db } from '@/lib/db';
import { Pokemon, PokemonSprites, BaseStats } from '@/types/pokemon';

// Define the Pokémon generation ranges
export const POKEMON_GENERATIONS = {
  gen1: { start: 1, end: 151 }, // Red, Blue, Yellow
  gen2: { start: 152, end: 251 }, // Gold, Silver, Crystal
  gen3: { start: 252, end: 386 }, // Ruby, Sapphire, Emerald, FireRed, LeafGreen
  gen4: { start: 387, end: 493 }, // Diamond, Pearl, Platinum, HeartGold, SoulSilver
  gen5: { start: 494, end: 649 }, // Black, White, Black 2, White 2
  gen6: { start: 650, end: 721 }, // X, Y, Omega Ruby, Alpha Sapphire
  gen7: { start: 722, end: 809 }, // Sun, Moon, Ultra Sun, Ultra Moon, Let's Go
  gen8: { start: 810, end: 905 }, // Sword, Shield, Brilliant Diamond, Shining Pearl, Legends: Arceus
  gen9: { start: 906, end: 1025 }, // Scarlet, Violet, DLC
  all: { start: 1, end: 1025 },
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

/**
 * Get a Pokémon by its ID
 * @param id - The ID of the Pokémon
 * @returns The Pokémon object
 */
export async function getPokemonByDexId(dexId: number): Promise<Pokemon> {
  const pokemon = await db.pokemon.findFirst({
    where: { dexId },
    include: {
      sprites: true,
    },
  });

  if (!pokemon) {
    throw new Error('Pokemon not found');
  }

  return {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types,
    baseStats: {
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      specialAttack: pokemon.specialAttack,
      specialDefense: pokemon.specialDefense,
      speed: pokemon.speed,
      total: pokemon.total,
    } as BaseStats,
    sprites: {
      front_default: pokemon.sprites[0].sprite,
      front_shiny: pokemon.sprites[1].sprite,
    } as PokemonSprites,
  };
}

export async function getPokemonByBaseStat(
  firstPokemon: Pokemon,
  baseStatToCompare: keyof BaseStats,
  difficulty: Difficulty,
): Promise<Pokemon> {
  const { lower, upper } = DIFFICULTY_BOUNDS[difficulty];

  const matchingPokemon = await db.pokemon.findMany({
    where: {
      OR: [
        {
          [baseStatToCompare]: {
            gt: firstPokemon.baseStats[baseStatToCompare] - upper,
            lte: firstPokemon.baseStats[baseStatToCompare] - lower,
          },
        },
        {
          [baseStatToCompare]: {
            gte: firstPokemon.baseStats[baseStatToCompare] + lower,
            lt: firstPokemon.baseStats[baseStatToCompare] + upper,
          },
        },
      ],
    },
    include: {
      sprites: true,
    },
  });

  const pokemon =
    matchingPokemon[Math.floor(Math.random() * matchingPokemon.length)];

  return {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types,
    baseStats: {
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      specialAttack: pokemon.specialAttack,
      specialDefense: pokemon.specialDefense,
      speed: pokemon.speed,
      total: pokemon.total,
    } as BaseStats,
    sprites: {
      front_default: pokemon.sprites[0].sprite,
      front_shiny: pokemon.sprites[1].sprite,
    } as PokemonSprites,
  };
}

export async function getRandomPokemon(
  selectedGenerations: PokemonGeneration[],
): Promise<Pokemon> {
  if (selectedGenerations.length === 0) {
    throw new Error('No generations selected');
  }

  const validDexIds: number[] = [];

  for (const generation of selectedGenerations) {
    const { start, end } = POKEMON_GENERATIONS[generation];
    validDexIds.push(
      ...Array.from({ length: end - start + 1 }, (_, i) => i + start),
    );
  }
  const dexId = validDexIds[Math.floor(Math.random() * validDexIds.length)];
  return getPokemonByDexId(dexId);
}

export async function getBaseStatQuiz(
  selectedGenerations: PokemonGeneration[],
  baseStatToCompare: keyof BaseStats,
  difficulty: Difficulty,
  shinyChance: number,
): Promise<Pokemon[]> {
  const baseStatQuiz: Pokemon[] = [];
  const pokemon = await getRandomPokemon(selectedGenerations);

  pokemon.isShiny = Math.floor(Math.random() * shinyChance) + 1 === shinyChance;

  baseStatQuiz.push(pokemon);

  const secondPokemon = await getPokemonByBaseStat(
    pokemon,
    baseStatToCompare,
    difficulty,
  );

  secondPokemon.isShiny =
    Math.floor(Math.random() * shinyChance) + 1 === shinyChance;

  baseStatQuiz.push(secondPokemon);

  return baseStatQuiz;
}
