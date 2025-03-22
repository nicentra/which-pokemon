import { NextRequest, NextResponse } from 'next/server';
import { Pokemon, PokemonSprites } from '@/types/pokemon';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shinyChance = parseInt(searchParams.get('shinyChance') ?? '4096');
  const firstDexId = parseInt(searchParams.get('firstDexId') ?? '1');
  const secondDexId = parseInt(searchParams.get('secondDexId') ?? '2');

  if (!firstDexId || !secondDexId) {
    return NextResponse.json(
      { error: 'Dex IDs are required' },
      { status: 400 },
    );
  }

  const pokemon = await db.pokemon.findMany({
    where: { dexId: { in: [firstDexId, secondDexId] } },
    include: {
      sprites: true,
    },
  });

  if (!pokemon) {
    return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 });
  }

  const res: Pokemon[] = pokemon.map((p) => ({
    id: p.id,
    name: p.name,
    types: p.types,
    hp: p.hp,
    attack: p.attack,
    defense: p.defense,
    specialAttack: p.specialAttack,
    specialDefense: p.specialDefense,
    speed: p.speed,
    total: p.total,
    sprites: {
      front_default: p.sprites[0].sprite,
      front_shiny: p.sprites[1].sprite,
    } as PokemonSprites,
    isShiny: Math.floor(Math.random() * shinyChance) + 1 === shinyChance,
  }));

  return NextResponse.json(
    { firstPokemon: res[0], secondPokemon: res[1] },
    { status: 200 },
  );
}
