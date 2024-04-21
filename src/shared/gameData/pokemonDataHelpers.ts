import { allPokemon } from "@shared/gameData/pokemonData"
import type { Pokemon } from "@shared/types/gameData"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import { isNotNullish } from "@shared/utils"

export const pokemonMap = allPokemon.reduce((map: Partial<Record<PokemonId, Pokemon>>, pokemon) => {
  map[pokemon.id] = pokemon
  return map
}, {}) as Record<PokemonId, Pokemon>

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