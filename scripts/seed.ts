import { db } from '@/lib/db';
import { BaseStats } from '@/types/pokemon';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Prisma } from '@prisma/client';
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
    pokemon_v2_pokemonmoves: {
      move_id: number;
      pokemon_v2_move: {
        name: string;
      };
      pokemon_v2_movelearnmethod: {
        id: number;
        name: string;
      };
    }[];
    pokemon_v2_pokemonabilities: {
      ability_id: number;
      is_hidden: boolean;
      pokemon_v2_ability: {
        name: string;
      };
    }[];
  }[];
};

const client = new ApolloClient({
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
  cache: new InMemoryCache(),
});

const GET_POKEMON = gql`
  query GetAllPokemonQuery($minId: Int!, $maxId: Int!) {
    pokemon_v2_pokemon(where: { id: { _gt: $minId, _lte: $maxId } }) {
      id
      name
      pokemon_v2_pokemonstats {
        base_stat
        stat_id
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
      pokemon_v2_pokemonmoves {
        move_id
        pokemon_v2_move {
          name
        }
        pokemon_v2_movelearnmethod {
          id
          name
        }
      }
      pokemon_v2_pokemonabilities {
        ability_id
        is_hidden
        pokemon_v2_ability {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites(path: "other.official-artwork")
      }
    }
  }
`;

const fetchPokemon = async (minId: number, maxId: number) => {
  const { data } = await client.query<PokemonData>({
    query: GET_POKEMON,
    variables: { minId, maxId },
  });
  return data.pokemon_v2_pokemon;
};

const seedPokemon = async () => {
  for (let i = 0; i < 1025; i += 50) {
    console.log(`Fetching pokemon from ${i + 1} to ${i + 50}`);
    const pokemon = await fetchPokemon(i, i + 50);
    const pokemonData: Prisma.PokemonCreateInput[] = pokemon.map((p) => ({
      dexId: p.id,
      name: p.name
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('-'),
      types: p.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name),
      ...p.pokemon_v2_pokemonstats.reduce(
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
      total: p.pokemon_v2_pokemonstats_aggregate.aggregate.sum.base_stat,
      sprites: {
        create: [
          {
            sprite: p.pokemon_v2_pokemonsprites[0].sprites.front_default,
          },
          {
            sprite: p.pokemon_v2_pokemonsprites[0].sprites.front_shiny,
          },
        ],
      },
      moves: {
        create: p.pokemon_v2_pokemonmoves.map((m) => ({
          moveId: m.move_id,
          name: m.pokemon_v2_move.name
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' '),
          learnMethod: m.pokemon_v2_movelearnmethod.name,
        })),
      },
      abilities: {
        create: p.pokemon_v2_pokemonabilities.map((a) => ({
          abilityId: a.ability_id,
          name: a.pokemon_v2_ability.name
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' '),
          isHidden: a.is_hidden,
        })),
      },
    }));

    for (const pd of pokemonData) {
      await db.pokemon.create({
        data: pd,
      });
    }
  }
};

seedPokemon();
