import { ROMInfo, ROMOffset } from "@lib/gameData/romInfo"
import { bytesFromLandAndWaterEncounterRates } from "@lib/generator/dataConverters/encounterRates"
import { bytesFromContestEncounters, bytesFromFishingEncounters, bytesFromLandAndWaterEncounters, bytesFromTreeAndRockEncounters, encountersGroupedByType } from "@lib/generator/dataConverters/encounters"
import { dataHunkFromMapObjectEvent } from "@lib/generator/dataConverters/mapObjectEvent"
import { bytesFromOddEgg } from "@lib/generator/dataConverters/oddEgg"
import { bytesForEvolutionsAndLevelUpMovesFromPokemon, bytesForInfoFromPokemon } from "@lib/generator/dataConverters/pokemon"
import { updateEncounterRates } from "@lib/generator/gameDataProcessors/encounterRates"
import { updateRandomEncounters } from "@lib/generator/gameDataProcessors/encounters"
import { updateEventPokemon } from "@lib/generator/gameDataProcessors/eventPokemon"
import { updateEvolutionMethods } from "@lib/generator/gameDataProcessors/evolutionMethods"
import { updateIntroPokemon } from "@lib/generator/gameDataProcessors/introPokemon"
import { shuffleItems, updateItems } from "@lib/generator/gameDataProcessors/itemLocations"
import { updateLevelUpMoves } from "@lib/generator/gameDataProcessors/levelUpMoves"
import { updateMapObjectEvents } from "@lib/generator/gameDataProcessors/mapObjectEvents"
import { updateMarts } from "@lib/generator/gameDataProcessors/marts"
import { updatePokemonInfo } from "@lib/generator/gameDataProcessors/pokemonInfo"
import { updateStarterItems, updateStarters } from "@lib/generator/gameDataProcessors/starters"
import { updateTeachableMoves } from "@lib/generator/gameDataProcessors/teachableMoves"
import { updateTrades } from "@lib/generator/gameDataProcessors/trades"
import { updateTrainers } from "@lib/generator/gameDataProcessors/trainers"
import { DataHunk, Patch } from "@lib/generator/patch"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsMap } from "@shared/gameData/items"
import { movesMap } from "@shared/gameData/moves"
import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { pokemonMap } from "@shared/gameData/pokemon"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import { trainerMovementBehavioursMap } from "@shared/gameData/trainerMovementBehaviours"
import type { Trade } from "@shared/types/gameData/trade"
import type { EventPokemonId } from "@shared/types/gameDataIds/eventPokemon"
import { type ItemId } from "@shared/types/gameDataIds/items"
import { starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import { trainerGroupIds } from "@shared/types/gameDataIds/trainerGroups"
import { bytesFrom, compact, hexStringFrom, isNotNullish, isNullish } from "@utils"
import crypto from "crypto"
import { app } from "electron"
import hash from "object-hash"
import seedrandom from "seedrandom"

export const generateROM = (data: Buffer, customSeed: string | undefined, settings: SettingsFromAppViewModel): {
  seed: string,
  data: Buffer,
} => {
  const romInfo = ROMInfo.vanilla()
  const seed = customSeed ?? crypto.randomUUID()
  const rng = seedrandom(seed)
  const randomInt = (min: number, max: number): number => {
    return Math.floor(rng() * (max + 1 - min)) + min
  }
  
  // Update game data based on settings
  
  updateGameData(settings, romInfo, randomInt)
  
  // Create patch hunks based on settings and updated game data
  
  createPatches(settings, romInfo)
  
  // Base Patch
  
  const checkValue = romInfo.patchHunks.length > 0 ? hash(romInfo.patchHunks).slice(0, 8).toUpperCase() : "00000000"
  
  const basePatch = Patch.fromYAML(
    romInfo,
    "randomizerBase.yml",
    {},
    {
      versionNumber: hexStringFrom(ROMInfo.displayCharacterBytesFrom(app.getVersion())),
      checkValue: hexStringFrom(ROMInfo.displayCharacterBytesFrom(checkValue)),
    },
  )
      
  romInfo.patchHunks = [...romInfo.patchHunks, ...basePatch.hunks]
  
  romInfo.patchHunks.forEach((hunk) => {
    data.set(hunk.values, hunk.offset.bank() * ROMInfo.bankSize + (hunk.offset.bankAddress() - (hunk.offset.bank() === 0 ? 0 : ROMInfo.bankSize)))
  })
  
  return {
    seed: "",
    data: data,
  }
}

const updateGameData = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number,
) => {
  updateIntroPokemon(settings, romInfo, randomInt)
  updateStarters(settings, romInfo, randomInt)
  updateStarterItems(settings, romInfo, randomInt)
  updateEventPokemon(settings, romInfo, randomInt)
  updateRandomEncounters(settings, romInfo, randomInt)
  updateEncounterRates(settings, romInfo)
  updateTrades(settings, romInfo, randomInt)
  updateEvolutionMethods(settings, romInfo)
  updateLevelUpMoves(settings, romInfo, randomInt)
  updateTeachableMoves(settings, romInfo, randomInt)
  updatePokemonInfo(settings, romInfo, randomInt)
  updateMarts(settings, romInfo)
  updateTrainers(settings, romInfo, randomInt)
  updateMapObjectEvents(settings, romInfo)
  updateItems(settings, romInfo, randomInt)
  shuffleItems(settings, romInfo, randomInt)
}

