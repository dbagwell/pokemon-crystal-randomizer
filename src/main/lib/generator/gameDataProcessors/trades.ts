import type { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"

export const updateTrades = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number,
) => {
  if (!settings.RANDOMIZE_TRADES.VALUE) { return }
  
  const tradesSettings = settings.RANDOMIZE_TRADES.SETTINGS
    
  const availableTradePokemonIds = pokemonIds.filter((pokemonId) => {
    return !settings.BANNED_POKEMON.includes(pokemonId) && !tradesSettings.BAN.includes(pokemonId)
  })
      
  const getRandomTradePokemonId = () => {
    const index = randomInt(0, availableTradePokemonIds.length - 1)
    const pokemonId = availableTradePokemonIds[index]
      
    if (tradesSettings.UNIQUE) {
      availableTradePokemonIds.splice(index, 1)
    }
      
    return pokemonId
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