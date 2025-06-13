import { ROMInfo, ROMOffset } from "@lib/gameData/romInfo"
import { bytesFromLandAndWaterEncounterRates } from "@lib/generator/dataConverters/encounterRates"
import { bytesFromContestEncounters, bytesFromFishingEncounters, bytesFromLandAndWaterEncounters, bytesFromTreeAndRockEncounters, encountersGroupedByType } from "@lib/generator/dataConverters/encounters"
import { dataHunkFromMapObjectEvent } from "@lib/generator/dataConverters/mapObjectEvent"
import { bytesFromOddEgg } from "@lib/generator/dataConverters/oddEgg"
import { frameTypeValue, primaryOptionsValue, printToneValue, secondaryOptionsValue } from "@lib/generator/dataConverters/options"
import { bytesForEvolutionsAndLevelUpMovesFromPokemon, bytesForInfoFromPokemon } from "@lib/generator/dataConverters/pokemon"
import { bytesFromTrade } from "@lib/generator/dataConverters/trades"
import { updateEncounterRates } from "@lib/generator/gameDataProcessors/encounterRates"
import { updateRandomEncounters } from "@lib/generator/gameDataProcessors/encounters"
import { updateEventPokemon, updateEventPokemonMoves } from "@lib/generator/gameDataProcessors/eventPokemon"
import { updateEvolutionMethods } from "@lib/generator/gameDataProcessors/evolutionMethods"
import { updateIntroPokemon } from "@lib/generator/gameDataProcessors/introPokemon"
import { shuffleItems, updateAccessLogic, updateItems } from "@lib/generator/gameDataProcessors/itemLocations"
import { updateLevelUpMoves } from "@lib/generator/gameDataProcessors/levelUpMoves"
import { updateMapObjectEvents } from "@lib/generator/gameDataProcessors/mapObjectEvents"
import { updateMarts } from "@lib/generator/gameDataProcessors/marts"
import { updateMoveTutorCost } from "@lib/generator/gameDataProcessors/moveTutorCost"
import { updateNumberOfMiltankBerries } from "@lib/generator/gameDataProcessors/numberOfMiltankBerries"
import { updatePokemonInfo } from "@lib/generator/gameDataProcessors/pokemonInfo"
import { updateStarterItems, updateStarters } from "@lib/generator/gameDataProcessors/starters"
import { updateTeachableMoves } from "@lib/generator/gameDataProcessors/teachableMoves"
import { updateTrades } from "@lib/generator/gameDataProcessors/trades"
import { updateTrainers } from "@lib/generator/gameDataProcessors/trainers"
import { generatorLog } from "@lib/generator/log"
import { DataHunk, Patch } from "@lib/generator/patch"
import { createPCRP } from "@lib/generator/pcrpProcessor"
import { Random } from "@lib/generator/random"
import { getVanillaROM } from "@lib/userData/vanillaROM"
import { attemptWriteFile, getFilePathFromUserInput } from "@lib/utils/dialogUtils"
import { defaultSettingsViewModel } from "@shared/appData/defaultSettingsViewModel"
import { type PlayerOptions, type Settings, settingsFromViewModel } from "@shared/appData/settingsFromViewModel"
import { eventFlagsMap } from "@shared/gameData/eventFlags"
import { gen5BaseExpMap } from "@shared/gameData/gen5BaseExp"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsMap } from "@shared/gameData/items"
import { movesMap } from "@shared/gameData/moves"
import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { pokemonMap } from "@shared/gameData/pokemon"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import { trainerMovementBehavioursMap } from "@shared/gameData/trainerMovementBehaviours"
import { itemHoldEffectsMap, itemMenuActionsMap } from "@shared/types/gameData/item"
import type { EventFlagId } from "@shared/types/gameDataIds/eventFlags"
import { type EventPokemonId } from "@shared/types/gameDataIds/eventPokemon"
import { type ItemId } from "@shared/types/gameDataIds/items"
import { starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import type { TeachableMoveId } from "@shared/types/gameDataIds/teachableMoves"
import { trainerGroupIds } from "@shared/types/gameDataIds/trainerGroups"
import { bytesFromTextData, bytesFromTextScript } from "@shared/utils/textConverters"
import { bytesFrom, compact, hexStringFrom, isNotNullish, isNullish } from "@utils"
import crypto from "crypto"
import { app } from "electron"
import fs from "fs"
import hash from "object-hash"

export const generatorDataFrom = (params: {
  customSeed: string | undefined
  settings: Settings
}) => {
  const {
    customSeed,
    settings,
  } = params
  
  const romInfo = ROMInfo.vanilla()
  const seed = customSeed ?? crypto.randomUUID()
  const random = new Random(seed)
  
  const isDefaultSettings = JSON.stringify(settings) === JSON.stringify(settingsFromViewModel(defaultSettingsViewModel()))
  
  if (!isDefaultSettings) {
    updateGameData(settings, romInfo, random)
    createPatches(settings, romInfo)
  }
  
  const checkValue: string = isDefaultSettings ? "00000000" : hash([...romInfo.patchHunks]).slice(0, 8).toUpperCase()
  
  return {
    romInfo: romInfo,
    settings: settings,
    seed: seed,
    checkValue: checkValue,
  }
}

export const generateROM = async (params: {
  data: ReturnType<typeof generatorDataFrom>
  playerOptions: PlayerOptions
  showInputInRenderer: boolean
  defaultFileName?: string
  inputROM?: Buffer
  forceOverwrite?: boolean
  throwErrorOnWriteFailure?: boolean
}) => {
  const {
    data,
    playerOptions,
    showInputInRenderer,
    defaultFileName,
    inputROM,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
  
  const fileData = inputROM ?? await getVanillaROM(showInputInRenderer)
  
  if (isNullish(fileData)) {
    throw new Error("A Pokémon Crystal Version 1.1 ROM is required.")
  }
  
  const basePatch = Patch.fromYAML(
    data.romInfo,
    "randomizerBase.yml",
    {},
    {
      versionNumber: hexStringFrom(bytesFromTextData(app.getVersion())),
      checkValue: hexStringFrom(bytesFromTextData(data.checkValue)),
    },
  )
  
  data.romInfo.patchHunks = [...data.romInfo.patchHunks, ...basePatch.hunks]
  
  createPlayerOptionsPatches(data.settings, playerOptions, data.romInfo)
  
  data.romInfo.patchHunks.forEach((hunk) => {
    fileData.set(hunk.values, hunk.offset.bank() * ROMInfo.bankSize + (hunk.offset.bankAddress() - (hunk.offset.bank() === 0 ? 0 : ROMInfo.bankSize)))
  })
  
  let filePath: string | undefined
  
  const dialogParams = {
    title: "Save Generated ROM to:",
    buttonLabel: "Generate",
    fileType: "gbc" as const,
    defaultFilePath: `${defaultFileName ?? data.checkValue}.gbc`,
  }
    
  if (defaultFileName) {
    filePath = attemptWriteFile({
      ...dialogParams,
      data: fileData,
      forceOverwrite: forceOverwrite,
      throwErrorOnWriteFailure: throwErrorOnWriteFailure,
    })
  } else {
    filePath = getFilePathFromUserInput(dialogParams)
      
    if (isNotNullish(filePath)) {
      fs.writeFileSync(filePath, fileData)
    }
  }
  
  if (isNullish(filePath)) {
    throw new Error("A save location must be specified.")
  }
  
  return {
    full: filePath,
    withoutExtension: filePath.replace(/\.gbc$/, ""),
  }
}

export const generateLog = (params: {
  data: ReturnType<typeof generatorDataFrom>
  defaultFileName?: string
  forceOverwrite?: boolean
  throwErrorOnWriteFailure?: boolean
}) => {
  const {
    data,
    defaultFileName,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
  
  const log = generatorLog({
    seed: data.seed,
    checkValue: data.checkValue,
    settings: data.settings,
    gameData: data.romInfo.gameData,
  })
  
  attemptWriteFile({
    dialogTitle: "Save log to:",
    fileType: "text",
    defaultFilePath: `${defaultFileName}.log.txt`,
    data: log,
    forceOverwrite: forceOverwrite,
    throwErrorOnWriteFailure: throwErrorOnWriteFailure,
  })
}

export const generatePatch = (params: {
  data: ReturnType<typeof generatorDataFrom>
  defaultFileName?: string
  forceOverwrite?: boolean
  throwErrorOnWriteFailure?: boolean
}) => {
  const {
    data,
    defaultFileName,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
  
  const pcrpData = createPCRP({
    seed: data.seed,
    settings: data.settings,
  })
            
  attemptWriteFile({
    dialogTitle: "Save patch to:",
    fileType: "pcrp",
    defaultFilePath: `${defaultFileName}.pcrp`,
    data: pcrpData,
    forceOverwrite: forceOverwrite,
    throwErrorOnWriteFailure: throwErrorOnWriteFailure,
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
  updateAccessLogic(settings, romInfo)
  shuffleItems(settings, romInfo, random) // Must be after updateAccessLogic
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
      new DataHunk(
        ROMOffset.fromBankAddress(1, 0x5FD2),
        [numericId],
      ),
      new DataHunk(
        ROMOffset.fromBankAddress(1, 0x6050),
        [numericId],
      ),
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
      
    const item = itemsMap[itemId]
      
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      new DataHunk(
        ROMOffset.fromBankAddress(
          starterLocationsMap[locationId].itemRomOffset[0],
          starterLocationsMap[locationId].itemRomOffset[1],
        ),
        [item.numericId],
      ),
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
  
  if (settings.RANDOMIZE_EVENT_POKEMON || settings.RANDOMIZE_RANDOM_ENCOUNTERS) {
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
      new DataHunk(
        ROMOffset.fromBankAddress(126, 0x756E),
        romInfo.gameData.oddEggs.flatMap((oddEgg) => {
          return bytesFromOddEgg(oddEgg)
        })
      ),
    ]
  }
    
  // Encounter Rates
    
  if (settings.CHANGE_POKEMON_ENCOUNTER_RATIOS.VALUE) {
    const encounterRateSettings = settings.CHANGE_POKEMON_ENCOUNTER_RATIOS.SETTINGS
      
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      new DataHunk(
        ROMOffset.fromBankAddress(10, 0x61CB),
        bytesFromLandAndWaterEncounterRates(
          encounterRateSettings.GRASS_AND_CAVES,
          encounterRateSettings.WATER,
        ),
      ),
    ]
  }
    
  // Encounters
    
  const groupedEncounters = encountersGroupedByType(romInfo.gameData.encounters)
    
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    new DataHunk(
      ROMOffset.fromBankAddress(10, 0x65E9),
      bytesFromLandAndWaterEncounters(groupedEncounters.landAndWaterEncounters),
    ),
  ]
    
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    new DataHunk(
      ROMOffset.fromBankAddress(46, 0x42FA),
      bytesFromTreeAndRockEncounters(groupedEncounters.treeEncounters, groupedEncounters.rockEnounters),
    ),
  ]
    
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    new DataHunk(
      ROMOffset.fromBankAddress(36, 0x64E3),
      bytesFromFishingEncounters(groupedEncounters.fishingEncounters, groupedEncounters.fishingTimeGroupEncounters),
    ),
  ]
    
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    new DataHunk(
      ROMOffset.fromBankAddress(37, 0x7D87),
      bytesFromContestEncounters(groupedEncounters.contestEncounters),
    ),
  ]
  
  if (settings.PREVENT_WILD_POKEMON_FLEEING) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      new DataHunk(ROMOffset.fromBankAddress(15, 0x459A), [0xFF]),
      new DataHunk(ROMOffset.fromBankAddress(15, 0x45A8), [0xFF]),
      new DataHunk(ROMOffset.fromBankAddress(15, 0x45B1), [0xFF]),
    ]
  }
    
  // Trades
  
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    new DataHunk(
      ROMOffset.fromBankAddress(63, 0x4E58),
      Object.values(romInfo.gameData.trades).flatMap((trade) => {
        return bytesFromTrade(trade)
      }),
    ),
  ]
  
  // Evolutions
    
  if (settings.CHANGE_HAPPINESS_EVOLUTION_REQUIREMENT.VALUE) {
    romInfo.patchHunks = [...romInfo.patchHunks, new DataHunk(ROMOffset.fromBankAddress(16, 0x6287), [settings.CHANGE_HAPPINESS_EVOLUTION_REQUIREMENT.SETTINGS.MINIMUM_HAPPINESS])]
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
      }
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...teachableMovesPatch.hunks]
  }
  
  // Items
  
  const shouldApplyReceiveItemsChanges = settings.RANDOMIZE_REGULAR_ITEM_BALLS.VALUE
    || settings.RANDOMIZE_TM_ITEM_BALLS.VALUE
    || settings.RANDOMIZE_REGULAR_HIDDEN_ITEMS.VALUE
    || settings.SHUFFLE_ITEMS.VALUE
    || settings.START_WITH_ITEMS.SETTINGS.REPLACE_EXISTING_ITEMS.VALUE
  
  if (shouldApplyReceiveItemsChanges) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "receiveItemChanges.yml",
        {},
        {
          regularItemPickupSound: settings.FASTER_ITEM_PICKUP_SFX ? "90 00" : "01 00",
          elmsAideNumberOfItems: hexStringFrom([Math.min(itemCategoriesMap[itemsMap[romInfo.gameData.itemLocations.ELMS_LAB_AIDES_GIFT_FOR_MYSTERY_EGG.itemId].category].slotSize, 5)]),
        },
      ).hunks,
      new DataHunk(
        ROMOffset.fromBankAddress(1, 0x67C1),
        Array(0xF9).fill(undefined).flatMap((_, index) => {
          const item = Object.values(itemsMap).find((item) => {
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
      ),
      new DataHunk(
        ROMOffset.fromBankAddress(114, 0x4000),
        Array(0xF9).fill(undefined).flatMap((_, index) => {
          const item = Object.values(itemsMap).find((item) => {
            return item.numericId === index + 1
          })
        
          if (isNotNullish(item)) {
            return bytesFromTextData(`${item.inGameName}@`)
          } else {
            return bytesFromTextData("@")
          }
        }),
      ),
    ]
  
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Object.values(romInfo.gameData.itemLocations).filter((itemLocation) => {
        return itemLocation.type !== "FRUIT_TREE"
      }).flatMap((itemLocation) => {
        return itemLocation.romOffsets.map((romOffset) => {
          return new DataHunk(
            ROMOffset.fromBankAddress(
              romOffset[0],
              romOffset[1],
            ),
            [itemsMap[itemLocation.itemId].numericId],
          )
        })
      }),
    ]
  } else if (settings.FASTER_ITEM_PICKUP_SFX) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      new DataHunk(ROMOffset.fromBankAddress(4, 0x62DC), [0x90, 0x00, 0x86, 0x18]),
      new DataHunk(ROMOffset.fromBankAddress(37, 0x6FF5), [0x90]),
      new DataHunk(ROMOffset.fromBankAddress(47, 0x4DBF), [0x90]),
    ]
  }
  
  if (settings.SINGLE_USE_FRUIT_TREES) {
    romInfo.patchHunks.push(...Object.values(romInfo.gameData.itemLocations).filter((itemLocation) => {
      return itemLocation.type === "FRUIT_TREE"
    }).flatMap((itemLocation) => {
      return itemLocation.romOffsets.map((romOffset) => {
        return new DataHunk(
          ROMOffset.fromBankAddress(
            romOffset[0],
            romOffset[1],
          ),
          [itemsMap[itemLocation.itemId].numericId, 1],
        )
      })
    }))
  } else if (shouldApplyReceiveItemsChanges) {
    romInfo.patchHunks.push(...[
      new DataHunk(
        ROMOffset.fromBankAddress(
          17,
          0x4097,
        ),
        Object.values(romInfo.gameData.itemLocations).filter((itemLocation) => {
          return itemLocation.type === "FRUIT_TREE"
        }).map((itemLocation) => {
          return itemsMap[itemLocation.itemId].numericId
        })
      ),
      ...Object.values(romInfo.gameData.itemLocations).filter((itemLocation) => {
        return itemLocation.type === "FRUIT_TREE"
      }).flatMap((itemLocation, index) => {
        return itemLocation.romOffsets.map((romOffset) => {
          return new DataHunk(
            ROMOffset.fromBankAddress(
              romOffset[0],
              romOffset[1] + 1,
            ),
            [index + 1],
          )
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
          
        const item = itemsMap[itemId as ItemId]
              
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
        }
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
  
  if (settings.EARLY_CHARRGROVE_MART_POKE_BALLS) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      new DataHunk(
        ROMOffset.fromBankAddress(101, 0x6813),
        [1],
      ),
    ]
  }
  
  if (settings.BUYABLE_EVOLUTION_STONES) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      new DataHunk(
        ROMOffset.fromBankAddress(1, 0x67F2),
        bytesFrom(2100, 2),
      ),
    ]
  }
  
  if (settings.BUYABLE_TM12) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks, ...Patch.fromYAML(
        romInfo,
        "buyableSweetScent.yml",
      ).hunks,
    ]
  }
  
  if (
    settings.CHERRYGROVE_MART_REPELS
    || settings.EARLY_CHARRGROVE_MART_POKE_BALLS
    || settings.VIOLET_MART_REPELS
    || settings.BUYABLE_EVOLUTION_STONES
    || settings.BUYABLE_TM12
  ) {
    const martsPatch = Patch.fromYAML(
      romInfo,
      "marts.yml",
      {
        marts: Object.values(romInfo.gameData.marts).map((mart) => {
          return {
            path: "martItems.yml",
            extraIncludes: {},
            extraValues: {
              numberOfItems: hexStringFrom([mart.items.length]),
              items: hexStringFrom(mart.items.map((item) => { return itemsMap[item].numericId })),
            },
          }
        }),
      }
    )

    romInfo.patchHunks = [...romInfo.patchHunks, ...martsPatch.hunks]
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
        }
      ).hunks,
    ]
  }
  
  // Skip Gender
  
  if (settings.SKIP_GENDER) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "skipGender.yml",
        {},
        {
          genderId: hexStringFrom(bytesFrom(playerSpriteMap.GIRL.numericId, 1)),
        }
      ).hunks,
    ]
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
      trainerGroups: trainerGroupIds.map((groupId) => {
        return {
          path: "trainerGroup.yml",
          extraIncludes: {
            trainers: romInfo.gameData.trainers.filter((trainer) => {
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
                trainerType = 1
              } else if (hasItems) {
                trainerType = 2
              }
              
              const trainerName = trainer.groupId === "RIVAL_1" || trainer.groupId === "RIVAL_2" ? "?" : trainer.name
                
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
    }
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
      }
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
      new DataHunk(ROMOffset.fromBankAddress(47, 0x4430), [0x14]),
    ]
  }
  
  // Ilex Cut Tree
  
  if (settings.REMOVE_ILEX_CUT_TREE) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      new DataHunk(ROMOffset.fromBankAddress(44, 0x418F), [0x17]),
    ]
  }
  
  // Goldenrod store basement
  
  if (settings.CLEAR_GOLDENROD_STORE_BASEMENT) {
    romInfo.patchHunks.push(...[
      new DataHunk(ROMOffset.fromBankAddress(43, 0x5EEF), [0x0D]),
      new DataHunk(ROMOffset.fromBankAddress(43, 0x5EF6), [0x0D]),
      new DataHunk(ROMOffset.fromBankAddress(43, 0x5F03), [0x0D]),
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
      new DataHunk(
        ROMOffset.fromBankAddress(27, 0x60A7),
        [0x18]
      ),
      new DataHunk(
        ROMOffset.fromBankAddress(27, 0x60BE),
        [0x18]
      ),
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
        whirlpoolItem: hexStringFrom([itemsMap[romInfo.gameData.itemLocations.TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT.itemId].numericId]),
        basementKeyItem: hexStringFrom([itemsMap[romInfo.gameData.itemLocations.RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT.itemId].numericId]),
        cardKeyItem: hexStringFrom([itemsMap[romInfo.gameData.itemLocations.GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT.itemId].numericId]),
        clearBellItem: hexStringFrom([itemsMap[romInfo.gameData.itemLocations.RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT.itemId].numericId]),
      }
    )
      
    romInfo.patchHunks = [...romInfo.patchHunks, ...additionalOptionsPatch.hunks]
  }
  
  // Buena
  
  if (settings.BUENA_ALWAYS_GIVES_ITEM) {
    romInfo.patchHunks.push(new DataHunk(
      ROMOffset.fromBankAddress(34, 0x6DDB),
      [0x31, 0x3D, 0x03, 0x08, 0x00, 0x58, 0x34, 0x13, 0x00, 0x09, 0x65, 0x58]
    ))
  }
  
  // Sick Miltank
  
  if (settings.RANDOMIZE_NUMBER_OF_BERRIES_FOR_MILTANK.VALUE) {
    romInfo.patchHunks.push(...[
      new DataHunk(
        ROMOffset.fromBankAddress(39, 0x4CDE),
        [
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
        ]
      ),
    ])
  }
  
  // Early Tin Tower
  
  if (settings.CHANGE_TIN_TOWER_REQUIREMENTS.length > 0) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...settings.CHANGE_TIN_TOWER_REQUIREMENTS.includes("SKIP_E4") ? [
        new DataHunk(ROMOffset.fromBankAddress(97, 0x5035), [0x18, 0x21, 0x46]),
      ] : [],
      ...settings.CHANGE_TIN_TOWER_REQUIREMENTS.includes("SKIP_BEASTS") ? [
        new DataHunk(ROMOffset.fromBankAddress(97, 0x503B), [0x32, 0xC5, 0x07, 0x33, 0xB6, 0x07, 0x0F, 0x96, 0x00, 0x08, 0x50, 0x50]),
        new DataHunk(ROMOffset.fromBankAddress(97, 0x507D), [0x90]),
      ] : [],
    ]
  }
  
  // Ho-Oh Level
  
  if (settings.CHANGE_HO_OH_LEVEL.VALUE) {
    romInfo.patchHunks.push(new DataHunk(
      ROMOffset.fromBankAddress(29, 0x7255),
      [settings.CHANGE_HO_OH_LEVEL.SETTINGS.LEVEL]
    ))
  }
  
  // Ho-oh Chamber
  
  if (settings.CLIMB_TIN_TOWER_FOR_HO_OH_CHAMBER) {
    romInfo.patchHunks.push(new DataHunk(
      ROMOffset.fromBankAddress(34, 0x6DDB),
      [0x11, 0x17, 0x03, 0x06, 0x02, 0xCD, 0x6F, 0x2E, 0x28, 0x09, 0x00]
    ))
  }
  
  // Boat changes
  
  if (settings.CHANGE_SS_AQUA_REQUIREMENTS.includes("SKIP_E4")) {
    romInfo.patchHunks.push(new DataHunk(
      ROMOffset.fromBankAddress(47, 0x44C9),
      bytesFrom(eventFlagsMap.OLIVINE_PORT_SPRITES_BEFORE_HALL_OF_FAME.numericId, 2),
    ))
  }
  
  if (settings.CHANGE_SS_AQUA_REQUIREMENTS.includes("BOARD_ANY_DAY")) {
    romInfo.patchHunks.push(...[
      new DataHunk(ROMOffset.fromBankAddress(29, 0x4935), [0x03]),
      new DataHunk(ROMOffset.fromBankAddress(29, 0x49A7), [0x03]),
      new DataHunk(ROMOffset.fromBankAddress(29, 0x4E33), [0x03, 0x49, 0x4E]),
      new DataHunk(ROMOffset.fromBankAddress(29, 0x4E9F), [0x03, 0xB5, 0x4E]),
    ])
    
    romInfo.freeSpace(ROMOffset.fromBankAddress(29, 0x4938), 22)
    romInfo.freeSpace(ROMOffset.fromBankAddress(29, 0x49AA), 22)
    romInfo.freeSpace(ROMOffset.fromBankAddress(29, 0x4E36), 19)
    romInfo.freeSpace(ROMOffset.fromBankAddress(29, 0x4EA2), 19)
  }
  
  if (settings.CHANGE_SS_AQUA_REQUIREMENTS.includes("REBOARD_IMMEDIATELY")) {
    romInfo.patchHunks.push(...[
      new DataHunk(ROMOffset.fromBankAddress(29, 0x48C2), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]),
      new DataHunk(ROMOffset.fromBankAddress(29, 0x499E), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]),
      new DataHunk(ROMOffset.fromBankAddress(29, 0x4DC6), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]),
      new DataHunk(ROMOffset.fromBankAddress(29, 0x4E99), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]),
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
      new DataHunk(ROMOffset.fromBankAddress(30, 0x4C53), [0x18, 0x21, 0x45]), // Allow turning in mystery egg before talking to mr pokemon
      ...Patch.fromYAML(
        romInfo,
        "radioTower5FCutsceneChanges.yml",
      ).hunks,
    ]
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
      }
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
          risingbadgeItem: hexStringFrom([itemsMap[romInfo.gameData.itemLocations.DRAGON_SHRINE_BADGE.itemId].numericId]),
          tm24Item: hexStringFrom([itemsMap.TM24.numericId]),
        }
      ).hunks,
    ]
  } else if (shouldApplyReceiveItemsChanges) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      new DataHunk(ROMOffset.fromBankAddress(101, 0x4E26), [0x31, 0x0C, 0x01]),
      ...Patch.fromYAML(
        romInfo,
        "clairBackupTM.yml",
        {},
        {
          itemId: hexStringFrom([itemsMap[romInfo.gameData.itemLocations.DRAGONS_DEN_B1F_SOUTH_AREA_CLAIRS_GIFT.itemId].numericId]),
        }
      ).hunks,
    ]
  }
  
  // GS Ball
  
  if (settings.ENABLE_GS_BALL_EVENT) {
    romInfo.patchHunks.push(...[
      new DataHunk(
        ROMOffset.fromBankAddress(24, 0x4F94),
        [0x31, 0xBC, 0x05, 0x09, 0x9E, 0x4F, 0x91],
      ),
      new DataHunk(
        ROMOffset.fromBankAddress(24, 0x4FD9),
        [0x31, 0xBC, 0x05, 0x09, 0xE3, 0x4F, 0x91],
      ),
    ])
  }
  
  // Early Train
  
  if (settings.RIDE_TRAIN_WITHOUT_POWER) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      new DataHunk(ROMOffset.fromBankAddress(21, 0x50EE), [0x18, 0x18, 0x18, 0x03]),
      new DataHunk(ROMOffset.fromBankAddress(98, 0x6820), [0x18, 0x18, 0x18, 0x03]),
    ]
  }
  
  // Weekday Siblings
  
  if (settings.WEEKDAY_SIBLINGS_ALWAYS_ACCESSIBLE) {
    romInfo.patchHunks.push(...[
      new DataHunk(ROMOffset.fromBankAddress(106, 0x4D77), [0x6F, 0x06, 0x90]), // Sunny
      new DataHunk(ROMOffset.fromBankAddress(105, 0x6165), [0x6F, 0x0A, 0x90]), // Monica
      new DataHunk(ROMOffset.fromBankAddress(104, 0x4F64), [0x6F, 0x08, 0x90]), // Tuscany
      new DataHunk(ROMOffset.fromBankAddress(28, 0x4016), [0x6F, 0x0B, 0x90]), // Wesley
      new DataHunk(ROMOffset.fromBankAddress(101, 0x400F), [0x6F, 0x08, 0x90]), // Arthur
      new DataHunk(ROMOffset.fromBankAddress(100, 0x4463), [0x6F, 0x0E, 0x90]), // Frieda
      new DataHunk(ROMOffset.fromBankAddress(105, 0x46DC), [0x6F, 0x09, 0x90]), // Santos
      new DataHunk(ROMOffset.fromBankAddress(106, 0x4DC7), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]), // Sunny
      new DataHunk(ROMOffset.fromBankAddress(105, 0x61E1), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]), // Monica
      new DataHunk(ROMOffset.fromBankAddress(104, 0x5051), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]), // Tuscany
      new DataHunk(ROMOffset.fromBankAddress(28, 0x4116), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]), // Wesley
      new DataHunk(ROMOffset.fromBankAddress(101, 0x4209), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]), // Arthur
      new DataHunk(ROMOffset.fromBankAddress(100, 0x4741), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]), // Frieda
      new DataHunk(ROMOffset.fromBankAddress(105, 0x4733), [0x18, 0x18, 0x18, 0x18, 0x18, 0x18]), // Santos
      new DataHunk(ROMOffset.fromBankAddress(100, 0x53CB), [0x0B]), // Route 32 Hidden Item
      new DataHunk(ROMOffset.fromBankAddress(28, 0x4937), [0x05]), // Lake of Rage Hidden Item
    ])
  }
  
  // Curse TM Gift
  
  if (settings.CELADON_MANSION_ROOF_GIFT_ALWAYS_ACCESSIBLE) {
    romInfo.patchHunks.push(new DataHunk(ROMOffset.fromBankAddress(28, 0x5B0B), [0x03]))
  }
  
  // Sanstorm TM Gift
  
  if (settings.REMOVE_TOHJO_FALLS_HOUSE_GIFT_HAPPINESS_REQUIREMENT) {
    romInfo.patchHunks.push(new DataHunk(ROMOffset.fromBankAddress(30, 0x73A8), [0xAA]))
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
}

