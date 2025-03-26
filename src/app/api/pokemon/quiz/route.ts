import { NextRequest, NextResponse } from 'next/server';

import { getBaseStatQuiz } from '@/lib/pokemon';
import { tryCatch } from '@/utils/try-catch';

export async function POST(request: NextRequest) {
  const { selectedGenerations, baseStatToCompare, difficulty, shinyChance } =
    await request.json();

  if (!selectedGenerations || !baseStatToCompare || !difficulty || !shinyChance) {
    return NextResponse.json(
      { error: 'Required parameters are missing' },
      { status: 400 }
    );
  }

  const result = await tryCatch(
    getBaseStatQuiz(selectedGenerations, baseStatToCompare, difficulty, shinyChance)
  );

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const pokemon = result.data;

  if (!pokemon) {
    return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 });
  }

  return NextResponse.json({ pokemon }, { status: 200 });
}
