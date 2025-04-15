import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import { teachableMovesMap } from "@shared/gameData/teachableMoves"
import { type HMItemId, hmItemIds, holdableItemIds, type TMItemId, tmItemIds } from "@shared/types/gameDataIds/items"
import { type MoveTutorId, moveTutorIds } from "@shared/types/gameDataIds/teachableMoves"
import { isNotNullish } from "@shared/utils"

export const updatePokemonInfo = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (settings.INCREASE_POKEMON_CATCH_RATES.VALUE) {
    const percentage = settings.INCREASE_POKEMON_CATCH_RATES.SETTINGS.PERCENTAGE
    
    Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
      pokemon.catchRate = (255 - pokemon.catchRate) * percentage / 100 + pokemon.catchRate
    })
  }
  
  if (settings.STANDARDIZE_POKEMON_GROWTH_RATES.VALUE) {
    const growthRatesSettings = settings.STANDARDIZE_POKEMON_GROWTH_RATES.SETTINGS
    
    Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
      if (!growthRatesSettings.EXCLUDE.includes(pokemon.id)) {
        pokemon.growthRate = growthRatesSettings.GROWTH_RATE
      }
    })
  }
  
  if (settings.RANDOMIZE_TM_COMPATIBILITY.VALUE) {
    Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
      const availableTMS = Object.values(teachableMovesMap).filter((move) => {
        return move.type === "TM"
      })
        
      pokemon.tmMoves = Array(Math.round(tmItemIds.length * (settings.RANDOMIZE_TM_COMPATIBILITY.SETTINGS.PERCENTAGE ?? random.int(0, 100)) / 100)).fill(undefined).map(() => {
        return random.element({ array: availableTMS, remove: true }).id as TMItemId
      }).toSorted()
    })
  }
    
  if (settings.RANDOMIZE_HM_COMPATIBILITY.VALUE) {
    Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
      const availableHMS = Object.values(teachableMovesMap).filter((move) => {
        return move.type === "HM"
      })
        
      pokemon.hmMoves = Array(Math.round(hmItemIds.length * (settings.RANDOMIZE_HM_COMPATIBILITY.SETTINGS.PERCENTAGE ?? random.int(0, 100)) / 100)).fill(undefined).map(() => {
        return random.element({ array: availableHMS, remove: true }).id as HMItemId
      }).toSorted()
    })
  }
    
  if (settings.RANDOMIZE_MOVE_TUTOR_COMPATIBILITY.VALUE) {
    Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
      const availableMoveTutorMoves = Object.values(teachableMovesMap).filter((move) => {
        return move.type === "MOVE_TUTOR"
      })
        
      pokemon.moveTutorMoves = Array(Math.round(moveTutorIds.length * (settings.RANDOMIZE_TM_COMPATIBILITY.SETTINGS.PERCENTAGE ?? random.int(0, 100)) / 100)).fill(undefined).map(() => {
        return random.element({ array: availableMoveTutorMoves, remove: true }).id as MoveTutorId
      }).toSorted()
    })
  }
  
  if (settings.RANDOMIZE_WILD_HELD_ITEMS.VALUE) {
    const availableItemIds = holdableItemIds.filter((itemId) => {
      return !settings.BANNED_ITEMS.includes(itemId) && !settings.RANDOMIZE_WILD_HELD_ITEMS.SETTINGS.BAN.includes(itemId)
    })
    
    const randomItemId = () => {
      return random.element({
        array: availableItemIds,
        errorInfo: {
          elementName: "item",
          mainSettingName: "RANDOMIZE_WILD_HELD_ITEMS",
          conflictingSettings: [
            "RANDOMIZE_WILD_HELD_ITEMS.SETTINGS.BAN",
            "BANNED_ITEMS",
          ],
        },
      })
    }
    
    const wildHeldItemsSettings = settings.RANDOMIZE_WILD_HELD_ITEMS.SETTINGS
    if (wildHeldItemsSettings.CHANGE_DISTRIBUTION.VALUE) {
      const itemsPerPokemonSettings = wildHeldItemsSettings.CHANGE_DISTRIBUTION.SETTINGS
      switch (itemsPerPokemonSettings.DISTRIBUTION) {
      case "RANDOM": {
        Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
          pokemon.items = [
            random.boolean() ? randomItemId() : undefined,
            random.boolean() ? randomItemId() : undefined,
          ]
        })
        break
      }
      case "SHUFFLED": {
        const itemGroups = Object.values(romInfo.gameData.pokemon).map((pokemon) => {
          for (let i = 0; i < pokemon.items.length; i++) {
            if (isNotNullish(pokemon.items[i])) {
              pokemon.items[i] = randomItemId()
            }
          }
          
          return pokemon.items
        })
        
        Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
          pokemon.items = random.element({ array: itemGroups, remove: true })
        })
        break
      }
      case "NONE": {
        Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
          pokemon.items = [undefined, undefined]
        })
        break
      }
      case "COMMON_ONLY": {
        Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
          pokemon.items = [randomItemId(), undefined]
        })
        break
      }
      case "RARE_ONLY": {
        Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
          pokemon.items = [undefined, randomItemId()]
        })
        break
      }
      case "FULL": {
        Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
          pokemon.items = [randomItemId(), randomItemId()]
        })
        break
      }
      }
    }
  }
}