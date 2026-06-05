import { defaultSettingsViewModel } from "@shared/appData/defaultSettingsViewModel"
import { type PlayerOptions, type Settings, settingsFromViewModel } from "@shared/appData/settingsFromViewModel"
import type { ApplyPlayerOptionsParams, GenerateParams, GenerateResult } from "@shared/appData/workerTypes"
import { eventFlagsMap } from "@shared/gameData/eventFlags"
import { gen5BaseExpMap } from "@shared/gameData/gen5BaseExp"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { movesMap } from "@shared/gameData/moves"
import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { pokemonMap } from "@shared/gameData/pokemon"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import { tradesMap } from "@shared/gameData/trades"
import { trainerClassesMap } from "@shared/gameData/trainerClasses"
import { trainerMovementBehavioursMap } from "@shared/gameData/trainerMovementBehaviours"
import { trainers } from "@shared/gameData/trainers"
import { unownLetters } from "@shared/gameData/unownLetters"
import type { DataHunk } from "@shared/romUtils/dataHunk"
import { bankAddressOfROMOffset, bankOfROMOffset, defaultROMInfo, markROMBytesAsUnused, romBankSize, type ROMInfo, romOffsetFromBankAddress } from "@shared/romUtils/romInfo"
import type { PlayerSpecificGameData } from "@shared/types/gameData/gameData"
import { itemHoldEffectsMap, itemMenuActionsMap } from "@shared/types/gameData/item"
import type { EventFlagId } from "@shared/types/gameDataIds/eventFlags"
import { type EventPokemonId } from "@shared/types/gameDataIds/eventPokemon"
import { type ItemId } from "@shared/types/gameDataIds/items"
import { type MartId, martIds, type SpecialShopId } from "@shared/types/gameDataIds/marts"
import { starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import type { TeachableMoveId } from "@shared/types/gameDataIds/teachableMoves"
import { trainerClassIds } from "@shared/types/gameDataIds/trainerClasses"
import { bytesFromTextData, bytesFromTextScript } from "@shared/utils/textConverters"
import { bytesFrom, compact, hexStringFrom, isNotNullish, isNullish } from "@utils"
import { bytesFromLandAndWaterEncounterRates } from "@worker/dataConverters/encounterRates"
import { bytesFromContestEncounters, bytesFromFishingEncounters, bytesFromLandAndWaterEncounters, bytesFromTreeAndRockEncounters, encountersGroupedByType } from "@worker/dataConverters/encounters"
import { dataHunkFromMapObjectEvent } from "@worker/dataConverters/mapObjectEvent"
import { bytesFromOddEgg } from "@worker/dataConverters/oddEgg"
import { frameTypeValue, primaryOptionsValue, printToneValue, secondaryOptionsValue } from "@worker/dataConverters/options"
import { bytesForEvolutionsAndLevelUpMovesFromPokemon, bytesForInfoFromPokemon } from "@worker/dataConverters/pokemon"
import { bytesFromTrade } from "@worker/dataConverters/trades"
import { updateEncounterRates } from "@worker/gameDataProcessors/encounterRates"
import { updateRandomEncounters } from "@worker/gameDataProcessors/encounters"
import { updateEventPokemon, updateEventPokemonMoves } from "@worker/gameDataProcessors/eventPokemon"
import { updateEvolutionMethods } from "@worker/gameDataProcessors/evolutionMethods"
import { updateIntroPokemon } from "@worker/gameDataProcessors/introPokemon"
import { shuffleItems, updateAccessLogic, updateItems } from "@worker/gameDataProcessors/itemLocations"
import { updateLevelUpMoves } from "@worker/gameDataProcessors/levelUpMoves"
import { updateMapObjectEvents } from "@worker/gameDataProcessors/mapObjectEvents"
import { updateMarts } from "@worker/gameDataProcessors/marts"
import { updateMoveTutorCost } from "@worker/gameDataProcessors/moveTutorCost"
import { updateNumberOfBadgesForOak } from "@worker/gameDataProcessors/numberOfBadgesForOak"
import { updateNumberOfMiltankBerries } from "@worker/gameDataProcessors/numberOfMiltankBerries"
import { updatePokemonInfo } from "@worker/gameDataProcessors/pokemonInfo"
import { updatePokemonNicknames } from "@worker/gameDataProcessors/pokemonNicknames"
import { updatePrices } from "@worker/gameDataProcessors/prices"
import { updateShowAndTellPokemon } from "@worker/gameDataProcessors/showAndTellPokemon"
import { updateStarterItems, updateStarters } from "@worker/gameDataProcessors/starters"
import { updateTeachableMoves } from "@worker/gameDataProcessors/teachableMoves"
import { updateTrades } from "@worker/gameDataProcessors/trades"
import { updateTrainerNames } from "@worker/gameDataProcessors/trainerNames"
import { updateTrainers } from "@worker/gameDataProcessors/trainers"
import { updateUnownSets } from "@worker/gameDataProcessors/unownSets"
import { generatorLog, playerSpecificLog } from "@worker/log"
import { Patch } from "@worker/patch"
import { Random } from "@worker/random"
import crypto from "crypto"
import { compressToUint8Array } from "lz-string"
import hash from "object-hash"
import yaml from "yaml"
import { crc32 } from "zlib"

export const generate = (params: GenerateParams) => {
  const seed = params.seed ?? crypto.randomUUID()
  const random = new Random(seed)
  const settingsString = JSON.stringify(params.settings)
  const isDefaultSettings = settingsString === JSON.stringify(settingsFromViewModel(defaultSettingsViewModel()))
  const romInfo = defaultROMInfo()
  
  const result: GenerateResult = {
    checkValue: isDefaultSettings ? "00000000" : hash(`${params.appVersion}${seed}${settingsString}`).slice(0, 8).toUpperCase(),
  }
  
  if (!isDefaultSettings) {
    updateGameData(params.settings, romInfo, random)
  }
  
  if (params.shouldCreateROM || params.shouldCreatePatch) {
    if (!isDefaultSettings) {
      createPatches(params.settings, romInfo)
    }
    
    createBasePatch({
      appVersion: params.appVersion,
      checkValue: result.checkValue,
      romInfo: romInfo,
    })
    
    const sharedOutputROM = Buffer.from(params.inputROM)
    applyDataHunks(sharedOutputROM, romInfo.patchHunks)
    
    result.rom = Buffer.from(sharedOutputROM)
    result.namesLog = applyPlayerOptions({
      seed: seed,
      settings: params.settings,
      playerOptions: params.playerOptions,
      rom: result.rom,
    })
    
    if (params.shouldCreatePatch) {
      result.patch = createPCRP({
        appVersion: params.appVersion,
        checkValue: result.checkValue,
        settings: params.settings,
        inputROMData: params.inputROM,
        sharedOutputROMData: sharedOutputROM,
      })
    }
  }
  
  if (params.shouldCreateLog) {
    result.log = generatorLog({
      appVersion: params.appVersion,
      seed: seed,
      checkValue: result.checkValue,
      settings: params.settings,
      gameData: romInfo.gameData,
    })
  }
  
  return result
}

export const applyPlayerOptions = (params: ApplyPlayerOptionsParams) => {
  const {
    seed,
    settings,
    playerOptions,
    rom,
  } = params
  
  const random = new Random(seed)
  
  const gameData = {
    trainerClasses: JSON.parse(JSON.stringify(trainerClassesMap)) as typeof trainerClassesMap,
    trainers: JSON.parse(JSON.stringify(trainers)) as typeof trainers,
    trades: JSON.parse(JSON.stringify(tradesMap)) as typeof tradesMap,
    kenyaNickname: "KENYA",
    shuckieNickname: "SHUCKIE",
  }
  
  updateTrainerNames(playerOptions, gameData, random)
  updatePokemonNicknames(playerOptions, gameData, random)
  
  const hunks = createPlayerOptionsPatches({
    settings: settings,
    playerOptions: playerOptions,
    romData: rom,
    gameData: gameData,
  })
  
  applyDataHunks(rom, hunks)
  
  if (playerOptions.CHANGE_NAMES.VALUE && playerOptions.CHANGE_NAMES.SETTINGS.CREATE_LOG) {
    return playerSpecificLog(gameData)
  } else {
    return undefined
  }
}

const applyDataHunks = (rom: Uint8Array, hunks: DataHunk[]) => {
  hunks.forEach((hunk) => {
    rom.set(hunk.values, bankOfROMOffset(hunk.offset) * romBankSize + (bankAddressOfROMOffset(hunk.offset) - (bankOfROMOffset(hunk.offset) === 0 ? 0 : romBankSize)))
  })
}

const updateGameData = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  updateIntroPokemon(settings, romInfo, random)
  updateStarters(settings, romInfo, random)
  updateStarterItems(settings, romInfo, random)
  updateEventPokemon(settings, romInfo, random)
  updateRandomEncounters(settings, romInfo, random)
  updateUnownSets(settings, romInfo, random)
  updateShowAndTellPokemon(settings, romInfo, random) // Must be after updateEventPokemon
  updateEncounterRates(settings, romInfo)
  updateTrades(settings, romInfo, random)
  updateEvolutionMethods(settings, romInfo)
  updateLevelUpMoves(settings, romInfo, random)
  updateEventPokemonMoves(settings, romInfo) // Must be after updateEventPokemon and updateLevelUpMoves
  updateTeachableMoves(settings, romInfo, random)
  updatePokemonInfo(settings, romInfo, random)
  updateMarts(settings, romInfo)
  updateMoveTutorCost(settings, romInfo, random)
  updateNumberOfMiltankBerries(settings, romInfo, random) // Must be before updateAccessLogic
  updateTrainers(settings, romInfo, random)
  updateMapObjectEvents(settings, romInfo)
  updateItems(settings, romInfo, random)
  updateNumberOfBadgesForOak(settings, romInfo, random) // Must be before updateAccessLogic
  updateAccessLogic(settings, romInfo) // Must be after updateShowAndTellPokemon
  shuffleItems(settings, romInfo, random) // Must be after updateItems, updateMarts and updateAccessLogic
  updatePrices(settings, romInfo, random) // Must be after updateMarts, updateItems, and shuffleItems
}

