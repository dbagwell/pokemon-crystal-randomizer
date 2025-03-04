import { pokemonMap } from "@shared/gameData/pokemon"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import { isNotNullish } from "@shared/utils"

export const baseStatTotal = (pokemon: Pokemon) => {
  return Object.values(pokemon.baseStats).reduce((total, stat) => {
    return total + stat
  }, 0)
}

export const maxNumberOfEvolutionStages = (pokemon: Pokemon): number => {
  if (isNotNullish(pokemon.evolutions) && pokemon.evolutions.length > 0) {
    return 1 + Math.max(...pokemon.evolutions.map((evolution) => {
      return maxNumberOfEvolutionStages(pokemonMap[evolution.pokemonId])
    }))
  } else {
    return 0
  }
}

export const hasPreEvolution = (pokemon: Pokemon) => {
  return Object.values(pokemonMap).flatMap((pokemon) => {
    return pokemon.evolutions?.map((evolution) => {
      return evolution.pokemonId
    }) ?? []
  }).includes(pokemon.id)
}