'use client';

import { Pokemon } from '@/types/pokemon';
import { getPokemon } from '@/lib/axios';
import { tryCatch } from '@/utils/try-catch';
import { useState, useEffect } from 'react';
import { PokemonCard } from '@/components/PokemonCard';

type BaseStat =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'specialAttack'
  | 'specialDefense'
  | 'speed'
  | 'total';

const baseStatToName = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  specialAttack: 'Special Attack',
  specialDefense: 'Special Defense',
  speed: 'Speed',
  total: 'Base Stat Total',
};

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [nextPokemon, setNextPokemon] = useState<Pokemon[]>([]);
  const [shinyChance, setShinyChance] = useState<number>(4096);
  const [guessedPokemon, setGuessedPokemon] = useState<Pokemon>();
  const [correctPokemon, setCorrectPokemon] = useState<Pokemon>();
  const [incorrectPokemon, setIncorrectPokemon] = useState<Pokemon>();
  const [baseStatToCompare, setBaseStatToCompare] = useState<BaseStat>('hp');
  const [isShowingAnswer, setIsShowingAnswer] = useState<boolean>(false);
  const [correctGuesses, setCorrectGuesses] = useState<number>(0);
  const [guessedCorrectly, setGuessedCorrectly] = useState<boolean>(false);

  function getTwoRandonmNumbers(min: number, max: number) {
    const firstNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const secondNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return { firstNumber, secondNumber };
  }

  async function getTwoRandomPokemon() {
    const { firstNumber, secondNumber } = getTwoRandonmNumbers(1, 1025);
    const apiResponse = await tryCatch(
      getPokemon(firstNumber, secondNumber, shinyChance),
    );
    if (apiResponse.error) {
      console.error(apiResponse.error);
      throw new Error('Error fetching pokemon');
    }

    const { firstPokemon, secondPokemon } = apiResponse.data;

    setPokemon([firstPokemon, secondPokemon]);
  }

  async function getNextPokemon() {
    const { firstNumber, secondNumber } = getTwoRandonmNumbers(1, 1025);
    const apiResponse = await tryCatch(
      getPokemon(firstNumber, secondNumber, shinyChance),
    );
    if (apiResponse.error) {
      console.error(apiResponse.error);
      throw new Error('Error fetching pokemon');
    }
    const { firstPokemon, secondPokemon } = apiResponse.data;
    setNextPokemon([firstPokemon, secondPokemon]);
  }

  async function resetGame() {
    if (!guessedCorrectly) {
      setCorrectGuesses(0);
    }
    setIsShowingAnswer(false);
    setGuessedPokemon(undefined);
    setCorrectPokemon(undefined);
    setIncorrectPokemon(undefined);
    setPokemon([...nextPokemon]);
    getNextPokemon();
    const baseStat = selectBaseStatToCompare();
    setBaseStatToCompare(baseStat);
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
  ): boolean {
    if (firstPokemon[baseStatToCompare] >= secondPokemon[baseStatToCompare]) {
      setCorrectGuesses(correctGuesses + 1);
      setGuessedCorrectly(true);
      setGuessedPokemon(firstPokemon);
      setCorrectPokemon(firstPokemon);
      setIncorrectPokemon(secondPokemon);
      return true;
    }
    setGuessedPokemon(firstPokemon);
    setCorrectPokemon(secondPokemon);
    setIncorrectPokemon(firstPokemon);
    setGuessedCorrectly(false);
    return false;
  }

  useEffect(() => {
    getTwoRandomPokemon();
    getNextPokemon();
    const baseStat = selectBaseStatToCompare();
    console.log('Base stat:', baseStat);
    setBaseStatToCompare(baseStat);
  }, []);

  if (!pokemon[0] || !pokemon[1]) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    );
  }

  return (
    <div className='m-4 mt-[10vh] flex flex-col items-center justify-center'>
      <h1 className='mb-8 text-center text-2xl font-bold'>
        {`Which Pokémon has the higher ${baseStatToName[baseStatToCompare]}?`}

        <br />
        {`You've guessed correctly ${correctGuesses} times in a row!${correctGuesses >= 20 ? ' Holy shit you are actually autistic' : correctGuesses >= 10 ? ' You are quite the Pokémon expert' : ''}`}
      </h1>
      <div className='mt-8 mb-8 flex flex-wrap justify-center gap-8'>
        <div className='flex flex-col items-center justify-center gap-4 rounded-xl bg-gray-800 p-4'>
          {pokemon[0] && <PokemonCard pokemon={pokemon[0]} />}
          <button
            className='rounded-md bg-red-500 px-4 py-2 font-bold text-white not-disabled:hover:bg-red-600 disabled:opacity-50'
            onClick={() => {
              guessPokemon(pokemon[0], pokemon[1], baseStatToCompare!);
              setIsShowingAnswer(true);
            }}
            disabled={isShowingAnswer}
          >
            {`Obviously ${pokemon[0].name}!`}
          </button>
        </div>
        <div className='flex flex-col items-center justify-center gap-4 rounded-xl bg-gray-800 p-4'>
          {pokemon[1] && <PokemonCard pokemon={pokemon[1]} />}
          <button
            className='rounded-md bg-red-500 px-4 py-2 font-bold text-white not-disabled:hover:bg-red-600 disabled:opacity-50'
            onClick={() => {
              guessPokemon(pokemon[1], pokemon[0], baseStatToCompare!);
              setIsShowingAnswer(true);
            }}
            disabled={isShowingAnswer}
          >
            {`Obviously ${pokemon[1].name}!`}
          </button>
        </div>
      </div>
      {isShowingAnswer && (
        <div className='flex max-w-3xl flex-col items-center justify-center gap-4 text-center text-xl'>
          {pokemon[0][baseStatToCompare] === pokemon[1][baseStatToCompare] ? (
            <>
              <div>
                {`Well technically, ${pokemon[0].name} and ${pokemon[1].name} have the same ${baseStatToName[baseStatToCompare]} but we're counting that as a win for you!`}
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
          ) : guessedPokemon?.id === correctPokemon?.id ? (
            <>
              <div>
                {`Wow you must be a Pokémon Professor! (or incredibly autistic)`}
                <br />
                {`${guessedPokemon?.name} has ${guessedPokemon?.[baseStatToCompare]} ${baseStatToName[baseStatToCompare]} whereas ${incorrectPokemon?.name} has ${incorrectPokemon?.[baseStatToCompare]} ${baseStatToName[baseStatToCompare]}!`}
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
                {`${guessedPokemon?.name} has only ${guessedPokemon?.[baseStatToCompare]} ${baseStatToName[baseStatToCompare]} whereas ${correctPokemon?.name} has ${correctPokemon?.[baseStatToCompare]} ${baseStatToName[baseStatToCompare]}!`}
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
