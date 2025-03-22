-- CreateTable
CREATE TABLE "Ability" (
    "id" SERIAL NOT NULL,
    "abilityId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonAbility" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "abilityId" INTEGER NOT NULL,
    "isHidden" BOOLEAN NOT NULL,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
