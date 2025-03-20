import { Pokemon } from '@/types/pokemon';

export function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <h1 className='text-2xl font-bold'>
        #{pokemon.id} {pokemon.name}
      </h1>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
      />
    </div>
  );
}
