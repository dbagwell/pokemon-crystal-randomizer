import { ROMInfo } from "@lib/gameData/romInfo"
import { DataHunk, Patch } from "@lib/generator/patch"
import { type Settings } from "@shared/appData/configHelpers"
import { evolutionTypesMap } from "@shared/gameData/evolutionTypes"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsMap } from "@shared/gameData/items"
import { type Move, movesMap } from "@shared/gameData/moves"
import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { pokemonMap } from "@shared/gameData/pokemon"
import { baseStatTotal, maxNumberOfEvolutionStages } from "@shared/gameData/pokemonHelpers"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import { happinessEvolutionConidtionsMap, statEvolutionConidtionsMap } from "@shared/types/gameData/evolutionMethod"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import type { ItemId } from "@shared/types/gameDataIds/items"
import { moveIds } from "@shared/types/gameDataIds/moves"
import { type PokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { type StarterLocationId, starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
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
  const randomInt = (max: number): number => {
    return Math.floor(rng() * max)
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
      
    const matchesStage = (pokemon: Pokemon) => {
      return !Object.values(pokemonMap).flatMap((pokemon) => {
        return pokemon.evolutions?.map((evolution) => {
          return evolution.pokemonId
        }) ?? []
      }).includes(pokemon.id)
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
          && (!randomStartersSettings.MATCH_STAGE || matchesStage(pokemon))
          && (!randomStartersSettings.MATCH_EVOLUTIONS || matchesEvoltions(pokemon))
          && (!randomStartersSettings.MATCH_SIMILAR_BST || baseStatDifference(pokemon) <= randomStartersSettings.MATCH_SIMILAR_BST.THRESHOLD)
      })
      
      // TODO: We should throw an error if there are no choices
      
      const index = randomInt(choices.length - 1)
      assignedStarters[locationId] = choices[index].id
    })
  }
      
  Object.entries(assignedStarters).forEach(([locationId, pokemonId]) => {
    if (isNullish(pokemonId)) {
      return
    }
        
    hunks = [
      ...hunks,
      ...Patch.fromYAML(
        romInfo,
        `starters/${locationId.toLowerCase()}.yml`,
        {},
        {
          pokemonId: hexStringFrom(bytesFrom(pokemonMap[pokemonId].numericId, 1)),
        },
      ).hunks,
    ]
  })
  
  // Random Level Up Moves
  
  const levelUpMovesSettings = pokemonSettings.RANDOMIZE_LEVEL_UP_MOVES
  
  if (isNotNullish(levelUpMovesSettings)) {
    let pointer = 0x67A7
    let pointersData: number[] = []
    let data: number[] = []
    
    const nonBannedMoveIds = moveIds.filter((moveId) => {
      return !levelUpMovesSettings.BAN.includes(moveId)
    })
    
    pokemonIds.forEach((pokemonId) => {
      pointersData = [
        ...pointersData,
        ...bytesFrom(pointer, 2),
      ]
      
      const pokemon = pokemonMap[pokemonId]
      let pokemonData: number[] = []
      
      pokemon.evolutions?.forEach((evolution) => {
        const secondByte = () => {
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
        
        const thirdByte = () => {
          if (evolution.method.typeId === "STAT") {
            return statEvolutionConidtionsMap[evolution.method.conditionId].numericId
          } else {
            return pokemonMap[evolution.pokemonId].numericId
          }
        }
        
        const fourthByte = () => {
          if (evolution.method.typeId === "STAT") {
            return pokemonMap[evolution.pokemonId].numericId
          } else {
            return undefined
          }
        }
        
        pokemonData = [
          ...pokemonData,
          ...compact([
            evolutionTypesMap[evolution.method.typeId].numericId,
            secondByte(),
            thirdByte(),
            fourthByte(),
          ]),
        ]
      })
      
      pokemonData.push(0)
      
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
          const index = indicesOfAllMoves.splice(randomInt(indicesOfAllMoves.length - 1), 1)[0]
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
      
      let chosenMoves: { level: number, move: Move }[] = []
      
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
        
        // TODO: We should throw an error if there are no choices (should only happen if there a too many banned moves)
        
        const chosenMove = primaryChoices[randomInt(primaryChoices.length - 1)]
          ?? secondaryChoices[randomInt(secondaryChoices.length - 1)]
        
        chosenMoves.push({
          level: 1,
          move: chosenMove,
        })
        
        if (levelUpMovesSettings.UNIQUE) {
          moveChoices = moveChoices.filter((move) => {
            return move.id !== chosenMove.id
          })
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
      
        // TODO: We should throw an error if there are no choices (should only happen if there a too many banned moves)
        
        const chosenMove = primaryChoices[randomInt(primaryChoices.length - 1)]
          ?? secondaryChoices[randomInt(secondaryChoices.length - 1)]
          ?? tertiaryChoices[randomInt(tertiaryChoices.length - 1)]
          
        chosenMoves.push({
          level: levelUpMove.level,
          move: chosenMove,
        })
        
        if (levelUpMovesSettings.UNIQUE) {
          moveChoices = moveChoices.filter((move) => {
            return move.id !== chosenMove.id
          })
        }
      })
      
      if (levelUpMovesSettings.PROGRESSIVE) {
        const sortedDamagingMoves = chosenMoves.map((info) => {
          return info.move
        }).filter((move) => {
          return move.power !== 0
        }).toSorted((move1, move2) => {
          return move1.power - move2.power
        })
        
        chosenMoves = chosenMoves.map((info) => {
          return info.move.power === 0 ? info : {
            level: info.level,
            move: sortedDamagingMoves.splice(0, 1)[0],
          }
        })
      }
      
      chosenMoves.forEach(({ level, move }) => {
        pokemonData.push(level)
        pokemonData.push(move.numericId)
      })
      
      pokemonData.push(0)
      
      pointer += pokemonData.length
      data = [
        ...data,
        ...pokemonData,
      ]
    })
    
    const pokemonEvolutionsAndAttacksPatch = Patch.fromYAML(
      romInfo,
      "pokemonEvolutionsAndAttacks.yml",
      {},
      {
        data: hexStringFrom([
          ...pointersData,
          ...data,
        ]),
      }
    )
  
    hunks = [...hunks, ...pokemonEvolutionsAndAttacksPatch.hunks]
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