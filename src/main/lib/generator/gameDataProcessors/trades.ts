import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import { pokemonMap } from "@shared/gameData/pokemon"
import { tradeGenderIds } from "@shared/types/gameData/trade"
import { holdableItemIds } from "@shared/types/gameDataIds/items"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"

export const updateTrades = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (!settings.RANDOMIZE_TRADES.VALUE) { return }
  
  const tradesSettings = settings.RANDOMIZE_TRADES.SETTINGS
    
  const availableTradePokemonIds = pokemonIds.filter((pokemonId) => {
    return !settings.BANNED_POKEMON.includes(pokemonId) && !tradesSettings.BAN.includes(pokemonId)
  })
      
  const getRandomTradePokemonId = () => {
    return random.element({
      array: availableTradePokemonIds,
      errorInfo: {
        elementName: "Pokémon",
        mainSettingName: "RANDOMIZE_TRADES",
        conflictingSettings: [
          "RANDOMIZE_TRADES.SETTINGS.UNIQUE",
          "RANDOMIZE_TRADES.SETTINGS.BAN",
          "BANNED_POKEMON",
        ],
      },
      remove: tradesSettings.UNIQUE,
    })
  }
  
  Object.values(romInfo.gameData.trades).forEach((trade) => {
    if (tradesSettings.METHOD === "REQUEST_ONLY" || tradesSettings.METHOD === "BOTH") {
      trade.requestedPokémonId = getRandomTradePokemonId()
    }
    
    if (tradesSettings.METHOD === "OFFER_ONLY" || tradesSettings.METHOD === "BOTH") {
      trade.offeredPokemonId = getRandomTradePokemonId()
    }
    
    if (tradesSettings.CHANGE_REQUESTED_GENDERS.VALUE) {
      switch (pokemonMap[trade.requestedPokémonId].genderRatio) {
      case 0:
      case 255:
      case 254: {
        trade.genderId === "ANY"
        break
      }
      default: {
        switch (tradesSettings.CHANGE_REQUESTED_GENDERS.SETTINGS.METHOD) {
        case "NONE": {
          trade.genderId = "ANY"
          break
        }
        case "MALE": {
          trade.genderId = "MALE"
          break
        }
        case "FEMALE": {
          trade.genderId = "FEMALE"
          break
        }
        case "RANDOM": {
          trade.genderId = random.element({ array: tradeGenderIds })
          break
        }
        }
      }
      }
    }
    
    if (settings.RANDOMIZE_TRADE_HELD_ITEMS.VALUE) {
      const availableItemIds = holdableItemIds.filter((itemId) => {
        return !settings.BANNED_ITEMS.includes(itemId) && !settings.RANDOMIZE_TRADE_HELD_ITEMS.SETTINGS.BAN.includes(itemId)
      })
      
      trade.heldItemId = random.element({
        array: availableItemIds,
        errorInfo: {
          elementName: "item",
          mainSettingName: "RANDOMIZE_TRADE_HELD_ITEMS",
          conflictingSettings: [
            "RANDOMIZE_TRADE_HELD_ITEMS.SETTINGS.BAN",
            "BANNED_ITEMS",
          ],
        },
      })
    }
  })
}