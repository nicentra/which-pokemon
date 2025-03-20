import axios from 'axios';
import { tryCatch } from './try-catch';
import { Pokemon, BaseStats } from '@/types/pokemon';

export const api = axios.create({
  baseURL: 'https://beta.pokeapi.co/graphql/v1beta',
});

export type PokemonData = {
  pokemon_v2_pokemon: {
    id: number;
    name: string;
    pokemon_v2_pokemonstats: {
      base_stat: number;
      pokemon_v2_stat: {
        name: string;
      };
    }[];
    pokemon_v2_pokemonstats_aggregate: {
      aggregate: {
        sum: {
          base_stat: number;
        };
      };
    };
    pokemon_v2_pokemontypes: {
      pokemon_v2_type: {
        name: string;
      };
    }[];
    pokemon_v2_pokemonsprites: {
      sprites: {
        front_default: string;
        front_shiny: string;
      };
    }[];
  }[];
};

export async function getPokemon(id: number): Promise<Pokemon> {
  console.log('Fetching pokemon with id:', id);
  const result = await tryCatch(
    api.post('/', {
      query: `
      query {
        pokemon_v2_pokemon(where: {id: {_eq: ${id}}}) {
          id
          name
          pokemon_v2_pokemonstats {
            base_stat
            pokemon_v2_stat {
              name
            }
          }
          pokemon_v2_pokemonstats_aggregate {
            aggregate {
              sum {
                base_stat
              }
            }
          }
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
            }
          }
          pokemon_v2_pokemonsprites {
            sprites(path: "other.official-artwork")
          }
        }
      }
    `,
    }),
  );
  if (result.error) {
    throw result.error;
  }
  const data = result.data.data.data as PokemonData;
  const pokemonName = data.pokemon_v2_pokemon[0].name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');
  const pokemon: Pokemon = {
    id: data.pokemon_v2_pokemon[0].id,
    name: pokemonName,
    sprites: data.pokemon_v2_pokemon[0].pokemon_v2_pokemonsprites[0].sprites,
    baseStats: {
      ...data.pokemon_v2_pokemon[0].pokemon_v2_pokemonstats.reduce(
        (acc, stat) => ({
          ...acc,
          [stat.pokemon_v2_stat.name === 'special-attack'
            ? 'specialAttack'
            : stat.pokemon_v2_stat.name === 'special-defense'
              ? 'specialDefense'
              : stat.pokemon_v2_stat.name]: stat.base_stat,
        }),
        {} as BaseStats,
      ),
      total:
        data.pokemon_v2_pokemon[0].pokemon_v2_pokemonstats_aggregate.aggregate
          .sum.base_stat,
    },
    firstType:
      data.pokemon_v2_pokemon[0].pokemon_v2_pokemontypes[0].pokemon_v2_type
        .name,
    secondType:
      data.pokemon_v2_pokemon[0].pokemon_v2_pokemontypes[1]?.pokemon_v2_type
        ?.name ?? null,
    isShiny: Math.floor(Math.random() * 4096) + 1 === 4096,
  };
  console.log('Pokemon:', pokemon);

  return pokemon;
}
