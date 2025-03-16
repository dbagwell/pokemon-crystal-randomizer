import type { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { teachableMovesMap } from "@shared/gameData/teachableMoves"
import { type HMItemId, hmItemIds, holdableItemIds, type TMItemId, tmItemIds } from "@shared/types/gameDataIds/items"
import { type MoveTutorId, moveTutorIds } from "@shared/types/gameDataIds/teachableMoves"

export const updatePokemonInfo = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number,
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
        
      pokemon.tmMoves = Array(randomInt(tmItemIds.length * (settings.RANDOMIZE_TM_COMPATIBILITY.SETTINGS.PERCENTAGE ?? randomInt(0, 100)) / 100, tmItemIds.length)).fill(undefined).map(() => {
        return availableTMS.splice(randomInt(0, availableTMS.length - 1), 1)[0].id as TMItemId
      })
    })
  }
    
  if (settings.RANDOMIZE_HM_COMPATIBILITY.VALUE) {
    Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
      const availableHMS = Object.values(teachableMovesMap).filter((move) => {
        return move.type === "HM"
      })
        
      pokemon.hmMoves = Array(randomInt(hmItemIds.length * (settings.RANDOMIZE_HM_COMPATIBILITY.SETTINGS.PERCENTAGE ?? randomInt(0, 100)) / 100, hmItemIds.length)).fill(undefined).map(() => {
        return availableHMS.splice(randomInt(0, availableHMS.length - 1), 1)[0].id as HMItemId
      })
    })
  }
    
  if (settings.RANDOMIZE_MOVE_TUTOR_COMPATIBILITY.VALUE) {
    Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
      const availableMoveTutorMoves = Object.values(teachableMovesMap).filter((move) => {
        return move.type === "MOVE_TUTOR"
      })
        
      pokemon.moveTutorMoves = Array(randomInt(moveTutorIds.length * (settings.RANDOMIZE_TM_COMPATIBILITY.SETTINGS.PERCENTAGE ?? randomInt(0, 100)) / 100, moveTutorIds.length)).fill(undefined).map(() => {
        return availableMoveTutorMoves.splice(randomInt(0, availableMoveTutorMoves.length - 1), 1)[0].id as MoveTutorId
      })
    })
  }
  
  if (settings.RANDOMIZE_WILD_HELD_ITEMS.VALUE) {
    const randomItemId = () => {
      return holdableItemIds[randomInt(0, holdableItemIds.length - 1)]
    }
    
    const wildHeldItemsSettings = settings.RANDOMIZE_WILD_HELD_ITEMS.SETTINGS
    if (wildHeldItemsSettings.CHANGE_NUMBER_OF_ITEMS_PER_POKEMON.VALUE) {
      const itemsPerPokemonSettings = wildHeldItemsSettings.CHANGE_NUMBER_OF_ITEMS_PER_POKEMON.SETTINGS
      switch (itemsPerPokemonSettings.NUMBER.VALUE) {
      case "RANDOM": {
        Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
          pokemon.items = []
          for (let i = 0; i < randomInt(0, 2); i++) {
            pokemon.items[i] = randomItemId()
          }
        })
        break
      }
      case "SHUFFLED": {
        if (itemsPerPokemonSettings.NUMBER.SETTINGS.SHUFFLED.KEEP_RATIOS) {
          const itemGroups = Object.values(romInfo.gameData.pokemon).map((pokemon) => {
            for (let i = 0; i < pokemon.items.length; i++) {
              pokemon.items[i] = randomItemId()
            }
            
            return pokemon.items
          })
          
          const pokemonArray = Object.values(romInfo.gameData.pokemon).map((pokemon) => {
            pokemon.items = []
            return pokemon
          })
          
          itemGroups.forEach((group) => {
            const index = randomInt(0, pokemonArray.length - 1)
            pokemonArray[index].items = group
            pokemonArray.splice(index, 1)
          })
        } else {
          const itemIds = Object.values(romInfo.gameData.pokemon).flatMap((pokemon) => {
            return pokemon.items.map((_) => {
              return randomItemId()
            })
          })
          
          const pokemonArray = Object.values(romInfo.gameData.pokemon).flatMap((pokemon) => {
            pokemon.items = []
            return [pokemon, pokemon]
          })
          
          itemIds.forEach((itemId) => {
            const index = randomInt(0, pokemonArray.length - 1)
            pokemonArray[index].items.push(itemId)
            pokemonArray.splice(index, 1)
          })
        }
        break
      }
      case "NONE": {
        Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
          pokemon.items = []
        })
        break
      }
      case "ONE": {
        Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
          pokemon.items = [randomItemId()]
        })
        break
      }
      case "TWO": {
        Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
          pokemon.items = [randomItemId(), randomItemId()]
        })
        break
      }
      }
    }
  }
}