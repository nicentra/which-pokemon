import axios from 'axios';
import { tryCatch } from '../utils/try-catch';
import { Pokemon } from '@/types/pokemon';

export const api = axios.create({});

export async function getPokemon(
  dexId: number,
  shinyChance: number = 4096,
): Promise<Pokemon> {
  console.log('Fetching pokemon with id:', dexId);

  const result = await tryCatch(
    api.get(`/api/pokemon/${dexId}?shinyChance=${shinyChance}`),
  );

  if (result.error) {
    throw result.error;
  }

  return result.data.data as Pokemon;
}
