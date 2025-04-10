import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import { hasPreEvolution } from "@shared/gameData/pokemonHelpers"

export const updateEvolutionMethods = (
  settings: Settings,
  romInfo: ROMInfo,
) => {
  Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
    pokemon.evolutions?.forEach((evolution) => {
      if (settings.CHANGE_TRADE_EVOLUTION_METHODS.VALUE && evolution.method.typeId === "TRADE") {
        if (pokemon.id === "SLOWPOKE") {
          evolution.method = {
            typeId: "ITEM",
            item: "WATER_STONE",
          }
        } else if (!hasPreEvolution(pokemon)) {
          evolution.method = {
            typeId: "LEVEL",
            level: settings.CHANGE_TRADE_EVOLUTION_METHODS.SETTINGS.FIRST_EVOLUTION_LEVEL,
          }
        } else {
          evolution.method = {
            typeId: "LEVEL",
            level: settings.CHANGE_TRADE_EVOLUTION_METHODS.SETTINGS.SECOND_EVOLUTION_LEVEL,
          }
        }
      }
      
      if (settings.CHANGE_TIME_BASED_EVOLUTION_METHODS && evolution.method.typeId === "HAPPINESS") {
        if (evolution.method.conditionId === "DAY") {
          evolution.method = {
            typeId: "ITEM",
            item: "SUN_STONE",
          }
        } else if (evolution.method.conditionId === "NIGHT") {
          evolution.method = {
            typeId: "ITEM",
            item: "MOON_STONE",
          }
        }
      }
      
      if (settings.DECREASE_HIGH_EVOLUTION_LEVELS.VALUE && evolution.method.typeId === "LEVEL") {
        if (evolution.method.level > settings.DECREASE_HIGH_EVOLUTION_LEVELS.SETTINGS.FIRST_EVOLUTION_THRESHOLD && !hasPreEvolution(pokemon)) {
          evolution.method.level = settings.DECREASE_HIGH_EVOLUTION_LEVELS.SETTINGS.FIRST_EVOLUTION_THRESHOLD
        } else if (evolution.method.level > settings.DECREASE_HIGH_EVOLUTION_LEVELS.SETTINGS.SECOND_EVOLUTION_THRESHOLD && hasPreEvolution(pokemon)) {
          evolution.method.level = settings.DECREASE_HIGH_EVOLUTION_LEVELS.SETTINGS.SECOND_EVOLUTION_THRESHOLD
        }
      }
    })
  })
}