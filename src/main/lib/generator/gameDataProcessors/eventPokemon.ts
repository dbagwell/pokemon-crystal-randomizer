import { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"

export const updateEventPokemon = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number,
) => {
  if (!settings.RANDOMIZE_EVENT_POKEMON.VALUE) { return }
  
  const eventPokemonSettings = settings.RANDOMIZE_EVENT_POKEMON.SETTINGS
    
  const availablePokemonIds = pokemonIds.filter((pokemonId) => {
    return !eventPokemonSettings.BAN.includes(pokemonId)
  })
    
  const getRandomPokemonId = () => {
    const index = randomInt(0, availablePokemonIds.length - 1)
    const pokemonId = availablePokemonIds[index]
      
    if (eventPokemonSettings.UNIQUE) {
      availablePokemonIds.splice(index, 1)
    }
      
    return pokemonId
  }
    
  const randomizedOddEggIds = [getRandomPokemonId()]
    
  for (let index = 1; index < 14; index++) {
    if (eventPokemonSettings.ODD_EGG === "RANDOM" || index % 2 === 0 && eventPokemonSettings.ODD_EGG === "SHINY_MATCH") {
      randomizedOddEggIds.push(getRandomPokemonId())
    } else {
      randomizedOddEggIds.push(randomizedOddEggIds[index - 1])
    }
  }
    
  romInfo.gameData.oddEggs.forEach((oddEgg, index) => {
    oddEgg.pokemonId = randomizedOddEggIds[index]
  })
    
  if (settings.FAST_HATCHING) {
    romInfo.gameData.oddEggs.forEach((oddEgg) => {
      oddEgg.hatchCyclesRemaining = 1
    })
  }
  
  romInfo.gameData.eventPokemon.RATTATA = getRandomPokemonId()
  romInfo.gameData.eventPokemon.SUDOWOODO = getRandomPokemonId()
  romInfo.gameData.eventPokemon.RAIKOU = getRandomPokemonId()
  romInfo.gameData.eventPokemon.ENTEI = getRandomPokemonId()
  romInfo.gameData.eventPokemon.SUICUNE = getRandomPokemonId()
  romInfo.gameData.eventPokemon.GYARADOS = getRandomPokemonId()
  romInfo.gameData.eventPokemon.VOLTORB = getRandomPokemonId()
  romInfo.gameData.eventPokemon.GEODUDE = getRandomPokemonId()
  romInfo.gameData.eventPokemon.KOFFING = getRandomPokemonId()
  romInfo.gameData.eventPokemon.ELECTRODE1 = getRandomPokemonId()
  romInfo.gameData.eventPokemon.ELECTRODE2 = getRandomPokemonId()
  romInfo.gameData.eventPokemon.ELECTRODE3 = getRandomPokemonId()
  romInfo.gameData.eventPokemon.LAPRAS = getRandomPokemonId()
  romInfo.gameData.eventPokemon.SNORLAX = getRandomPokemonId()
  romInfo.gameData.eventPokemon.HO_OH = getRandomPokemonId()
  romInfo.gameData.eventPokemon.LUGIA = getRandomPokemonId()
  romInfo.gameData.eventPokemon.CELEBI = getRandomPokemonId()
  romInfo.gameData.eventPokemon.TOGEPI = getRandomPokemonId()
  romInfo.gameData.eventPokemon.SPEAROW = getRandomPokemonId()
  romInfo.gameData.eventPokemon.SHUCKLE = getRandomPokemonId()
  romInfo.gameData.eventPokemon.EEVEE = getRandomPokemonId()
  romInfo.gameData.eventPokemon.DRATINI = getRandomPokemonId()
  romInfo.gameData.eventPokemon.TYROGUE = getRandomPokemonId()
  romInfo.gameData.eventPokemon.ABRA = getRandomPokemonId()
  romInfo.gameData.eventPokemon.CUBONE = getRandomPokemonId()
  romInfo.gameData.eventPokemon.WOBBUFFET = getRandomPokemonId()
  romInfo.gameData.eventPokemon.PIKACHU = getRandomPokemonId()
  romInfo.gameData.eventPokemon.PORYGON = getRandomPokemonId()
  romInfo.gameData.eventPokemon.LARVITAR = getRandomPokemonId()
}