const createPatches = (
  settings: Settings,
  romInfo: ROMInfo,
) => {
  // Intro Pokemon
  
  if (isNotNullish(romInfo.gameData.introPokemonInfo)) {
    const numericId = pokemonMap[romInfo.gameData.introPokemonInfo.pokemonId].numericId
    
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      {
        offset: romOffsetFromBankAddress(1, 0x5FD2),
        values: [numericId],
      },
      {
        offset: romOffsetFromBankAddress(1, 0x6050),
        values: [numericId],
      },
    ]
    
    if (romInfo.gameData.introPokemonInfo.pokemonId === "UNOWN") {
      romInfo.patchHunks = [
        ...romInfo.patchHunks,
        ...Patch.fromYAML(
          romInfo,
          "unownInIntro.yml",
          {},
          {
            unownLetter: hexStringFrom([romInfo.gameData.introPokemonInfo.unownId]),
          },
        ).hunks,
      ]
    }
  }
  
  // Starter Pokemon
  
  Object.entries(romInfo.gameData.starters).forEach(([locationId, pokemonId]) => {
    if (isNullish(pokemonId)) {
      return
    }
      
    const pokemon = pokemonMap[pokemonId]
      
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        `starters/${locationId.toLowerCase()}.yml`,
        {},
        {
          pokemonId: hexStringFrom(bytesFrom(pokemon.numericId, 1)),
          pokemonName: hexStringFrom(bytesFromTextData(pokemon.name.toUpperCase())),
        },
      ).hunks,
    ]
  })
  
  starterLocationIds.forEach((locationId) => {
    const itemId = romInfo.gameData.starterItems[locationId]
    
    if (isNullish(itemId)) {
      return
    }
      
    const item = romInfo.gameData.items[itemId]
      
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      {
        offset: romOffsetFromBankAddress(
          starterLocationsMap[locationId].itemRomOffset[0],
          starterLocationsMap[locationId].itemRomOffset[1],
        ),
        values: [item.numericId],
      },
    ]
  })
  
  // Event Pokémon
  
  const eventPokemonFromId = (eventPokemonId: EventPokemonId) => {
    return pokemonMap[romInfo.gameData.eventPokemon[eventPokemonId]]
  }
  
  const hexStringFromEventPokemonId = (eventPokemonId: EventPokemonId) => {
    return hexStringFrom([eventPokemonFromId(eventPokemonId).numericId])
  }
  
  const nameStringFromEventPokemonId = (eventPokemonId: EventPokemonId) => {
    return eventPokemonFromId(eventPokemonId).name.toUpperCase()
  }
  
  const eventPokemonPatch = Patch.fromYAML(
    romInfo,
    "eventPokemon.yml",
    {},
    {
      rattataPokemonId: hexStringFromEventPokemonId("RATTATA"),
      sudowoodoPokemonId: hexStringFromEventPokemonId("SUDOWOODO"),
      raikouPokemonId: hexStringFromEventPokemonId("RAIKOU"),
      enteiPokemonId: hexStringFromEventPokemonId("ENTEI"),
      suicunePokemonId: hexStringFromEventPokemonId("SUICUNE"),
      gyaradosPokemonId: hexStringFromEventPokemonId("GYARADOS"),
      voltorbPokemonId: hexStringFromEventPokemonId("VOLTORB"),
      geodudePokemonId: hexStringFromEventPokemonId("GEODUDE"),
      koffingPokemonId: hexStringFromEventPokemonId("KOFFING"),
      electrode1PokemonId: hexStringFromEventPokemonId("ELECTRODE1"),
      electrode2PokemonId: hexStringFromEventPokemonId("ELECTRODE2"),
      electrode3PokemonId: hexStringFromEventPokemonId("ELECTRODE3"),
      laprasPokemonId: hexStringFromEventPokemonId("LAPRAS"),
      snorlaxPokemonId: hexStringFromEventPokemonId("SNORLAX"),
      hoOhPokemonId: hexStringFromEventPokemonId("HO_OH"),
      lugiaPokemonId: hexStringFromEventPokemonId("LUGIA"),
      celebiPokemonId: hexStringFromEventPokemonId("CELEBI"),
      togepiPokemonId: hexStringFromEventPokemonId("TOGEPI"),
      spearowPokemonId: hexStringFromEventPokemonId("SPEAROW"),
      shucklePokemonId: hexStringFromEventPokemonId("SHUCKLE"),
      eeveePokemonId: hexStringFromEventPokemonId("EEVEE"),
      eeveePokemonNameText1: hexStringFrom(bytesFromTextData(`${nameStringFromEventPokemonId("EEVEE")}.`.padEnd(11, " "))),
      eeveePokemonNameText2: hexStringFrom(bytesFromTextData(`${nameStringFromEventPokemonId("EEVEE")}`.padEnd(10, " "))),
      dratiniPokemonId: hexStringFromEventPokemonId("DRATINI"),
      dratiniPokemonNameText1: hexStringFrom(bytesFromTextData(`${nameStringFromEventPokemonId("DRATINI")}`.padEnd(12, " "))),
      dratiniPokemonNameText2: hexStringFrom(bytesFromTextData(`${nameStringFromEventPokemonId("DRATINI")}`.padEnd(10, " "))),
      tyroguePokemonId: hexStringFromEventPokemonId("TYROGUE"),
      tyroguePokemonNameText: hexStringFrom(bytesFromTextData(`${nameStringFromEventPokemonId("TYROGUE")}`.padEnd(10, " "))),
      abraPokemonId: hexStringFromEventPokemonId("ABRA"),
      cubonePokemonId: hexStringFromEventPokemonId("CUBONE"),
      wobbuffetPokemonId: hexStringFromEventPokemonId("WOBBUFFET"),
      goldenrodGameCornerPokemonMenuText: hexStringFrom(bytesFromTextData(`${nameStringFromEventPokemonId("ABRA").padEnd(10, " ")}  100@${nameStringFromEventPokemonId("CUBONE").padEnd(10, " ")}  800@${nameStringFromEventPokemonId("WOBBUFFET").padEnd(10, " ")} 1500@`)),
      pikachuPokemonId: hexStringFromEventPokemonId("PIKACHU"),
      porygonPokemonId: hexStringFromEventPokemonId("PORYGON"),
      larvitarPokemonId: hexStringFromEventPokemonId("LARVITAR"),
      celadonGameCornerPokemonMenuText: hexStringFrom(bytesFromTextData(`${nameStringFromEventPokemonId("PIKACHU").padEnd(10, " ")} 2222@${nameStringFromEventPokemonId("PORYGON").padEnd(10, " ")} 5555@${nameStringFromEventPokemonId("LARVITAR").padEnd(10, " ")} 8888@`)),
      dratiniMoves: hexStringFrom(Object.values(romInfo.gameData.dratiniMoves).flatMap((moveList) => {
        return [
          ...moveList.map((moveId) => {
            return movesMap[moveId].numericId
          }),
          0,
        ]
      })),
    },
  )
  
  romInfo.patchHunks = [...romInfo.patchHunks, ...eventPokemonPatch.hunks]
  
  if (settings.RANDOM_SHINY_ENCOUNTER_ATTACK_STAT) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "randomShinyAttackDV.yml",
      ).hunks,
    ]
  }
  
  if (settings.RANDOMIZE_EVENT_POKEMON.VALUE || settings.RANDOMIZE_RANDOM_ENCOUNTERS.VALUE) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "unownsInWildBattles.yml",
      ).hunks,
    ]
  }
    
  // Eggs
    
  if (settings.FAST_BREEDING) {
    const fastBreedingPatch = Patch.fromYAML(
      romInfo,
      "fastBreeding.yml",
    )
      
    romInfo.patchHunks = [...romInfo.patchHunks, ...fastBreedingPatch.hunks]
  }
    
  if (settings.FAST_HATCHING) {
    const fastHatchingPatch = Patch.fromYAML(
      romInfo,
      "fastHatching.yml",
    )
      
    romInfo.patchHunks = [...romInfo.patchHunks, ...fastHatchingPatch.hunks]
  }
    
  if (settings.RANDOMIZE_EVENT_POKEMON.VALUE || settings.FAST_HATCHING) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      {
        offset: romOffsetFromBankAddress(126, 0x756E),
        values: romInfo.gameData.oddEggs.flatMap((oddEgg) => {
          return bytesFromOddEgg(oddEgg)
        }),
      },
    ]
  }
    
  // Encounter Rates
    
  if (settings.CHANGE_POKEMON_ENCOUNTER_RATIOS.VALUE) {
    const encounterRateSettings = settings.CHANGE_POKEMON_ENCOUNTER_RATIOS.SETTINGS
      
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      {
        offset: romOffsetFromBankAddress(10, 0x61CB),
        values: bytesFromLandAndWaterEncounterRates(
          encounterRateSettings.GRASS_AND_CAVES,
          encounterRateSettings.WATER,
        ),
      },
    ]
  }
    
  // Encounters
    
  const groupedEncounters = encountersGroupedByType(romInfo.gameData.encounters)
    
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    {
      offset: romOffsetFromBankAddress(10, 0x65E9),
      values: bytesFromLandAndWaterEncounters(groupedEncounters.landAndWaterEncounters),
    },
  ]
    
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    {
      offset: romOffsetFromBankAddress(46, 0x42FA),
      values: bytesFromTreeAndRockEncounters(groupedEncounters.treeEncounters, groupedEncounters.rockEnounters),
    },
  ]
    
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    {
      offset: romOffsetFromBankAddress(36, 0x64E3),
      values: bytesFromFishingEncounters(groupedEncounters.fishingEncounters, groupedEncounters.fishingTimeGroupEncounters),
    },
  ]
    
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    {
      offset: romOffsetFromBankAddress(37, 0x7D87),
      values: bytesFromContestEncounters(groupedEncounters.contestEncounters),
    },
  ]
  
  if (settings.PREVENT_WILD_POKEMON_FLEEING) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      { offset: romOffsetFromBankAddress(15, 0x459A), values: [0xFF] },
      { offset: romOffsetFromBankAddress(15, 0x45A8), values: [0xFF] },
      { offset: romOffsetFromBankAddress(15, 0x45B1), values: [0xFF] },
    ]
  }
    
  // Trades
  
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    {
      offset: romOffsetFromBankAddress(63, 0x4E58),
      values: Object.values(romInfo.gameData.trades).flatMap((trade) => {
        return bytesFromTrade(trade)
      }),
    },
  ]
  
  // Evolutions
    
  if (settings.CHANGE_HAPPINESS_EVOLUTION_REQUIREMENT.VALUE) {
    romInfo.patchHunks = [...romInfo.patchHunks, { offset: romOffsetFromBankAddress(16, 0x6287), values: [settings.CHANGE_HAPPINESS_EVOLUTION_REQUIREMENT.SETTINGS.MINIMUM_HAPPINESS] }]
  }
    
  // Random Level Up Moves
    
  const pokemonEvolutionsAndAttacksPatch = Patch.fromYAML(
    romInfo,
    "pokemonEvolutionsAndLevelUpMovesTable.yml",
    {
      pokemon: Object.values(romInfo.gameData.pokemon).map((pokemon) => {
        return {
          path: "pokemonEvolutionsAndLevelUpMoves.yml",
          extraIncludes: {},
          extraValues: {
            data: hexStringFrom(bytesForEvolutionsAndLevelUpMovesFromPokemon(pokemon)),
          },
        }
      }),
    },
  )
  
  romInfo.patchHunks = [...romInfo.patchHunks, ...pokemonEvolutionsAndAttacksPatch.hunks]
    
  // Pokemon Info
      
  const pokemonInfoPatch = Patch.fromYAML(
    romInfo,
    "pokemonInfoTable.yml",
    {
      pokemon: Object.values(romInfo.gameData.pokemon).map((pokemon) => {
        return {
          path: "pokemonInfo.yml",
          extraIncludes: {},
          extraValues: {
            data: hexStringFrom(bytesForInfoFromPokemon(pokemon)),
          },
        }
      }),
    },
  )
      
  romInfo.patchHunks = [...romInfo.patchHunks, ...pokemonInfoPatch.hunks]
    
  // Teachable Moves
  
  if (settings.RANDOMIZE_TM_MOVES.VALUE || settings.RANDOMIZE_MOVE_TUTOR_MOVES.VALUE) {
    const hex = hexStringFrom(Object.values(romInfo.gameData.teachableMoves).map((move) => {
      return movesMap[move.moveId].numericId
    }))
    
    const updatedTeachableMove = (id: TeachableMoveId) => {
      return movesMap[romInfo.gameData.teachableMoves[id].moveId]
    }
    
    const teachableMovesPatch = Patch.fromYAML(
      romInfo,
      "teachableMoves.yml",
      {},
      {
        teachableMoves: hex,
        moveTutorMoveId1: hexStringFrom([updatedTeachableMove("MOVE_TUTOR_1").numericId]),
        moveTutorMoveId2: hexStringFrom([updatedTeachableMove("MOVE_TUTOR_2").numericId]),
        moveTutorMoveId3: hexStringFrom([updatedTeachableMove("MOVE_TUTOR_3").numericId]),
        moveTutorMoveName1: hexStringFrom(bytesFromTextData(updatedTeachableMove("MOVE_TUTOR_1").name.toUpperCase())),
        moveTutorMoveName2: hexStringFrom(bytesFromTextData(updatedTeachableMove("MOVE_TUTOR_2").name.toUpperCase())),
        moveTutorMoveName3: hexStringFrom(bytesFromTextData(updatedTeachableMove("MOVE_TUTOR_3").name.toUpperCase())),
        tm31Text: hexStringFrom(bytesFromTextScript(`\n${updatedTeachableMove("TM31").name.toUpperCase()}.\f`)),
        tm49Text: hexStringFrom(bytesFromTextScript(`\n${updatedTeachableMove("TM49").name.toUpperCase()}.\rIsn<'t> that great?\nI discovered it!\f`)),
        tm45Text: hexStringFrom(bytesFromTextScript(`\0TM45 is\n${updatedTeachableMove("TM45").name.toUpperCase()}!\rIsn<'t> it just per-\nfect for a cutie\tlike me?\f`)),
        tm30Text: hexStringFrom(bytesFromTextScript(`\0TM30 is\n${updatedTeachableMove("TM30").name.toUpperCase()}.\rUse it if it\nappeals to you.\f`)),
        tm01Text: hexStringFrom(bytesFromTextScript(`\0TM01 is\n${updatedTeachableMove("TM01").name.toUpperCase()}.\f`)),
        tm23Text: hexStringFrom(bytesFromTextScript(`\0…TM23 teaches\n${updatedTeachableMove("TM23").name.toUpperCase()}.\f`)),
        tm16Text: hexStringFrom(bytesFromTextScript(`\0TM16 contains\n${updatedTeachableMove("TM16").name.toUpperCase()}.\rIt demonstrates\nthe harshness of\twinter.\f`)),
        tm24Text: hexStringFrom(bytesFromTextScript(`\0TM24 contains\n${updatedTeachableMove("TM24").name.toUpperCase()}.\rIf you don't want\nit, you don<'t> have\tto take it.\f`)),
        tm19Text: hexStringFrom(bytesFromTextScript(`\rTM19 is\n${updatedTeachableMove("TM19").name.toUpperCase()}.\rPlease use it if\nit pleases you…\f`)),
        tm06Text: hexStringFrom(bytesFromTextScript(`\rTM06 is\n${updatedTeachableMove("TM06").name.toUpperCase()}.\f`)),
        tm03Text: hexStringFrom(bytesFromTextScript(`\0TM03 is\n${updatedTeachableMove("TM03").name.toUpperCase()}.\rIt<'s> a terrifying\nmove.\f`)),
        tm05Text: hexStringFrom(bytesFromTextScript(`\nTM05 is\n${updatedTeachableMove("TM05").name.toUpperCase()}!\f`)),
        tm07Text: hexStringFrom(bytesFromTextScript(`\nmy ${updatedTeachableMove("TM07").name.toUpperCase()}.\rIt<'s> a powerful\ntechnique!\f`)),
        tm08Text: hexStringFrom(bytesFromTextScript(`\0TM08 happens to be\n${updatedTeachableMove("TM08").name.toUpperCase()}.\rIf any rocks are\nin your way, just\tsmash 'em up\twith ROCK SMASH!\f`)),
        tm10Text: hexStringFrom(bytesFromTextScript(`\nTM10 is\t${updatedTeachableMove("TM10").name.toUpperCase()}!\f`)),
        tm11Text: hexStringFrom(bytesFromTextScript(`\0TM11 is\n${updatedTeachableMove("TM11").name.toUpperCase()}.\f`)),
        tm12Text: hexStringFrom(bytesFromTextScript(`\0TM12 is\n${updatedTeachableMove("TM12").name.toUpperCase()}.\f`)),
        tm13Text: hexStringFrom(bytesFromTextScript(`\0TM13 is\n${updatedTeachableMove("TM13").name.toUpperCase()}.\rIt<'s> a rare move.\f`)),
        tm29Text: hexStringFrom(bytesFromTextScript(`\0TM29 is\n${updatedTeachableMove("TM29").name.toUpperCase()}.\f`)),
        tm37Text: hexStringFrom(bytesFromTextScript(`\n${updatedTeachableMove("TM37").name.toUpperCase()}.\rIt<'s> for advanced\ntrainers only.\rUse it if you\ndare. Good luck!\f`)),
        tm42Text: hexStringFrom(bytesFromTextScript(`\n${updatedTeachableMove("TM42").name.toUpperCase()}…\r…Zzzz…\f`)),
        tm50Text: hexStringFrom(bytesFromTextScript(`\0TM50 is\n${updatedTeachableMove("TM50").name.toUpperCase()}.\rIt<'s> a wicked move.\rOoooh…\nThat<'s> scary…\rI don<'t> want to\nhave bad dreams.\f`)),
      },
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...teachableMovesPatch.hunks]
  }
  
  // Items
  
  const shouldApplyReceiveItemsChanges = settings.RANDOMIZE_REGULAR_ITEM_BALLS.VALUE
    || settings.RANDOMIZE_TM_ITEM_BALLS.VALUE
    || settings.RANDOMIZE_REGULAR_HIDDEN_ITEMS.VALUE
    || settings.SHUFFLE_ITEMS.VALUE
    || settings.START_WITH_ITEMS.SETTINGS.REPLACE_EXISTING_ITEMS.VALUE
    || settings.SKIP_KURT_FOR_ILEX_SHRINE
  
  if (shouldApplyReceiveItemsChanges) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "receiveItemChanges.yml",
        {},
        {
          regularItemPickupSound: settings.FASTER_ITEM_PICKUP_SFX ? "90 00" : "01 00",
          mapCardItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.CHERRYGROVE_CITY_GUIDE_GENTS_GIFT.itemId].numericId]),
          mysteryEggItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.MR_POKEMONS_HOUSE_MR_POKEMONS_FREE_GIFT.itemId].numericId]),
          pokedexItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.MR_POKEMONS_HOUSE_OAKS_GIFT.itemId].numericId]),
          potionItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.ELMS_LAB_AIDES_FREE_GIFT.itemId].numericId]),
          pokeBallsItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.ELMS_LAB_AIDES_GIFT_FOR_MYSTERY_EGG.itemId].numericId]),
          blueCardItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.RADIO_TOWER_2F_BUENAS_GIFT.itemId].numericId]),
          basementKeyItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT.itemId].numericId]),
          clearBellItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT.itemId].numericId]),
          rainbowWingItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.TIN_TOWER_1F_NORTH_SAGES_GIFT.itemId].numericId]),
          redScaleItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.LAKE_OF_RAGE_SURF_AREA_SHINYS_GIFT.itemId].numericId]),
          risingbadgeItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.DRAGON_SHRINE_BADGE.itemId].numericId]),
          whirlpoolItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT.itemId].numericId]),
          tm24ItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.DRAGONS_DEN_B1F_SOUTH_AREA_CLAIRS_GIFT.itemId].numericId]),
          unownDexItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.RUINS_OF_ALPH_OUTSIDE_MAIN_AREA_RESEARCHERS_GIFT.itemId].numericId]),
          pokegearItemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.PLAYERS_HOUSE_1F_MOMS_GIFT.itemId].numericId]),
          elmsAideNumberOfItems: hexStringFrom([Math.min(itemCategoriesMap[romInfo.gameData.items[romInfo.gameData.itemLocations.ELMS_LAB_AIDES_GIFT_FOR_MYSTERY_EGG.itemId].category].slotSize, 5)]),
          gotZephyrbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_ZEPHYRBADGE.numericId, 2)),
          gotHivebadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_HIVEBADGE.numericId, 2)),
          gotPlainbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_PLAINBADGE.numericId, 2)),
          gotFogbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_FOGBADGE.numericId, 2)),
          gotMineralbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_MINERALBADGE.numericId, 2)),
          gotStormbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_STORMBADGE.numericId, 2)),
          gotGlacierbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_GLACIERBADGE.numericId, 2)),
          gotRisingbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_RISINGBADGE.numericId, 2)),
          gotBoulderbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_BOULDERBADGE.numericId, 2)),
          gotCascadebadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_CASCADEBADGE.numericId, 2)),
          gotThunderbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_THUNDERBADGE.numericId, 2)),
          gotRainbowbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_RAINBOWBADGE.numericId, 2)),
          gotSoulbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_SOULBADGE.numericId, 2)),
          gotMarshbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_MARSHBADGE.numericId, 2)),
          gotVolcanobadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_VOLCANOBADGE.numericId, 2)),
          gotEarthbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_EARTHBADGE.numericId, 2)),
          gotRadioCardEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_RADIO_CARD.numericId, 2)),
          gotExpnCardEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_EXPN_CARD.numericId, 2)),
          directorInUndergroundWarehouseEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.DIRECTOR_IN_UNDERGROUND_WAREHOUSE.numericId, 2)),
          gotUnownDexEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_UNOWN_DEX.numericId, 2)),
          gotMapCardEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_MAP_CARD.numericId, 2)),
          gotPokedexEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_POKEDEX.numericId, 2)),
          gotMysteryEggEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_MYSTERY_EGG.numericId, 2)),
          elmsAideHasPotionEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.ELMS_AIDE_HAS_POTION.numericId, 2)),
          elmsAideHasPokeBallsEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.ELMS_AIDE_HAS_POKE_BALLS.numericId, 2)),
          gotBasementKeyEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_BASEMENT_KEY.numericId, 2)),
          gotCardKeyEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_CARD_KEY.numericId, 2)),
          beatRedGyaradosEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.BEAT_RED_GYARADOS.numericId, 2)),
          gotAzaleaGSBallEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_AZALEA_GS_BALL.numericId, 2)),
          gotPokegearEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_POKEGEAR.numericId, 2)),
        },
      ).hunks,
      {
        offset: romOffsetFromBankAddress(1, 0x67C1),
        values: Array(0xF9).fill(undefined).flatMap((_, index) => {
          const item = Object.values(romInfo.gameData.items).find((item) => {
            return item.numericId === index + 1
          })
        
          if (isNotNullish(item)) {
            return [
              ...bytesFrom(item.price, 2),
              itemHoldEffectsMap[item.holdEffectId],
              item.associatedValue,
              item.isRegisterable && item.isTossable ? 0b00000000
                : item.isRegisterable ? 0b10000000
                  : item.isTossable ? 0b01000000
                    : 0b11000000,
              item.category === "REGULAR_ITEMS" ? 1
                : item.category === "KEY_ITEMS" ? 2
                  : item.category === "BALLS" ? 3
                    : item.category === "TMS" || item.category === "HMS" ? 4
                      : item.type === "POKEDEX_PART" ? 5
                        : item.type === "POKEGEAR_PART" ? 6
                          : item.type === "JOHTO_BADGE" ? 7
                            : 8,
              itemMenuActionsMap[item.fieldMenuAction] << 4 | itemMenuActionsMap[item.battleMenuAction],
            ]
          } else {
            return Array(7).fill(0)
          }
        }),
      },
      {
        offset: romOffsetFromBankAddress(114, 0x4000),
        values: Array(0xF9).fill(undefined).flatMap((_, index) => {
          const item = Object.values(romInfo.gameData.items).find((item) => {
            return item.numericId === index + 1
          })
        
          if (isNotNullish(item)) {
            return bytesFromTextData(`${item.inGameName}@`)
          } else {
            return bytesFromTextData("@")
          }
        }),
      },
    ]
    
    // These hunks need to be added to the array after receiveItemChanges patch some things in here still overwrite some things from that patch
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Object.values(romInfo.gameData.itemLocations).filter((itemLocation) => {
        return itemLocation.type !== "FRUIT_TREE"
      }).flatMap((itemLocation) => {
        return itemLocation.romOffsets.map((romOffset) => {
          return {
            offset: romOffsetFromBankAddress(
              romOffset[0],
              romOffset[1],
            ),
            values: [romInfo.gameData.items[itemLocation.itemId].numericId],
          }
        })
      }),
    ]
    
    if (settings.SHUFFLE_ITEMS.SETTINGS.GROUPS.flat().includes("SHOPS")) {
      romInfo.patchHunks.push(...Patch.fromYAML(
        romInfo,
        "martsPreventDuplicateKeyItems.yml",
        {},
        {
          rooftopSaleMartIndex: hexStringFrom([martIds.length]),
          gotMartItemsEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_MART_ITEMS.numericId, 2)),
        },
      ).hunks)
    }
    
    if (settings.SKIP_KURT_FOR_ILEX_SHRINE) {
      romInfo.patchHunks.push(...Patch.fromYAML(
        romInfo,
        "earlyCelebiEvent.yml",
        {},
        {
          receivedGSBallEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.RECEIVED_GS_BALL.numericId, 2)),
        },
      ).hunks)
    }
  } else if (settings.FASTER_ITEM_PICKUP_SFX) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      { offset: romOffsetFromBankAddress(4, 0x62DC), values: [0x90, 0x00, 0x86, 0x18] },
      { offset: romOffsetFromBankAddress(37, 0x6FF5), values: [0x90] },
      { offset: romOffsetFromBankAddress(47, 0x4DBF), values: [0x90] },
    ]
  }
  
  if (settings.KEEP_GS_BALL_AFTER_CELEBI_EVENT) {
    romInfo.patchHunks.push({ offset: romOffsetFromBankAddress(27, 0x6E42), values: [0x18, 0x18, 0x18] })
  }
  
  if (settings.SINGLE_USE_FRUIT_TREES) {
    romInfo.patchHunks.push(...Object.values(romInfo.gameData.itemLocations).filter((itemLocation) => {
      return itemLocation.type === "FRUIT_TREE"
    }).flatMap((itemLocation) => {
      return itemLocation.romOffsets.map((romOffset) => {
        return {
          offset: romOffsetFromBankAddress(
            romOffset[0],
            romOffset[1],
          ),
          values: [romInfo.gameData.items[itemLocation.itemId].numericId, 1],
        }
      })
    }))
  } else if (shouldApplyReceiveItemsChanges) {
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(
          17,
          0x4097,
        ),
        values: Object.values(romInfo.gameData.itemLocations).filter((itemLocation) => {
          return itemLocation.type === "FRUIT_TREE"
        }).map((itemLocation) => {
          return romInfo.gameData.items[itemLocation.itemId].numericId
        }),
      },
      ...Object.values(romInfo.gameData.itemLocations).filter((itemLocation) => {
        return itemLocation.type === "FRUIT_TREE"
      }).flatMap((itemLocation, index) => {
        return itemLocation.romOffsets.map((romOffset) => {
          return {
            offset: romOffsetFromBankAddress(
              romOffset[0],
              romOffset[1] + 1,
            ),
            values: [index + 1],
          }
        })
      }),
    ])
  }
    
  // Starting Inventory
    
  if (settings.START_WITH_ITEMS.VALUE) {
    const startingInventorySettings = settings.START_WITH_ITEMS.SETTINGS
      
    let hasStartingInventory = false
    let pokedexPartsValue = 0
    let pokegearPartsValue = 0
    let johtoBadgesValue = 0
    let kantoBadgesValue = 0
    const bagItemValues: {itemId: string, itemAmount: string}[] = []
        
    Object.values(itemCategoriesMap).forEach((category) => {
      const itemCategorySettings = startingInventorySettings[category.id]
      let itemAmountMap: Partial<Record<ItemId, { AMOUNT: number}>> = {}
        
      if (Array.isArray(itemCategorySettings)) {
        itemCategorySettings.forEach((itemId) => {
          return itemAmountMap[itemId] = {
            AMOUNT: 1,
          }
        })
      } else {
        itemAmountMap = {
          ...itemAmountMap,
          ...itemCategorySettings,
        }
      }
        
      Object.entries(itemAmountMap).forEach(([itemId, settings]) => {
        hasStartingInventory = true
          
        const item = romInfo.gameData.items[itemId as ItemId]
              
        switch (item.type) {
        case "POKEDEX_PART": {
          pokedexPartsValue |= item.associatedValue
          break
        }
        case "POKEGEAR_PART": {
          pokegearPartsValue |= item.associatedValue
          break
        }
        case "JOHTO_BADGE": {
          johtoBadgesValue |= item.associatedValue
          break
        }
        case "KANTO_BADGE": {
          kantoBadgesValue |= item.associatedValue
          break
        }
        case "BAG_ITEM": {
          bagItemValues.push({
            itemId: hexStringFrom(bytesFrom(item.numericId, 1)),
            itemAmount: `[2]{${settings.AMOUNT}}`,
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
        },
      )
      
      romInfo.patchHunks = [...romInfo.patchHunks, ...startingItemsPatch.hunks]
    }
  }
    
  // Item Behaviours
    
  if (settings.POKEMON_RADAR) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "pokemonRadar.yml",
      ).hunks,
    ]
  }
  
  if (settings.EARLY_KANTO_DEX) {
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(36, 0x50ED),
        values: [0x00, 0x00],
      },
      {
        offset: romOffsetFromBankAddress(36, 0x5DBC),
        values: [0x00],
      },
    ])
  }
    
  if (settings.BIKE_INDOORS) {
    const bikeAnywherePatch = Patch.fromYAML(
      romInfo,
      "bikeAnywhere.yml",
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...bikeAnywherePatch.hunks]
  }
    
  if (settings.POKE_BALLS_NEVER_FAIL) {
    const pokeBallsNeverFailPatch = Patch.fromYAML(
      romInfo,
      "pokeBallsNeverFail.yml",
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...pokeBallsNeverFailPatch.hunks]
  }
    
  if (settings.PREVENT_FAILED_POKE_BALL_WOBBLES) {
    const preventFailedPokeBallWobblesPatch = Patch.fromYAML(
      romInfo,
      "preventFailedPokeBallWobbles.yml",
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...preventFailedPokeBallWobblesPatch.hunks]
  }
    
  if (settings.REMOVE_POKE_BALL_BOUNCE_ANIMATION) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "removePokeballBounceAnimation.yml",
      ).hunks,
    ]
  }
    
  if (settings.RODS_ALWAYS_WORK) {
    const rodsAlwaysWorkPatch = Patch.fromYAML(
      romInfo,
      "rodsAlwaysWork.yml",
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...rodsAlwaysWorkPatch.hunks]
  }
  
  if (settings.PROGRESSIVE_RODS) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "progressiveRods.yml",
      {},
      {
        goldenrodGameCornerItem1Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.GOLDENROD_GAME_CORNER_ITEM_SHOP.items[0].itemId].numericId]),
        goldenrodGameCornerItem2Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.GOLDENROD_GAME_CORNER_ITEM_SHOP.items[1].itemId].numericId]),
        goldenrodGameCornerItem3Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.GOLDENROD_GAME_CORNER_ITEM_SHOP.items[2].itemId].numericId]),
        goldenrodVendingMachinesItem1Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES.items[0].itemId].numericId]),
        goldenrodVendingMachinesItem2Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES.items[1].itemId].numericId]),
        goldenrodVendingMachinesItem3Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES.items[2].itemId].numericId]),
        celadonGameCornerItem1Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.CELADON_GAME_CORNER_ITEM_SHOP.items[0].itemId].numericId]),
        celadonGameCornerItem2Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.CELADON_GAME_CORNER_ITEM_SHOP.items[1].itemId].numericId]),
        celadonGameCornerItem3Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.CELADON_GAME_CORNER_ITEM_SHOP.items[2].itemId].numericId]),
        celadonVendingMachinesItem1Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.CELADON_DEPT_STORE_6F_VENDING_MACHINES.items[0].itemId].numericId]),
        celadonVendingMachinesItem2Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.CELADON_DEPT_STORE_6F_VENDING_MACHINES.items[1].itemId].numericId]),
        celadonVendingMachinesItem3Id: hexStringFrom([romInfo.gameData.items[romInfo.gameData.specialShops.CELADON_DEPT_STORE_6F_VENDING_MACHINES.items[2].itemId].numericId]),
      },
    ).hunks)
  }
    
  if (settings.HEADBUTT_ALWAYS_WORKS) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "headbuttAlwaysWorks.yml",
      ).hunks,
    ]
  }
    
  if (settings.ROCK_SMASH_ALWAYS_WORKS || settings.REPEL_ROCKS) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "rockSmashChanges.yml",
        {
          options: compact([
            settings.ROCK_SMASH_ALWAYS_WORKS ? undefined : "rockSmashOptions/encounterChance.yml",
            "rockSmashOptions/getEncounter.yml",
            settings.REPEL_ROCKS ? "rockSmashOptions/repel.yml" : undefined,
          ]),
        },
      ).hunks,
    ]
  }
    
  if (settings.REPEL_REFRESH) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "repelRefresh.yml",
      ).hunks,
    ]
  }
    
  if (settings.ESCAPE_ALL_BUILDINGS) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "escapeAllBuildings.yml",
      ).hunks,
    ]
  }
    
  if (settings.SHOW_RECEIVED_TM_HM_MOVE_NAMES) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "showTMHMMoveNames.yml",
      ).hunks,
    ]
  }
  
  // Marts
  
  if (settings.EARLY_CHERRYGROVE_MART_POKE_BALLS) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      {
        offset: romOffsetFromBankAddress(101, 0x6813),
        values: [1],
      },
    ]
  }
  
  if (settings.BUYABLE_EVOLUTION_STONES) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      {
        offset: romOffsetFromBankAddress(1, 0x67F2),
        values: bytesFrom(2100, 2),
      },
    ]
  }
  
  if (settings.BUYABLE_TM12) {
    const numericMartIdFrom = (martId: MartId) => {
      const updatedMartId = settings.EARLY_GOLDENROD_MART_TMS ? "GOLDENROD_DEPT_STORE_5F_SHOP_8" : martId
      return hexStringFrom([martIds.findIndex((martId) => { return martId === updatedMartId })!])
    }
    
    romInfo.patchHunks = [
      ...romInfo.patchHunks, ...Patch.fromYAML(
        romInfo,
        "buyableSweetScent.yml",
        {},
        {
          mart1Id: numericMartIdFrom("GOLDENROD_DEPT_STORE_5F_SHOP_1"),
          mart2Id: numericMartIdFrom("GOLDENROD_DEPT_STORE_5F_SHOP_2"),
          mart3Id: numericMartIdFrom("GOLDENROD_DEPT_STORE_5F_SHOP_3"),
          mart4Id: numericMartIdFrom("GOLDENROD_DEPT_STORE_5F_SHOP_4"),
          mart5Id: numericMartIdFrom("GOLDENROD_DEPT_STORE_5F_SHOP_5"),
          mart6Id: numericMartIdFrom("GOLDENROD_DEPT_STORE_5F_SHOP_6"),
          mart7Id: numericMartIdFrom("GOLDENROD_DEPT_STORE_5F_SHOP_7"),
          mart8Id: numericMartIdFrom("GOLDENROD_DEPT_STORE_5F_SHOP_8"),
        },
      ).hunks,
    ]
  } else if (settings.EARLY_GOLDENROD_MART_TMS) {
    const numericMartId = martIds.findIndex((martId) => { return martId === "GOLDENROD_DEPT_STORE_5F_SHOP_4" })!
    
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(21, 0x60B8), values: [numericMartId] },
      { offset: romOffsetFromBankAddress(21, 0x60BE), values: [numericMartId] },
      { offset: romOffsetFromBankAddress(21, 0x60C4), values: [numericMartId] },
      { offset: romOffsetFromBankAddress(21, 0x60CA), values: [numericMartId] },
    ])
  }
  
  if (
    settings.CHERRYGROVE_MART_REPELS
    || settings.EARLY_CHERRYGROVE_MART_POKE_BALLS
    || settings.VIOLET_MART_REPELS
    || settings.BUYABLE_EVOLUTION_STONES
    || settings.BUYABLE_TM12
    || settings.SHUFFLE_ITEMS.VALUE && settings.SHUFFLE_ITEMS.SETTINGS.GROUPS.flat().includes("SHOPS")
  ) {
    const martsPatch = Patch.fromYAML(
      romInfo,
      "marts.yml",
      {
        marts: martIds.map((martId) => {
          const mart = romInfo.gameData.marts[martId]
          return {
            path: "martItems.yml",
            extraIncludes: {},
            extraValues: {
              numberOfItems: hexStringFrom([mart.items.length]),
              items: hexStringFrom(mart.items.map((item) => { return romInfo.gameData.items[item].numericId })),
            },
          }
        }),
      },
    )

    romInfo.patchHunks = [...romInfo.patchHunks, ...martsPatch.hunks]
  }
  
  const specialShopItemInfo = (shopId: SpecialShopId, index: number) => {
    return romInfo.gameData.specialShops[shopId].items[index]
  }
  
  const specialShopItem = (shopId: SpecialShopId, index: number) => {
    return romInfo.gameData.items[specialShopItemInfo(shopId, index).itemId]
  }
  
  const specialShopItemName = (shopId: SpecialShopId, index: number) => {
    const itemData = specialShopItem(shopId, index)
    return settings.PROGRESSIVE_RODS && (itemData.id === "OLD_ROD" || itemData.id === "GOOD_ROD" || itemData.id === "SUPER_ROD") ? "ROD UPGRADE" : itemData.inGameName
  }
  
  const specialShopMenuItemNameAndPriceText = (shopId: SpecialShopId, index: number) => {
    return hexStringFrom(bytesFromTextData(specialShopItemName(shopId, index).padEnd(12, " ") + `${specialShopItemInfo(shopId, index).price}`.padStart(5, " ")))
  }
  
  const shouldApplyShopItemChanges = settings.SHUFFLE_ITEMS.SETTINGS.GROUPS.flat().includes("SHOPS") || settings.START_WITH_ITEMS.SETTINGS.REPLACE_EXISTING_ITEMS.VALUE
  
  if (shouldApplyShopItemChanges || settings.RANDOMIZE_BLUE_CARD_REWARD_COSTS.VALUE) {
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(34, 0x715E),
        values: romInfo.gameData.specialShops.RADIO_TOWER_2F_BLUE_CARD_SHOP.items.flatMap((itemInfo) => {
          return [
            romInfo.gameData.items[itemInfo.itemId].numericId,
            itemInfo.price,
          ]
        }),
      },
    ])
  }
  
  if (shouldApplyShopItemChanges || settings.CHANGE_DEFAULT_ITEM_PRICES.VALUE) {
    const shouldLimitItemStock = (shopId: SpecialShopId, index: number) => {
      return itemCategoriesMap[specialShopItem(shopId, index).category].slotSize === 1
    }
    
    const mooMooItemInfo = specialShopItemInfo("ROUTE_39_FARMHOUSE_SHOP", 0)
    const mooMooItem = specialShopItem("ROUTE_39_FARMHOUSE_SHOP", 0)
    const mooMooItemName = specialShopItemName("ROUTE_39_FARMHOUSE_SHOP", 0)
    
    const mahoganyItemInfo = specialShopItemInfo("MAHOGANY_TOWN_STREET_VENDOR", 0)
    const mahoganyItem = specialShopItem("MAHOGANY_TOWN_STREET_VENDOR", 0)
    const mahoganyItemName = specialShopItemName("MAHOGANY_TOWN_STREET_VENDOR", 0)
    
    romInfo.patchHunks.push(...[
      // Bargain Shop
      {
        offset: romOffsetFromBankAddress(5, 0x5C52),
        values: [
          ...romInfo.gameData.specialShops.GOLDENROD_UNDERGROUND_BARGAIN_SHOP.items.flatMap((itemInfo) => {
            return [
              romInfo.gameData.items[itemInfo.itemId].numericId,
              ...bytesFrom(itemInfo.price, 2),
            ]
          }),
        ],
      },
      // Rooftop Sale
      {
        offset: romOffsetFromBankAddress(5, 0x5AEF),
        values: [
          ...romInfo.gameData.specialShops.GOLDENROD_DEPT_STORE_ROOF_SHOP_1.items.flatMap((itemInfo) => {
            return [
              romInfo.gameData.items[itemInfo.itemId].numericId,
              ...bytesFrom(itemInfo.price, 2),
            ]
          }),
        ],
      },
      ...Patch.fromYAML(
        romInfo,
        "rooftopSalePostE4.yml",
        {},
        {
          itemData: hexStringFrom([
            romInfo.gameData.specialShops.GOLDENROD_DEPT_STORE_ROOF_SHOP_2.items.length,
            ...romInfo.gameData.specialShops.GOLDENROD_DEPT_STORE_ROOF_SHOP_2.items.flatMap((itemInfo) => {
              return [
                romInfo.gameData.items[itemInfo.itemId].numericId,
                ...bytesFrom(itemInfo.price, 2),
              ]
            }),
            0xFF,
          ]),
        },
      ).hunks,
      // MooMoo Milk Vendor
      { offset: romOffsetFromBankAddress(39, 0x4EDD), values: [0x9E, mooMooItem.numericId] },
      { offset: romOffsetFromBankAddress(39, 0x4FF3), values: bytesFromTextScript(`${mooMooItemName}\tfer just ¥${mooMooItemInfo.price}?\f`) },
      { offset: romOffsetFromBankAddress(39, 0x4ED7), values: bytesFrom(mooMooItemInfo.price, 2, true) },
      { offset: romOffsetFromBankAddress(39, 0x4EE6), values: bytesFrom(mooMooItemInfo.price, 2, true) },
      { offset: romOffsetFromBankAddress(39, 0x4EC5), values: [0x18, 0x18] },
      { offset: romOffsetFromBankAddress(39, 0x4EEB), values: [0x33, ...bytesFrom(eventFlagsMap.GOT_MOOMOO_MILK.numericId, 2), 0x18] },
      { offset: romOffsetFromBankAddress(39, 0x4EF3), values: [0x18] },
      // Ragecandybar Vendor
      ...Patch.fromYAML(
        romInfo,
        "moveMahoganyStreetVendor.yml",
      ).hunks,
      { offset: romOffsetFromBankAddress(100, 0x4054), values: [0x9E, mahoganyItem.numericId] },
      { offset: romOffsetFromBankAddress(100, 0x4100), values: bytesFromTextScript(`yummy\n${mahoganyItemName}\tfor just ¥${mahoganyItemInfo.price}!\f`) },
      { offset: romOffsetFromBankAddress(100, 0x41A7), values: bytesFromTextScript(`${mahoganyItemName}<'s>`.padEnd(16, " ")) },
      { offset: romOffsetFromBankAddress(100, 0x404E), values: bytesFrom(mahoganyItemInfo.price, 2, true) },
      { offset: romOffsetFromBankAddress(100, 0x4061), values: bytesFrom(mahoganyItemInfo.price, 2, true) },
      shouldLimitItemStock("MAHOGANY_TOWN_STREET_VENDOR", 0) ? { offset: romOffsetFromBankAddress(100, 0x402F), values: [0x31, ...bytesFrom(eventFlagsMap.GOT_RAGECANDYBAR.numericId, 2)] } : { offset: romOffsetFromBankAddress(100, 0x4032), values: [0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(100, 0x405A), values: [0x33, ...bytesFrom(eventFlagsMap.GOT_RAGECANDYBAR.numericId, 2), 0x18] },
      // Vending Machines
      ...Patch.fromYAML(
        romInfo,
        "vendingMachineItems.yml",
        {},
        {
          goldenrodItem1NameAndPrice: specialShopMenuItemNameAndPriceText("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 0),
          goldenrodItem2NameAndPrice: specialShopMenuItemNameAndPriceText("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 1),
          goldenrodItem3NameAndPrice: specialShopMenuItemNameAndPriceText("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 2),
          celadonItem1NameAndPrice: specialShopMenuItemNameAndPriceText("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 0),
          celadonItem2NameAndPrice: specialShopMenuItemNameAndPriceText("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 1),
          celadonItem3NameAndPrice: specialShopMenuItemNameAndPriceText("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 2),
          goldenrodItem1Id: hexStringFrom([specialShopItem("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 0).numericId]),
          goldenrodItem1Price: hexStringFrom(bytesFrom(specialShopItemInfo("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 0).price, 2, true)),
          goldenrodItem2Id: hexStringFrom([specialShopItem("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 1).numericId]),
          goldenrodItem2Price: hexStringFrom(bytesFrom(specialShopItemInfo("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 1).price, 2, true)),
          goldenrodItem3Id: hexStringFrom([specialShopItem("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 2).numericId]),
          goldenrodItem3Price: hexStringFrom(bytesFrom(specialShopItemInfo("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 2).price, 2, true)),
          celadonItem1Id: hexStringFrom([specialShopItem("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 0).numericId]),
          celadonItem1Price: hexStringFrom(bytesFrom(specialShopItemInfo("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 0).price, 2, true)),
          celadonItem2Id: hexStringFrom([specialShopItem("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 1).numericId]),
          celadonItem2Price: hexStringFrom(bytesFrom(specialShopItemInfo("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 1).price, 2, true)),
          celadonItem3Id: hexStringFrom([specialShopItem("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 2).numericId]),
          celadonItem3Price: hexStringFrom(bytesFrom(specialShopItemInfo("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 2).price, 2, true)),
        },
      ).hunks,
      // Limit Unique Item Purchases
      ...Patch.fromYAML(
        romInfo,
        "limitSpecialShopItemStock.yml",
        {
          goldenrodVendingMachineOptions: compact([
            shouldLimitItemStock("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 0) ? "limitSpecialShopItemStockOptions/goldenrodVendingMachineItem1.yml" : undefined,
            shouldLimitItemStock("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 1) ? "limitSpecialShopItemStockOptions/goldenrodVendingMachineItem2.yml" : undefined,
            shouldLimitItemStock("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 2) ? "limitSpecialShopItemStockOptions/goldenrodVendingMachineItem3.yml" : undefined,
          ]),
          celadonVendingMachineOptions: compact([
            shouldLimitItemStock("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 0) ? "limitSpecialShopItemStockOptions/celadonVendingMachineItem1.yml" : undefined,
            shouldLimitItemStock("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 1) ? "limitSpecialShopItemStockOptions/celadonVendingMachineItem2.yml" : undefined,
            shouldLimitItemStock("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 2) ? "limitSpecialShopItemStockOptions/celadonVendingMachineItem3.yml" : undefined,
          ]),
          mooMooFarmOptions: compact([
            shouldLimitItemStock("ROUTE_39_FARMHOUSE_SHOP", 0) ? "limitSpecialShopItemStockOptions/mooMooFarmItem.yml" : undefined,
          ]),
        },
        {
          gotGoldenrodVendingMachineItem1EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_GOLDENROD_VENDING_MACHINE_ITEM_1.numericId, 2)),
          gotGoldenrodVendingMachineItem2EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_GOLDENROD_VENDING_MACHINE_ITEM_2.numericId, 2)),
          gotGoldenrodVendingMachineItem3EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_GOLDENROD_VENDING_MACHINE_ITEM_3.numericId, 2)),
          gotCeladonVendingMachineItem1EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_CELADON_VENDING_MACHINE_ITEM_1.numericId, 2)),
          gotCeladonVendingMachineItem2EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_CELADON_VENDING_MACHINE_ITEM_2.numericId, 2)),
          gotCeladonVendingMachineItem3EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_CELADON_VENDING_MACHINE_ITEM_3.numericId, 2)),
          gotMooMooMilkEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_MOOMOO_MILK.numericId, 2)),
        },
      ).hunks,
    ])
  }
  
  if (shouldApplyShopItemChanges || settings.LIMIT_GAME_CORNER_ITEM_STOCK) {
    const shouldLimitItemStock = (shopId: SpecialShopId, index: number) => {
      if (settings.LIMIT_GAME_CORNER_ITEM_STOCK) {
        return true
      }
      
      return itemCategoriesMap[specialShopItem(shopId, index).category].slotSize === 1
    }
    
    romInfo.patchHunks.push(...[
      ...Patch.fromYAML(
        romInfo,
        "limitGameCornerItemStock.yml",
        {
          goldenrodGameCornerOptions: compact([
            shouldLimitItemStock("GOLDENROD_GAME_CORNER_ITEM_SHOP", 0) ? "limitGameCornerItemStockOptions/goldenrodGameCornerItem1.yml" : undefined,
            shouldLimitItemStock("GOLDENROD_GAME_CORNER_ITEM_SHOP", 1) ? "limitGameCornerItemStockOptions/goldenrodGameCornerItem2.yml" : undefined,
            shouldLimitItemStock("GOLDENROD_GAME_CORNER_ITEM_SHOP", 2) ? "limitGameCornerItemStockOptions/goldenrodGameCornerItem3.yml" : undefined,
          ]),
          celadonGameCornerOptions: compact([
            shouldLimitItemStock("CELADON_GAME_CORNER_ITEM_SHOP", 0) ? "limitGameCornerItemStockOptions/celadonGameCornerItem1.yml" : undefined,
            shouldLimitItemStock("CELADON_GAME_CORNER_ITEM_SHOP", 1) ? "limitGameCornerItemStockOptions/celadonGameCornerItem2.yml" : undefined,
            shouldLimitItemStock("CELADON_GAME_CORNER_ITEM_SHOP", 2) ? "limitGameCornerItemStockOptions/celadonGameCornerItem3.yml" : undefined,
          ]),
        },
        {
          gotGoldenrodGameCornerItem1EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_GOLDENROD_GAME_CORNER_ITEM_1.numericId, 2)),
          gotGoldenrodGameCornerItem2EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_GOLDENROD_GAME_CORNER_ITEM_2.numericId, 2)),
          gotGoldenrodGameCornerItem3EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_GOLDENROD_GAME_CORNER_ITEM_3.numericId, 2)),
          gotCeladonGameCornerItem1EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_CELADON_GAME_CORNER_ITEM_1.numericId, 2)),
          gotCeladonGameCornerItem2EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_CELADON_GAME_CORNER_ITEM_2.numericId, 2)),
          gotCeladonGameCornerItem3EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_CELADON_GAME_CORNER_ITEM_3.numericId, 2)),
        },
      ).hunks,
    ])
  }
  
  if (shouldApplyShopItemChanges || settings.LIMIT_BLUE_CARD_REWARDS_STOCK) {
    romInfo.patchHunks.push(...[
      ...Patch.fromYAML(
        romInfo,
        "limitBlueCardRewardsStock.yml",
        {
          options: compact([
            settings.LIMIT_BLUE_CARD_REWARDS_STOCK ? undefined : "limitBlueCardRewardsStockOptions/onlyLimitKeyItems.yml",
          ]),
        },
        {
          blueCardPrize1EventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_BLUE_CARD_PRIZE_1.numericId, 2)),
        },
      ).hunks,
    ])
  }
  
  if (shouldApplyShopItemChanges || settings.RANDOMIZE_GAME_CORNER_ITEM_PRICES.VALUE) {
    romInfo.patchHunks.push(...[
      ...Patch.fromYAML(
        romInfo,
        "gameCornerItems.yml",
        {},
        {
          goldenrodItem1NameAndPrice: specialShopMenuItemNameAndPriceText("GOLDENROD_GAME_CORNER_ITEM_SHOP", 0),
          goldenrodItem2NameAndPrice: specialShopMenuItemNameAndPriceText("GOLDENROD_GAME_CORNER_ITEM_SHOP", 1),
          goldenrodItem3NameAndPrice: specialShopMenuItemNameAndPriceText("GOLDENROD_GAME_CORNER_ITEM_SHOP", 2),
          celadonItem1NameAndPrice: specialShopMenuItemNameAndPriceText("CELADON_GAME_CORNER_ITEM_SHOP", 0),
          celadonItem2NameAndPrice: specialShopMenuItemNameAndPriceText("CELADON_GAME_CORNER_ITEM_SHOP", 1),
          celadonItem3NameAndPrice: specialShopMenuItemNameAndPriceText("CELADON_GAME_CORNER_ITEM_SHOP", 2),
          goldenrodItem1Id: hexStringFrom([specialShopItem("GOLDENROD_GAME_CORNER_ITEM_SHOP", 0).numericId]),
          goldenrodItem1Price: hexStringFrom(bytesFrom(specialShopItemInfo("GOLDENROD_GAME_CORNER_ITEM_SHOP", 0).price, 2)),
          goldenrodItem2Id: hexStringFrom([specialShopItem("GOLDENROD_GAME_CORNER_ITEM_SHOP", 1).numericId]),
          goldenrodItem2Price: hexStringFrom(bytesFrom(specialShopItemInfo("GOLDENROD_GAME_CORNER_ITEM_SHOP", 1).price, 2)),
          goldenrodItem3Id: hexStringFrom([specialShopItem("GOLDENROD_GAME_CORNER_ITEM_SHOP", 2).numericId]),
          goldenrodItem3Price: hexStringFrom(bytesFrom(specialShopItemInfo("GOLDENROD_GAME_CORNER_ITEM_SHOP", 2).price, 2)),
          celadonItem1Id: hexStringFrom([specialShopItem("CELADON_GAME_CORNER_ITEM_SHOP", 0).numericId]),
          celadonItem1Price: hexStringFrom(bytesFrom(specialShopItemInfo("CELADON_GAME_CORNER_ITEM_SHOP", 0).price, 2)),
          celadonItem2Id: hexStringFrom([specialShopItem("CELADON_GAME_CORNER_ITEM_SHOP", 1).numericId]),
          celadonItem2Price: hexStringFrom(bytesFrom(specialShopItemInfo("CELADON_GAME_CORNER_ITEM_SHOP", 1).price, 2)),
          celadonItem3Id: hexStringFrom([specialShopItem("CELADON_GAME_CORNER_ITEM_SHOP", 2).numericId]),
          celadonItem3Price: hexStringFrom(bytesFrom(specialShopItemInfo("CELADON_GAME_CORNER_ITEM_SHOP", 2).price, 2)),
        },
      ).hunks,
    ])
  }
  
  if (shouldApplyShopItemChanges && !settings.PROGRESSIVE_RODS) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(21, 0x6C56), values: [specialShopItem("GOLDENROD_GAME_CORNER_ITEM_SHOP", 0).numericId] },
      { offset: romOffsetFromBankAddress(21, 0x6C72), values: [specialShopItem("GOLDENROD_GAME_CORNER_ITEM_SHOP", 1).numericId] },
      { offset: romOffsetFromBankAddress(21, 0x6C8E), values: [specialShopItem("GOLDENROD_GAME_CORNER_ITEM_SHOP", 2).numericId] },
      { offset: romOffsetFromBankAddress(21, 0x6424), values: [specialShopItem("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 0).numericId] },
      { offset: romOffsetFromBankAddress(21, 0x643E), values: [specialShopItem("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 1).numericId] },
      { offset: romOffsetFromBankAddress(21, 0x6458), values: [specialShopItem("GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES", 2).numericId] },
      { offset: romOffsetFromBankAddress(28, 0x671D), values: [specialShopItem("CELADON_GAME_CORNER_ITEM_SHOP", 0).numericId] },
      { offset: romOffsetFromBankAddress(28, 0x6739), values: [specialShopItem("CELADON_GAME_CORNER_ITEM_SHOP", 1).numericId] },
      { offset: romOffsetFromBankAddress(28, 0x6755), values: [specialShopItem("CELADON_GAME_CORNER_ITEM_SHOP", 2).numericId] },
      { offset: romOffsetFromBankAddress(28, 0x51AD), values: [specialShopItem("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 0).numericId] },
      { offset: romOffsetFromBankAddress(28, 0x51C9), values: [specialShopItem("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 1).numericId] },
      { offset: romOffsetFromBankAddress(28, 0x51E3), values: [specialShopItem("CELADON_DEPT_STORE_6F_VENDING_MACHINES", 2).numericId] },
    ])
  }
  
  if (settings.MOVE_TUTOR_ALWAYS_AVAILABLE) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks, ...Patch.fromYAML(
        romInfo,
        "moveTutorAlwaysAvailable.yml",
      ).hunks,
    ]
  }
  
  if (settings.RANDOMIZE_MOVE_TUTOR_COST.VALUE) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks, ...Patch.fromYAML(
        romInfo,
        "moveTutorCost.yml",
        {},
        {
          cost: hexStringFrom(bytesFrom(romInfo.gameData.moveTutorCost, 2)),
          costText: hexStringFrom(bytesFromTextScript(`${romInfo.gameData.moveTutorCost} coins. Okay?`.padEnd(17, " "))),
        },
      ).hunks,
    ]
  }
  
  // Skip Gender
  
  if (settings.SKIP_GENDER) {
    romInfo.patchHunks.push({
      offset: romOffsetFromBankAddress(1, 0x5B97),
      values: [0x3E, ...bytesFrom(playerSpriteMap.GIRL.numericId, 1), 0xEA, 0x72, 0xD4, 0x00],
    })
  }
    
  // Skip Name
    
  if (settings.SKIP_NAME) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "skipName.yml",
      ).hunks,
    ]
  }
    
  // Trainers
    
  const trainersPatch = Patch.fromYAML(
    romInfo,
    "trainers.yml",
    {
      trainerGroups: trainerClassIds.map((classId) => {
        return {
          path: "trainerGroup.yml",
          extraIncludes: {
            trainers: romInfo.gameData.trainers.filter((trainer) => {
              return trainer.classId === classId
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
                trainerType = 1
              } else if (hasItems) {
                trainerType = 2
              }
              
              const trainerName = trainer.classId === "RIVAL_1" || trainer.classId === "RIVAL_2" ? "?" : trainer.name
                
              return {
                path: "trainerNameAndPokemon.yml",
                extraIncludes: {},
                extraValues: {
                  name: hexStringFrom(bytesFromTextData(`${trainerName}@`)),
                  trainerType: hexStringFrom([trainerType]),
                  pokemon: hexStringFrom(compact(trainer.pokemon.flatMap((pokemon) => {
                    return [
                      pokemon.level,
                      pokemonMap[pokemon.id].numericId,
                      hasItems ? isNotNullish(pokemon.itemId) ? romInfo.gameData.items[pokemon.itemId].numericId : 0 : null,
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
    },
  )
    
  romInfo.patchHunks = [...romInfo.patchHunks, ...trainersPatch.hunks]
    
  romInfo.gameData.mapObjectEvents.forEach((event) => {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      dataHunkFromMapObjectEvent(event),
    ]
  })
    
  const trainerMovementSpeedPatch = Patch.fromYAML(
    romInfo,
    "trainerMovementSpeed.yml",
    {},
    {
      fastSpinDurationMask: hexStringFrom([trainerMovementBehavioursMap[settings.CHANGE_OVERWORLD_TRAINER_MOVEMENT.SETTINGS.MOVEMENT].fastSpinDurationMask]),
    },
  )
  
  romInfo.patchHunks = [...romInfo.patchHunks, ...trainerMovementSpeedPatch.hunks]
  
  // Change Box Phone Call
    
  if (settings.CHANGE_BOX_PHONE_CALL) {
    const changeBoxCallPatch = Patch.fromYAML(
      romInfo,
      "changeBoxCall.yml",
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...changeBoxCallPatch.hunks]
  }
  
  // Move Stats
    
  if (settings.SHOW_MOVE_STATS_IN_BATTLE) {
    const moveStatsPatch = Patch.fromYAML(
      romInfo,
      "movePowerAndAccuracyInBattle.yml",
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...moveStatsPatch.hunks]
  }
    
  // Scale Experience
    
  if (settings.SCALE_EXPERIENCE || settings.USE_UPDATED_BASE_EXP) {
    const experiencePatch = Patch.fromYAML(
      romInfo,
      "experienceCalculation.yml",
      {
        options: compact([
          settings.USE_UPDATED_BASE_EXP ? "updatedBaseExperience.yml" : undefined,
          settings.SCALE_EXPERIENCE ? "scaleExperience.yml" : undefined,
        ]),
      },
      {
        gen5BaseExpTable: settings.USE_UPDATED_BASE_EXP ? hexStringFrom(Object.values(gen5BaseExpMap).flatMap((value) => {
          return bytesFrom(value, 2)
        })) : "",
      },
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...experiencePatch.hunks]
  }
  
  // Fly Between Regions
  
  if (settings.FLY_BETWEEN_REGIONS) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "flyBetweenRegions.yml",
    ).hunks)
  }
  
  // Route 30 Roadblock
  
  if (settings.REMOVE_ROUTE_30_ROADBLOCK) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      { offset: romOffsetFromBankAddress(47, 0x4430), values: [0x14] },
    ]
  }
  
  // Ilex Cut Tree
  
  if (settings.REMOVE_ILEX_CUT_TREE) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      { offset: romOffsetFromBankAddress(44, 0x418F), values: [0x17] },
    ]
  }
  
  // Goldenrod store basement
  
  if (settings.CLEAR_GOLDENROD_STORE_BASEMENT) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(43, 0x5EEF), values: [0x0D] },
      { offset: romOffsetFromBankAddress(43, 0x5EF6), values: [0x0D] },
      { offset: romOffsetFromBankAddress(43, 0x5F03), values: [0x0D] },
    ])
  }
  
  // Flower Shop
  
  if (settings.SKIP_FLORIA || settings.SHUFFLE_ITEMS.VALUE) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "flowerShopChanges.yml",
      {},
      {
        checkFloriaState: settings.SKIP_FLORIA ? "18 18 18 18 18 18 18 18 18 18 18 18" : "31 B9 00 08 9F 53 31 BA 00 08 8F 53",
      },
    ).hunks)
  }
  
  // Auto Rocket Passwords
  
  if (settings.AUTO_ROCKET_PASSWORDS) {
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(27, 0x60A7),
        values: [0x18],
      },
      {
        offset: romOffsetFromBankAddress(27, 0x60BE),
        values: [0x18],
      },
    ])
  }
  
  // Skip Rockets
  
  if (settings.SKIP_MAHOGANY_ROCKETS || settings.SKIP_GOLDENROD_ROCKETS) {
    const additionalOptionsPatch = Patch.fromYAML(
      romInfo,
      "skipRockets.yml",
      {
        options: compact([
          settings.SKIP_MAHOGANY_ROCKETS ? "skipRocketsOptions/skipMahoganyRockets.yml" : null,
          settings.SKIP_GOLDENROD_ROCKETS ? "skipRocketsOptions/skipGoldenrodRockets.yml" : null,
        ]),
      },
      {
        whirlpoolItem: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT.itemId].numericId]),
        basementKeyItem: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT.itemId].numericId]),
        cardKeyItem: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT.itemId].numericId]),
        clearBellItem: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT.itemId].numericId]),
        gotBasementKeyEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_BASEMENT_KEY.numericId, 2)),
        gotCardKeyEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_CARD_KEY.numericId, 2)),
      },
    )
      
    romInfo.patchHunks = [...romInfo.patchHunks, ...additionalOptionsPatch.hunks]
  }
  
  // Buena
  
  if (settings.BUENA_ALWAYS_GIVES_ITEM) {
    romInfo.patchHunks.push({
      offset: romOffsetFromBankAddress(23, 0x5777),
      values: [0x31, 0x3D, 0x03, 0x08, 0x00, 0x58, 0x34, 0x13, 0x00, 0x09, 0x65, 0x58],
    })
  }
  
  // Sick Miltank
  
  if (settings.RANDOMIZE_NUMBER_OF_BERRIES_FOR_MILTANK.VALUE) {
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(39, 0x4CDE),
        values: [
          0x06,
          romInfo.gameData.numberOfMiltankBerries,
          0x04,
          0x4D,
          0x06,
          Math.floor(romInfo.gameData.numberOfMiltankBerries * 5 / 7),
          0xFA,
          0x4C,
          0x06,
          Math.floor(romInfo.gameData.numberOfMiltankBerries * 3 / 7),
          0xF0,
          0x4C,
        ],
      },
    ])
  }
  
  // Elm Everstone Requirements
  
  if (settings.RANDOMIZE_EVENT_POKEMON.VALUE) {
    const numericId = pokemonMap[romInfo.gameData.showAndTellPokemon.TOGEPI].numericId
    
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(30, 0x4C0D),
        values: [numericId],
      },
      {
        offset: romOffsetFromBankAddress(30, 0x4C15),
        values: [numericId],
      },
      {
        offset: romOffsetFromBankAddress(30, 0x4C23),
        values: [numericId],
      },
      {
        offset: romOffsetFromBankAddress(30, 0x4C2B),
        values: [numericId],
      },
    ])
  }
  
  if (settings.HATCH_ANY_EGG_FOR_ELM) {
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(5, 0x6FB5),
        values: [0, 0],
      },
    ])
  }
  
  // Show and Tell Pokemon
  
  if (settings.RANDOMIZE_SHOW_AND_TELL_POKEMON.VALUE) {
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(23, 0x4149),
        values: [pokemonMap[romInfo.gameData.showAndTellPokemon.MARILL].numericId],
      },
      {
        offset: romOffsetFromBankAddress(105, 0x5B1C),
        values: [pokemonMap[romInfo.gameData.showAndTellPokemon.PIKACHU].numericId],
      },
      {
        offset: romOffsetFromBankAddress(103, 0x5193),
        values: [pokemonMap[romInfo.gameData.showAndTellPokemon.CLEFAIRY].numericId],
      },
      {
        offset: romOffsetFromBankAddress(102, 0x66E1),
        values: [pokemonMap[romInfo.gameData.showAndTellPokemon.MAGIKARP].numericId],
      },
      {
        offset: romOffsetFromBankAddress(98, 0x5586),
        values: [pokemonMap[romInfo.gameData.showAndTellPokemon.LICKITUNG].numericId],
      },
      {
        offset: romOffsetFromBankAddress(98, 0x55A7),
        values: [pokemonMap[romInfo.gameData.showAndTellPokemon.ODDISH].numericId],
      },
      {
        offset: romOffsetFromBankAddress(98, 0x55C8),
        values: [pokemonMap[romInfo.gameData.showAndTellPokemon.STARYU].numericId],
      },
      {
        offset: romOffsetFromBankAddress(98, 0x55ED),
        values: [pokemonMap[romInfo.gameData.showAndTellPokemon.GROWLITHE].numericId],
      },
      {
        offset: romOffsetFromBankAddress(98, 0x562F),
        values: [pokemonMap[romInfo.gameData.showAndTellPokemon.PICHU].numericId],
      },
    ])
  }
  
  // Magikarp
  
  if (settings.IGNORE_MAGIKARP_SIZE) {
    romInfo.patchHunks.push({ offset: romOffsetFromBankAddress(102, 0x66EC), values: [0x03, 0xFE, 0x66] })
  }
  
  if (settings.LIMIT_ITEMS_FROM_MAGIKARP_REQUEST) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "limitMagikarpItems.yml",
      {},
      {
        gotElixerForMagikarpEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_ELIXER_FOR_MAGIKARP.numericId, 2)),
      },
    ).hunks)
  }
  
  // Unown Sets
  
  if (settings.CHANGE_UNOWN_SETS.VALUE) {
    let omanyteOffset = 0x6BA9
    let aerodactylOffset = 0x6BA9
    let hoOhOffset = 0x6BA9
    
    if (settings.CHANGE_UNOWN_SETS.SETTINGS.METHOD.VALUE === "RANDOM") {
      omanyteOffset += romInfo.gameData.unownSets.KABUTO_PUZZLE.length + 1
      aerodactylOffset = omanyteOffset + romInfo.gameData.unownSets.OMANYTE_PUZZLE.length + 1
      hoOhOffset = aerodactylOffset + romInfo.gameData.unownSets.AERODACTYL_PUZZLE.length + 1
    }
    
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(15, 0x6BA3),
        values: [
          ...bytesFrom(omanyteOffset, 2),
          ...bytesFrom(aerodactylOffset, 2),
          ...bytesFrom(hoOhOffset, 2),
          ...romInfo.gameData.unownSets.KABUTO_PUZZLE.map((id) => { return unownLetters[id].numericId }),
          0xFF,
          ...romInfo.gameData.unownSets.OMANYTE_PUZZLE.map((id) => { return unownLetters[id].numericId }),
          0xFF,
          ...romInfo.gameData.unownSets.AERODACTYL_PUZZLE.map((id) => { return unownLetters[id].numericId }),
          0xFF,
          ...romInfo.gameData.unownSets.HO_OH_PUZZLE.map((id) => { return unownLetters[id].numericId }),
          0xFF,
        ],
      },
    ])
  }
  
  // Better Pokemon Info
  
  if (settings.SHOW_REQUESTED_POKEMON_INFO) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "improvedPokemonRequests.yml",
      {},
      {
        togepiId: hexStringFrom([pokemonMap[romInfo.gameData.showAndTellPokemon.TOGEPI].numericId]),
        marillId: hexStringFrom([pokemonMap[romInfo.gameData.showAndTellPokemon.MARILL].numericId]),
        pikachuId: hexStringFrom([pokemonMap[romInfo.gameData.showAndTellPokemon.PIKACHU].numericId]),
        clefairyId: hexStringFrom([pokemonMap[romInfo.gameData.showAndTellPokemon.CLEFAIRY].numericId]),
        magikarpId: hexStringFrom([pokemonMap[romInfo.gameData.showAndTellPokemon.MAGIKARP].numericId]),
        lickitungId: hexStringFrom([pokemonMap[romInfo.gameData.showAndTellPokemon.LICKITUNG].numericId]),
        oddishId: hexStringFrom([pokemonMap[romInfo.gameData.showAndTellPokemon.ODDISH].numericId]),
        staryuId: hexStringFrom([pokemonMap[romInfo.gameData.showAndTellPokemon.STARYU].numericId]),
        growlitheId: hexStringFrom([pokemonMap[romInfo.gameData.showAndTellPokemon.GROWLITHE].numericId]),
        pichuId: hexStringFrom([pokemonMap[romInfo.gameData.showAndTellPokemon.PICHU].numericId]),
      },
    ).hunks)
  }
  
  if (settings.SHOW_REQUESTED_POKEMON_INFO || settings.CHANGE_STARTERS.VALUE) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "allowUnownPokepics.yml",
    ).hunks)
  }
  
  // Early Tin Tower
  
  if (settings.CHANGE_TIN_TOWER_REQUIREMENTS.length > 0) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...settings.CHANGE_TIN_TOWER_REQUIREMENTS.includes("SKIP_E4") ? [
        { offset: romOffsetFromBankAddress(97, 0x5035), values: [0x18, 0x21, 0x46] },
      ] : [],
      ...settings.CHANGE_TIN_TOWER_REQUIREMENTS.includes("SKIP_BEASTS") ? [
        { offset: romOffsetFromBankAddress(97, 0x503B), values: [0x32, 0xC5, 0x07, 0x33, 0xB6, 0x07, 0x0F, 0x96, 0x00, 0x08, 0x50, 0x50] },
        { offset: romOffsetFromBankAddress(97, 0x507D), values: [0x90] },
      ] : [],
    ]
  }
  
  // Ho-Oh Level
  
  if (settings.CHANGE_HO_OH_LEVEL.VALUE) {
    romInfo.patchHunks.push({
      offset: romOffsetFromBankAddress(29, 0x7257),
      values: [settings.CHANGE_HO_OH_LEVEL.SETTINGS.LEVEL],
    })
  }
  
  // Ho-oh Chamber
  
  if (settings.CLIMB_TIN_TOWER_FOR_HO_OH_CHAMBER) {
    romInfo.patchHunks.push({
      offset: romOffsetFromBankAddress(34, 0x6DDB),
      values: [0x11, 0x17, 0x03, 0x06, 0x02, 0xCD, 0x6F, 0x2E, 0x79, 0xA7, 0xC8],
    })
  }
  
  // Boat changes
  
  if (settings.CHANGE_SS_AQUA_REQUIREMENTS.includes("SKIP_E4")) {
    romInfo.patchHunks.push({
      offset: romOffsetFromBankAddress(47, 0x44C9),
      values: bytesFrom(eventFlagsMap.OLIVINE_PORT_SPRITES_BEFORE_HALL_OF_FAME.numericId, 2),
    })
  }
  
  if (settings.CHANGE_SS_AQUA_REQUIREMENTS.includes("BOARD_ANY_DAY")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(29, 0x4935), values: [0x03] },
      { offset: romOffsetFromBankAddress(29, 0x49A7), values: [0x03] },
      { offset: romOffsetFromBankAddress(29, 0x4E33), values: [0x03, 0x49, 0x4E] },
      { offset: romOffsetFromBankAddress(29, 0x4E9F), values: [0x03, 0xB5, 0x4E] },
    ])
    
    markROMBytesAsUnused(romInfo, romOffsetFromBankAddress(29, 0x4938), 22)
    markROMBytesAsUnused(romInfo, romOffsetFromBankAddress(29, 0x49AA), 22)
    markROMBytesAsUnused(romInfo, romOffsetFromBankAddress(29, 0x4E36), 19)
    markROMBytesAsUnused(romInfo, romOffsetFromBankAddress(29, 0x4EA2), 19)
  }
  
  if (settings.CHANGE_SS_AQUA_REQUIREMENTS.includes("REBOARD_IMMEDIATELY")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(29, 0x48C2), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(29, 0x499E), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(29, 0x4DC6), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(29, 0x4E99), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] },
    ])
  }
  
  // Olivine Fly Point
  
  if (settings.FLY_TO_OLIVINE_FROM_PORT) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "olivineFlyPoint.yml",
    ).hunks)
  }
  
  if (settings.SHUFFLE_ITEMS.VALUE) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "tinSageItemRequirements.yml",
      ).hunks,
      ...Patch.fromYAML(
        romInfo,
        "tinStairsRequirements.yml",
      ).hunks,
      ...Patch.fromYAML(
        romInfo,
        "radioTower5FCutsceneChanges.yml",
      ).hunks,
      ...Patch.fromYAML(
        romInfo,
        "powerPlantChanges.yml",
      ).hunks,
      ...Patch.fromYAML(
        romInfo,
        "earlyGSBall.yml",
      ).hunks,
      {
        offset: romOffsetFromBankAddress(24, 0x6D65),
        values: [0x31, 0x7A, 0x00, 0x08, 0x71, 0x6D, 0x31, 0xC0, 0x00, 0x09, 0x84, 0x6D],
      }, // Allow getting sweet scent item even while the ilex forest is restless
      {
        offset: romOffsetFromBankAddress(24, 0x6D40),
        values: [0x03],
      }, // Allow leaving the Route 34 - Ilex Forest Gate via the south exit while the Ilex forest is restless
      {
        offset: romOffsetFromBankAddress(24, 0x4B93),
        values: [0x31, 0x37, 0x00, 0x09, 0xA0, 0x4B, 0x4C, 0x81, 0x4C, 0x55, 0x33, 0x37, 0x00, 0x21, 0x43, 0x09, 0xAB, 0x4B],
      }, // Allow getting secretpotion item even after turning in the secret potion to jasmine
      ...Patch.fromYAML(
        romInfo,
        "copycatChanges.yml",
      ).hunks,
      ...Patch.fromYAML(
        romInfo,
        "boatChanges.yml",
      ).hunks,
    ]
  }
  
  // Special Shop Changes
  
  if (settings.REMOVE_HERB_SHOP_TIME_REQUIREMENT) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(31, 0x40B2), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x40BB), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x40C4), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x40CD), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x40D6), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x4133), values: [0x03, 0x40, 0x41] },
    ])
  }
  
  if (settings.CHANGE_BARGAIN_SHOP_BEHAVIOR.includes("REMOVE_TIME_REQUIREMENT")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(31, 0x409C), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x40a5), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x40b5), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x40be), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x40c7), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x40d0), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x40d9), values: [0x6F] },
      { offset: romOffsetFromBankAddress(31, 0x414D), values: [0x03, 0x5B, 0x41] },
    ])
  }
  
  if (settings.CHANGE_BARGAIN_SHOP_BEHAVIOR.includes("ALLOW_REPEAT_VISITS")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(31, 0x414A), values: [0x18, 0x18, 0x18] },
    ])
  }
  
  // Mystery Gift
  
  if (settings.CHANGE_MYSTERY_GIFT) {
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(21, 0x611A),
        values: [
          0x31,
          ...bytesFrom(eventFlagsMap["GOT_EON_MAIL"].numericId, 2),
          0x09,
          0x29,
          0x61,
          0x9E,
          romInfo.gameData.items[romInfo.gameData.itemLocations.GOLDENROD_DEPT_STORE_5F_MYSTERY_GIFT_GIRLS_GIFT.itemId].numericId,
          0x01,
          0x08,
          0x29,
          0x61,
          0x33,
          ...bytesFrom(eventFlagsMap["GOT_EON_MAIL"].numericId, 2),
          0x4C,
          0x41,
          0x62,
          0x54,
          0x49,
          0x91,
        ],
      },
    ])
  }
  
  // Eon Mail
  
  if (settings.LIMIT_ITEMS_FROM_GOLDENROD_POKEFAN) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "limitItemsFromGoldenrodPokefan.yml",
      {},
      {
        gotReviveFromPokefanEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_REVIVE_FROM_POKEFAN.numericId, 2)),
      },
    ).hunks)
  }
  
  // Initialize events
  
  const eventFlagsToInitialize: EventFlagId[] = compact([
    settings.SHUFFLE_ITEMS.VALUE ? "DIRECTOR_IN_UNDERGROUND_WAREHOUSE" : undefined,
    romInfo.gameData.numberOfMiltankBerries === 0 ? "HEALED_MOOMOO" : undefined,
  ])
  
  if (eventFlagsToInitialize.length > 0) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "initializeEventFlags.yml",
      {
        events: eventFlagsToInitialize.map((eventId) => {
          return {
            path: "initializeEventFlag.yml",
            extraIncludes: {},
            extraValues: {
              eventId: hexStringFrom(bytesFrom(eventFlagsMap[eventId].numericId, 2)),
            },
          }
        }),
      },
    ).hunks)
  }
  
  // Skip Clair Badge Test
  
  if (settings.SKIP_CLAIR_BADGE_TEST) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "skipClairBadgeTest.yml",
        {
          options: [
            shouldApplyReceiveItemsChanges ? "skipClairBadgeTestOptions/itemShuffle.yml" : "skipClairBadgeTestOptions/default.yml",
          ],
        },
        {
          risingbadgeItem: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.DRAGON_SHRINE_BADGE.itemId].numericId]),
          tm24Item: hexStringFrom([romInfo.gameData.items.TM24.numericId]),
          gotRisingbadgeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_RISINGBADGE.numericId, 2)),
        },
      ).hunks,
    ]
  } else if (shouldApplyReceiveItemsChanges) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      { offset: romOffsetFromBankAddress(101, 0x4E26), values: [0x31, ...bytesFrom(eventFlagsMap.GOT_RISINGBADGE.numericId, 2)] },
      ...Patch.fromYAML(
        romInfo,
        "clairBackupTM.yml",
        {},
        {
          itemId: hexStringFrom([romInfo.gameData.items[romInfo.gameData.itemLocations.DRAGONS_DEN_B1F_SOUTH_AREA_CLAIRS_GIFT.itemId].numericId]),
        },
      ).hunks,
    ]
  }
  
  // GS Ball
  
  if (settings.ENABLE_GS_BALL_EVENT) {
    romInfo.patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(24, 0x4F94),
        values: [0x31, 0xBC, 0x05, 0x09, 0x9E, 0x4F, 0x91],
      },
      {
        offset: romOffsetFromBankAddress(24, 0x4FD9),
        values: [0x31, 0xBC, 0x05, 0x09, 0xE3, 0x4F, 0x91],
      },
    ])
  }
  
  if (settings.SKIP_GS_BALL_INSPECTION) {
    romInfo.patchHunks.push({ offset: romOffsetFromBankAddress(99, 0x635D), values: [0x18] })
    romInfo.patchHunks.push({ offset: romOffsetFromBankAddress(99, 0x6364), values: [0x03, 0x78, 0x63] })
  }
  
  // Early Train
  
  if (settings.RIDE_TRAIN_WITHOUT_POWER) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      { offset: romOffsetFromBankAddress(21, 0x50EE), values: [0x18, 0x18, 0x18, 0x03] },
      { offset: romOffsetFromBankAddress(98, 0x6820), values: [0x18, 0x18, 0x18, 0x03] },
    ]
  }
  
  // Copycat
  
  if (settings.SKIP_TALKING_TO_COPYCAT) {
    romInfo.patchHunks.push({ offset: romOffsetFromBankAddress(100, 0x583B), values: [0x03, 0x44, 0x58] })
  }
  
  // Mount Moon
  
  if (settings.MOUNT_MOON_HIDDEN_ITEM_ALWAYS_ACCESSIBLE) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "mountMoonClefairyDanceChanges.yml",
    ).hunks)
  }
  
  // Weekday Siblings
  
  if (settings.WEEKDAY_SIBLINGS_ALWAYS_ACCESSIBLE) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(106, 0x4D77), values: [0x6F, 0x06, 0x90] }, // Sunny
      { offset: romOffsetFromBankAddress(105, 0x6165), values: [0x6F, 0x0A, 0x90] }, // Monica
      { offset: romOffsetFromBankAddress(104, 0x4F64), values: [0x6F, 0x08, 0x90] }, // Tuscany
      { offset: romOffsetFromBankAddress(28, 0x4016), values: [0x6F, 0x0B, 0x90] }, // Wesley
      { offset: romOffsetFromBankAddress(101, 0x400F), values: [0x6F, 0x08, 0x90] }, // Arthur
      { offset: romOffsetFromBankAddress(100, 0x4463), values: [0x6F, 0x0E, 0x90] }, // Frieda
      { offset: romOffsetFromBankAddress(105, 0x46DC), values: [0x6F, 0x09, 0x90] }, // Santos
      { offset: romOffsetFromBankAddress(106, 0x4DC7), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] }, // Sunny
      { offset: romOffsetFromBankAddress(105, 0x61E1), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] }, // Monica
      { offset: romOffsetFromBankAddress(104, 0x5051), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] }, // Tuscany
      { offset: romOffsetFromBankAddress(28, 0x4116), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] }, // Wesley
      { offset: romOffsetFromBankAddress(101, 0x4209), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] }, // Arthur
      { offset: romOffsetFromBankAddress(100, 0x4741), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] }, // Frieda
      { offset: romOffsetFromBankAddress(105, 0x4733), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] }, // Santos
      { offset: romOffsetFromBankAddress(100, 0x53CB), values: [0x0B] }, // Route 32 Hidden Item
      { offset: romOffsetFromBankAddress(28, 0x4937), values: [0x05] }, // Lake of Rage Hidden Item
    ])
  }
  
  // Curse TM Gift
  
  if (settings.CELADON_MANSION_ROOF_GIFT_ALWAYS_ACCESSIBLE) {
    romInfo.patchHunks.push({ offset: romOffsetFromBankAddress(28, 0x5B0B), values: [0x03] })
  }
  
  // Sanstorm TM Gift
  
  if (settings.REMOVE_TOHJO_FALLS_HOUSE_GIFT_HAPPINESS_REQUIREMENT) {
    romInfo.patchHunks.push({ offset: romOffsetFromBankAddress(30, 0x73A8), values: [0xAA] })
  }
  
  // Kenji
  
  if (settings.CHANGE_KENJI_GIFT_REQUIREMENTS.includes("REMOVE_TIME_REQUIREMENT")) {
    romInfo.patchHunks.push({ offset: romOffsetFromBankAddress(103, 0x60B5), values: [0xF4] })
  }
  
  if (settings.CHANGE_KENJI_GIFT_REQUIREMENTS.includes("REMOVE_CALL_REQUIREMENT")) {
    romInfo.patchHunks.push({ offset: romOffsetFromBankAddress(103, 0x60F4), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] })
  }
  
  // Return/Frustration TM Gifts
  
  if (settings.CHANGE_GOLDENROD_DEPT_STORE_TM_GIFTS_REQUIREMENTS.includes("REMOVE_DAY_REQUIREMENT")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(21, 0x6090), values: [0x6F, 0x07, 0x90] },
      { offset: romOffsetFromBankAddress(21, 0x60D0), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] },
    ])
  }
  
  if (settings.CHANGE_GOLDENROD_DEPT_STORE_TM_GIFTS_REQUIREMENTS.includes("REMOVE_HAPPINESS_REQUIREMENT")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(21, 0x60D6), values: [0x31, ...bytesFrom(eventFlagsMap.GOT_RETURN.numericId, 2), 0x09, 0xFB, 0x60, 0x4C, 0x43, 0x61, 0x55, 0x03, 0xEE, 0x60, 0x09, 0x12, 0x61, 0x4C, 0x43, 0x61, 0x55, 0x03, 0x03, 0x61] },
      { offset: romOffsetFromBankAddress(21, 0x60F5), values: [0x08, 0xFB, 0x60, 0x33, ...bytesFrom(eventFlagsMap.GOT_RETURN.numericId, 2), 0x31, ...bytesFrom(eventFlagsMap.GOT_FRUSTRATION.numericId, 2), 0x03, 0xE3, 0x60] },
      { offset: romOffsetFromBankAddress(21, 0x610D), values: [0x33, ...bytesFrom(eventFlagsMap.GOT_FRUSTRATION.numericId, 2)] },
    ])
  }
  
  if (settings.CHANGE_NATIONAL_PARK_CONTEST_REQUIREMENTS.includes("REMOVE_DAY_REQUIREMENT")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(26, 0x61AF), values: [0x03, 0xCA, 0x61] }, // Route 35 Gate Init
      { offset: romOffsetFromBankAddress(26, 0x6204), values: [0x03, 0x16, 0x62] }, // Route 35 Gate Guard Script
      { offset: romOffsetFromBankAddress(26, 0x6B29), values: [0x03, 0x42, 0x6B] }, // Route 36 Gate Init
      { offset: romOffsetFromBankAddress(26, 0x6BE0), values: [0x03, 0xF2, 0x6B] }, // Route 36 Gate Guard Script
    ])
  }
  
  if (settings.CHANGE_NATIONAL_PARK_CONTEST_REQUIREMENTS.includes("REMOVE_DAILY_LIMIT")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(26, 0x6218), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] }, // Route 35 Gate
      { offset: romOffsetFromBankAddress(26, 0x6BF4), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18] }, // Route 36 Gate
    ])
  }
  
  if (settings.CHANGE_NATIONAL_PARK_CONTEST_REQUIREMENTS.includes("LIMIT_PRIZES")) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "limitContestPrizes.yml",
      {
        options: [
          settings.CHANGE_NATIONAL_PARK_CONTEST_REQUIREMENTS.includes("MERGE_SECOND_AND_THIRD") ? "limitContestPrizesOptions/mergeSecondAndThird.yml" : "limitContestPrizesOptions/default.yml",
        ],
      },
      {
        gotFirstPlacePrizeEventFlag: hexStringFrom(bytesFrom(eventFlagsMap.GOT_FIRST_PLACE_PRIZE.numericId, 2)),
        gotSecondPlacePrizeEventFlag: hexStringFrom(bytesFrom(eventFlagsMap.GOT_SECOND_PLACE_PRIZE.numericId, 2)),
        gotThirdPlacePrizeEventFlag: hexStringFrom(bytesFrom(eventFlagsMap.GOT_THIRD_PLACE_PRIZE.numericId, 2)),
        gotConsolationPrizeEventFlag: hexStringFrom(bytesFrom(eventFlagsMap.GOT_CONSOLATION_PRIZE.numericId, 2)),
      },
    ).hunks)
  } else if (settings.CHANGE_NATIONAL_PARK_CONTEST_REQUIREMENTS.includes("MERGE_SECOND_AND_THIRD")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(47, 0x4341), values: [0x03, 0x4B, 0x43] },
    ])
  }
  
  if (settings.CHANGE_NATIONAL_PARK_CONTEST_REQUIREMENTS.includes("MERGE_SECOND_AND_THIRD")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(47, 0x429B), values: [0x32, 0x43] },
      { offset: romOffsetFromBankAddress(47, 0x4368), values: [0x43, 0x43] },
    ])
  }
  
  // Phone Call Behaviour
  
  if (settings.CHANGE_PHONE_CALL_TRAINER_BEHAVIOUR.includes("SKIP_TO_STRONGEST_AVAILABLE_REMATCH")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(22, 0x6FCF), values: [0x03, 0xE2, 0x6F] },
      { offset: romOffsetFromBankAddress(23, 0x4090), values: [0x03, 0xA7, 0x40] },
      { offset: romOffsetFromBankAddress(30, 0x40C5), values: [0x03, 0xDC, 0x40] },
      { offset: romOffsetFromBankAddress(30, 0x41A7), values: [0x03, 0xBE, 0x41] },
      { offset: romOffsetFromBankAddress(100, 0x4585), values: [0x03, 0x9C, 0x45] },
      { offset: romOffsetFromBankAddress(100, 0x4675), values: [0x03, 0x8C, 0x46] },
      { offset: romOffsetFromBankAddress(101, 0x4148), values: [0x03, 0x5F, 0x41] },
      { offset: romOffsetFromBankAddress(103, 0x49C3), values: [0x03, 0xDA, 0x49] },
      { offset: romOffsetFromBankAddress(103, 0x50D7), values: [0x03, 0xEA, 0x50] },
      { offset: romOffsetFromBankAddress(103, 0x51C9), values: [0x03, 0xDC, 0x51] },
      { offset: romOffsetFromBankAddress(103, 0x5872), values: [0x03, 0x81, 0x58] },
      { offset: romOffsetFromBankAddress(103, 0x5976), values: [0x03, 0x85, 0x59] },
      { offset: romOffsetFromBankAddress(103, 0x61C0), values: [0x03, 0xCF, 0x61] },
      { offset: romOffsetFromBankAddress(104, 0x4907), values: [0x03, 0x16, 0x49] },
      { offset: romOffsetFromBankAddress(104, 0x49F1), values: [0x03, 0x00, 0x4A] },
      { offset: romOffsetFromBankAddress(104, 0x56E8), values: [0x03, 0xFF, 0x56] },
      { offset: romOffsetFromBankAddress(104, 0x5D8A), values: [0x03, 0xA1, 0x5D] },
      { offset: romOffsetFromBankAddress(104, 0x5E7D), values: [0x03, 0x94, 0x5E] },
      { offset: romOffsetFromBankAddress(105, 0x4D81), values: [0x03, 0x90, 0x4D] },
      { offset: romOffsetFromBankAddress(105, 0x4E3D), values: [0x03, 0x4C, 0x4E] },
      { offset: romOffsetFromBankAddress(105, 0x549B), values: [0x03, 0xB2, 0x54] },
      { offset: romOffsetFromBankAddress(106, 0x5287), values: [0x03, 0x9A, 0x52] },
      { offset: romOffsetFromBankAddress(106, 0x56E2), values: [0x03, 0xF1, 0x56] },
      { offset: romOffsetFromBankAddress(107, 0x4059), values: [0x03, 0x70, 0x40] },
    ])
  }
  
  if (settings.CHANGE_PHONE_CALL_TRAINER_BEHAVIOUR.includes("SIMULTANEOUS_GIFTS")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(47, 0x54AD), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(47, 0x54BC), values: [0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(47, 0x54C2), values: [0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(47, 0x54C8), values: [0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(47, 0x5D57), values: [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(47, 0x5D61), values: [0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(47, 0x5D67), values: [0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(103, 0x59CF), values: [0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(103, 0x59D8), values: [0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(105, 0x5528), values: [0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(105, 0x5531), values: [0x18, 0x18, 0x18] },
      { offset: romOffsetFromBankAddress(105, 0x553A), values: [0x18, 0x18, 0x18] },
    ])
  }
  
  if (settings.CHANGE_PHONE_CALL_TRAINER_BEHAVIOUR.includes("SIMULTANEOUS_GIFTS") || settings.CHANGE_PHONE_CALL_TRAINER_BEHAVIOUR.includes("PREVENT_REPEAT_GIFTS")) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "wadeAndWiltonChanges.yml",
      {},
      {
        gotBerryFromWadeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_BERRY_FROM_WADE.numericId, 2)),
        gotPsncureberryFromWadeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_PSNCUREBERRY_FROM_WADE.numericId, 2)),
        gotPrzcureberryFromWadeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_PRZCUREBERRY_FROM_WADE.numericId, 2)),
        gotBitterBerryFromWadeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_BITTER_BERRY_FROM_WADE.numericId, 2)),
        gotUltraBallFromWiltonEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_ULTRA_BALL_FROM_WILTON.numericId, 2)),
        gotGreatBallFromWiltonEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_GREAT_BALL_FROM_WILTON.numericId, 2)),
        gotPokeBallFromWiltonEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_POKE_BALL_FROM_WILTON.numericId, 2)),
      },
    ).hunks)
  }
  
  if (settings.CHANGE_PHONE_CALL_TRAINER_BEHAVIOUR.includes("PRIORITIZE_USEFUL_CALLS")) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "prioritizeUsefulCalls.yml",
    ).hunks)
  }
  
  if (settings.CHANGE_PHONE_CALL_TRAINER_BEHAVIOUR.includes("PREVENT_REPEAT_GIFTS")) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "preventRepeatPhoneCallGifts.yml",
      {},
      {
        gotNuggetFromBeverlyEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_NUGGET_FROM_BEVERLY.numericId, 2)),
        gotStarPieceFromJoseEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_STAR_PIECE_FROM_JOSE.numericId, 2)),
        gotBerryFromWadeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_BERRY_FROM_WADE.numericId, 2)),
        gotPsncureberryFromWadeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_PSNCUREBERRY_FROM_WADE.numericId, 2)),
        gotPrzcureberryFromWadeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_PRZCUREBERRY_FROM_WADE.numericId, 2)),
        gotBitterBerryFromWadeEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_BITTER_BERRY_FROM_WADE.numericId, 2)),
        gotNuggetFromDerekEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_NUGGET_FROM_DEREK.numericId, 2)),
        gotPokeBallFromWiltonEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_POKE_BALL_FROM_WILTON.numericId, 2)),
        gotGreatBallFromWiltonEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_GREAT_BALL_FROM_WILTON.numericId, 2)),
        gotUltraBallFromWiltonEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_ULTRA_BALL_FROM_WILTON.numericId, 2)),
        gotPPUpFromKenjiEventFlagId: hexStringFrom(bytesFrom(eventFlagsMap.GOT_PP_UP_FROM_KENJI.numericId, 2)),
      },
    ).hunks)
  }
  
  if (settings.CHANGE_PHONE_CALL_TRAINER_BEHAVIOUR.includes("AUTOMATICALLY_OFFER_TO_SHARE_NUMBERS")) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(22, 0x6F94), values: [0x18] },
      { offset: romOffsetFromBankAddress(23, 0x413B), values: [0x18] },
      { offset: romOffsetFromBankAddress(30, 0x4080), values: [0x18] },
      { offset: romOffsetFromBankAddress(30, 0x4162), values: [0x18] },
      { offset: romOffsetFromBankAddress(101, 0x4103), values: [0x18] },
      { offset: romOffsetFromBankAddress(103, 0x517F), values: [0x18] },
      { offset: romOffsetFromBankAddress(103, 0x5833), values: [0x18] },
      { offset: romOffsetFromBankAddress(103, 0x5931), values: [0x18] },
      { offset: romOffsetFromBankAddress(103, 0x6181), values: [0x18] },
      { offset: romOffsetFromBankAddress(104, 0x48C2), values: [0x18] },
      { offset: romOffsetFromBankAddress(104, 0x56A9), values: [0x18] },
      { offset: romOffsetFromBankAddress(104, 0x5D45), values: [0x18] },
      { offset: romOffsetFromBankAddress(105, 0x5456), values: [0x18] },
      { offset: romOffsetFromBankAddress(105, 0x5B0E), values: [0x18] },
      { offset: romOffsetFromBankAddress(106, 0x5242), values: [0x18] },
      { offset: romOffsetFromBankAddress(106, 0x56A3), values: [0x18] },
    ])
  }
  
  // Red / Mount Silver
  
  if (settings.SKIP_E4_FOR_RED && (!settings.EARLY_MOUNT_SILVER.VALUE || !settings.EARLY_MOUNT_SILVER.SETTINGS.REQUIRE_TALKING_TO_OAK_FOR_RED)) {
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(47, 0x44C5), values: [0x18, 0x18, 0x18] },
    ])
  }
  
  if (settings.EARLY_MOUNT_SILVER.VALUE && settings.EARLY_MOUNT_SILVER.SETTINGS.REQUIRE_TALKING_TO_OAK_FOR_RED) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "requireOakForRed.yml",
    ).hunks)
  }
  
  if (settings.RANDOMIZE_NUMBER_OF_BADGES_FOR_OAK.VALUE) {
    if (romInfo.gameData.numberOfBadgesForOak === 0) {
      romInfo.patchHunks.push(...[
        { offset: romOffsetFromBankAddress(102, 0x73DF), values: [0x03, 0xF7, 0x73] },
      ])
    } else {
      romInfo.patchHunks.push(...[
        { offset: romOffsetFromBankAddress(102, 0x73DF), values: [0x0A, romInfo.gameData.numberOfBadgesForOak - 1] },
      ])
    }
  }
  
  // Kanto Badges
  
  if (settings.ADD_KANTO_BADGES_TO_TRAINER_CARD) {
    romInfo.patchHunks.push(...Patch.fromYAML(
      romInfo,
      "kantoBadgesInTrainerCard.yml",
    ).hunks)
    
    // Swap the Soul and Marsh badges so that they show up in the desired order on the tainer card
    romInfo.patchHunks.push(...[
      { offset: romOffsetFromBankAddress(32, 0x44D9), values: [0b00100000] }, // Swap the bitmasks for the Soul and Marsh badge engine actions
      { offset: romOffsetFromBankAddress(32, 0x44DC), values: [0b00010000] }, // Swap the bitmasks for the Soul and Marsh badge engine actions
      { offset: romOffsetFromBankAddress(62, 0x7E8C), values: [0x18, 0x03] }, // Swap the Soul and Marsh Type boosts
    ])
  }
  
  // Performance Improvements
    
  if (settings.IMPROVE_PERFORMANCE) {
    const performanceImprovementsPatch = Patch.fromYAML(
      romInfo,
      "performanceImprovements.yml",
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...performanceImprovementsPatch.hunks]
  }
  
  if (settings.FAST_BATTLE_CRIES) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "fastBattleCries.yml",
      ).hunks,
    ]
  }
  
  if (settings.SKIP_HP_XP_ANIMATIONS) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "skipHPXPAnimations.yml",
      ).hunks,
    ]
  }
  
  if (settings.SKIP_RUN_SFX) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "skipRunSFX.yml",
      ).hunks,
    ]
  }
  
  // Additional Options
  
  const selectedAdditionalOptionIds = settings.ADDITIONAL_OPTIONS
  
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
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...additionalOptionsPatch.hunks]
  }
  
  // Viewable DV'S
  
  if (settings.ADD_DV_TOGGLE_TO_STATS) {
    romInfo.patchHunks.push(...Patch.fromYAML(romInfo, "viewableDVs.yml").hunks)
  }
}

