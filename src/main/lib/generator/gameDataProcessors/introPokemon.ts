import type { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"

export const updateIntroPokemon = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number,
) => {
  if (!settings.RANDOMIZE_INTRO_POKEMON) { return }
  
  const availablePokemonIds = pokemonIds.filter((pokemonId) => {
    return !settings.BANNED_POKEMON.includes(pokemonId)
  })
  
  romInfo.gameData.introPokemonId = availablePokemonIds[randomInt(0, availablePokemonIds.length - 1)]
}