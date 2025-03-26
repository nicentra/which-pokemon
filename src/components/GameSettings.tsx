'use client';

import { RefreshCcw } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHydratedGameSettings } from '@/stores/gameSettingsStore';
import { Difficulty, POKEMON_GENERATIONS, PokemonGeneration } from '@/types/pokemon';

import { Button } from './ui/button';
import { Input } from './ui/input';

export function GameSettings() {
  const {
    difficulty,
    selectedGenerations,
    shinyChance,
    setDifficulty,
    setSelectedGenerations,
    setShinyChance,
    isHydrated,
  } = useHydratedGameSettings();

  // Don't render until we have the stored values
  if (!isHydrated) {
    return null;
  }

  const saveDifficulty = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
  };

  const saveSelectedGenerations = (selectedGenerations: PokemonGeneration[]) => {
    setSelectedGenerations(selectedGenerations);
  };

  const saveShinyChance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShinyChance(parseInt(e.target.value));
  };

  return (
    <>
      <div className='flex flex-col gap-4'>
        <Label>Select Difficulty</Label>
        <Select
          value={difficulty}
          onValueChange={saveDifficulty}
          defaultValue={difficulty}
        >
          <SelectTrigger>
            <SelectValue placeholder='Difficulty' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='easy'>Easy</SelectItem>
            <SelectItem value='medium'>Medium</SelectItem>
            <SelectItem value='hard'>Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex flex-col gap-4'>
        <Label>Select Generations</Label>
        {Object.entries(POKEMON_GENERATIONS).map(([key, value]) => (
          <div
            key={key}
            className='flex space-x-2'
          >
            <Checkbox
              checked={selectedGenerations.includes(key as PokemonGeneration)}
              onCheckedChange={() => {
                if (selectedGenerations.includes(key as PokemonGeneration)) {
                  saveSelectedGenerations(
                    selectedGenerations.filter(
                      (gen) => gen !== (key as PokemonGeneration)
                    )
                  );
                } else {
                  saveSelectedGenerations(
                    [...selectedGenerations, key as PokemonGeneration].sort((a, b) =>
                      a.localeCompare(b)
                    )
                  );
                }
              }}
            />
            <Label>{value.name}</Label>
          </div>
        ))}
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={() => {
              saveSelectedGenerations(
                Object.keys(POKEMON_GENERATIONS).map((key) => key as PokemonGeneration)
              );
            }}
          >
            Select All
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              saveSelectedGenerations([]);
            }}
          >
            Select None
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <Label>Shiny Chance</Label>
        <div className='flex gap-2'>
          <Input
            type='number'
            value={shinyChance}
            onChange={saveShinyChance}
          />
          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              setShinyChance(4096);
            }}
          >
            <RefreshCcw />
          </Button>
        </div>
      </div>
    </>
  );
}
