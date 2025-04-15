import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import { pokemonMap } from "@shared/gameData/pokemon"
import { baseStatTotal, hasPreEvolution, maxNumberOfEvolutionStages } from "@shared/gameData/pokemonHelpers"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import { trainerGroupsMap } from "@shared/gameData/trainerGroups"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import { holdableItemIds } from "@shared/types/gameDataIds/items"
import { starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import { isNotNullish, isNullish } from "@shared/utils"

export const updateStarters = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
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
      
      romInfo.gameData.starters[locationId] = random.element({
        array: choices,
        errorInfo: {
          elementName: "Pokémon",
          mainSettingName: "CHANGE_STARTERS",
          conflictingSettings: [
            "CHANGE_STARTERS.SETTINGS.METHOD.SETTINGS.RANDOM.UNIQUE",
            "CHANGE_STARTERS.SETTINGS.METHOD.SETTINGS.RANDOM.MATCH_TYPE",
            "CHANGE_STARTERS.SETTINGS.METHOD.SETTINGS.RANDOM.MATCH_STAGE",
            "CHANGE_STARTERS.SETTINGS.METHOD.SETTINGS.RANDOM.MATCH_EVOLUTIONS",
            "CHANGE_STARTERS.SETTINGS.METHOD.SETTINGS.RANDOM.MATCH_SIMILAR_BST",
            "CHANGE_STARTERS.SETTINGS.METHOD.SETTINGS.RANDOM.BAN",
            "BANNED_POKEMON",
          ],
        },
        remove: randomStartersSettings.UNIQUE,
      }).id
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

export const updateStarterItems = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (settings.CHANGE_STARTER_HELD_ITEMS.VALUE) {
    const starterHeldItemsMethod = settings.CHANGE_STARTER_HELD_ITEMS.SETTINGS.METHOD
    if (starterHeldItemsMethod.VALUE === "CUSTOM") {
      starterLocationIds.forEach((locationId) => {
        romInfo.gameData.starterItems[locationId] = starterHeldItemsMethod.SETTINGS.CUSTOM[locationId]
      })
    } else {
      const availableItemIds = holdableItemIds.filter((itemId) => {
        return !settings.BANNED_ITEMS.includes(itemId) && !starterHeldItemsMethod.SETTINGS.RANDOM.BAN.includes(itemId)
      })
      
      starterLocationIds.forEach((locationId) => {
        romInfo.gameData.starterItems[locationId] = random.element({
          array: availableItemIds,
          errorInfo: {
            elementName: "item",
            mainSettingName: "CHANGE_STARTER_HELD_ITEMS",
            conflictingSettings: [
              "CHANGE_STARTER_HELD_ITEMS.SETTINGS.METHOD.SETTINGS.RANDOM.BAN",
              "BANNED_ITEMS",
            ],
          },
        })
      })
    }
  }
}