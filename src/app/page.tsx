'use client';

import { Pokemon, BaseStat } from '@/types/pokemon';
import { tryCatch } from '@/utils/try-catch';
import { useState, useEffect } from 'react';
import { PokemonCard } from '@/components/PokemonCard';
import { Difficulty, PokemonGeneration } from '@/lib/pokemon';
import { api } from '@/lib/axios';

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
  shinyChance: number;
  difficulty: Difficulty;
  selectedGenerations: PokemonGeneration[];
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
    shinyChance: 4096,
    difficulty: 'medium',
    selectedGenerations: ['all'],
    isShowingAnswer: false,
    correctGuesses: 0,
    guessedCorrectly: false,
  });
  const [nextPokemon, setNextPokemon] = useState<GetTwoRandomPokemonResponse>({
    pokemon: [],
    baseStatToCompare: 'hp',
  });

  async function getTwoRandomPokemon(): Promise<GetTwoRandomPokemonResponse> {
    const baseStatToCompare = selectBaseStatToCompare();
    const apiResponse = await tryCatch(
      api.post('/pokemon/quiz', {
        selectedGenerations: gameState.selectedGenerations,
        baseStatToCompare: baseStatToCompare,
        difficulty: gameState.difficulty,
        shinyChance: gameState.shinyChance,
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
    setTimeout(() => {
      console.log(gameState);
    }, 5000);
  }

  useEffect(() => {
    initGame();
  }, []);

  if (!gameState.pokemon[0] || !gameState.pokemon[1]) {
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
        <div className='flex flex-col items-center justify-center gap-4 rounded-xl bg-gray-800 p-4'>
          {gameState.pokemon[0] && (
            <PokemonCard pokemon={gameState.pokemon[0]} />
          )}
          <button
            className='rounded-md bg-red-500 px-4 py-2 font-bold text-white not-disabled:hover:bg-red-600 disabled:opacity-50'
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
          </button>
        </div>
        <div className='flex flex-col items-center justify-center gap-4 rounded-xl bg-gray-800 p-4'>
          {gameState.pokemon[1] && (
            <PokemonCard pokemon={gameState.pokemon[1]} />
          )}
          <button
            className='rounded-md bg-red-500 px-4 py-2 font-bold text-white not-disabled:hover:bg-red-600 disabled:opacity-50'
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
          </button>
        </div>
      </div>
      {gameState.isShowingAnswer && (
        <div className='flex max-w-3xl flex-col items-center justify-center gap-4 text-center text-xl'>
          {gameState.pokemon[0].baseStats[gameState.baseStatToCompare] ===
          gameState.pokemon[1].baseStats[gameState.baseStatToCompare] ? (
            <>
              <div>
                {`Well technically, ${gameState.pokemon[0].name} and ${gameState.pokemon[1].name} have the same ${baseStatToName[gameState.baseStatToCompare]} but we're counting that as a win for you!`}
              </div>
              <button
                className='rounded-md bg-green-500 px-4 py-2 font-bold text-white not-disabled:hover:bg-green-600 disabled:opacity-50'
                onClick={() => {
                  resetGame();
                }}
              >
                {`Play again?`}
              </button>
            </>
          ) : gameState.guessedPokemon?.id === gameState.correctPokemon?.id ? (
            <>
              <div>
                {`Wow you must be a Pokémon Professor! (or incredibly autistic)`}
                <br />
                {`${gameState.guessedPokemon?.name} has ${gameState.guessedPokemon?.baseStats[gameState.baseStatToCompare]} ${baseStatToName[gameState.baseStatToCompare]} whereas ${gameState.incorrectPokemon?.name} has ${gameState.incorrectPokemon?.baseStats[gameState.baseStatToCompare]} ${baseStatToName[gameState.baseStatToCompare]}!`}
              </div>
              <button
                className='rounded-md bg-green-500 px-4 py-2 font-bold text-white not-disabled:hover:bg-green-600 disabled:opacity-50'
                onClick={() => {
                  resetGame();
                }}
              >
                {`Play again?`}
              </button>
            </>
          ) : (
            <>
              <div>
                {`You absolute buffoon! You call yourself a Pokémon fan?`}
                <br />
                {`${gameState.guessedPokemon?.name} has only ${gameState.guessedPokemon?.baseStats[gameState.baseStatToCompare]} ${baseStatToName[gameState.baseStatToCompare]} whereas ${gameState.correctPokemon?.name} has ${gameState.correctPokemon?.baseStats[gameState.baseStatToCompare]} ${baseStatToName[gameState.baseStatToCompare]}!`}
              </div>
              <button
                className='rounded-md bg-green-800 px-4 py-2 font-bold text-white not-disabled:hover:bg-green-600 disabled:opacity-50'
                onClick={() => {
                  resetGame();
                }}
              >
                {`Play again?`}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
