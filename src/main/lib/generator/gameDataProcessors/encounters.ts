import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import { gameMapsMap } from "@shared/gameData/gameMaps"
import { pokemonMap } from "@shared/gameData/pokemon"
import type { Encounter } from "@shared/types/gameData/encounter"
import { type PokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { isNotNullish, isNullish } from "@shared/utils"

export const updateRandomEncounters = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (!settings.RANDOMIZE_RANDOM_ENCOUNTERS.VALUE) { return }
  
  const wildEcountersSettings = settings.RANDOMIZE_RANDOM_ENCOUNTERS.SETTINGS
    
  const nonBannedPokemonIds = pokemonIds.filter((pokemonId) => {
    return !settings.BANNED_POKEMON.includes(pokemonId) && !wildEcountersSettings.BAN.includes(pokemonId)
  })
    
  const nonBannedFullyEvolvedPokemonIds = nonBannedPokemonIds.filter((pokemonId) => {
    return isNullish(pokemonMap[pokemonId].evolutions) || pokemonMap[pokemonId].evolutions.length < 1
  })
    
  const nonBannedNotFullyEvolvedPokemonIds = nonBannedPokemonIds.filter((pokemonId) => {
    return isNotNullish(pokemonMap[pokemonId].evolutions) && pokemonMap[pokemonId].evolutions.length > 0
  })
    
  const shouldBeFullyEvolved = (encounter: Encounter): boolean => {
    return wildEcountersSettings.FORCE_FULLY_EVOLVED_BELOW_LEVEL.VALUE
        && (encounter.type !== "FISHING" || !encounter.isTimeGroup)
        && (
          encounter.type !== "CONTEST" && encounter.level < wildEcountersSettings.FORCE_FULLY_EVOLVED_BELOW_LEVEL.SETTINGS.THRESHOLD
            || encounter.type === "CONTEST" && encounter.minLevel < wildEcountersSettings.FORCE_FULLY_EVOLVED_BELOW_LEVEL.SETTINGS.THRESHOLD
        )
  }
    
  const unrestrictedEncounters: Encounter[] = []
  const fullyEvolvedEncounters: Encounter[] = []
    
  const balancedEncounters = [
    {
      fullyEvolved: [] as Encounter[],
      others: [] as Encounter[],
    },
    {
      fullyEvolved: [] as Encounter[],
      others: [] as Encounter[],
    },
  ]
    
  romInfo.gameData.encounters.forEach((encounter) => {
    if (
      wildEcountersSettings.REMOVE_TIME_BASED_ENCOUNTERS
        && (encounter.type === "LAND" || encounter.type === "FISHING_TIME_GROUP")
        && encounter.time !== "DAY"
    ) {
      return
    }
      
    if (wildEcountersSettings.AVAILABILITY === "SEARCHABLE" || wildEcountersSettings.AVAILABILITY === "REGIONAL") {
      if (encounter.type === "LAND" && !encounter.isSwarm || encounter.type === "WATER") {
        const index = wildEcountersSettings.AVAILABILITY === "REGIONAL" && gameMapsMap[encounter.mapId].encounterRegion === "KANTO" ? 1 : 0
          
        if (shouldBeFullyEvolved(encounter)) {
          balancedEncounters[index].fullyEvolved.push(encounter)
        } else {
          balancedEncounters[index].others.push(encounter)
        }
          
        return
      }
    }
      
    if (shouldBeFullyEvolved(encounter)) {
      fullyEvolvedEncounters.push(encounter)
    } else {
      unrestrictedEncounters.push(encounter)
    }
  })
    
  const balancedEncounterChoices = balancedEncounters.map((group) => {
    const numberOfSharedSets = Math.floor(group.fullyEvolved.length / nonBannedFullyEvolvedPokemonIds.length)
      
    const choices = (totalNumber: number, partialSet: PokemonId[], carryOverSet: PokemonId[]) => {
      const choices = Array(numberOfSharedSets).fill(partialSet).flat()
      let possibleRemainingChoices = carryOverSet
        
      while (choices.length < totalNumber) {
        choices.push(totalNumber - choices.length < possibleRemainingChoices.length ? random.element({ array: possibleRemainingChoices, remove: true }) : possibleRemainingChoices.splice(0, 1))
          
        if (possibleRemainingChoices.length < 1) {
          possibleRemainingChoices = nonBannedPokemonIds.map((pokemonId) => { return pokemonId })
        }
      }
        
      return choices.flat()
    }
      
    const carryOverSet = nonBannedFullyEvolvedPokemonIds.map((pokemonId) => { return pokemonId })
      
    return {
      fullyEvolved: choices(
        group.fullyEvolved.length,
        nonBannedFullyEvolvedPokemonIds,
        carryOverSet,
      ),
      others: choices(
        group.others.length,
        nonBannedNotFullyEvolvedPokemonIds,
        [...carryOverSet, ...nonBannedNotFullyEvolvedPokemonIds],
      ),
    }
  })
    
  const randomizeEcounters = (encounters: Encounter[], choices: PokemonId[], removeChoiceOnSelection: boolean) => {
    encounters.forEach((encounter) => {
      if (encounter.type !== "FISHING" || !encounter.isTimeGroup) {
        encounter.pokemonId = random.element({
          array: choices,
          errorInfo: {
            elementName: "Pokémon",
            mainSettingName: "RANDOMIZE_RANDOM_ENCOUNTERS",
            conflictingSettings: [
              "RANDOMIZE_RANDOM_ENCOUNTERS.SETTINGS.FORCE_FULLY_EVOLVED_BELOW_LEVEL",
              "RANDOMIZE_RANDOM_ENCOUNTERS.SETTINGS.AVAILABILITY",
              "RANDOMIZE_RANDOM_ENCOUNTERS.SETTINGS.BAN",
              "BANNED_POKEMON",
            ],
          },
          remove: removeChoiceOnSelection,
        })
      }
    })
  }
    
  randomizeEcounters(unrestrictedEncounters, nonBannedPokemonIds, false)
  randomizeEcounters(fullyEvolvedEncounters, nonBannedFullyEvolvedPokemonIds, false)
    
  balancedEncounters.forEach((group, index) => {
    randomizeEcounters(group.fullyEvolved, balancedEncounterChoices[index].fullyEvolved, true)
    randomizeEcounters(group.others, balancedEncounterChoices[index].others, true)
  })
    
  if (wildEcountersSettings.REMOVE_TIME_BASED_ENCOUNTERS) {
    romInfo.gameData.encounters.forEach((encounter) => {
      switch (encounter.type) {
      case "LAND":
        if (encounter.time !== "DAY") {
          encounter.pokemonId = (romInfo.gameData.encounters.find((otherEncounter) => {
            return otherEncounter.type === encounter.type
                && otherEncounter.mapId === encounter.mapId
                && (otherEncounter.isSwarm ?? false) === (encounter.isSwarm ?? false)
                && otherEncounter.time === "DAY"
                && otherEncounter.slot === encounter.slot
          }) as { pokemonId: PokemonId }).pokemonId
        }
        break
      case "FISHING_TIME_GROUP":
        if (encounter.time !== "DAY") {
          encounter.pokemonId = (romInfo.gameData.encounters.find((otherEncounter) => {
            return otherEncounter.type === encounter.type
                && otherEncounter.timeGroupIndex === encounter.timeGroupIndex
                && otherEncounter.time === "DAY"
          }) as { pokemonId: PokemonId }).pokemonId
        }
        break
      default: break
      }
    })
  }
}