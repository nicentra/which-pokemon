'use client';

import type { GameState, GetTwoRandomPokemonResponse } from '@/types/gameState';
import type { BaseStat, Pokemon } from '@/types/pokemon';

import { useCallback, useEffect, useState } from 'react';

import { PokemonCard } from '@/components/PokemonCard';
import { SolutionCard } from '@/components/SolutionCard';
import { api } from '@/lib/axios';
import { useHydratedGameSettings } from '@/stores/gameSettingsStore';
import { baseStatToName } from '@/types/gameState';
import { tryCatch } from '@/utils/try-catch';

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

  // Factory function to create getTwoRandomPokemon with current settings
  const createGetTwoRandomPokemon = useCallback(() => {
    return async function getTwoRandomPokemon(): Promise<GetTwoRandomPokemonResponse> {
      const baseStatToCompare = selectBaseStatToCompare();
      const apiResponse = await tryCatch(
        api.post('/pokemon/quiz', {
          selectedGenerations: selectedGenerations,
          baseStatToCompare: baseStatToCompare,
          difficulty: difficulty,
          shinyChance: shinyChance,
        })
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
    };
  }, [difficulty, selectedGenerations, shinyChance]);

  const initGame = useCallback(async () => {
    const getTwoRandomPokemon = createGetTwoRandomPokemon();

    const firstBatch = await tryCatch(getTwoRandomPokemon());

    if (firstBatch.error) {
      console.error(firstBatch.error);
      throw new Error('Error fetching pokemon');
    }

    setGameState((prevState) => ({
      ...prevState,
      pokemon: firstBatch.data.pokemon,
      baseStatToCompare: firstBatch.data.baseStatToCompare,
    }));

    const secondBatch = await tryCatch(getTwoRandomPokemon());

    if (secondBatch.error) {
      console.error(secondBatch.error);
      throw new Error('Error fetching pokemon');
    }

    setNextPokemon(secondBatch.data);
  }, [createGetTwoRandomPokemon]);

  const resetGame = useCallback(async () => {
    const getTwoRandomPokemon = createGetTwoRandomPokemon();

    setGameState((prevState) => ({
      ...prevState,
      isShowingAnswer: false,
      pokemon: nextPokemon.pokemon,
      baseStatToCompare: nextPokemon.baseStatToCompare,
      correctGuesses: !prevState.guessedCorrectly ? 0 : prevState.correctGuesses,
    }));

    const nextBatch = await tryCatch(getTwoRandomPokemon());

    if (nextBatch.error) {
      console.error(nextBatch.error);
      throw new Error('Error fetching pokemon');
    }

    setNextPokemon(nextBatch.data);
  }, [nextPokemon, createGetTwoRandomPokemon]);

  const guessPokemon = useCallback(
    (firstPokemon: Pokemon, secondPokemon: Pokemon, baseStatToCompare: BaseStat) => {
      if (
        firstPokemon.baseStats[baseStatToCompare] >=
        secondPokemon.baseStats[baseStatToCompare]
      ) {
        setGameState((prevState) => ({
          ...prevState,
          correctGuesses: prevState.correctGuesses + 1,
          guessedCorrectly: true,
          guessedPokemon: firstPokemon,
          correctPokemon: firstPokemon,
          incorrectPokemon: secondPokemon,
          isShowingAnswer: true,
        }));
      } else {
        setGameState((prevState) => ({
          ...prevState,
          guessedPokemon: firstPokemon,
          correctPokemon: secondPokemon,
          incorrectPokemon: firstPokemon,
          guessedCorrectly: false,
          isShowingAnswer: true,
        }));
      }
    },
    []
  );

  useEffect(() => {
    initGame();
  }, [initGame]);

  if (!gameState.pokemon[0] || !gameState.pokemon[1] || !isHydrated) {
    return <div className='flex h-screen items-center justify-center'>Loading...</div>;
  }

  return (
    <div className='m-4 mt-[10vh] flex shrink flex-col items-center justify-center'>
      <h1 className='mb-8 scroll-m-20 text-center text-2xl font-semibold tracking-tight'>
        {`Which Pokémon has the higher ${baseStatToName[gameState.baseStatToCompare]}?`}

        <br />
        {`You've guessed correctly ${gameState.correctGuesses} times in a row!${gameState.correctGuesses >= 20 ? ' Holy shit you are actually autistic' : gameState.correctGuesses >= 10 ? ' You are quite the Pokémon expert' : ''}`}
      </h1>
      <div className='mt-8 mb-8 flex flex-wrap justify-center gap-8'>
        {gameState.pokemon.map((p, i) => {
          const otherPokemon = gameState.pokemon.filter(
            (pokemon) => pokemon.id !== p.id
          )[0];

          return (
            p && (
              <PokemonCard
                key={p.id}
                pokemon={p}
                nextPokemon={nextPokemon.pokemon[i]}
                handleClick={() => {
                  guessPokemon(p, otherPokemon, gameState.baseStatToCompare);
                }}
                isShowingAnswer={gameState.isShowingAnswer}
              />
            )
          );
        })}
      </div>
      {gameState.isShowingAnswer &&
        gameState.guessedPokemon &&
        gameState.correctPokemon &&
        gameState.incorrectPokemon && (
          <div className='flex flex-col items-center justify-center gap-4 text-center text-xl'>
            {gameState.pokemon[0].baseStats[gameState.baseStatToCompare] ===
            gameState.pokemon[1].baseStats[gameState.baseStatToCompare] ? (
              <SolutionCard
                guessedPokemon={gameState.pokemon[0]}
                otherPokemon={gameState.pokemon[1]}
                baseStatToCompare={gameState.baseStatToCompare}
                variant='tie'
                resetGame={resetGame}
              />
            ) : gameState.guessedPokemon?.id === gameState.correctPokemon?.id ? (
              <SolutionCard
                guessedPokemon={gameState.guessedPokemon}
                otherPokemon={gameState.incorrectPokemon}
                baseStatToCompare={gameState.baseStatToCompare}
                variant='correct'
                resetGame={resetGame}
              />
            ) : (
              <SolutionCard
                guessedPokemon={gameState.guessedPokemon}
                otherPokemon={gameState.correctPokemon}
                baseStatToCompare={gameState.baseStatToCompare}
                variant='incorrect'
                resetGame={resetGame}
              />
            )}
          </div>
        )}
    </div>
  );
}