const createPlayerOptionsPatches = (
  settings: Settings,
  playerOptions: PlayerOptions,
  romInfo: ROMInfo,
) => {
  // Skip Gender
  
  const genderId = playerSpriteMap[playerOptions.PLAYER_GENDER].numericId
  
  if (settings.SKIP_GENDER) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Patch.fromYAML(
        romInfo,
        "skipGender.yml",
        {},
        {
          genderId: hexStringFrom(bytesFrom(genderId, 1)),
        }
      ).hunks,
    ]
  }
  
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    new DataHunk(
      ROMOffset.fromBankAddress(18, 0x4E03),
      bytesFrom(genderId + 1, 1),
    ),
  ]
  
  // Player Name
  
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    new DataHunk(
      ROMOffset.fromBankAddress(1, 0x60D3),
      bytesFromTextData(`${playerOptions.PLAYER_NAME}@`),
    ),
    new DataHunk(
      ROMOffset.fromBankAddress(1, 0x60DE),
      bytesFromTextData(`${playerOptions.PLAYER_NAME}@`),
    ),
  ]
  
  // Default Options
  
  const selectedAdditionalOptionIds = settings.ADDITIONAL_OPTIONS
    
  romInfo.patchHunks = [
    ...romInfo.patchHunks,
    new DataHunk(ROMOffset.fromBankAddress(5, 0x4F7C), [
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
    ]),
    new DataHunk(ROMOffset.fromBankAddress(5, 0x4F81), [
      secondaryOptionsValue({
        nicknamesEnabled: playerOptions.NICKNAMES,
        rideMusic: playerOptions.RIDE_MUSIC,
        menuAccountEnabled: playerOptions.MENU_ACCOUNT,
      }),
    ]),
    new DataHunk(ROMOffset.fromBankAddress(5, 0x4F7E), [frameTypeValue(playerOptions.FRAME_TYPE)]),
    new DataHunk(ROMOffset.fromBankAddress(5, 0x4F80), [printToneValue(playerOptions.PRINT_TONE)]),
  ]
}