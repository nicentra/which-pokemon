export interface Pokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
  baseStats: BaseStats;
  firstType: string;
  secondType: string | null;
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
