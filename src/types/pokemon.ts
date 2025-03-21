export interface Pokemon {
  id: number;
  name: string;
  firstType: string;
  secondType: string | null;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
  sprites: PokemonSprites;
  isShiny: boolean;
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