const createPatches = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
) => {
  // Intro Pokemon
  
  if (isNotNullish(romInfo.gameData.introPokemonId)) {
    const numericId = pokemonMap[romInfo.gameData.introPokemonId].numericId
    
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
          pokemonName: hexStringFrom(ROMInfo.displayCharacterBytesFrom(pokemon.name.toUpperCase())),
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
      eeveePokemonNameText1: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${nameStringFromEventPokemonId("EEVEE")}.`.padEnd(11, " "))),
      eeveePokemonNameText2: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${nameStringFromEventPokemonId("EEVEE")}`.padEnd(10, " "))),
      dratiniPokemonId: hexStringFromEventPokemonId("DRATINI"),
      dratiniPokemonNameText1: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${nameStringFromEventPokemonId("DRATINI")}`.padEnd(12, " "))),
      dratiniPokemonNameText2: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${nameStringFromEventPokemonId("DRATINI")}`.padEnd(10, " "))),
      tyroguePokemonId: hexStringFromEventPokemonId("TYROGUE"),
      tyroguePokemonNameText: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${nameStringFromEventPokemonId("TYROGUE")}`.padEnd(10, " "))),
      abraPokemonId: hexStringFromEventPokemonId("ABRA"),
      cubonePokemonId: hexStringFromEventPokemonId("CUBONE"),
      wobbuffetPokemonId: hexStringFromEventPokemonId("WOBBUFFET"),
      goldenrodGameCornerPokemonMenuText: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${nameStringFromEventPokemonId("ABRA").padEnd(10, " ")}  100@${nameStringFromEventPokemonId("CUBONE").padEnd(10, " ")}  800@${nameStringFromEventPokemonId("WOBBUFFET").padEnd(10, " ")} 1500@`)),
      pikachuPokemonId: hexStringFromEventPokemonId("PIKACHU"),
      porygonPokemonId: hexStringFromEventPokemonId("PORYGON"),
      larvitarPokemonId: hexStringFromEventPokemonId("LARVITAR"),
      celadonGameCornerPokemonMenuText: hexStringFrom(ROMInfo.displayCharacterBytesFrom(`${nameStringFromEventPokemonId("PIKACHU").padEnd(10, " ")} 2222@${nameStringFromEventPokemonId("PORYGON").padEnd(10, " ")} 5555@${nameStringFromEventPokemonId("LARVITAR").padEnd(10, " ")} 8888@`)),
    },
  )
    
  romInfo.patchHunks = [...romInfo.patchHunks, ...eventPokemonPatch.hunks]
    
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
    
  // Trades
    
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
      mikeTradePokemonIds: tradePokemonIdsHexString(romInfo.gameData.trades.MIKE),
      kyleTradePokemonIds: tradePokemonIdsHexString(romInfo.gameData.trades.KYLE),
      timTradePokemonIds: tradePokemonIdsHexString(romInfo.gameData.trades.TIM),
      emyTradePokemonIds: tradePokemonIdsHexString(romInfo.gameData.trades.EMY),
      chirsTradePokemonIds: tradePokemonIdsHexString(romInfo.gameData.trades.CHRIS),
      kimTradePokemonIds: tradePokemonIdsHexString(romInfo.gameData.trades.KIM),
      forestTradePokemonIds: tradePokemonIdsHexString(romInfo.gameData.trades.FOREST),
    },
  )
    
  romInfo.patchHunks = [...romInfo.patchHunks, ...tradesPatch.hunks]
    
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
    
  const hex = hexStringFrom(Object.values(romInfo.gameData.teachableMoves).map((move) => {
    return movesMap[move.moveId].numericId
  }))
    
  const teachableMovesPatch = Patch.fromYAML(
    romInfo,
    "teachableMoves.yml",
    {},
    {
      teachableMoves: hex,
      moveTutorMoveId1: hexStringFrom([movesMap[romInfo.gameData.teachableMoves.MOVE_TUTOR_1.moveId].numericId]),
      moveTutorMoveId2: hexStringFrom([movesMap[romInfo.gameData.teachableMoves.MOVE_TUTOR_2.moveId].numericId]),
      moveTutorMoveId3: hexStringFrom([movesMap[romInfo.gameData.teachableMoves.MOVE_TUTOR_3.moveId].numericId]),
      moveTutorMoveName1: hexStringFrom(ROMInfo.displayCharacterBytesFrom(movesMap[romInfo.gameData.teachableMoves.MOVE_TUTOR_1.moveId].name.toUpperCase())),
      moveTutorMoveName2: hexStringFrom(ROMInfo.displayCharacterBytesFrom(movesMap[romInfo.gameData.teachableMoves.MOVE_TUTOR_2.moveId].name.toUpperCase())),
      moveTutorMoveName3: hexStringFrom(ROMInfo.displayCharacterBytesFrom(movesMap[romInfo.gameData.teachableMoves.MOVE_TUTOR_3.moveId].name.toUpperCase())),
    }
  )
      
  romInfo.patchHunks = [...romInfo.patchHunks, ...teachableMovesPatch.hunks]
  
  // Items
  
  if (settings.RANDOMIZE_REGULAR_ITEM_BALLS || settings.RANDOMIZE_TM_ITEM_BALLS || settings.RANDOMIZE_HIDDEN_ITEMS) {
    romInfo.patchHunks = [
      ...romInfo.patchHunks,
      ...Object.values(romInfo.gameData.itemLocations).map((itemLocation) => {
        return new DataHunk(
          ROMOffset.fromBankAddress(
            itemLocation.romOffset[0],
            itemLocation.romOffset[1]
          ),
          compact([
            itemsMap[itemLocation.itemId].numericId,
            itemLocation.type === "ITEM_BALL" ? 1 : null,
          ]),
        )
      }),
    ]
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
    
  // Skip Gender
    
  if (settings.SKIP_GENDER.VALUE) {
    const genderId = playerSpriteMap[settings.SKIP_GENDER.SETTINGS.GENDER].numericId
    const skipGenderPatch = Patch.fromYAML(
      romInfo,
      "skipGender.yml",
      {},
      {
        genderId: hexStringFrom(bytesFrom(genderId, 1)),
      }
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...skipGenderPatch.hunks]
  }
    
  // Skip Name
    
  if (settings.SKIP_NAME.VALUE) {
    const nameBytes = ROMInfo.displayCharacterBytesFrom(settings.SKIP_NAME.SETTINGS.PLAYER_NAME)
    const skipNamePatch = Patch.fromYAML(
      romInfo,
      "skipName.yml",
      {},
      {
        name: hexStringFrom(nameBytes),
      }
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...skipNamePatch.hunks]
  }
    
  // Change Box Phone Call
    
  if (settings.CHANGE_BOX_PHONE_CALL) {
    const scaleExperiencePatch = Patch.fromYAML(
      romInfo,
      "changeBoxCall.yml",
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...scaleExperiencePatch.hunks]
  }
    
  // Scale Experience
    
  if (settings.SCALE_EXPERIENCE) {
    const scaleExperiencePatch = Patch.fromYAML(
      romInfo,
      "scaleExperience.yml",
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...scaleExperiencePatch.hunks]
  }
    
  // Performance Improvements
    
  if (settings.IMPROVE_PERFORMANCE) {
    const performanceImprovementsPatch = Patch.fromYAML(
      romInfo,
      "performanceImprovements.yml",
    )
    
    romInfo.patchHunks = [...romInfo.patchHunks, ...performanceImprovementsPatch.hunks]
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