const createBasePatch = (params: {
  appVersion: string
  checkValue: string
  romInfo: ROMInfo
}) => {
  const {
    appVersion,
    checkValue,
    romInfo,
  } = params
  
  const basePatch = Patch.fromYAML(
    romInfo,
    "randomizerBase.yml",
    {},
    {
      versionNumber: hexStringFrom(bytesFromTextData(appVersion)),
      checkValue: hexStringFrom(bytesFromTextData(checkValue)),
    },
  )
  
  romInfo.patchHunks.push(...basePatch.hunks)
}

const createPlayerOptionsPatches = (params: {
  settings: Settings
  playerOptions: PlayerOptions
  romData: Uint8Array
  gameData: PlayerSpecificGameData
}) => {
  const {
    settings,
    playerOptions,
    romData,
    gameData,
  } = params
  
  const patchHunks: DataHunk[] = []
  
  // Skip Gender
  
  const genderId = playerSpriteMap[playerOptions.PLAYER_GENDER].numericId
  
  if (settings.SKIP_GENDER) {
    patchHunks.push({
      offset: romOffsetFromBankAddress(1, 0x5B98),
      values: [genderId],
    })
  }
  
  patchHunks.push({
    offset: romOffsetFromBankAddress(18, 0x4E03),
    values: bytesFrom(genderId + 1, 1),
  })
  
  // Player Name
  
  patchHunks.push(...[
    {
      offset: romOffsetFromBankAddress(1, 0x60D3),
      values: bytesFromTextData(`${playerOptions.PLAYER_NAME}@`),
    },
    {
      offset: romOffsetFromBankAddress(1, 0x60DE),
      values: bytesFromTextData(`${playerOptions.PLAYER_NAME}@`),
    },
  ])
  
  // Default Options
  
  const selectedAdditionalOptionIds = settings.ADDITIONAL_OPTIONS
    
  patchHunks.push(...[
    {
      offset: romOffsetFromBankAddress(5, 0x4F7C),
      values: [
        primaryOptionsValue(
          {
            textSpeed: playerOptions.TEXT_SPEED,
            holdToMashEnabled: playerOptions.HOLD_TO_MASH,
            battleSceneEnabled: playerOptions.BATTLE_SCENE,
            battleStyle: playerOptions.BATTLE_STYLE,
            sound: playerOptions.SOUND,
          },
          selectedAdditionalOptionIds.includes("INSTANT_TEXT"),
          selectedAdditionalOptionIds.length > 0,
        ),
      ],
    },
    {
      offset: romOffsetFromBankAddress(5, 0x4F81),
      values: [
        secondaryOptionsValue({
          nicknamesEnabled: playerOptions.NICKNAMES,
          rideMusic: playerOptions.RIDE_MUSIC,
          menuAccountEnabled: playerOptions.MENU_ACCOUNT,
        }),
      ],
    },
    { offset: romOffsetFromBankAddress(5, 0x4F7E), values: [frameTypeValue(playerOptions.FRAME_TYPE)] },
    { offset: romOffsetFromBankAddress(5, 0x4F80), values: [printToneValue(playerOptions.PRINT_TONE)] },
  ])
  
  // Trainer Names
  
  if (playerOptions.CHANGE_NAMES.VALUE) {
    // Class names
    
    patchHunks.push({
      offset: romOffsetFromBankAddress(11, 0x41EF),
      values: Object.values(gameData.trainerClasses).flatMap((trainerClass) => {
        return [
          ...bytesFromTextData(trainerClass.name),
          0x50,
        ]
      }),
    })
    
    // Trainer names
    
    const trainerDataOffset = romOffsetFromBankAddress(14, 0x5A1F)
    let trainerIndex = 0
    let readOffset = trainerDataOffset
    let writeOffset = trainerDataOffset
    const trainerGroupOffsets: number[] = []
    let trainerData: number[] = []
    let lastClassId = ""
    
    while (trainerIndex < gameData.trainers.length) {
      if (lastClassId !== gameData.trainers[trainerIndex].classId) {
        const trainerClassIndex = Object.values(gameData.trainerClasses).findIndex((trainerClass) => {
          return trainerClass.id === gameData.trainers[trainerIndex].classId
        })
        
        while (trainerClassIndex >= trainerGroupOffsets.length) {
          trainerGroupOffsets.push(writeOffset)
        }
        
        lastClassId = gameData.trainers[trainerIndex].classId
      }
      
      const nameBytes = bytesFromTextData(`${gameData.trainers[trainerIndex].name}@`)
      
      trainerData = [
        ...trainerData,
        ...nameBytes,
      ]
      
      writeOffset += nameBytes.length
      
      let isBeyondName = false
      
      while (romData[readOffset] !== 0xFF) {
        if (isBeyondName) {
          trainerData = [...trainerData, romData[readOffset]]
          writeOffset++
        } else if (romData[readOffset] === 0x50) {
          isBeyondName = true
        }
        readOffset++
      }
      
      trainerData = [
        ...trainerData,
        romData[readOffset],
      ]
      
      readOffset++
      writeOffset++
      trainerIndex++
    }
    
    patchHunks.push(...[
      {
        offset: romOffsetFromBankAddress(14, 0x5999),
        values: trainerGroupOffsets.flatMap((offset) => {
          return bytesFrom(bankAddressOfROMOffset(offset), 2)
        }),
      },
      {
        offset: trainerDataOffset,
        values: trainerData,
      },
    ])
  }
  
  // Pokémon Nicknames
  
  const firstTradeNicknameOffset = romOffsetFromBankAddress(63, 0x4E5B)
  
  patchHunks.push(...[
    ...Object.values(gameData.trades).map((trade, index) => {
      return {
        offset: firstTradeNicknameOffset + 32 * index,
        values: bytesFromTextData(trade.nickname.padEnd(11, "@")),
      }
    }),
    {
      offset: romOffsetFromBankAddress(26, 0x5DB9),
      values: bytesFromTextData(gameData.kenyaNickname.padEnd(6, "@")),
    },
    {
      offset: romOffsetFromBankAddress(1, 0x7376),
      values: bytesFromTextData(gameData.shuckieNickname.padEnd(8, "@")),
    },
  ])
  
  return patchHunks
}

