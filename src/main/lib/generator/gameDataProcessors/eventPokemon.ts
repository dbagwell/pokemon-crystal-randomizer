import { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import { movesMap } from "@shared/gameData/moves"
import { type PokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"

export const updateEventPokemon = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (!settings.RANDOMIZE_EVENT_POKEMON.VALUE) { return }
  
  const eventPokemonSettings = settings.RANDOMIZE_EVENT_POKEMON.SETTINGS
    
  const availablePokemonIds = pokemonIds.filter((pokemonId) => {
    return !settings.BANNED_POKEMON.includes(pokemonId) && !eventPokemonSettings.BAN.includes(pokemonId)
  })
    
  const getRandomPokemonId = () => {
    return random.element({
      array: availablePokemonIds,
      errorInfo: {
        elementName: "Pokémon",
        mainSettingName: "RANDOMIZE_EVENT_POKEMON",
        conflictingSettings: [
          "RANDOMIZE_EVENT_POKEMON.SETTINGS.UNIQUE",
          "RANDOMIZE_EVENT_POKEMON.SETTINGS.BAN",
          "BANNED_POKEMON",
        ],
      },
      remove: eventPokemonSettings.UNIQUE,
    })
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

export const updateEventPokemonMoves = (
  settings: Settings,
  romInfo: ROMInfo,
) => {
  if (settings.RANDOMIZE_EVENT_POKEMON.VALUE || settings.RANDOMIZE_LEVEL_UP_MOVES.VALUE) {
    const getEligibleMoves = (pokemonId: PokemonId, level: number) => {
      const allLevelUpMoves = romInfo.gameData.pokemon[pokemonId].levelUpMoves
      const indexOfLastMove = allLevelUpMoves.map((move) => {
        return move.level
      }).lastIndexOf(level)
      
      return allLevelUpMoves.slice(indexOfLastMove < 3 ? 0 : indexOfLastMove - 3, indexOfLastMove + 1).map((move) => {
        return move.moveId
      })
    }
    
    romInfo.gameData.oddEggs.forEach((egg) => {
      const eligibleMoves = getEligibleMoves(egg.pokemonId, egg.level)
      
      if (!settings.BANNED_MOVES.includes("DIZZY_PUNCH")) {
        eligibleMoves.push("DIZZY_PUNCH")
      }
      
      egg.moves = eligibleMoves.slice(-4).map((moveId) => {
        return {
          id: moveId,
          pp: movesMap[moveId].pp,
        }
      })
    })
    
    const eligibleDratiniMoves = getEligibleMoves(romInfo.gameData.eventPokemon.DRATINI, 15)
    romInfo.gameData.dratiniMoves.regular = eligibleDratiniMoves.slice(-4)
    
    if (!settings.BANNED_MOVES.includes("EXTREMESPEED")) {
      eligibleDratiniMoves.push("EXTREMESPEED")
      if (eligibleDratiniMoves.length > 4) {
        eligibleDratiniMoves.splice(-4, 1)
      }
    }
    
    romInfo.gameData.dratiniMoves.special = eligibleDratiniMoves.slice(-4)
  }
}