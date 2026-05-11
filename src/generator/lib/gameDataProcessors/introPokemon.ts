import type { Random } from "@mainShared/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import type { ROMInfo } from "@shared/romUtils/romInfo"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"

export const updateIntroPokemon = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (!settings.RANDOMIZE_INTRO_POKEMON) { return }
  
  const availablePokemonIds = pokemonIds.filter((pokemonId) => {
    return !settings.BANNED_POKEMON.includes(pokemonId)
  })
  
  const pokemonId = random.element({
    array: availablePokemonIds,
    errorInfo: {
      elementName: "Pokémon",
      mainSettingName: "RANDOMIZE_INTRO_POKEMON",
      conflictingSettings: [
        "BANNED_POKEMON",
      ],
    },
  })
  
  if (pokemonId === "UNOWN") {
    romInfo.gameData.introPokemonInfo = {
      pokemonId: "UNOWN",
      unownId: random.int(1, 26),
    }
  } else {
    romInfo.gameData.introPokemonInfo = {
      pokemonId: pokemonId,
    }
  }
}