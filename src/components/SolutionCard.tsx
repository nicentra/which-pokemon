import type { BaseStat, Pokemon } from '@/types/pokemon';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { baseStatToName } from '@/types/gameState';

export function SolutionCard({
  guessedPokemon,
  otherPokemon,
  baseStatToCompare,
  resetGame,
  variant,
}: {
  guessedPokemon: Pokemon;
  otherPokemon: Pokemon;
  baseStatToCompare: BaseStat;
  resetGame: () => void;
  variant: 'correct' | 'incorrect' | 'tie';
}) {
  const cardContent: string | React.ReactNode =
    variant === 'tie' ? (
      `Well technically, ${guessedPokemon.name} and ${otherPokemon.name} have the same ${baseStatToName[baseStatToCompare]} but we're counting that as a win for you!`
    ) : variant === 'correct' ? (
      <>
        <span>{`Wow you must be a Pokémon Professor! (or incredibly autistic)`}</span>
        <br />
        <span>
          {`${guessedPokemon.name} has ${guessedPokemon.baseStats[baseStatToCompare]} ${baseStatToName[baseStatToCompare]} whereas ${otherPokemon.name} has ${otherPokemon.baseStats[baseStatToCompare]} ${baseStatToName[baseStatToCompare]}!`}
        </span>
      </>
    ) : (
      <>
        <span>{`You absolute buffoon! You call yourself a Pokémon fan?`}</span>
        <br />
        <span>
          {`${guessedPokemon.name} has only ${guessedPokemon.baseStats[baseStatToCompare]} ${baseStatToName[baseStatToCompare]} whereas ${otherPokemon.name} has ${otherPokemon.baseStats[baseStatToCompare]} ${baseStatToName[baseStatToCompare]}!`}
        </span>
      </>
    );

  return (
    <Card className='flex flex-col items-center justify-center gap-4'>
      <CardContent>{cardContent}</CardContent>
      <CardFooter className='flex flex-col items-center justify-center gap-4'>
        <Button
          className='font-bold'
          variant='accept'
          onClick={resetGame}
        >
          {`Play again?`}
        </Button>
      </CardFooter>
    </Card>
  );
}
