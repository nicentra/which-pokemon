import { db } from '@/lib/db';
import {
  Pokemon,
  PokemonSprites,
  BaseStats,
  PokemonGeneration,
  Difficulty,
  POKEMON_GENERATIONS,
  DIFFICULTY_BOUNDS,
} from '@/types/pokemon';

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
  validDexIds: number[],
): Promise<Pokemon> {
  const { lower, upper } = DIFFICULTY_BOUNDS[difficulty];

  const matchingPokemon = await db.pokemon.findMany({
    where: {
      dexId: {
        in: validDexIds,
      },
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
  validDexIds: number[],
): Promise<Pokemon> {
  const dexId = validDexIds[Math.floor(Math.random() * validDexIds.length)];
  return getPokemonByDexId(dexId);
}

export async function getBaseStatQuiz(
  selectedGenerations: PokemonGeneration[],
  baseStatToCompare: keyof BaseStats,
  difficulty: Difficulty,
  shinyChance: number,
): Promise<Pokemon[]> {
  if (selectedGenerations.length === 0) {
    throw new Error('No generations selected');
  }

  const validDexIds: number[] = [];

  for (const generation of selectedGenerations) {
    const { start, end } = POKEMON_GENERATIONS[generation];
    const dexIds = Array.from({ length: end - start + 1 }, (_, i) => i + start);

    validDexIds.push(...dexIds);
  }
  const baseStatQuiz: Pokemon[] = [];
  const pokemon = await getRandomPokemon(validDexIds);

  pokemon.isShiny = Math.floor(Math.random() * shinyChance) + 1 === shinyChance;

  baseStatQuiz.push(pokemon);

  const secondPokemon = await getPokemonByBaseStat(
    pokemon,
    baseStatToCompare,
    difficulty,
    validDexIds,
  );

  secondPokemon.isShiny =
    Math.floor(Math.random() * shinyChance) + 1 === shinyChance;

  baseStatQuiz.push(secondPokemon);

  return baseStatQuiz;
}
