import axios from 'axios';
import { tryCatch } from '../utils/try-catch';
import { Pokemon } from '@/types/pokemon';

export const api = axios.create({
  baseURL: '/api',
});

export async function getPokemon(
  firstDexId: number,
  secondDexId: number,
  shinyChance: number = 4096,
): Promise<{ firstPokemon: Pokemon; secondPokemon: Pokemon }> {
  console.log('Fetching pokemon with id:', firstDexId, secondDexId);

  const result = await tryCatch(
    api.get('/pokemon/two-pokemon', {
      params: {
        firstDexId,
        secondDexId,
        shinyChance,
      },
    }),
  );

  if (result.error) {
    throw result.error;
  }

  return result.data.data as {
    firstPokemon: Pokemon;
    secondPokemon: Pokemon;
  };
}