const createPCRP = (params: {
  appVersion: string
  checkValue: string
  settings: Settings
  inputROMData: Uint8Array
  sharedOutputROMData: Buffer
}) => {
  const {
    appVersion,
    checkValue,
    settings,
    inputROMData,
    sharedOutputROMData,
  } = params
  
  const encode = (value: number) => {
    const result = []
    let remainder = value
    
    while (remainder >= 0) {
      let byte = remainder & 0b01111111
      remainder >>= 7
      
      if (remainder === 0) {
        byte += 0b10000000
      }
      
      result.push(byte)
      remainder--
    }
    
    return Buffer.from(result)
  }
  
  const metadata = Buffer.from(compressToUint8Array(yaml.stringify({
    settingsVersion: appVersion,
    minimumSupportedVersion: "0.3.0",
    settings: settings,
    checkValue: checkValue,
  })))
  
  const buffers: Buffer[] = []
   
  buffers.push(Buffer.from("BPS1", "ascii"))
  buffers.push(encode(inputROMData.length))
  buffers.push(encode(sharedOutputROMData.length))
  buffers.push(encode(metadata.length))
  buffers.push(metadata)
  
  let currentAction: {
    action: 0
    length: number
  } | {
    action: 1
    data: number[]
  } | undefined
  
  const processCurrentAction = () => {
    if (isNullish(currentAction)) {
      return
    }
    
    if (currentAction.action === 0) {
      buffers.push(encode(currentAction.action | currentAction.length - 1 << 2))
    } else if (currentAction.action === 1) {
      buffers.push(encode(currentAction.action | currentAction.data.length - 1 << 2))
      buffers.push(Buffer.from(currentAction.data))
    }
  }
  
  sharedOutputROMData.forEach((byte, index) => {
    let action: number | undefined
    if (inputROMData[index] === byte) {
      action = 0
    } else {
      action = 1
    }
    
    if (action !== currentAction?.action) {
      processCurrentAction()
      
      if (action === 0) {
        currentAction = {
          action: action,
          length: 0,
        }
      } else if (action === 1) {
        currentAction = {
          action: action,
          data: [],
        }
      }
    }
    
    if (currentAction?.action === 0) {
      currentAction.length++
    } else if (currentAction?.action === 1) {
      currentAction.data.push(byte)
    }
  })
  
  processCurrentAction()
  
  buffers.push(Buffer.from(bytesFrom(crc32(inputROMData), 4)))
  buffers.push(Buffer.from(bytesFrom(crc32(sharedOutputROMData), 4)))
  
  const data = Buffer.concat(buffers)
  
  return Buffer.concat([
    data,
    Buffer.from(bytesFrom(crc32(data), 4)),
  ])
}