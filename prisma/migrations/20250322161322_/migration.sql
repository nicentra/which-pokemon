-- DropForeignKey
ALTER TABLE "Ability" DROP CONSTRAINT "Ability_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "Move" DROP CONSTRAINT "Move_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonSprites" DROP CONSTRAINT "PokemonSprites_pokemonId_fkey";

-- AlterTable
ALTER TABLE "Ability" ALTER COLUMN "pokemonId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Move" ALTER COLUMN "pokemonId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PokemonSprites" ALTER COLUMN "pokemonId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PokemonSprites" ADD CONSTRAINT "PokemonSprites_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ability" ADD CONSTRAINT "Ability_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
