import type { PokemonType } from "@shared/types/gameData/pokemonType"
import type { PokemonTypeId } from "@shared/types/gameDataIds/pokemonTypes"

export const pokemonTypesMap: IdMap<PokemonTypeId, PokemonType> = {
  NONE: {
    id: "NONE",
    numericId: 19,
  },
  BUG: {
    id: "BUG",
    numericId: 7,
  },
  DARK: {
    id: "DARK",
    numericId: 27,
  },
  DRAGON: {
    id: "DRAGON",
    numericId: 26,
  },
  ELECTRIC: {
    id: "ELECTRIC",
    numericId: 23,
  },
  FIGHTING: {
    id: "FIGHTING",
    numericId: 1,
  },
  FIRE: {
    id: "FIRE",
    numericId: 20,
  },
  FLYING: {
    id: "FLYING",
    numericId: 2,
  },
  GHOST: {
    id: "GHOST",
    numericId: 8,
  },
  GRASS: {
    id: "GRASS",
    numericId: 22,
  },
  GROUND: {
    id: "GROUND",
    numericId: 4,
  },
  ICE: {
    id: "ICE",
    numericId: 25,
  },
  NORMAL: {
    id: "NORMAL",
    numericId: 0,
  },
  POISON: {
    id: "POISON",
    numericId: 3,
  },
  PSYCHIC: {
    id: "PSYCHIC",
    numericId: 24,
  },
  ROCK: {
    id: "ROCK",
    numericId: 5,
  },
  STEEL: {
    id: "STEEL",
    numericId: 9,
  },
  WATER: {
    id: "WATER",
    numericId: 21,
  },
}