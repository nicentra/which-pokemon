-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "dexId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "firstType" TEXT NOT NULL,
    "secondType" TEXT,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "specialAttack" INTEGER NOT NULL,
    "specialDefense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonSprites" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "sprite" TEXT NOT NULL,

    CONSTRAINT "PokemonSprites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PokemonSprites" ADD CONSTRAINT "PokemonSprites_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
