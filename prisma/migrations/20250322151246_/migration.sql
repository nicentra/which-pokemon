/*
  Warnings:

  - You are about to drop the `PokemonAbility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PokemonMove` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isHidden` to the `Ability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pokemonId` to the `Ability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learnMethod` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pokemonId` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PokemonAbility" DROP CONSTRAINT "PokemonAbility_abilityId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonAbility" DROP CONSTRAINT "PokemonAbility_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonMove" DROP CONSTRAINT "PokemonMove_moveId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonMove" DROP CONSTRAINT "PokemonMove_pokemonId_fkey";

-- AlterTable
ALTER TABLE "Ability" ADD COLUMN     "isHidden" BOOLEAN NOT NULL,
ADD COLUMN     "pokemonId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "learnMethod" TEXT NOT NULL,
ADD COLUMN     "pokemonId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PokemonAbility";

-- DropTable
DROP TABLE "PokemonMove";

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ability" ADD CONSTRAINT "Ability_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
