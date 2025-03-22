import { NextRequest, NextResponse } from 'next/server';
import { Pokemon, PokemonSprites } from '@/types/pokemon';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dexId: string }> },
) {
  const { dexId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const shinyChance = parseInt(searchParams.get('shinyChance') ?? '4096');

  if (!dexId) {
    return NextResponse.json({ error: 'Dex ID is required' }, { status: 400 });
  }

  const pokemon = await db.pokemon.findFirst({
    where: { dexId: parseInt(dexId) },
    include: {
      sprites: true,
    },
  });

  if (!pokemon) {
    return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 });
  }

  const res: Pokemon = {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types,
    hp: pokemon.hp,
    attack: pokemon.attack,
    defense: pokemon.defense,
    specialAttack: pokemon.specialAttack,
    specialDefense: pokemon.specialDefense,
    speed: pokemon.speed,
    total: pokemon.total,
    sprites: {
      front_default: pokemon.sprites[0].sprite,
      front_shiny: pokemon.sprites[1].sprite,
    } as PokemonSprites,
    isShiny: Math.floor(Math.random() * shinyChance) + 1 === shinyChance,
  };

  return NextResponse.json(res, { status: 200 });
}
