export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
  sprites: PokemonSprites;
  moves?: Move[];
  abilities?: Ability[];
  isShiny: boolean;
}

export interface Ability {
  name: string;
  isHidden: boolean;
}

export interface Move {
  name: string;
  learnMethod: string;
}

export interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
}
