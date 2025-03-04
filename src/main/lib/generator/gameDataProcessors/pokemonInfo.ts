import type { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { teachableMovesMap } from "@shared/gameData/teachableMoves"
import { type HMItemId, hmItemIds, type TMItemId, tmItemIds } from "@shared/types/gameDataIds/items"
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
}