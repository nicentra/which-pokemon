export interface Pokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
  baseStats: BaseStats;
  baseStatsTotal: number;
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
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
}
