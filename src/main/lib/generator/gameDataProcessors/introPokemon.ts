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
  
  const pokemonId = availablePokemonIds[randomInt(0, availablePokemonIds.length - 1)]
  
  if (pokemonId === "UNOWN") {
    romInfo.gameData.introPokemonInfo = {
      pokemonId: "UNOWN",
      unownId: randomInt(1, 26),
    }
  } else {
    romInfo.gameData.introPokemonInfo = {
      pokemonId: pokemonId,
    }
  }
}