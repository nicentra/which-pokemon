import { Pokemon } from '@/types/pokemon';
import { CardHeader, CardContent, CardTitle } from './ui/card';
export function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <>
      <CardHeader className='w-full'>
        <CardTitle className='text-center text-xl'>
          #{pokemon.id} {pokemon.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={
            pokemon.isShiny
              ? pokemon.sprites.front_shiny
              : pokemon.sprites.front_default
          }
          alt={pokemon.name}
          className='size-72'
        />
      </CardContent>
    </>
  );
}
