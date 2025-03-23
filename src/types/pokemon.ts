export type Pokemon = {
  id: number;
  name: string;
  types: string[];
  baseStats: BaseStats;
  sprites: PokemonSprites;
  moves?: Move[];
  abilities?: Ability[];
  isShiny?: boolean;
};

export type Ability = {
  name: string;
  isHidden: boolean;
};

export type Move = {
  name: string;
  learnMethod: string;
};

export type BaseStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
};

export type BaseStat = keyof BaseStats;

export type PokemonSprites = {
  front_default: string;
  front_shiny: string;
};
