import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"

export const updateTrades = (
  settings: SettingsFromAppViewModel,
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
    
  if (tradesSettings.METHOD === "ASK_ONLY" || tradesSettings.METHOD === "BOTH") {
    Object.values(romInfo.gameData.trades).forEach((trade) => {
      trade.askPokemonId = getRandomTradePokemonId()
    })
  }
    
  if (tradesSettings.METHOD === "OFFER_ONLY" || tradesSettings.METHOD === "BOTH") {
    Object.values(romInfo.gameData.trades).forEach((trade) => {
      trade.offerPokemonId = getRandomTradePokemonId()
    })
  }
}