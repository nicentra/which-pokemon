/*
  Warnings:

  - You are about to drop the column `firstType` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `secondType` on the `Pokemon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "firstType",
DROP COLUMN "secondType",
ADD COLUMN     "types" TEXT[];

-- CreateTable
CREATE TABLE "Move" (
    "id" SERIAL NOT NULL,
    "moveId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonMove" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "moveId" INTEGER NOT NULL,

    CONSTRAINT "PokemonMove_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PokemonMove" ADD CONSTRAINT "PokemonMove_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonMove" ADD CONSTRAINT "PokemonMove_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "Move"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
