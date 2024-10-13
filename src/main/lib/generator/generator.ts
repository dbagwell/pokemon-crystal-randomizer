import { ROMInfo, ROMOffset } from "@lib/gameData/romInfo"
import { DataHunk, Patch } from "@lib/generator/patch"
import { type Settings } from "@shared/appData/configHelpers"
import { eggGroupsMap } from "@shared/gameData/eggGroups"
import { encounters } from "@shared/gameData/encounters"
import { eventFlagsMap } from "@shared/gameData/eventFlags"
import { evolutionTypesMap } from "@shared/gameData/evolutionTypes"
import { gameMapGroupsMap } from "@shared/gameData/gameMapGroups"
import { gameMapsMap } from "@shared/gameData/gameMaps"
import { growthRatesMap } from "@shared/gameData/growthRates"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsMap } from "@shared/gameData/items"
import { mapObjectEvents } from "@shared/gameData/mapObjectEvents"
import { mapObjectTypesMap } from "@shared/gameData/mapObjectTypes"
import { type Move, movesMap } from "@shared/gameData/moves"
import { oddEggs } from "@shared/gameData/oddEggs"
import { overworldMovementBehavioursMap } from "@shared/gameData/overworldMovementBehaviours"
import { overworldSpritePalletsMap } from "@shared/gameData/overworldSpritePallets"
import { overworldSpritesMap } from "@shared/gameData/overworldSprites"
import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { pokemonMap } from "@shared/gameData/pokemon"
import { baseStatTotal, maxNumberOfEvolutionStages } from "@shared/gameData/pokemonHelpers"
import { pokemonTypesMap } from "@shared/gameData/pokemonTypes"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import { teachableMovesMap } from "@shared/gameData/teachableMoves"
import { tradesMap } from "@shared/gameData/trades"
import { trainerGroupsMap } from "@shared/gameData/trainerGroups"
import { trainerMovementBehavioursMap } from "@shared/gameData/trainerMovementBehaviours"
import { trainers } from "@shared/gameData/trainers"
import type { Encounter } from "@shared/types/gameData/encounter"
import { happinessEvolutionConidtionsMap, statEvolutionConidtionsMap } from "@shared/types/gameData/evolutionMethod"
import type { MapObjectEvent } from "@shared/types/gameData/mapObjectEvent"
import { type OddEgg } from "@shared/types/gameData/oddEgg"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import type { TeachableMove } from "@shared/types/gameData/teachableMove"
import type { Trade } from "@shared/types/gameData/trade"
import type { Trainer } from "@shared/types/gameData/trainer"
import { fishingGroupIds } from "@shared/types/gameDataIds/fishingGroups"
import { fishingRodIds } from "@shared/types/gameDataIds/fishingRods"
import { type HMItemId, hmItemIds, type ItemId, type TMItemId, tmItemIds } from "@shared/types/gameDataIds/items"
import { moveIds } from "@shared/types/gameDataIds/moves"
import { type PokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { pokemonTypeIds } from "@shared/types/gameDataIds/pokemonTypes"
import { type StarterLocationId, starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import { type MoveTutorId, moveTutorIds, type TeachableMoveId } from "@shared/types/gameDataIds/teachableMoves"
import type { TradeId } from "@shared/types/gameDataIds/trades"
import { trainerGroupIds } from "@shared/types/gameDataIds/trainerGroups"
import { treeGroupIds } from "@shared/types/gameDataIds/treeGroups"
import { bytesFrom, compact, hexStringFrom, isNotNullish, isNullish, isString } from "@utils"
import crypto from "crypto"
import { app } from "electron"
import hash from "object-hash"
import seedrandom from "seedrandom"

export const generateROM = (data: Buffer, customSeed: string | undefined, settings: Settings): {
  seed: string,
  data: Buffer,
} => {
  const romInfo = ROMInfo.vanilla()
  
  let hunks: DataHunk[] = []
  const seed = customSeed ?? crypto.randomUUID()
  const rng = seedrandom(seed)
  const randomInt = (min: number, max: number): number => {
    return Math.floor(rng() * (max + 1 - min)) + min
  }
  
  const updatedTrainers = JSON.parse(JSON.stringify(trainers)) as Trainer[]
  
  const hasPreEvolution = (pokemon: Pokemon) => {
    return Object.values(pokemonMap).flatMap((pokemon) => {
      return pokemon.evolutions?.map((evolution) => {
        return evolution.pokemonId
      }) ?? []
    }).includes(pokemon.id)
  }
  
  // Pokemon
  
  const pokemonSettings = settings.POKEMON
  
  // Starter Pokemon
  
  const startersSettings = pokemonSettings.STARTERS
  
  // Custom Starter Pokemon
  
  const customStartersSettings = startersSettings.CUSTOM
  const assignedStarters: Partial<Record<StarterLocationId, PokemonId>> = {}
      
  starterLocationIds.forEach((locationId) => {
    assignedStarters[locationId] = customStartersSettings[locationId]
  })
  
  // Random Starter Pokemon
      
  if (startersSettings.RANDOM) {
    const randomStartersSettings = startersSettings.RANDOM
    const isBanned = (pokemon: Pokemon) => {
      return randomStartersSettings.BAN.includes(pokemon.id)
    }
    
    const isAssigned = (pokemon: Pokemon) => {
      return isNotNullish(Object.values(assignedStarters).find((assignedStarterId) => {
        return assignedStarterId === pokemon.id
      }))
    }
    
    starterLocationIds.forEach((locationId) => {
      if (isNotNullish(assignedStarters[locationId])) {
        return
      }
      
      const vanillaStarter = pokemonMap[starterLocationsMap[locationId].pokemonId]
    
      const matchesType = (pokemon: Pokemon) => {
        return pokemon.types.includes(vanillaStarter.types[0]) // Vanilla starters only have 1 type each
      }
      
      const matchesEvoltions = (pokemon: Pokemon) => {
        return maxNumberOfEvolutionStages(pokemon) === maxNumberOfEvolutionStages(vanillaStarter)
      }
      
      const baseStatDifference = (pokemon: Pokemon) => {
        return Math.abs(baseStatTotal(pokemon) - baseStatTotal(vanillaStarter))
      }
      
      const choices = Object.values(pokemonMap).filter((pokemon) => {
        return !isBanned(pokemon)
          && (!randomStartersSettings.UNIQUE || !isAssigned(pokemon))
          && (!randomStartersSettings.MATCH_TYPE || matchesType(pokemon))
          && (!randomStartersSettings.MATCH_STAGE || !hasPreEvolution(pokemon))
          && (!randomStartersSettings.MATCH_EVOLUTIONS || matchesEvoltions(pokemon))
          && (!randomStartersSettings.MATCH_SIMILAR_BST || baseStatDifference(pokemon) <= randomStartersSettings.MATCH_SIMILAR_BST.THRESHOLD)
      })
      
      if (choices.length < 1) {
        throw new Error("Unable to satisfy settings for randomized starter Pokémon. Possible reasons: BST threshold too small or too many banned Pokémon. You could try again with a different seed, but different settings might be required.")
      }
      
      const index = randomInt(0, choices.length - 1)
      assignedStarters[locationId] = choices[index].id
    })
  }
      
  Object.entries(assignedStarters).forEach(([locationId, pokemonId]) => {
    if (isNullish(pokemonId)) {
      return
    }
    
    const pokemon = pokemonMap[pokemonId]
        
    hunks = [
      ...hunks,
      ...Patch.fromYAML(
        romInfo,
        `starters/${locationId.toLowerCase()}.yml`,
        {},
        {
          pokemonId: hexStringFrom(bytesFrom(pokemon.numericId, 1)),
          pokemonName: hexStringFrom(ROMInfo.displayCharacterBytesFrom(pokemon.name.toUpperCase())),
        },
      ).hunks,
    ]
  })
  
  if (pokemonSettings.STARTERS.RIVAL_SYNC) {
    Object.entries(assignedStarters).forEach(([locationId, newPokemonId]) => {
      if (isNullish(newPokemonId)) {
        return
      }
      
      let newPokemon = pokemonMap[newPokemonId]
      
      const rivalPokemon = updatedTrainers.filter((trainer) => {
        return trainerGroupsMap[trainer.groupId].classId === "RIVAL"
      }).flatMap((trainer) => {
        return trainer.pokemon
      })
      
      // Update the Rival's initial starters
      
      rivalPokemon.filter((pokemon) => {
        return locationId === "LEFT" && pokemon.id === "CYNDAQUIL"
          || locationId === "MIDDLE" && pokemon.id === "TOTODILE"
          || locationId === "RIGHT" && pokemon.id === "CHIKORITA"
      }).forEach((pokemon) => {
        pokemon.id = newPokemon.id
      })
      
      // Update the Rival's second stage starters
      
      const evolutionId = newPokemon.evolutions?.[0]?.pokemonId
      
      // Only evolve the pokemon at this stage if it can evolve further
      if (isNotNullish(evolutionId) && isNotNullish(pokemonMap[evolutionId].evolutions)) {
        newPokemon = pokemonMap[evolutionId]
      }
      
      rivalPokemon.filter((pokemon) => {
        return locationId === "LEFT" && pokemon.id === "QUILAVA"
          || locationId === "MIDDLE" && pokemon.id === "CROCONAW"
          || locationId === "RIGHT" && pokemon.id === "BAYLEEF"
      }).forEach((pokemon) => {
        pokemon.id = newPokemon.id
        
        if (pokemon.moves.length > 0) {
          const startIndex = newPokemon.levelUpMoves.findIndex((move) => {
            return move.level >= pokemon.level
          })
          
          pokemon.moves = newPokemon.levelUpMoves.slice(startIndex, 4).map((move) => {
            return move.moveId
          })
        }
      })
      
      // Update the Rival's third stage starters
      
      newPokemon = pokemonMap[newPokemon.evolutions?.[0]?.pokemonId ?? newPokemon.id]
      
      rivalPokemon.filter((pokemon) => {
        return locationId === "LEFT" && pokemon.id === "TYPHLOSION"
          || locationId === "MIDDLE" && pokemon.id === "FERALIGATR"
          || locationId === "RIGHT" && pokemon.id === "MEGANIUM"
      }).forEach((pokemon) => {
        pokemon.id = newPokemon.id
        
        if (pokemon.moves.length > 0) {
          const startIndex = newPokemon.levelUpMoves.findIndex((move) => {
            return move.level >= pokemon.level
          })
          
          pokemon.moves = newPokemon.levelUpMoves.slice(startIndex, 4).map((move) => {
            return move.moveId
          })
        }
      })
    })
  }
  
  // Random Event Pokemon
  
  const updatedOddEggs = JSON.parse(JSON.stringify(oddEggs)) as OddEgg[]
    
  if (pokemonSettings.RANDOMIZE_EVENT_POKEMON) {
    const eventPokemonSettings = pokemonSettings.RANDOMIZE_EVENT_POKEMON
    
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
    
    const getRandomPokemon = () => {
      return pokemonMap[getRandomPokemonId()]
    }
    
    const getRandomPokemonIdHexString = () => {
      return hexStringFrom([getRandomPokemon().numericId])
    }
    
    const randomizedOddEggIds = [getRandomPokemonId()]
    
    for (let index = 1; index < 14; index++) {
      if (eventPokemonSettings.ODD_EGG === "RANDOM" || index % 2 === 0 && eventPokemonSettings.ODD_EGG === "SHINY_MATCH") {
        randomizedOddEggIds.push(getRandomPokemonId())
      } else {
        randomizedOddEggIds.push(randomizedOddEggIds[index - 1])
      }
    }
    
    updatedOddEggs.forEach((oddEgg, index) => {
      oddEgg.pokemonId = randomizedOddEggIds[index]
    })
    
    const eeveePokemon = getRandomPokemon()
    const dratiniPokemon = getRandomPokemon()
    const tyrogue2Pokemon = getRandomPokemon()
    const abraPokemon = getRandomPokemon()
    const cubonePokemon = getRandomPokemon()
    const wobbuffetPokemon = getRandomPokemon()
    const pikachuPokemon = getRandomPokemon()
    const porygonPokemon = getRandomPokemon()
    const larvitarPokemon = getRandomPokemon()
    
    const eventPokemonPatch = Patch.fromYAML(
      romInfo,
      "eventPokemon.yml",
      {},
      {
        rattataPokemonId: getRandomPokemonIdHexString(),
        sudowoodoPokemonId: getRandomPokemonIdHexString(),
        raikouPokemonId: getRandomPokemonIdHexString(),
        enteiPokemonId: getRandomPokemonIdHexString(),
        suicunePokemonId: getRandomPokemonIdHexString(),
        gyaradosPokemonId: getRandomPokemonIdHexString(),
        voltorbPokemonId: getRandomPokemonIdHexString(),
        geodudePokemonId: getRandomPokemonIdHexString(),
        koffingPokemonId: getRandomPokemonIdHexString(),
        electrode1PokemonId: getRandomPokemonIdHexString(),
        electrode2PokemonId: getRandomPokemonIdHexString(),
        electrode3PokemonId: getRandomPokemonIdHexString(),
        laprasPokemonId: getRandomPokemonIdHexString(),
        snorlaxPokemonId: getRandomPokemonIdHexString(),
        hoOhPokemonId: getRandomPokemonIdHexString(),
        lugiaPokemonId: getRandomPokemonIdHexString(),
        celebiPokemonId: getRandomPokemonIdHexString(),
        togepiPokemonId: getRandomPokemonIdHexString(),
        spearowPokemonId: getRandomPokemonIdHexString(),
        shucklePokemonId: getRandomPokemonIdHexString(),
        eeveePokemonId: hexStringFrom([eeveePokemon.numericId]),
        eeveePokemonNameText1: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${eeveePokemon.name.toUpperCase()}.`.padEnd(11, " "))),
        eeveePokemonNameText2: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${eeveePokemon.name.toUpperCase()}`.padEnd(10, " "))),
        dratiniPokemonId: hexStringFrom([dratiniPokemon.numericId]),
        dratiniPokemonNameText1: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${dratiniPokemon.name.toUpperCase()}`.padEnd(12, " "))),
        dratiniPokemonNameText2: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${dratiniPokemon.name.toUpperCase()}`.padEnd(10, " "))),
        tyroguePokemonId: hexStringFrom([tyrogue2Pokemon.numericId]),
        tyroguePokemonNameText: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${tyrogue2Pokemon.name.toUpperCase()}`.padEnd(10, " "))),
        abraPokemonId: hexStringFrom([abraPokemon.numericId]),
        cubonePokemonId: hexStringFrom([cubonePokemon.numericId]),
        wobbuffetPokemonId: hexStringFrom([wobbuffetPokemon.numericId]),
        goldenrodGameCornerPokemonMenuText: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${abraPokemon.name.toUpperCase().padEnd(10, " ")}  100@${cubonePokemon.name.toUpperCase().padEnd(10, " ")}  800@${wobbuffetPokemon.name.toUpperCase().padEnd(10, " ")} 1500@`)),
        pikachuPokemonId: hexStringFrom([pikachuPokemon.numericId]),
        porygonPokemonId: hexStringFrom([porygonPokemon.numericId]),
        larvitarPokemonId: hexStringFrom([larvitarPokemon.numericId]),
        celadonGameCornerPokemonMenuText: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${pikachuPokemon.name.toUpperCase().padEnd(10, " ")} 2222@${porygonPokemon.name.toUpperCase().padEnd(10, " ")} 5555@${larvitarPokemon.name.toUpperCase().padEnd(10, " ")} 8888@`)),
      },
    )
    
    hunks = [...hunks, ...eventPokemonPatch.hunks]
  }
  
  // Eggs
  
  if (pokemonSettings.EGGS.FAST_BREEDING) {
    const fastBreedingPatch = Patch.fromYAML(
      romInfo,
      "fastBreeding.yml",
    )
    
    hunks = [...hunks, ...fastBreedingPatch.hunks]
  }
  
  if (pokemonSettings.EGGS.FAST_HATCHING) {
    updatedOddEggs.forEach((oddEgg) => {
      oddEgg.hatchCyclesRemaining = 1
    })
    
    const fastHatchingPatch = Patch.fromYAML(
      romInfo,
      "fastHatching.yml",
    )
    
    hunks = [...hunks, ...fastHatchingPatch.hunks]
  }
  
  if (pokemonSettings.RANDOMIZE_EVENT_POKEMON || pokemonSettings.EGGS.FAST_HATCHING) {
    hunks = [
      ...hunks,
      new DataHunk(
        ROMOffset.fromBankAddress(126, 0x756E),
        updatedOddEggs.flatMap((oddEgg) => {
          return [
            pokemonMap[oddEgg.pokemonId].numericId,
            isNotNullish(oddEgg.item) ? itemsMap[oddEgg.item].numericId : 0,
            ...oddEgg.moves.map((move) => {
              return movesMap[move.id].numericId
            }).concat(Array(4 - oddEgg.moves.length).fill(0)),
            ...bytesFrom(oddEgg.ot, 2),
            ...bytesFrom(oddEgg.experience, 3, true),
            ...bytesFrom(oddEgg.statExperience.hp, 2, true),
            ...bytesFrom(oddEgg.statExperience.attack, 2, true),
            ...bytesFrom(oddEgg.statExperience.defence, 2, true),
            ...bytesFrom(oddEgg.statExperience.speed, 2, true),
            ...bytesFrom(oddEgg.statExperience.special, 2, true),
            (oddEgg.dvs.attack << 4) + oddEgg.dvs.defence,
            (oddEgg.dvs.speed << 4) + oddEgg.dvs.special,
            ...oddEgg.moves.map((move) => {
              return move.pp
            }).concat(Array(4 - oddEgg.moves.length).fill(0)),
            oddEgg.hatchCyclesRemaining,
            isNotNullish(oddEgg.pokerus) ? (oddEgg.pokerus.strain << 4) + oddEgg.pokerus.daysRemaining : 0,
            0,
            0,
            oddEgg.level,
            0,
            0,
            0,
            0,
            ...bytesFrom(oddEgg.stats.hp, 2, true),
            ...bytesFrom(oddEgg.stats.attack, 2, true),
            ...bytesFrom(oddEgg.stats.defence, 2, true),
            ...bytesFrom(oddEgg.stats.speed, 2, true),
            ...bytesFrom(oddEgg.stats.specialAttack, 2, true),
            ...bytesFrom(oddEgg.stats.specialDefence, 2, true),
            ...ROMInfo.displayCharacterBytesFrom(oddEgg.name),
          ]
        })
      ),
    ]
  }
  
  // Encounter Data
  
  const updatedEncountersData: Encounter[] = JSON.parse(JSON.stringify(encounters))
  
  // Random Wild Encounters
  
  if (pokemonSettings.RANDOMIZE_WILD_ENCOUNTERS) {
    const wildEcountersSettings = pokemonSettings.RANDOMIZE_WILD_ENCOUNTERS
    
    const nonBannedPokemonIds = pokemonIds.filter((pokemonId) => {
      return !wildEcountersSettings.BAN.includes(pokemonId)
    })
    
    const nonBannedFullyEvolvedPokemonIds = nonBannedPokemonIds.filter((pokemonId) => {
      return isNullish(pokemonMap[pokemonId].evolutions) || pokemonMap[pokemonId].evolutions.length < 1
    })
    
    const nonBannedNotFullyEvolvedPokemonIds = nonBannedPokemonIds.filter((pokemonId) => {
      return isNotNullish(pokemonMap[pokemonId].evolutions) && pokemonMap[pokemonId].evolutions.length > 0
    })
    
    const shouldBeFullyEvolved = (encounter: Encounter): boolean => {
      return isNotNullish(wildEcountersSettings.FORCE_FULLY_EVOLVED)
        && (encounter.type !== "FISHING" || !encounter.isTimeGroup)
        && (
          encounter.type !== "CONTEST" && encounter.level <= wildEcountersSettings.FORCE_FULLY_EVOLVED.THRESHOLD
            || encounter.type === "CONTEST" && encounter.minLevel <= wildEcountersSettings.FORCE_FULLY_EVOLVED.THRESHOLD
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
    
    updatedEncountersData.forEach((encounter) => {
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
          const index = totalNumber - choices.length < possibleRemainingChoices.length ? randomInt(0, possibleRemainingChoices.length - 1) : 0
          choices.push(possibleRemainingChoices[index])
          possibleRemainingChoices.splice(index, 1)
          
          if (possibleRemainingChoices.length < 1) {
            possibleRemainingChoices = nonBannedPokemonIds.map((pokemonId) => { return pokemonId })
          }
        }
        
        return choices
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
          const index = randomInt(0, choices.length - 1)
          encounter.pokemonId = choices[index]
          
          if (removeChoiceOnSelection) {
            choices.splice(index, 1)
          }
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
      updatedEncountersData.forEach((encounter) => {
        switch (encounter.type) {
        case "LAND":
          if (encounter.time !== "DAY") {
            encounter.pokemonId = (updatedEncountersData.find((otherEncounter) => {
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
            encounter.pokemonId = (updatedEncountersData.find((otherEncounter) => {
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
  
  // Encounter Rates
  
  const getAdjustedEncounterRates = (rates: number[], max: number) => {
    let cumulativeValue = 0
    
    const adjustedRates = rates.map((rate) => {
      const adjustedRate = rate * max / 100
      cumulativeValue += Math.floor(adjustedRate)
      return cumulativeValue
    })
    
    if (cumulativeValue < max) {
      if (adjustedRates.length === 4) {
        adjustedRates[adjustedRates.length - 2]++
        adjustedRates[adjustedRates.length - 1]++
      } else {
        let remainingPoints = max - cumulativeValue
        let cumulativeAdjustment = 0
        
        for (let index = 0; index < adjustedRates.length; index++) {
          if (remainingPoints > 0) {
            cumulativeAdjustment++
            remainingPoints--
          }
          
          adjustedRates[index] += cumulativeAdjustment
        }
      }
    }
    
    return adjustedRates
  }
  
  const encounterRateSettings = pokemonSettings.WILD_ENCOUNTER_RATES
  
  updatedEncountersData.forEach((encounter) => {
    switch (encounter.type) {
    case "FISHING": {
      switch (encounter.rod) {
      case "OLD": {
        encounter.rate = getAdjustedEncounterRates(encounterRateSettings.OLD_ROD, 255)[encounter.slot]
        break
      }
      case "GOOD": {
        encounter.rate = getAdjustedEncounterRates(encounterRateSettings.GOOD_ROD, 255)[encounter.slot]
        break
      }
      case "SUPER": {
        encounter.rate = getAdjustedEncounterRates(encounterRateSettings.SUPER_ROD, 255)[encounter.slot]
        break
      }
      }
      break
    }
    case "TREE": {
      encounter.rate = encounterRateSettings.TREE[encounter.slot]
      break
    }
    case "ROCK": {
      encounter.rate = encounterRateSettings.ROCK[encounter.slot]
      break
    }
    case "CONTEST": {
      encounter.rate = encounterRateSettings.CONTEST[encounter.slot]
      break
    }
    }
  })
  
  // Encounter Data Patch
    
  const landOrWaterEncounterIncludes = (region: "JOHTO" | "KANTO", type: "LAND" | "WATER", isSwarm: boolean) => {
    return compact(Object.values(gameMapsMap).map((gameMap) => {
      const encounterRates = (() => {
        if (isSwarm) {
          return gameMap.swarmEncounterRates
        }
        
        switch (type) {
        case "LAND": return gameMap.landEncounterRates
        case "WATER": return gameMap.waterEncounterRate ? [gameMap.waterEncounterRate] : undefined
        }
      })()
      
      if (gameMap.encounterRegion !== region || isNullish(encounterRates)) {
        return undefined
      }
      
      return {
        path: "landOrWaterEncounterGroup.yml",
        extraIncludes: {
          encounterSlots: compact(updatedEncountersData.map((encounter) => {
            if (encounter.type !== type || encounter.mapId !== gameMap.id || encounter.type === "LAND" && (encounter.isSwarm ?? false) !== isSwarm) {
              return undefined
            }
            
            const timeIndex = encounter.type === "WATER" || encounter.time === "MORNING" ? 0 : encounter.time === "DAY" ? 10 : 20
            
            return {
              sortOrder: timeIndex + encounter.slot,
              level: encounter.level,
              pokemonId: encounter.pokemonId,
            }
          })).toSorted((info1, info2) => {
            return info1.sortOrder - info2.sortOrder
          }).map((info) => {
            return {
              path: "landOrWaterEncounterSlot.yml",
              extraIncludes: {},
              extraValues: {
                level: hexStringFrom([info.level]),
                pokemonId: hexStringFrom([pokemonMap[info.pokemonId].numericId]),
              },
            }
          }),
        },
        extraValues: {
          mapGroupId: hexStringFrom([gameMapGroupsMap[gameMap.mapGroup].numericId]),
          mapId: hexStringFrom([gameMap.numericId]),
          encounterRates: hexStringFrom(encounterRates),
        },
      }
    }))
  }
  
  const wildEncountersPatch = Patch.fromYAML(
    romInfo,
    "wildEncounters.yml",
    {
      johtoLandEncounterGroups: landOrWaterEncounterIncludes("JOHTO", "LAND", false),
      johtoWaterEncounterGroups: landOrWaterEncounterIncludes("JOHTO", "WATER", false),
      kantoLandEncounterGroups: landOrWaterEncounterIncludes("KANTO", "LAND", false),
      kantoWaterEncounterGroups: landOrWaterEncounterIncludes("KANTO", "WATER", false),
      swarmEncounterGroups: landOrWaterEncounterIncludes("JOHTO", "LAND", true),
      contestEncounterSlots: compact(updatedEncountersData.map((encounter) => {
        if (encounter.type !== "CONTEST") {
          return undefined
        }
        
        return {
          path: "contestEncounterSlot.yml",
          extraIncludes: {},
          extraValues: {
            encounterRate: hexStringFrom([encounter.rate]),
            pokemonId: hexStringFrom([pokemonMap[encounter.pokemonId].numericId]),
            minLevel: hexStringFrom([encounter.minLevel]),
            maxLevel: hexStringFrom([encounter.maxLevel]),
          },
        }
      })),
      fishingEncounterSlots: fishingGroupIds.flatMap((group, groupIndex) => {
        return fishingRodIds.flatMap((rod, rodIndex) => {
          return compact(updatedEncountersData.map((encounter) => {
            if (encounter.type !== "FISHING" || encounter.group !== group || encounter.rod !== rod) {
              return undefined
            }
            
            return {
              sortOrder: groupIndex * 10_000 + rodIndex * 1_000 + encounter.rate,
              rate: encounter.rate,
              pokemonId: encounter.isTimeGroup ? 0 : pokemonMap[encounter.pokemonId].numericId,
              levelOrTimeGroupIndex: encounter.isTimeGroup ? encounter.timeGroupIndex : encounter.level,
            }
          }))
        })
      }).toSorted((info1, info2) => {
        return info1.sortOrder - info2.sortOrder
      }).map((info) => {
        return {
          path: "fishingTreeOrRockEncounterSlot.yml",
          extraIncludes: {},
          extraValues: {
            encounterRate: hexStringFrom([info.rate]),
            pokemonId: hexStringFrom([info.pokemonId]),
            levelOrTimeGroupIndex: hexStringFrom([info.levelOrTimeGroupIndex]),
          },
        }
      }),
      fishingTimeEncounterGroups: compact(updatedEncountersData.map((encounter) => {
        if (encounter.type !== "FISHING_TIME_GROUP") {
          return undefined
        }
            
        return {
          sortOrder: encounter.timeGroupIndex,
          dayPokemonId: pokemonMap[encounter.pokemonId].numericId,
          dayLevel: encounter.level,
          nightPokemonId: pokemonMap[encounter.pokemonId].numericId,
          nightLevel: encounter.level,
        }
      })).toSorted((info1, info2) => {
        return info1.sortOrder - info2.sortOrder
      }).map((info) => {
        return {
          path: "fishingTimeGroup.yml",
          extraIncludes: {},
          extraValues: {
            dayPokemonId: hexStringFrom([info.dayPokemonId]),
            dayLevel: hexStringFrom([info.dayLevel]),
            nightPokemonId: hexStringFrom([info.nightPokemonId]),
            nightLevel: hexStringFrom([info.nightLevel]),
          },
        }
      }),
      treeEncounterGroups: treeGroupIds.flatMap((group) => {
        return ["COMMON", "RARE"].map((rarity) => {
          return compact(updatedEncountersData.map((encounter) => {
            if (encounter.type !== "TREE" || encounter.group !== group || encounter.rarity !== rarity) {
              return undefined
            }
              
            return {
              rate: encounter.rate,
              pokemonId: pokemonMap[encounter.pokemonId].numericId,
              level: encounter.level,
            }
          }))
        })
      }).map((encounterSlots) => {
        return {
          path: "treeEncounterGroup.yml",
          extraIncludes: {
            encounterSlots: encounterSlots.map((info) => {
              return {
                path: "fishingTreeOrRockEncounterSlot.yml",
                extraIncludes: {},
                extraValues: {
                  encounterRate: hexStringFrom([info.rate]),
                  pokemonId: hexStringFrom([info.pokemonId]),
                  levelOrTimeGroupIndex: hexStringFrom([info.level]),
                },
              }
            }),
          },
          extraValues: {},
        }
      }),
      rockEncounterSlots: compact(updatedEncountersData.map((encounter) => {
        if (encounter.type !== "ROCK") {
          return undefined
        }
          
        return {
          rate: encounter.rate,
          pokemonId: pokemonMap[encounter.pokemonId].numericId,
          level: encounter.level,
        }
      })).map((info) => {
        return {
          path: "fishingTreeOrRockEncounterSlot.yml",
          extraIncludes: {},
          extraValues: {
            encounterRate: hexStringFrom([info.rate]),
            pokemonId: hexStringFrom([info.pokemonId]),
            levelOrTimeGroupIndex: hexStringFrom([info.level]),
          },
        }
      }),
    },
    {
      landAndWaterEncounterRates: hexStringFrom([
        ...getAdjustedEncounterRates(encounterRateSettings.LAND, 100).flatMap((rate, index) => {
          return [rate, index * 2]
        }),
        ...getAdjustedEncounterRates(encounterRateSettings.WATER, 100).flatMap((rate, index) => {
          return [rate, index * 2]
        }),
      ]),
    },
  )
    
  hunks = [...hunks, ...wildEncountersPatch.hunks]
  
  // Trades
  
  const updatedTradesDataMap = JSON.parse(JSON.stringify(tradesMap)) as IdMap<TradeId, Trade>
  
  const availableTradePokemonIds = pokemonIds.filter((pokemonId) => {
    return !pokemonSettings.TRADES.BAN.includes(pokemonId)
  })
    
  const getRandomTradePokemonId = () => {
    const index = randomInt(0, availableTradePokemonIds.length - 1)
    const pokemonId = availableTradePokemonIds[index]
    
    if (pokemonSettings.TRADES.UNIQUE) {
      availableTradePokemonIds.splice(index, 1)
    }
    
    return pokemonId
  }
  
  if (pokemonSettings.TRADES.RANDOMIZE_TRADE_ASKS) {
    Object.values(updatedTradesDataMap).forEach((trade) => {
      trade.askPokemonId = getRandomTradePokemonId()
    })
  }
  
  if (pokemonSettings.TRADES.RANDOMIZE_TRADE_OFFERS) {
    Object.values(updatedTradesDataMap).forEach((trade) => {
      trade.offerPokemonId = getRandomTradePokemonId()
    })
  }
  
  const tradePokemonIdsHexString = (trade: Trade) => {
    return hexStringFrom([
      pokemonMap[trade.askPokemonId].numericId,
      pokemonMap[trade.offerPokemonId].numericId,
    ])
  }
  
  const tradesPatch = Patch.fromYAML(
    romInfo,
    "trades.yml",
    {},
    {
      mikeTradePokemonIds: tradePokemonIdsHexString(updatedTradesDataMap.MIKE),
      kyleTradePokemonIds: tradePokemonIdsHexString(updatedTradesDataMap.KYLE),
      timTradePokemonIds: tradePokemonIdsHexString(updatedTradesDataMap.TIM),
      emyTradePokemonIds: tradePokemonIdsHexString(updatedTradesDataMap.EMY),
      chirsTradePokemonIds: tradePokemonIdsHexString(updatedTradesDataMap.CHRIS),
      kimTradePokemonIds: tradePokemonIdsHexString(updatedTradesDataMap.KIM),
      forestTradePokemonIds: tradePokemonIdsHexString(updatedTradesDataMap.FOREST),
    },
  )

  hunks = [...hunks, ...tradesPatch.hunks]
  
  // Pokemon Data
  
  const updatedPokemonDataMap: IdMap<PokemonId, Pokemon> = JSON.parse(JSON.stringify(pokemonMap))
  
  // Evolutions
  
  Object.values(updatedPokemonDataMap).forEach((pokemon) => {
    pokemon.evolutions?.forEach((evolution) => {
      if (isNotNullish(pokemonSettings.CHANGE_TRADE_EVOLUTION_METHODS) && evolution.method.typeId === "TRADE") {
        if (pokemon.id === "SLOWPOKE") {
          evolution.method = {
            typeId: "ITEM",
            item: "WATER_STONE",
          }
        } else if (!hasPreEvolution(pokemon)) {
          evolution.method = {
            typeId: "LEVEL",
            level: pokemonSettings.CHANGE_TRADE_EVOLUTION_METHODS.FIRST_EVO_LEVEL,
          }
        } else {
          evolution.method = {
            typeId: "LEVEL",
            level: pokemonSettings.CHANGE_TRADE_EVOLUTION_METHODS.SECOND_EVO_LEVEL,
          }
        }
      }
      
      if (pokemonSettings.CHANGE_TIME_EVOLUTION_METHODS && evolution.method.typeId === "HAPPINESS") {
        if (evolution.method.conditionId === "DAY") {
          evolution.method = {
            typeId: "ITEM",
            item: "SUN_STONE",
          }
        } else if (evolution.method.conditionId === "NIGHT") {
          evolution.method = {
            typeId: "ITEM",
            item: "MOON_STONE",
          }
        }
      }
      
      if (isNotNullish(pokemonSettings.DECREASE_HIGH_EVOLUTION_LEVELS) && evolution.method.typeId === "LEVEL") {
        if (evolution.method.level > pokemonSettings.DECREASE_HIGH_EVOLUTION_LEVELS.FIRST_EVO_THRESHOLD && !hasPreEvolution(pokemon)) {
          evolution.method.level = pokemonSettings.DECREASE_HIGH_EVOLUTION_LEVELS.FIRST_EVO_THRESHOLD
        } else if (evolution.method.level > pokemonSettings.DECREASE_HIGH_EVOLUTION_LEVELS.SECOND_EVO_THRESHOLD && hasPreEvolution(pokemon)) {
          evolution.method.level = pokemonSettings.DECREASE_HIGH_EVOLUTION_LEVELS.SECOND_EVO_THRESHOLD
        }
      }
    })
  })
  
  hunks = [...hunks, new DataHunk(ROMOffset.fromBankAddress(16, 0x6287), [pokemonSettings.HAPPINESS_EVOLUTION_REQUIREMENT])]
  
  // Random Level Up Moves
  
  const levelUpMovesSettings = pokemonSettings.RANDOMIZE_LEVEL_UP_MOVES
  
  if (isNotNullish(levelUpMovesSettings)) {
    const nonBannedMoveIds = moveIds.filter((moveId) => {
      return !levelUpMovesSettings.BAN.includes(moveId)
    })
    
    Object.values(updatedPokemonDataMap).forEach((pokemon) => {
      let moveChoices = nonBannedMoveIds.map((moveId) => {
        return movesMap[moveId]
      })
      
      const numberOfLevelOneMovesToAdd = levelUpMovesSettings.LEVEL_ONE_MOVES - pokemon.levelUpMoves.filter((levelUpMove) => { return levelUpMove.level === 1 }).length
      const totalNumberOfMoves = numberOfLevelOneMovesToAdd + pokemon.levelUpMoves.length
      const indicesOfForcedGoodMoves: number[] = []
      const minPowerForForcedGoodMoves = levelUpMovesSettings.GOOD_DAMAGING_MOVES?.POWER ?? 0
      
      if (isNotNullish(levelUpMovesSettings.GOOD_DAMAGING_MOVES)) {
        const guaranteedNumberOfGoodMoves = Math.ceil(totalNumberOfMoves * levelUpMovesSettings.GOOD_DAMAGING_MOVES.PERCENTAGE / 100)
        const indicesOfAllMoves = Array(totalNumberOfMoves).map((_, index) => { return index })
        for (let i = 0; i < guaranteedNumberOfGoodMoves; i++) {
          const index = indicesOfAllMoves.splice(randomInt(0, indicesOfAllMoves.length - 1), 1)[0]
          indicesOfForcedGoodMoves.push(index)
        }
      }
      
      const matchesForcedGoodMovesConditions = (move: Move, index: number) => {
        if (indicesOfForcedGoodMoves.includes(index)) {
          return move.power >= minPowerForForcedGoodMoves
        } else {
          return true
        }
      }
      
      pokemon.levelUpMoves.forEach((levelUpMove, index) => {
        const adjustedIndex = index + numberOfLevelOneMovesToAdd
        
        const primaryChoices: Move[] = []
        const secondaryChoices: Move[] = []
        const tertiaryChoices: Move[] = []
        
        moveChoices.forEach((move) => {
          if (!levelUpMovesSettings.PREFER_SAME_TYPE || move.type === movesMap[levelUpMove.moveId].type) {
            if (matchesForcedGoodMovesConditions(move, adjustedIndex)) {
              primaryChoices.push(move)
            } else {
              secondaryChoices.push(move)
            }
          } else if (matchesForcedGoodMovesConditions(move, adjustedIndex)) {
            secondaryChoices.push(move)
          } else {
            tertiaryChoices.push(move)
          }
        })
        
        const chosenMove = primaryChoices[randomInt(0, primaryChoices.length - 1)]
          ?? secondaryChoices[randomInt(0, secondaryChoices.length - 1)]
          ?? tertiaryChoices[randomInt(0, tertiaryChoices.length - 1)]
        
        if (isNullish(chosenMove)) {
          throw new Error("Unable to satisfy settings for randomized level up moves. Possible reason: too many banned moves. You could try again with a different seed, but different settings might be required.")
        }
        
        levelUpMove.moveId = chosenMove.id
        
        if (levelUpMovesSettings.UNIQUE) {
          moveChoices = moveChoices.filter((move) => {
            return move.id !== chosenMove.id
          })
        }
      })
      
      for (let i = 0; i < numberOfLevelOneMovesToAdd; i++) {
        const primaryChoices: Move[] = []
        const secondaryChoices: Move[] = []
        
        moveChoices.forEach((move) => {
          if (matchesForcedGoodMovesConditions(move, i)) {
            primaryChoices.push(move)
          } else {
            secondaryChoices.push(move)
          }
        })
        
        const chosenMove = primaryChoices[randomInt(0, primaryChoices.length - 1)]
          ?? secondaryChoices[randomInt(0, secondaryChoices.length - 1)]
        
        if (isNullish(chosenMove)) {
          throw new Error("Unable to satisfy settings for randomized level up moves. Possible reason: too many banned moves. You could try again with a different seed, but different settings might be required.")
        }
        
        pokemon.levelUpMoves.push({
          moveId: chosenMove.id,
          level: 1,
        })
        
        if (levelUpMovesSettings.UNIQUE) {
          moveChoices = moveChoices.filter((move) => {
            return move.id !== chosenMove.id
          })
        }
      }
        
      pokemon.levelUpMoves.sort((move1, move2) => {
        return move1.level - move2.level
      })
      
      if (levelUpMovesSettings.PROGRESSIVE) {
        const sortedDamagingMoves = pokemon.levelUpMoves.map((levelUpMove) => {
          return movesMap[levelUpMove.moveId]
        }).filter((move) => {
          return move.power !== 0
        }).toSorted((move1, move2) => {
          return move1.power - move2.power
        })
        
        pokemon.levelUpMoves.forEach((levelUpMove) => {
          levelUpMove.moveId = movesMap[levelUpMove.moveId].power === 0 ? levelUpMove.moveId : sortedDamagingMoves.splice(0, 1)[0].id
        })
      }
    })
    
    const pokemonEvolutionsAndAttacksPatch = Patch.fromYAML(
      romInfo,
      "pokemonEvolutionsAndLevelUpMovesTable.yml",
      {
        pokemon: Object.values(updatedPokemonDataMap).map((pokemon) => {
          return {
            path: "pokemonEvolutionsAndLevelUpMoves.yml",
            extraIncludes: {
              evolutions: pokemon.evolutions?.map((evolution) => {
                const levelOrItemIdOrHappinessCondition = () => {
                  switch (evolution.method.typeId) {
                  case "LEVEL":
                  case "STAT": {
                    return evolution.method.level
                  }
                  case "ITEM":
                  case "TRADE": {
                    if (isNotNullish(evolution.method.item)) {
                      return itemsMap[evolution.method.item].numericId
                    } else {
                      return 0xFF
                    }
                  }
                  case "HAPPINESS": {
                    return happinessEvolutionConidtionsMap[evolution.method.conditionId].numericId
                  }
                  }
                }
          
                const statConditionOrSpecies = () => {
                  if (evolution.method.typeId === "STAT") {
                    return statEvolutionConidtionsMap[evolution.method.conditionId].numericId
                  } else {
                    return pokemonMap[evolution.pokemonId].numericId
                  }
                }
          
                const statSpecies = () => {
                  if (evolution.method.typeId === "STAT") {
                    return pokemonMap[evolution.pokemonId].numericId
                  } else {
                    return undefined
                  }
                }
                
                return {
                  path: "evolution.yml",
                  extraIncludes: {},
                  extraValues: {
                    typeId: hexStringFrom([evolutionTypesMap[evolution.method.typeId].numericId]),
                    levelOrItemIdOrHappinessCondition: hexStringFrom([levelOrItemIdOrHappinessCondition()]),
                    statConditionAndSpecies: hexStringFrom(compact([
                      statConditionOrSpecies(),
                      statSpecies(),
                    ])),
                  },
                }
              }) ?? [],
              levelUpMoves: pokemon.levelUpMoves.map(({ level, moveId }) => {
                return {
                  path: "levelUpMove.yml",
                  extraIncludes: {},
                  extraValues: {
                    level: hexStringFrom([level]),
                    moveId: hexStringFrom([movesMap[moveId].numericId]),
                  },
                }
              }),
            },
            extraValues: {},
          }
        }),
      },
    )
  
    hunks = [...hunks, ...pokemonEvolutionsAndAttacksPatch.hunks]
    
    updatedTrainers.forEach((trainer) => {
      trainer.pokemon.forEach((pokemon) => {
        pokemon.moves = []
      })
    })
  }
  
  // Pokemon Info
  
  if (pokemonSettings.INCREASE_POKEMON_CATCH_RATES) {
    const percentage = pokemonSettings.INCREASE_POKEMON_CATCH_RATES.PERCENTAGE
    
    Object.values(updatedPokemonDataMap).forEach((pokemon) => {
      pokemon.catchRate = (255 - pokemon.catchRate) * percentage / 100 + pokemon.catchRate
    })
  }
  
  if (pokemonSettings.STANDARDIZE_POKEMON_GROWTH_RATES) {
    const growthRatesSettings = pokemonSettings.STANDARDIZE_POKEMON_GROWTH_RATES
    
    Object.values(updatedPokemonDataMap).forEach((pokemon) => {
      if (!growthRatesSettings.EXCLUDE.includes(pokemon.id)) {
        pokemon.growthRate = growthRatesSettings.GROWTH_RATE
      }
    })
  }
  
  if (
    pokemonSettings.RANDOMIZE_TM_COMPATIBILITY
    || pokemonSettings.RANDOMIZE_HM_COMPATIBILITY
    || pokemonSettings.RANDOMIZE_MOVE_TUTOR_COMPATIBILITY
  ) {
    if (pokemonSettings.RANDOMIZE_TM_COMPATIBILITY) {
      Object.values(updatedPokemonDataMap).forEach((pokemon) => {
        const availableTMS = Object.values(teachableMovesMap).filter((move) => {
          return move.type === "TM"
        })
        
        pokemon.tmMoves = Array(randomInt(tmItemIds.length * (pokemonSettings.RANDOMIZE_TM_COMPATIBILITY?.PERCENTAGE ?? randomInt(0, 100)) / 100, tmItemIds.length)).fill(undefined).map(() => {
          return availableTMS.splice(randomInt(0, availableTMS.length - 1), 1)[0].id as TMItemId
        })
      })
    }
    
    if (pokemonSettings.RANDOMIZE_HM_COMPATIBILITY) {
      Object.values(updatedPokemonDataMap).forEach((pokemon) => {
        const availableHMS = Object.values(teachableMovesMap).filter((move) => {
          return move.type === "HM"
        })
        
        pokemon.hmMoves = Array(randomInt(hmItemIds.length * (pokemonSettings.RANDOMIZE_HM_COMPATIBILITY?.PERCENTAGE ?? randomInt(0, 100)) / 100, hmItemIds.length)).fill(undefined).map(() => {
          return availableHMS.splice(randomInt(0, availableHMS.length - 1), 1)[0].id as HMItemId
        })
      })
    }
    
    if (pokemonSettings.RANDOMIZE_TM_COMPATIBILITY) {
      Object.values(updatedPokemonDataMap).forEach((pokemon) => {
        const availableMoveTutorMoves = Object.values(teachableMovesMap).filter((move) => {
          return move.type === "MOVE_TUTOR"
        })
        
        pokemon.moveTutorMoves = Array(randomInt(moveTutorIds.length * (pokemonSettings.RANDOMIZE_TM_COMPATIBILITY?.PERCENTAGE ?? randomInt(0, 100)) / 100, moveTutorIds.length)).fill(undefined).map(() => {
          return availableMoveTutorMoves.splice(randomInt(0, availableMoveTutorMoves.length - 1), 1)[0].id as MoveTutorId
        })
      })
    }
    
    const pokemonInfoPatch = Patch.fromYAML(
      romInfo,
      "pokemonInfoTable.yml",
      {
        pokemon: Object.values(updatedPokemonDataMap).map((pokemon) => {
          const teachableMovesBytes: number[] = Array(8).fill(0)
          
          const pokemonTeachableMoveIds = [
            ...pokemon.tmMoves,
            ...pokemon.hmMoves,
            ...pokemon.moveTutorMoves,
          ]
          
          pokemonTeachableMoveIds.forEach((id) => {
            const move = teachableMovesMap[id]
            teachableMovesBytes[move.byteIndex] += 1 << move.bitIndex
          })
          
          return {
            path: "pokemonInfo.yml",
            extraIncludes: {},
            extraValues: {
              numericId: hexStringFrom([pokemon.numericId]),
              hp: hexStringFrom([pokemon.baseStats.hp]),
              attack: hexStringFrom([pokemon.baseStats.attack]),
              defence: hexStringFrom([pokemon.baseStats.defence]),
              speed: hexStringFrom([pokemon.baseStats.speed]),
              specialAttack: hexStringFrom([pokemon.baseStats.specialAttack]),
              specialDefence: hexStringFrom([pokemon.baseStats.specialDefence]),
              type1: hexStringFrom([pokemonTypesMap[pokemon.types[0]].numericId]),
              type2: hexStringFrom([pokemonTypesMap[pokemon.types[1] ?? pokemon.types[0]].numericId]),
              catchRate: hexStringFrom([pokemon.catchRate]),
              baseExperience: hexStringFrom([pokemon.baseExperience]),
              item1: hexStringFrom([isNotNullish(pokemon.items[0]) ? itemsMap[pokemon.items[0]].numericId : 0]),
              item2: hexStringFrom([isNotNullish(pokemon.items[1]) ? itemsMap[pokemon.items[1]].numericId : 0]),
              genderRatio: hexStringFrom([pokemon.genderRatio]),
              eggCycles: hexStringFrom([pokemon.eggCycles]),
              spriteDimensions: hexStringFrom([pokemon.spriteDimensions]),
              growthRate: hexStringFrom([growthRatesMap[pokemon.growthRate].numericId]),
              eggGroups: hexStringFrom([(eggGroupsMap[pokemon.eggGroups[0]].numericId << 4) + eggGroupsMap[pokemon.eggGroups[1] ?? pokemon.eggGroups[0]].numericId]),
              teachableMovesData: hexStringFrom(teachableMovesBytes),
            },
          }
        }),
      },
    )
    
    hunks = [...hunks, ...pokemonInfoPatch.hunks]
  }
  
  // Moves
  
  const movesSettings = settings.MOVES
  
  // Randomize TMs and Move Tutor Moves
  
  if (movesSettings.RANDOMIZE_TMS || movesSettings.RANDOMIZE_MOVE_TUTORS) {
    const updatedTeachableMovesDataMap: IdMap<TeachableMoveId, TeachableMove> = JSON.parse(JSON.stringify(teachableMovesMap))
    
    if (movesSettings.RANDOMIZE_TMS) {
      const tmsSettings = movesSettings.RANDOMIZE_TMS
      
      const tms = Object.values(updatedTeachableMovesDataMap).filter((move) => {
        return move.type === "TM"
      })
      
      let nonBannedMoves = Object.values(movesMap).filter((move) => {
        return !tmsSettings.BAN.includes(move.id)
      })
      
      const indicesOfForcedGoodMoves: number[] = []
      const minPowerForForcedGoodMoves = tmsSettings.GOOD_DAMAGING_MOVES?.POWER ?? 0
      
      if (isNotNullish(tmsSettings.GOOD_DAMAGING_MOVES)) {
        const guaranteedNumberOfGoodMoves = Math.ceil(tms.length * tmsSettings.GOOD_DAMAGING_MOVES.PERCENTAGE / 100)
        const indicesOfAllMoves = Array(tms.length).map((_, index) => { return index })
        for (let i = 0; i < guaranteedNumberOfGoodMoves; i++) {
          const index = indicesOfAllMoves.splice(randomInt(0, indicesOfAllMoves.length - 1), 1)[0]
          indicesOfForcedGoodMoves.push(index)
        }
      }
      
      const matchesForcedGoodMovesConditions = (move: Move, index: number) => {
        if (indicesOfForcedGoodMoves.includes(index)) {
          return move.power >= minPowerForForcedGoodMoves
        } else {
          return true
        }
      }
      
      tms.forEach((tm, index) => {
        if (!tmsSettings.KEEP_FIELD_MOVES || !movesMap[tm.moveId].isFieldMove) {
          const primaryChoices: Move[] = []
          const secondaryChoices: Move[] = []
          const tertiaryChoices: Move[] = []
          
          nonBannedMoves.forEach((move) => {
            if (!tmsSettings.PREFER_SAME_TYPE || move.type === movesMap[tm.moveId].type) {
              if (matchesForcedGoodMovesConditions(move, index)) {
                primaryChoices.push(move)
              } else {
                secondaryChoices.push(move)
              }
            } else if (matchesForcedGoodMovesConditions(move, index)) {
              secondaryChoices.push(move)
            } else {
              tertiaryChoices.push(move)
            }
          })
          
          const chosenMove = primaryChoices[randomInt(0, primaryChoices.length - 1)]
            ?? secondaryChoices[randomInt(0, secondaryChoices.length - 1)]
            ?? tertiaryChoices[randomInt(0, tertiaryChoices.length - 1)]
      
          if (isNullish(chosenMove)) {
            throw new Error("Unable to satisfy settings for randomized tm moves. Possible reason: too many banned moves. You could try again with a different seed, but different settings might be required.")
          }
          
          tm.moveId = chosenMove.id
        }
        
        if (tmsSettings.UNIQUE) {
          nonBannedMoves = nonBannedMoves.filter((move) => {
            return move.id !== tm.moveId
          })
        }
      })
    }
    
    if (movesSettings.RANDOMIZE_MOVE_TUTORS) {
      const moveTutorSettings = movesSettings.RANDOMIZE_MOVE_TUTORS
      
      const moveTutorMoves = Object.values(updatedTeachableMovesDataMap).filter((move) => {
        return move.type === "MOVE_TUTOR"
      })
      
      let nonBannedMoves = Object.values(movesMap).filter((move) => {
        return !moveTutorSettings.BAN.includes(move.id)
      })
      
      const indicesOfForcedGoodMoves: number[] = []
      const minPowerForForcedGoodMoves = moveTutorSettings.GOOD_DAMAGING_MOVES?.POWER ?? 0
      
      if (isNotNullish(moveTutorSettings.GOOD_DAMAGING_MOVES)) {
        const guaranteedNumberOfGoodMoves = Math.ceil(moveTutorMoves.length * moveTutorSettings.GOOD_DAMAGING_MOVES.PERCENTAGE / 100)
        const indicesOfAllMoves = Array(moveTutorMoves.length).map((_, index) => { return index })
        for (let i = 0; i < guaranteedNumberOfGoodMoves; i++) {
          const index = indicesOfAllMoves.splice(randomInt(0, indicesOfAllMoves.length - 1), 1)[0]
          indicesOfForcedGoodMoves.push(index)
        }
      }
      
      const matchesForcedGoodMovesConditions = (move: Move, index: number) => {
        if (indicesOfForcedGoodMoves.includes(index)) {
          return move.power >= minPowerForForcedGoodMoves
        } else {
          return true
        }
      }
      
      moveTutorMoves.forEach((moveTutorMove, index) => {
        const choices = nonBannedMoves.filter((move) => {
          return (!moveTutorSettings.PREFER_SAME_TYPE || move.type === movesMap[moveTutorMove.moveId].type)
            && matchesForcedGoodMovesConditions(move, index)
        })
        
        const primaryChoices: Move[] = []
        const secondaryChoices: Move[] = []
        const tertiaryChoices: Move[] = []
        
        nonBannedMoves.forEach((move) => {
          if (!moveTutorSettings.PREFER_SAME_TYPE || move.type === movesMap[moveTutorMove.moveId].type) {
            if (matchesForcedGoodMovesConditions(move, index)) {
              primaryChoices.push(move)
            } else {
              secondaryChoices.push(move)
            }
          } else if (matchesForcedGoodMovesConditions(move, index)) {
            secondaryChoices.push(move)
          } else {
            tertiaryChoices.push(move)
          }
        })
        
        const chosenMove = primaryChoices[randomInt(0, primaryChoices.length - 1)]
          ?? secondaryChoices[randomInt(0, secondaryChoices.length - 1)]
          ?? tertiaryChoices[randomInt(0, tertiaryChoices.length - 1)]
    
        if (isNullish(chosenMove)) {
          throw new Error("Unable to satisfy settings for randomized move tutor moves. Possible reason: too many banned moves. You could try again with a different seed, but different settings might be required.")
        }
        moveTutorMove.moveId = choices[randomInt(0, choices.length - 1)].id
        
        if (moveTutorSettings.UNIQUE) {
          nonBannedMoves = nonBannedMoves.filter((move) => {
            return move.id !== moveTutorMove.moveId
          })
        }
      })
    }
    
    const hex = hexStringFrom(Object.values(updatedTeachableMovesDataMap).map((move) => {
      return movesMap[move.moveId].numericId
    }))
    
    const teachableMovesPatch = Patch.fromYAML(
      romInfo,
      "teachableMoves.yml",
      {},
      {
        teachableMoves: hex,
        moveTutorMoveId1: hexStringFrom([movesMap[updatedTeachableMovesDataMap.MOVE_TUTOR_1.moveId].numericId]),
        moveTutorMoveId2: hexStringFrom([movesMap[updatedTeachableMovesDataMap.MOVE_TUTOR_2.moveId].numericId]),
        moveTutorMoveId3: hexStringFrom([movesMap[updatedTeachableMovesDataMap.MOVE_TUTOR_3.moveId].numericId]),
        moveTutorMoveName1: hexStringFrom(ROMInfo.displayCharacterBytesFrom(movesMap[updatedTeachableMovesDataMap.MOVE_TUTOR_1.moveId].name.toUpperCase())),
        moveTutorMoveName2: hexStringFrom(ROMInfo.displayCharacterBytesFrom(movesMap[updatedTeachableMovesDataMap.MOVE_TUTOR_2.moveId].name.toUpperCase())),
        moveTutorMoveName3: hexStringFrom(ROMInfo.displayCharacterBytesFrom(movesMap[updatedTeachableMovesDataMap.MOVE_TUTOR_3.moveId].name.toUpperCase())),
      }
    )
      
    hunks = [...hunks, ...teachableMovesPatch.hunks]
  }
  
  // Items
  
  const itemsSettings = settings.ITEMS
  
  // Starting Inventory
  
  const startingInventorySettings = itemsSettings.STARTING_INVENTORY
  
  let hasStartingInventory = false
  let pokedexPartsValue = 0
  let pokegearPartsValue = 0
  let johtoBadgesValue = 0
  let kantoBadgesValue = 0
  const bagItemValues: {itemId: string, itemAmount: string}[] = []
    
  Object.values(itemCategoriesMap).forEach((category) => {
    const itemCategorySettings = startingInventorySettings[category.id]
    
    const itemAmountMap = itemCategorySettings.reduce((result: Partial<Record<ItemId, number>>, setting) => {
      let mappedSetting: Partial<Record<ItemId, number>>
      
      if (isString(setting)) {
        mappedSetting = {
          [setting]: 1,
        }
      } else {
        mappedSetting = Object.entries(setting).reduce((result, [itemId, settings]) => {
          return {
            ...result,
            [itemId]: settings.AMOUNT,
          }
        }, {})
      }
      
      return {
        ...result,
        ...mappedSetting,
      }
    }, {})
    
    Object.entries(itemAmountMap).forEach(([itemId, amount]) => {
      hasStartingInventory = true
      
      const item = itemsMap[itemId as ItemId]
          
      switch (item.type) {
      case "POKEDEX_PART": {
        pokedexPartsValue |= item.numericId
        break
      }
      case "POKEGEAR_PART": {
        pokegearPartsValue |= item.numericId
        break
      }
      case "JOHTO_BADGE": {
        johtoBadgesValue |= item.numericId
        break
      }
      case "KANTO_BADGE": {
        kantoBadgesValue |= item.numericId
        break
      }
      case "BAG_ITEM": {
        bagItemValues.push({
          itemId: hexStringFrom(bytesFrom(item.numericId, 1)),
          itemAmount: `[2]{${amount}}`,
        })
        break
      }
      }
    })
  })
  
  if (hasStartingInventory) {
    const startingItemsPatch = Patch.fromYAML(
      romInfo,
      "startingItems.yml",
      {
        items: bagItemValues.map((value) => {
          return {
            path: "giveItem.yml",
            extraIncludes: {},
            extraValues: value,
          }
        }),
      },
      {
        pokedexParts: hexStringFrom(bytesFrom(pokedexPartsValue, 1)),
        pokegearParts: hexStringFrom(bytesFrom(pokegearPartsValue, 1)),
        johtoBadges: hexStringFrom(bytesFrom(johtoBadgesValue, 1)),
        kantoBadges: hexStringFrom(bytesFrom(kantoBadgesValue, 1)),
      }
    )
  
    hunks = [...hunks, ...startingItemsPatch.hunks]
  }
  
  if (itemsSettings.POKE_BALLS_NEVER_FAIL) {
    const pokeBallsNeverFailPatch = Patch.fromYAML(
      romInfo,
      "pokeBallsNeverFail.yml",
    )
  
    hunks = [...hunks, ...pokeBallsNeverFailPatch.hunks]
  }
  
  if (itemsSettings.PREVENT_FAILED_POKE_BALL_WOBBLES) {
    const preventFailedPokeBallWobblesPatch = Patch.fromYAML(
      romInfo,
      "preventFailedPokeBallWobbles.yml",
    )
  
    hunks = [...hunks, ...preventFailedPokeBallWobblesPatch.hunks]
  }
  
  if (itemsSettings.RODS_ALWAYS_WORK) {
    const rodsAlwaysWorkPatch = Patch.fromYAML(
      romInfo,
      "rodsAlwaysWork.yml",
    )
  
    hunks = [...hunks, ...rodsAlwaysWorkPatch.hunks]
  }
  
  // Trainers
  
  const trainerSettings = settings.TRAINERS
  
  if (trainerSettings.RANDOMIZE_POKEMON) {
    const randomTeamsSettings = trainerSettings.RANDOMIZE_POKEMON
    
    updatedTrainers.forEach((trainer) => {
      const typeFilter = randomTeamsSettings.THEMED_TEAMS ? pokemonTypeIds[randomInt(0, pokemonTypeIds.length - 1)] : undefined
      const nonBannedAndTypeFilteredPokemon = (Object.values(pokemonMap) as Pokemon[]).filter((pokemon) => {
        return !randomTeamsSettings.BAN.includes(pokemon.id) && (isNullish(typeFilter) || pokemon.types.includes(typeFilter))
      })
      
      trainer.pokemon.forEach((pokemon, index) => {
        const availablePokemon = randomTeamsSettings.FORCE_FULLY_EVOLVED && pokemon.level >= randomTeamsSettings.FORCE_FULLY_EVOLVED.THRESHOLD ? nonBannedAndTypeFilteredPokemon.filter((pokemon) => {
          return isNullish(pokemon.evolutions)
        }) : nonBannedAndTypeFilteredPokemon
        
        if (trainerGroupsMap[trainer.groupId].classId !== "RIVAL" || !pokemonSettings.STARTERS.RIVAL_SYNC || index !== trainer.pokemon.length - 1) {
          pokemon.id = availablePokemon[randomInt(0, availablePokemon.length - 1)].id
        }
        
        pokemon.moves = []
      })
    })
  }
  
  const trainersPatch = Patch.fromYAML(
    romInfo,
    "trainers.yml",
    {
      trainerGroups: trainerGroupIds.map((groupId) => {
        return {
          path: "trainerGroup.yml",
          extraIncludes: {
            trainers: updatedTrainers.filter((trainer) => {
              return trainer.groupId === groupId
            }).map((trainer) => {
              const hasItems = trainer.pokemon.reduce((result, pokemon) => {
                return result || isNotNullish(pokemon.itemId)
              }, false)
              
              const hasMoves = trainer.pokemon.reduce((result, pokemon) => {
                return result || pokemon.moves.length > 0
              }, false)
              
              let trainerType = 0
              
              if (hasItems && hasMoves) {
                trainerType = 3
              } else if (hasMoves) {
                trainerType = 2
              } else if (hasItems) {
                trainerType = 1
              }
              
              return {
                path: "trainerNameAndPokemon.yml",
                extraIncludes: {},
                extraValues: {
                  name: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${trainer.name}@`)),
                  trainerType: hexStringFrom([trainerType]),
                  pokemon: hexStringFrom(compact(trainer.pokemon.flatMap((pokemon) => {
                    return [
                      pokemon.level,
                      pokemonMap[pokemon.id].numericId,
                      hasItems ? isNotNullish(pokemon.itemId) ? itemsMap[pokemon.itemId].numericId : 0 : null,
                      hasMoves ? [...pokemon.moves.map((moveId) => {
                        return movesMap[moveId].numericId
                      }), ...Array(4 - pokemon.moves.length).fill(0)] : null,
                    ].flat()
                  }))),
                },
              }
            }),
          },
          extraValues: {},
        }
      }),
    }
  )
  
  hunks = [...hunks, ...trainersPatch.hunks]
  
  if (trainerSettings.MOVEMENT) {
    const movementSettings = trainerSettings.MOVEMENT
    const behaviour = trainerMovementBehavioursMap[movementSettings.BEHAVIOR]
    
    const updatedMapObjectEvents = JSON.parse(JSON.stringify(mapObjectEvents)) as [MapObjectEvent]
    updatedMapObjectEvents.forEach((event) => {
      if (
        event.typeId === "TRAINER"
          && (
            movementSettings.INCLUDE_STAIONARY
              || event.movementBehaviourId === "SPINCLOCKWISE"
              || event.movementBehaviourId === "SPINCOUNTERCLOCKWISE"
              || event.movementBehaviourId === "SPINRANDOM_SLOW"
              || event.movementBehaviourId === "SPINRANDOM_FAST"
          )
      ) {
        event.movementBehaviourId = behaviour.overworldMovementBehaviourId
      }
    })
    
    updatedMapObjectEvents.forEach((event) => {
      let timeArray = [-1, -1]
      
      if (event.time === "MORNING") {
        timeArray[1] = 1
      } else if (event.time === "DAY") {
        timeArray[1] = 2
      } else if (event.time === "NIGHT") {
        timeArray[1] = 4
      } else if (event.time !== "ANY") {
        timeArray = event.time
      }
      
      hunks = [
        ...hunks,
        new DataHunk(
          ROMOffset.fromBankAddress(event.romOffset[0], event.romOffset[1]),
          [
            overworldSpritesMap[event.spriteId].numericId,
            event.coordinate[1] + 4,
            event.coordinate[0] + 4,
            overworldMovementBehavioursMap[event.movementBehaviourId].numericId,
            event.movementRadius[0] + (event.movementRadius[1] << 4),
            ...timeArray,
            ((isNotNullish(event.palletId) ? overworldSpritePalletsMap[event.palletId].numericId : 0) << 4) + mapObjectTypesMap[event.typeId].numericId,
            event.sightRange,
            ...bytesFrom(event.scriptPointer, 2),
            ...isNotNullish(event.flagId) ? bytesFrom(eventFlagsMap[event.flagId].numericId, 2) : [-1],
          ]
        ),
      ]
    })
    
    const trainerMovementSpeedPatch = Patch.fromYAML(
      romInfo,
      "trainerMovementSpeed.yml",
      {},
      {
        fastSpinDurationMask: hexStringFrom([behaviour.fastSpinDurationMask]),
      }
    )
  
    hunks = [...hunks, ...trainerMovementSpeedPatch.hunks]
  }
  
  // Other
  
  const otherSettings = settings.OTHER
  
  // Skip Gender
  
  if (otherSettings.SKIP_GENDER) {
    const genderId = playerSpriteMap[otherSettings.SKIP_GENDER.PLAYER_SPRITE].numericId
    const skipGenderPatch = Patch.fromYAML(
      romInfo,
      "skipGender.yml",
      {},
      {
        genderId: hexStringFrom(bytesFrom(genderId, 1)),
      }
    )
  
    hunks = [...hunks, ...skipGenderPatch.hunks]
  }
  
  // Skip Name
  
  if (otherSettings.SKIP_NAME) {
    const nameBytes = ROMInfo.displayCharacterBytesFrom(otherSettings.SKIP_NAME.PLAYER_NAME)
    const skipNamePatch = Patch.fromYAML(
      romInfo,
      "skipName.yml",
      {},
      {
        name: hexStringFrom(nameBytes),
      }
    )
  
    hunks = [...hunks, ...skipNamePatch.hunks]
  }
  
  // Bike Anywhere
  
  if (otherSettings.BIKE_ANYWHERE) {
    const bikeAnywherePatch = Patch.fromYAML(
      romInfo,
      "bikeAnywhere.yml",
    )
  
    hunks = [...hunks, ...bikeAnywherePatch.hunks]
  }
  
  // Scale Experience
  
  if (otherSettings.SCALE_EXPERIENCE) {
    const scaleExperiencePatch = Patch.fromYAML(
      romInfo,
      "scaleExperience.yml",
    )
  
    hunks = [...hunks, ...scaleExperiencePatch.hunks]
  }
  
  // Performance Improvements
  
  if (otherSettings.IMPROVE_PERFORMANCE) {
    const performanceImprovementsPatch = Patch.fromYAML(
      romInfo,
      "performanceImprovements.yml",
    )
  
    hunks = [...hunks, ...performanceImprovementsPatch.hunks]
  }
  
  // Additional Options
  
  const selectedAdditionalOptionIds = otherSettings.ADDITIONAL_OPTIONS
  
  if (selectedAdditionalOptionIds.length > 0) {
    const additionalOptionsPatch = Patch.fromYAML(
      romInfo,
      "additionalOptions.yml",
      {
        options: compact([
          selectedAdditionalOptionIds.includes("INSTANT_TEXT") ? "options/textSpeedWithInstantText.yml" : "options/textSpeed.yml",
          selectedAdditionalOptionIds.includes("HOLD_TO_MASH") ? "options/holdToMash.yml" : null,
          "options/battleScene.yml",
          "options/battleShift.yml",
          selectedAdditionalOptionIds.includes("NICKNAMES") ? "options/nicknames.yml" : null,
          "options/stereoSound.yml",
          selectedAdditionalOptionIds.includes("RIDE_MUSIC") ? "options/rideMusic.yml" : null,
          "options/menuAccount.yml",
          "options/printTone.yml",
          "options/frameType.yml",
        ]),
      },
    )
    
    hunks = [...hunks, ...additionalOptionsPatch.hunks]
  }
  
  // Base Patch
  
  const checkValue = hunks.length > 0 ? hash(hunks).slice(0, 8).toUpperCase() : "00000000"
  
  const basePatch = Patch.fromYAML(
    romInfo,
    "randomizerBase.yml",
    {},
    {
      versionNumber: hexStringFrom(ROMInfo.displayCharacterBytesFrom(app.getVersion())),
      checkValue: hexStringFrom(ROMInfo.displayCharacterBytesFrom(checkValue)),
    },
  )
      
  hunks = [...hunks, ...basePatch.hunks]
  
  hunks.forEach((hunk) => {
    data.set(hunk.values, hunk.offset.bank() * ROMInfo.bankSize + (hunk.offset.bankAddress() - (hunk.offset.bank() === 0 ? 0 : ROMInfo.bankSize)))
  })
  
  return {
    seed: "",
    data: data,
  }
}