'use client';

import { Pokemon, BaseStat } from '@/types/pokemon';
import { tryCatch } from '@/utils/try-catch';
import { useState, useEffect } from 'react';
import { PokemonCard } from '@/components/PokemonCard';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardContent } from '@/components/ui/card';
import { useHydratedGameSettings } from '@/stores/gameSettingsStore';

const baseStatToName = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  specialAttack: 'Special Attack',
  specialDefense: 'Special Defense',
  speed: 'Speed',
  total: 'Base Stat Total',
};

type GameState = {
  pokemon: Pokemon[];
  baseStatToCompare: BaseStat;
  guessedPokemon?: Pokemon;
  correctPokemon?: Pokemon;
  incorrectPokemon?: Pokemon;
  isShowingAnswer: boolean;
  correctGuesses: number;
  guessedCorrectly: boolean;
};

type GetTwoRandomPokemonResponse = {
  pokemon: Pokemon[];
  baseStatToCompare: BaseStat;
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    pokemon: [],
    baseStatToCompare: 'hp',
    isShowingAnswer: false,
    correctGuesses: 0,
    guessedCorrectly: false,
  });
  const [nextPokemon, setNextPokemon] = useState<GetTwoRandomPokemonResponse>({
    pokemon: [],
    baseStatToCompare: 'hp',
  });
  const { difficulty, selectedGenerations, shinyChance, isHydrated } =
    useHydratedGameSettings();

  async function getTwoRandomPokemon(): Promise<GetTwoRandomPokemonResponse> {
    const baseStatToCompare = selectBaseStatToCompare();
    const apiResponse = await tryCatch(
      api.post('/pokemon/quiz', {
        selectedGenerations: selectedGenerations,
        baseStatToCompare: baseStatToCompare,
        difficulty: difficulty,
        shinyChance: shinyChance,
      }),
    );

    if (apiResponse.error) {
      console.error(apiResponse.error);
      throw new Error('Error fetching pokemon');
    }

    const { pokemon } = apiResponse.data.data;

    return {
      pokemon: pokemon,
      baseStatToCompare: baseStatToCompare,
    };
  }

  async function initGame() {
    const firstBatch = await tryCatch(getTwoRandomPokemon());

    if (firstBatch.error) {
      console.error(firstBatch.error);
      throw new Error('Error fetching pokemon');
    }

    setGameState({
      ...gameState,
      pokemon: firstBatch.data.pokemon,
      baseStatToCompare: firstBatch.data.baseStatToCompare,
    });

    const secondBatch = await tryCatch(getTwoRandomPokemon());

    if (secondBatch.error) {
      console.error(secondBatch.error);
      throw new Error('Error fetching pokemon');
    }

    setNextPokemon(secondBatch.data);
  }

  async function resetGame() {
    setGameState({
      ...gameState,
      isShowingAnswer: false,
      pokemon: nextPokemon.pokemon,
      baseStatToCompare: nextPokemon.baseStatToCompare,
      correctGuesses: !gameState.guessedCorrectly
        ? 0
        : gameState.correctGuesses,
    });

    const nextBatch = await tryCatch(getTwoRandomPokemon());

    if (nextBatch.error) {
      console.error(nextBatch.error);
      throw new Error('Error fetching pokemon');
    }

    setNextPokemon(nextBatch.data);
  }

  function selectBaseStatToCompare(): BaseStat {
    const baseStatId = Math.floor(Math.random() * 7) + 1;
    switch (baseStatId) {
      case 1:
        return 'hp';
      case 2:
        return 'attack';
      case 3:
        return 'defense';
      case 4:
        return 'specialAttack';
      case 5:
        return 'specialDefense';
      case 6:
        return 'speed';
      case 7:
        return 'total';
      default:
        return 'hp';
    }
  }

  function guessPokemon(
    firstPokemon: Pokemon,
    secondPokemon: Pokemon,
    baseStatToCompare: BaseStat,
  ) {
    if (
      firstPokemon.baseStats[baseStatToCompare] >=
      secondPokemon.baseStats[baseStatToCompare]
    ) {
      setGameState({
        ...gameState,
        correctGuesses: gameState.correctGuesses + 1,
        guessedCorrectly: true,
        guessedPokemon: firstPokemon,
        correctPokemon: firstPokemon,
        incorrectPokemon: secondPokemon,
        isShowingAnswer: true,
      });
    } else {
      setGameState({
        ...gameState,
        guessedPokemon: firstPokemon,
        correctPokemon: secondPokemon,
        incorrectPokemon: firstPokemon,
        guessedCorrectly: false,
        isShowingAnswer: true,
      });
    }
  }

  useEffect(() => {
    initGame();
  }, []);

  if (!gameState.pokemon[0] || !gameState.pokemon[1] || !isHydrated) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    );
  }

  return (
    <div className='m-4 mt-[10vh] flex flex-col items-center justify-center'>
      <h1 className='mb-8 text-center text-2xl font-bold'>
        {`Which Pokémon has the higher ${baseStatToName[gameState.baseStatToCompare]}?`}

        <br />
        {`You've guessed correctly ${gameState.correctGuesses} times in a row!${gameState.correctGuesses >= 20 ? ' Holy shit you are actually autistic' : gameState.correctGuesses >= 10 ? ' You are quite the Pokémon expert' : ''}`}
      </h1>
      <div className='mt-8 mb-8 flex flex-wrap justify-center gap-8'>
        <Card className='flex flex-col items-center justify-center gap-4'>
          {gameState.pokemon[0] && (
            <PokemonCard pokemon={gameState.pokemon[0]} />
          )}
          <CardFooter>
            <Button
              className='font-bold'
              variant='destructive'
              onClick={() => {
                guessPokemon(
                  gameState.pokemon[0],
                  gameState.pokemon[1],
                  gameState.baseStatToCompare,
                );
              }}
              disabled={gameState.isShowingAnswer}
            >
              {`Obviously ${gameState.pokemon[0].name}!`}
            </Button>
          </CardFooter>
        </Card>
        <Card className='flex flex-col items-center justify-center gap-4'>
          {gameState.pokemon[1] && (
            <PokemonCard pokemon={gameState.pokemon[1]} />
          )}
          <CardFooter>
            <Button
              className='font-bold'
              variant='destructive'
              onClick={() => {
                guessPokemon(
                  gameState.pokemon[1],
                  gameState.pokemon[0],
                  gameState.baseStatToCompare,
                );
              }}
              disabled={gameState.isShowingAnswer}
            >
              {`Obviously ${gameState.pokemon[1].name}!`}
            </Button>
          </CardFooter>
        </Card>
      </div>
      {gameState.isShowingAnswer && (
        <div className='flex flex-col items-center justify-center gap-4 text-center text-xl'>
          {gameState.pokemon[0].baseStats[gameState.baseStatToCompare] ===
          gameState.pokemon[1].baseStats[gameState.baseStatToCompare] ? (
            <Card className='flex flex-col items-center justify-center gap-4'>
              <CardContent>
                {`Well technically, ${gameState.pokemon[0].name} and ${gameState.pokemon[1].name} have the same ${baseStatToName[gameState.baseStatToCompare]} but we're counting that as a win for you!`}
              </CardContent>
              <CardFooter className='flex flex-col items-center justify-center gap-4'>
                <Button
                  className='font-bold'
                  variant='accept'
                  onClick={() => {
                    resetGame();
                  }}
                >
                  {`Play again?`}
                </Button>
              </CardFooter>
            </Card>
          ) : gameState.guessedPokemon?.id === gameState.correctPokemon?.id ? (
            <Card className='flex flex-col items-center justify-center gap-4'>
              <CardContent>
                {`Wow you must be a Pokémon Professor! (or incredibly autistic)`}
                <br />
                {`${gameState.guessedPokemon?.name} has ${gameState.guessedPokemon?.baseStats[gameState.baseStatToCompare]} ${baseStatToName[gameState.baseStatToCompare]} whereas ${gameState.incorrectPokemon?.name} has ${gameState.incorrectPokemon?.baseStats[gameState.baseStatToCompare]} ${baseStatToName[gameState.baseStatToCompare]}!`}
              </CardContent>
              <CardFooter className='flex flex-col items-center justify-center gap-4'>
                <Button
                  className='font-bold'
                  variant='accept'
                  onClick={() => {
                    resetGame();
                  }}
                >
                  {`Play again?`}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className='flex flex-col items-center justify-center gap-4'>
              <CardContent>
                {`You absolute buffoon! You call yourself a Pokémon fan?`}
                <br />
                {`${gameState.guessedPokemon?.name} has only ${gameState.guessedPokemon?.baseStats[gameState.baseStatToCompare]} ${baseStatToName[gameState.baseStatToCompare]} whereas ${gameState.correctPokemon?.name} has ${gameState.correctPokemon?.baseStats[gameState.baseStatToCompare]} ${baseStatToName[gameState.baseStatToCompare]}!`}
              </CardContent>
              <CardFooter className='flex flex-col items-center justify-center gap-4'>
                <Button
                  className='font-bold'
                  variant='accept'
                  onClick={() => {
                    resetGame();
                  }}
                >
                  {`Play again?`}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
