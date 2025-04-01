import { eggGroupsMap } from "@shared/gameData/eggGroups"
import { evolutionTypesMap } from "@shared/gameData/evolutionTypes"
import { gen5BaseExpMap } from "@shared/gameData/gen5BaseExp"
import { growthRatesMap } from "@shared/gameData/growthRates"
import { itemsMap } from "@shared/gameData/items"
import { movesMap } from "@shared/gameData/moves"
import { pokemonMap } from "@shared/gameData/pokemon"
import { pokemonTypesMap } from "@shared/gameData/pokemonTypes"
import { teachableMovesMap } from "@shared/gameData/teachableMoves"
import { type EvolutionMethod, happinessEvolutionConidtionsMap, statEvolutionConidtionsMap } from "@shared/types/gameData/evolutionMethod"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import { bytesFrom, compact, isNotNullish } from "@shared/utils"

export const bytesForEvolutionsAndLevelUpMovesFromPokemon = (pokemon: Pokemon) => {
  return [
    ...pokemon.evolutions?.flatMap((evolution) => {
      return bytesFromEvolution(evolution)
    }) ?? [],
    0,
    ...pokemon.levelUpMoves.flatMap(({ level, moveId }) => {
      return [
        level,
        movesMap[moveId].numericId,
      ]
    }),
    0,
  ]
}

const bytesFromEvolution = (evolution: {
  pokemonId: PokemonId
  method: EvolutionMethod
}) => {
  const levelOrItemIdOrHappinessCondition = () => {
    switch (evolution.method.typeId) {
    case "LEVEL":
    case "STAT": {
      return evolution.method.level
    }
    case "ITEM":
    case "TRADE": {
      if (isNotNullish(evolution.method.item)) {
        return itemsMap[evolution.method.item].numericId
      } else {
        return 0xFF
      }
    }
    case "HAPPINESS": {
      return happinessEvolutionConidtionsMap[evolution.method.conditionId].numericId
    }
    }
  }

  const statConditionOrSpecies = () => {
    if (evolution.method.typeId === "STAT") {
      return statEvolutionConidtionsMap[evolution.method.conditionId].numericId
    } else {
      return pokemonMap[evolution.pokemonId].numericId
    }
  }

  const statSpecies = () => {
    if (evolution.method.typeId === "STAT") {
      return pokemonMap[evolution.pokemonId].numericId
    } else {
      return undefined
    }
  }

  return compact([
    evolutionTypesMap[evolution.method.typeId].numericId,
    levelOrItemIdOrHappinessCondition(),
    statConditionOrSpecies(),
    statSpecies(),
  ])
}

export const bytesForInfoFromPokemon = (pokemon: Pokemon, addGen5BaseExp: boolean) => {
  const teachableMovesBytes: number[] = Array(8).fill(0)
          
  const pokemonTeachableMoveIds = [
    ...pokemon.tmMoves,
    ...pokemon.hmMoves,
    ...pokemon.moveTutorMoves,
  ]
    
  pokemonTeachableMoveIds.forEach((id) => {
    const move = teachableMovesMap[id]
    teachableMovesBytes[move.byteIndex] += 1 << move.bitIndex
  })
  
  return [
    pokemon.numericId,
    pokemon.baseStats.hp,
    pokemon.baseStats.attack,
    pokemon.baseStats.defence,
    pokemon.baseStats.speed,
    pokemon.baseStats.specialAttack,
    pokemon.baseStats.specialDefence,
    pokemonTypesMap[pokemon.types[0]].numericId,
    pokemonTypesMap[pokemon.types[1] ?? pokemon.types[0]].numericId,
    pokemon.catchRate,
    pokemon.baseExperience,
    isNotNullish(pokemon.items[0]) ? itemsMap[pokemon.items[0]].numericId : 0,
    isNotNullish(pokemon.items[1]) ? itemsMap[pokemon.items[1]].numericId : 0,
    pokemon.genderRatio,
    100,
    pokemon.eggCycles,
    5,
    pokemon.spriteDimensions,
    ...addGen5BaseExp ? bytesFrom(gen5BaseExpMap[pokemon.id], 2) : [0, 0],
    0,
    0,
    growthRatesMap[pokemon.growthRate].numericId,
    (eggGroupsMap[pokemon.eggGroups[0]].numericId << 4) + eggGroupsMap[pokemon.eggGroups[1] ?? pokemon.eggGroups[0]].numericId,
    ...teachableMovesBytes,
  ]
}