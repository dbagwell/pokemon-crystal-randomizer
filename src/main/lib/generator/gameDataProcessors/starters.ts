import type { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { pokemonMap } from "@shared/gameData/pokemon"
import { baseStatTotal, hasPreEvolution, maxNumberOfEvolutionStages } from "@shared/gameData/pokemonHelpers"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import { trainerGroupsMap } from "@shared/gameData/trainerGroups"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import { starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import { isNotNullish, isNullish } from "@shared/utils"

export const updateStarters = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number,
) => {
  if (!settings.CHANGE_STARTERS.VALUE) { return }
  
  const startersSettings = settings.CHANGE_STARTERS.SETTINGS
  
  if (startersSettings.METHOD.VALUE === "CUSTOM") {
    const customStartersSettings = startersSettings.METHOD.SETTINGS.CUSTOM
  
    starterLocationIds.forEach((locationId) => {
      romInfo.gameData.starters[locationId] = customStartersSettings[locationId]
    })
  } else if (startersSettings.METHOD.VALUE === "RANDOM") {
    const randomStartersSettings = startersSettings.METHOD.SETTINGS.RANDOM
    const isBanned = (pokemon: Pokemon) => {
      return settings.BANNED_POKEMON.includes(pokemon.id) || randomStartersSettings.BAN.includes(pokemon.id)
    }
    
    const isAssigned = (pokemon: Pokemon) => {
      return isNotNullish(Object.values(romInfo.gameData.starters).find((assignedStarterId) => {
        return assignedStarterId === pokemon.id
      }))
    }
    
    starterLocationIds.forEach((locationId) => {
      if (isNotNullish(romInfo.gameData.starters[locationId])) {
        return
      }
      
      const vanillaStarter = pokemonMap[starterLocationsMap[locationId].pokemonId]
      
      const matchesType = (pokemon: Pokemon) => {
        return pokemon.types.includes(vanillaStarter.types[0]) // Vanilla starters only have 1 type each
      }
      
      const matchesEvoltions = (pokemon: Pokemon) => {
        return maxNumberOfEvolutionStages(pokemon) === maxNumberOfEvolutionStages(vanillaStarter)
      }
      
      const baseStatDifference = (pokemon: Pokemon) => {
        return Math.abs(baseStatTotal(pokemon) - baseStatTotal(vanillaStarter))
      }
      
      const choices = Object.values(pokemonMap).filter((pokemon) => {
        return !isBanned(pokemon)
          && (!randomStartersSettings.UNIQUE || !isAssigned(pokemon))
          && (!randomStartersSettings.MATCH_TYPE || matchesType(pokemon))
          && (!randomStartersSettings.MATCH_STAGE || !hasPreEvolution(pokemon))
          && (!randomStartersSettings.MATCH_EVOLUTIONS || matchesEvoltions(pokemon))
          && (!randomStartersSettings.MATCH_SIMILAR_BST.VALUE || baseStatDifference(pokemon) <= randomStartersSettings.MATCH_SIMILAR_BST.SETTINGS.THRESHOLD)
      })
      
      if (choices.length < 1) {
        throw new Error("Unable to satisfy settings for randomized starter Pokémon. Possible reasons: BST threshold too small or too many banned Pokémon. You could try again with a different seed, but different settings might be required.")
      }
      
      const index = randomInt(0, choices.length - 1)
      romInfo.gameData.starters[locationId] = choices[index].id
    })
  }
  
  if (startersSettings.CHANGE_RIVALS_STARTER) {
    Object.entries(romInfo.gameData.starters).forEach(([locationId, newPokemonId]) => {
      if (isNullish(newPokemonId)) {
        return
      }
      
      let newPokemon = pokemonMap[newPokemonId]
      
      const rivalPokemon = romInfo.gameData.trainers.filter((trainer) => {
        return trainerGroupsMap[trainer.groupId].classId === "RIVAL"
      }).flatMap((trainer) => {
        return trainer.pokemon
      })
      
      // Update the Rival's initial starters
      
      rivalPokemon.filter((pokemon) => {
        return locationId === "LEFT" && pokemon.id === "CYNDAQUIL"
          || locationId === "MIDDLE" && pokemon.id === "TOTODILE"
          || locationId === "RIGHT" && pokemon.id === "CHIKORITA"
      }).forEach((pokemon) => {
        pokemon.id = newPokemon.id
      })
      
      // Update the Rival's second stage starters
      
      const evolutionId = newPokemon.evolutions?.[0]?.pokemonId
      
      // Only evolve the pokemon at this stage if it can evolve further
      if (isNotNullish(evolutionId) && isNotNullish(pokemonMap[evolutionId].evolutions)) {
        newPokemon = pokemonMap[evolutionId]
      }
      
      rivalPokemon.filter((pokemon) => {
        return locationId === "LEFT" && pokemon.id === "QUILAVA"
          || locationId === "MIDDLE" && pokemon.id === "CROCONAW"
          || locationId === "RIGHT" && pokemon.id === "BAYLEEF"
      }).forEach((pokemon) => {
        pokemon.id = newPokemon.id
        
        if (pokemon.moves.length > 0) {
          const startIndex = newPokemon.levelUpMoves.findIndex((move) => {
            return move.level >= pokemon.level
          })
          
          pokemon.moves = newPokemon.levelUpMoves.slice(startIndex, 4).map((move) => {
            return move.moveId
          })
        }
      })
      
      // Update the Rival's third stage starters
      
      newPokemon = pokemonMap[newPokemon.evolutions?.[0]?.pokemonId ?? newPokemon.id]
      
      rivalPokemon.filter((pokemon) => {
        return locationId === "LEFT" && pokemon.id === "TYPHLOSION"
          || locationId === "MIDDLE" && pokemon.id === "FERALIGATR"
          || locationId === "RIGHT" && pokemon.id === "MEGANIUM"
      }).forEach((pokemon) => {
        pokemon.id = newPokemon.id
        
        if (pokemon.moves.length > 0) {
          const startIndex = newPokemon.levelUpMoves.findIndex((move) => {
            return move.level >= pokemon.level
          })
          
          pokemon.moves = newPokemon.levelUpMoves.slice(startIndex, 4).map((move) => {
            return move.moveId
          })
        }
      })
    })
  }
}