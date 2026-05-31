import type { Settings } from "@shared/appData/settingsFromViewModel"
import { type ROMInfo } from "@shared/romUtils/romInfo"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"
import type { Random } from "@worker/random"

export const updateShowAndTellPokemon = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (settings.RANDOMIZE_EVENT_POKEMON.VALUE) {
    if (settings.RANDOMIZE_EVENT_POKEMON.SETTINGS.MYSTERY_EGG_RESEARCH_REQUEST === "MATCH_EGG") {
      romInfo.gameData.showAndTellPokemon.TOGEPI = romInfo.gameData.eventPokemon.TOGEPI
    } else if (settings.RANDOMIZE_EVENT_POKEMON.SETTINGS.MYSTERY_EGG_RESEARCH_REQUEST === "RANDOM") {
      romInfo.gameData.showAndTellPokemon.TOGEPI = random.element({
        array: pokemonIds.filter((pokemonId) => {
          return !settings.BANNED_POKEMON.includes(pokemonId)
        }),
        errorInfo: {
          elementName: "Pokémon",
          mainSettingName: "RANDOMIZE_EVENT_POKEMON.MYSTERY_EGG_RESEARCH_REQUEST",
          conflictingSettings: [
            "BANNED_POKEMON",
          ],
        },
      })
    }
  }
  
  if (!settings.RANDOMIZE_SHOW_AND_TELL_POKEMON.VALUE) { return }
  
  const showAndTellSettings = settings.RANDOMIZE_SHOW_AND_TELL_POKEMON.SETTINGS
  
  const availablePokemonIds = pokemonIds.filter((pokemonId) => {
    return !settings.BANNED_POKEMON.includes(pokemonId) && !showAndTellSettings.BAN.includes(pokemonId)
  })
  
  const getRandomPokemonId = () => {
    return random.element({
      array: availablePokemonIds,
      errorInfo: {
        elementName: "Pokémon",
        mainSettingName: "RANDOMIZE_SHOW_AND_TELL_POKEMON",
        conflictingSettings: [
          "RANDOMIZE_SHOW_AND_TELL_POKEMON.SETTINGS.UNIQUE",
          "RANDOMIZE_SHOW_AND_TELL_POKEMON.SETTINGS.BAN",
          "BANNED_POKEMON",
        ],
      },
      remove: showAndTellSettings.UNIQUE,
    })
  }
  
  romInfo.gameData.showAndTellPokemon.MARILL = getRandomPokemonId()
  romInfo.gameData.showAndTellPokemon.PIKACHU = getRandomPokemonId()
  romInfo.gameData.showAndTellPokemon.CLEFAIRY = getRandomPokemonId()
  romInfo.gameData.showAndTellPokemon.MAGIKARP = getRandomPokemonId()
  romInfo.gameData.showAndTellPokemon.LICKITUNG = getRandomPokemonId()
  romInfo.gameData.showAndTellPokemon.ODDISH = getRandomPokemonId()
  romInfo.gameData.showAndTellPokemon.STARYU = getRandomPokemonId()
  romInfo.gameData.showAndTellPokemon.GROWLITHE = getRandomPokemonId()
  romInfo.gameData.showAndTellPokemon.PICHU = getRandomPokemonId()
}