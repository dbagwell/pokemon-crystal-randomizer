export const pokemonTypeIds = [
  "NONE",
  "BUG",
  "DARK",
  "DRAGON",
  "ELECTRIC",
  "FIGHTING",
  "FIRE",
  "FLYING",
  "GHOST",
  "GRASS",
  "GROUND",
  "ICE",
  "NORMAL",
  "POISON",
  "PSYCHIC",
  "ROCK",
  "STEEL",
  "WATER",
] as const

export type PokemonTypeId = typeof pokemonTypeIds[number]