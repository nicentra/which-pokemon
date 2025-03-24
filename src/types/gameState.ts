import { Pokemon, BaseStat } from './pokemon';

export const baseStatToName = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  specialAttack: 'Special Attack',
  specialDefense: 'Special Defense',
  speed: 'Speed',
  total: 'Base Stat Total',
};

export type GameState = {
  pokemon: Pokemon[];
  baseStatToCompare: BaseStat;
  guessedPokemon?: Pokemon;
  correctPokemon?: Pokemon;
  incorrectPokemon?: Pokemon;
  isShowingAnswer: boolean;
  correctGuesses: number;
  guessedCorrectly: boolean;
};

export type GetTwoRandomPokemonResponse = {
  pokemon: Pokemon[];
  baseStatToCompare: BaseStat;
};
