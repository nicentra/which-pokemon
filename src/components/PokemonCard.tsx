import type { Pokemon } from '@/types/pokemon';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function PokemonCard({
  pokemon,
  nextPokemon,
  handleClick,
  isShowingAnswer,
}: {
  pokemon: Pokemon;
  nextPokemon?: Pokemon;
  handleClick: () => void;
  isShowingAnswer: boolean;
}) {
  return (
    <Card className='flex flex-col items-center justify-center gap-4'>
      <CardHeader className='w-full'>
        <CardTitle className='text-center text-xl'>
          #{pokemon.id} {pokemon.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nextPokemon && (
          <Image
            hidden={true}
            loader={({ src }) => src}
            src={nextPokemon.sprites.front_default}
            alt={nextPokemon.name}
            className='size-72'
            width={288}
            height={288}
          />
        )}
        <Image
          loader={({ src }) => src}
          src={
            pokemon.isShiny
              ? pokemon.sprites.front_shiny
              : pokemon.sprites.front_default
          }
          alt={pokemon.name}
          className='size-72'
          width={288}
          height={288}
        />
      </CardContent>
      <CardFooter>
        <Button
          className='font-bold'
          variant='destructive'
          onClick={handleClick}
          disabled={isShowingAnswer}
        >
          {`Obviously ${pokemon.name}!`}
        </Button>
      </CardFooter>
    </Card>
  );
}
